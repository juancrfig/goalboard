'use client';

import { motion } from 'framer-motion';

interface XpBarProps {
  current: number;
  max: number;
  level: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function XpBar({ current, max, level, showText = true, size = 'md' }: XpBarProps) {
  const percent = Math.min((current / max) * 100, 100);
  
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2.5' : 'h-4';
  const textClass = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm';

  return (
    <div className="w-full">
      {showText && (
        <div className={`flex justify-between items-center mb-1.5 ${textClass}`}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Level {level}</span>
            <span className="text-muted-foreground">Commander</span>
          </div>
          <span className="font-mono text-primary">{current.toLocaleString()} / {max.toLocaleString()} XP</span>
        </div>
      )}
      <div className={`${heightClass} bg-card-hover rounded-full overflow-hidden relative`}>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shimmer" />
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: 'linear-gradient(90deg, #c2410c, #ea580c, #f59e0b)',
            boxShadow: '0 0 10px rgba(234, 88, 12, 0.4), 0 0 30px rgba(234, 88, 12, 0.15)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
