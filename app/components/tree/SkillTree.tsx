'use client';

import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, Play, Lock, Target } from 'lucide-react';
import { SkillNode } from '@/lib/types';
import TreeNode from './TreeNode';

const nodeTypes = { skillNode: TreeNode };

interface SkillTreeProps {
  nodes: SkillNode[];
  onTaskToggle: (nodeId: string, taskId: string) => void;
}

export default function SkillTree({ nodes, onTaskToggle }: SkillTreeProps) {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const initialNodes: Node[] = useMemo(() =>
    nodes.map((n) => ({
      id: n.id,
      type: 'skillNode',
      position: n.position,
      data: n as unknown as Record<string, unknown>,
      selectable: true,
    })), [nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    nodes.forEach((node) => {
      node.prerequisites.forEach((prereq) => {
        edges.push({
          id: `${prereq}-${node.id}`,
          source: prereq,
          target: node.id,
          type: 'smoothstep',
          style: {
            stroke: node.status === 'locked' ? '#334155' : '#ea580c',
            strokeWidth: 2,
            opacity: node.status === 'locked' ? 0.4 : 0.8,
          },
          animated: node.status !== 'locked',
        });
      });
    });
    return edges;
  }, [nodes]);

  const [flowNodes, , onNodesChange] = useNodesState(initialNodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedNode(node.data as unknown as SkillNode);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const statusIcons = {
    locked: Lock,
    available: Circle,
    active: Play,
    completed: CheckCircle2,
  };

  const StatusIcon = selectedNode ? statusIcons[selectedNode.status] : Circle;

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background
          color="#1e293b"
          gap={24}
          size={1}
          style={{ background: '#020617' }}
        />
        <Controls className="!bg-card !border-border !shadow-xl" />
        <MiniMap
          className="!bg-card !border-border !rounded-xl"
          nodeColor={(node) => {
            const data = node.data as unknown as SkillNode;
            switch (data.status) {
              case 'completed': return '#f59e0b';
              case 'active': return '#ea580c';
              case 'available': return '#06b6d4';
              default: return '#334155';
            }
          }}
          maskColor="rgba(2, 6, 23, 0.8)"
        />
      </ReactFlow>

      {/* Node Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-4 top-4 bottom-4 w-96 glass-strong rounded-3xl border border-border overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-xl ${
                  selectedNode.status === 'active' ? 'bg-primary/10' :
                  selectedNode.status === 'completed' ? 'bg-primary-glow/10' :
                  selectedNode.status === 'available' ? 'bg-secondary/10' : 'bg-muted/10'
                }`}>
                  <StatusIcon className={`w-5 h-5 ${
                    selectedNode.status === 'active' ? 'text-primary' :
                    selectedNode.status === 'completed' ? 'text-primary-glow' :
                    selectedNode.status === 'available' ? 'text-secondary' : 'text-muted'
                  }`} />
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 rounded-lg hover:bg-card-hover transition-colors"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{selectedNode.label}</h2>
              <p className="text-sm text-muted">{selectedNode.description}</p>
            </div>

            {/* Progress */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted">Progress</span>
                <span className="text-sm font-bold text-foreground">{selectedNode.progress}%</span>
              </div>
              <div className="h-2 bg-card-hover rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedNode.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted">{selectedNode.xpValue} XP total</span>
                <span className="text-xs font-mono text-primary">{Math.round(selectedNode.xpValue * (selectedNode.progress / 100))} earned</span>
              </div>
            </div>

            {/* Tasks - The Hunt */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">The Hunt</h3>
                <span className="text-xs text-muted ml-auto">
                  {selectedNode.tasks.filter(t => t.completed).length} / {selectedNode.tasks.length}
                </span>
              </div>

              <div className="space-y-2">
                {selectedNode.tasks.map((task, i) => (
                  <motion.button
                    key={task.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onTaskToggle(selectedNode.id, task.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                      task.completed
                        ? 'bg-success/5 border-success/30'
                        : 'bg-card/30 border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      task.completed ? 'bg-success border-success' : 'border-muted'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-background" />}
                    </div>
                    <span className={`flex-1 text-sm ${task.completed ? 'text-muted line-through' : 'text-foreground'}`}>
                      {task.title}
                    </span>
                    <span className="text-xs font-mono text-primary">+{task.xpReward}</span>
                  </motion.button>
                ))}
              </div>

              {selectedNode.tasks.length === 0 && (
                <div className="text-center py-8 text-muted text-sm">
                  No tasks defined yet.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
