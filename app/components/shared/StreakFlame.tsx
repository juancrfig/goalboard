'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
  days: number;
  longest: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StreakFlame({ days, longest, size = 'md' }: StreakFlameProps) {
  const isRecord = days >= longest;
  
  const sizeMap = {
    sm: { icon: 20, container: 'p-2', text: 'text-lg' },
    md: { icon: 32, container: 'p-3', text: 'text-2xl' },
    lg: { icon: 48, container: 'p-4', text: 'text-4xl' },
  };
  
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`relative ${s.container} rounded-2xl bg-primary/5 border border-primary/20`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <Flame 
          size={s.icon} 
          className={`relative z-10 ${isRecord ? 'text-primary-glow' : 'text-primary'}`}
          style={{
            filter: isRecord ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' : 'drop-shadow(0 0 6px rgba(234, 88, 12, 0.4))',
          }}
        />
      </motion.div>
      <div>
        <motion.span 
          className={`${s.text} font-bold text-foreground block`}
          key={days}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {days} {days === 1 ? 'Day' : 'Days'}
        </motion.span>
        <span className="text-xs text-muted">
          {isRecord ? '🔥 New record!' : `${longest - days} days from best`}
        </span>
      </div>
    </div>
  );
}
