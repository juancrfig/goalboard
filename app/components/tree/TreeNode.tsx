'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, Play, Circle } from 'lucide-react';
import { NodeProps } from '@xyflow/react';
import { SkillNode } from '@/lib/types';

const categoryColors: Record<string, string> = {
  devops: '#06b6d4',
  business: '#f59e0b',
  teaching: '#8b5cf6',
  health: '#10b981',
  creative: '#ec4899',
};

const statusConfig = {
  locked: { icon: Lock, bg: '#0f172a', border: '#334155', text: '#64748b', glow: 'none' },
  available: { icon: Circle, bg: '#0f172a', border: '#06b6d4', text: '#06b6d4', glow: '0 0 15px rgba(6, 182, 212, 0.3)' },
  active: { icon: Play, bg: '#1e293b', border: '#ea580c', text: '#ea580c', glow: '0 0 20px rgba(234, 88, 12, 0.4)' },
  completed: { icon: CheckCircle2, bg: '#0f172a', border: '#f59e0b', text: '#f59e0b', glow: '0 0 15px rgba(245, 158, 11, 0.3)' },
};

function TreeNodeComponent({ data: nodeData, selected }: NodeProps) {
  const node = nodeData as unknown as SkillNode;
  const { label, status, progress, category } = node;
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const catColor = categoryColors[category] || '#ea580c';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative"
    >
      {/* Glow effect for active/completed */}
      {(status === 'active' || status === 'completed') && (
        <div 
          className="absolute inset-0 rounded-2xl blur-xl opacity-30"
          style={{ background: catColor }}
        />
      )}
      
      <div
        className={`relative px-4 py-3 rounded-2xl border-2 min-w-[180px] max-w-[220px] cursor-pointer transition-all duration-300 ${
          selected ? 'scale-105' : 'hover:scale-[1.02]'
        }`}
        style={{
          background: config.bg,
          borderColor: status === 'active' ? catColor : config.border,
          boxShadow: selected 
            ? `0 0 30px ${catColor}44, ${config.glow}` 
            : config.glow,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <StatusIcon 
            size={16} 
            style={{ color: status === 'active' ? catColor : config.text }}
          />
          <span 
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: status === 'active' ? catColor : config.text }}
          >
            {status}
          </span>
        </div>
        
        <h3 className="text-sm font-bold text-foreground leading-tight mb-2">
          {label}
        </h3>
        
        {/* Progress bar */}
        {status !== 'locked' && (
          <div className="h-1.5 bg-card-hover rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${catColor}66, ${catColor})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        )}
        
        {status !== 'locked' && (
          <div className="mt-1.5 flex justify-between items-center">
            <span className="text-[10px] text-muted">{progress}%</span>
            <span className="text-[10px] font-mono" style={{ color: catColor }}>
              {node.xpValue} XP
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default memo(TreeNodeComponent);
