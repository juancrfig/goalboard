'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Sidebar from './components/layout/Sidebar';
import TodayHero from './components/today/TodayHero';
import SkillTree from './components/tree/SkillTree';
import ArchivePanel from './components/archive/ArchivePanel';
import { SkillNode, UserStats, DailyLog } from '@/lib/types';
import { mockNodes, initialUserStats, dailyLogs } from '@/lib/mock-data';

type View = 'today' | 'tree' | 'archive';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('today');
  const [nodes, setNodes] = useState<SkillNode[]>(mockNodes);
  const [stats, setStats] = useState<UserStats>(initialUserStats);
  const [logs] = useState<DailyLog[]>(dailyLogs);

  const focusNode = useMemo(() => 
    nodes.find(n => n.label === stats.todayFocus) || null,
  [nodes, stats.todayFocus]);

  const handleTaskToggle = useCallback((nodeId: string, taskId: string) => {
    setNodes(prev => {
      const newNodes = prev.map(node => {
        if (node.id !== nodeId) return node;
        
        const newTasks = node.tasks.map(task => {
          if (task.id !== taskId) return task;
          return { ...task, completed: !task.completed };
        });
        
        const completedCount = newTasks.filter(t => t.completed).length;
        const progress = Math.round((completedCount / newTasks.length) * 100);
        
        // Auto-complete node if all tasks done
        const newStatus = progress === 100 ? 'completed' : node.status;
        
        return {
          ...node,
          tasks: newTasks,
          progress,
          status: newStatus,
        };
      });

      // Unlock children if node completed
      const completedNode = newNodes.find(n => n.id === nodeId);
      if (completedNode?.status === 'completed') {
        return newNodes.map(node => {
          if (node.prerequisites.includes(nodeId) && node.status === 'locked') {
            return { ...node, status: 'available' as const };
          }
          return node;
        });
      }

      return newNodes;
    });

    // Update stats
    setStats(prev => {
      const wasCompleted = nodes.find(n => n.id === nodeId)?.tasks.find(t => t.id === taskId)?.completed;
      const xpReward = nodes.find(n => n.id === nodeId)?.tasks.find(t => t.id === taskId)?.xpReward || 0;
      
      if (wasCompleted) {
        return {
          ...prev,
          currentXp: Math.max(0, prev.currentXp - xpReward),
          totalXp: Math.max(0, prev.totalXp - xpReward),
          todayTasksCompleted: Math.max(0, prev.todayTasksCompleted - 1),
        };
      }

      const newCurrentXp = prev.currentXp + xpReward;
      const newTotalXp = prev.totalXp + xpReward;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let newCurrent = newCurrentXp;

      // Level up logic
      if (newCurrentXp >= prev.xpToNextLevel) {
        newLevel = prev.level + 1;
        newCurrent = newCurrentXp - prev.xpToNextLevel;
        newXpToNext = Math.round(prev.xpToNextLevel * 1.25);
        
        // Celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#06b6d4', '#10b981'],
        });
      }

      return {
        ...prev,
        level: newLevel,
        currentXp: newCurrent,
        xpToNextLevel: newXpToNext,
        totalXp: newTotalXp,
        todayTasksCompleted: prev.todayTasksCompleted + 1,
      };
    });
  }, [nodes]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        stats={stats}
      />
      
      <main className="flex-1 ml-20 lg:ml-64">
        <AnimatePresence mode="wait">
          {activeView === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TodayHero
                stats={stats}
                focusNode={focusNode}
                onTaskToggle={handleTaskToggle}
              />
            </motion.div>
          )}
          
          {activeView === 'tree' && (
            <motion.div
              key="tree"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="h-screen"
            >
              <SkillTree nodes={nodes} onTaskToggle={handleTaskToggle} />
            </motion.div>
          )}
          
          {activeView === 'archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ArchivePanel logs={logs} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
