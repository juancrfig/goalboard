'use client';

import { motion } from 'framer-motion';
import { Target, GitBranch, BarChart3, Zap, Flame } from 'lucide-react';
import { UserStats } from '@/lib/types';

type View = 'today' | 'tree' | 'archive';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  stats: UserStats;
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'today', label: 'Today', icon: Target },
  { id: 'tree', label: 'Skill Tree', icon: GitBranch },
  { id: 'archive', label: 'Archive', icon: BarChart3 },
];

export default function Sidebar({ activeView, onViewChange, stats }: SidebarProps) {
  const xpPercent = (stats.currentXp / stats.xpToNextLevel) * 100;

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-full w-20 lg:w-64 glass-strong z-50 flex flex-col border-r border-border"
    >
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse-glow">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold tracking-tight text-foreground">GoalBoard</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Progression OS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-muted hover:text-foreground hover:bg-card-hover'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="hidden lg:block text-sm font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Stats Summary */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted">Level {stats.level}</span>
            <span className="text-xs text-primary font-mono">{stats.currentXp} / {stats.xpToNextLevel} XP</span>
          </div>
          <div className="h-1.5 bg-card-hover rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-2">
          <Flame className="w-4 h-4 text-primary-glow" />
          <span className="text-sm font-bold text-primary-glow">{stats.streakDays}</span>
          <span className="text-xs text-muted hidden lg:inline">day streak</span>
        </div>
      </div>
    </motion.aside>
  );
}
