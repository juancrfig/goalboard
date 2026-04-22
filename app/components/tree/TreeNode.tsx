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
  locked: { icon: Lock, track: '#1e293b', fill: '#334155', glow: 'none' },
  available: { icon: Circle, track: '#1e293b', fill: '#06b6d4', glow: '0 0 15px rgba(6, 182, 212, 0.35)' },
  active: { icon: Play, track: '#1e293b', fill: '#ea580c', glow: '0 0 20px rgba(234, 88, 12, 0.45)' },
  completed: { icon: CheckCircle2, track: '#1e293b', fill: '#f59e0b', glow: '0 0 18px rgba(245, 158, 11, 0.4)' },
};

function TreeNodeComponent({ data: nodeData, selected }: NodeProps) {
  const node = nodeData as unknown as SkillNode;
  const { label, status, progress, category } = node;
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const catColor = categoryColors[category] || '#ea580c';
  const activeColor = status === 'active' ? catColor : config.fill;

  const size = 72;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Title above node */}
      <div className="mb-2 px-2 py-0.5 rounded-md bg-card/80 border border-border/50">
        <span className="text-[11px] font-bold text-foreground whitespace-nowrap leading-none">
          {label}
        </span>
      </div>

      {/* Circular node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative"
        style={{
          filter: status !== 'locked' ? `drop-shadow(${config.glow})` : undefined,
        }}
      >
        {/* Outer glow ring for active/completed */}
        {(status === 'active' || status === 'completed') && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${activeColor}15 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <div
          className={`relative rounded-full transition-transform duration-200 ${
            selected ? 'scale-110' : 'hover:scale-105'
          }`}
          style={{ width: size, height: size }}
        >
          {/* SVG progress ring */}
          <svg
            width={size}
            height={size}
            className="absolute inset-0 -rotate-90"
          >
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="#0f172a"
              stroke={config.track}
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            {progress > 0 && (
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={activeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  filter: `drop-shadow(0 0 4px ${activeColor}66)`,
                }}
              />
            )}
          </svg>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <StatusIcon
              size={22}
              style={{
                color: status === 'locked' ? '#475569' : activeColor,
                filter: status !== 'locked' ? `drop-shadow(0 0 3px ${activeColor}66)` : undefined,
              }}
            />
          </div>

          {/* Pulse ring for available nodes */}
          {status === 'available' && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-secondary"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        {/* XP badge below */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-card border border-border/50">
          <span className="text-[9px] font-mono font-bold" style={{ color: activeColor }}>
            {node.xpValue} XP
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(TreeNodeComponent);
