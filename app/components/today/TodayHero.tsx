'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock, CheckCircle2, Circle, Zap, Trophy } from 'lucide-react';
import { UserStats, SkillNode } from '@/lib/types';
import XpBar from '../shared/XpBar';
import StreakFlame from '../shared/StreakFlame';
import ProgressRing from '../shared/ProgressRing';

interface TodayHeroProps {
  stats: UserStats;
  focusNode: SkillNode | null;
  onTaskToggle: (nodeId: string, taskId: string) => void;
}

export default function TodayHero({ stats, focusNode, onTaskToggle }: TodayHeroProps) {
  const todayProgress = stats.todayTasksTotal > 0 
    ? (stats.todayTasksCompleted / stats.todayTasksTotal) * 100 
    : 0;

  const focusTasks = focusNode?.tasks || [];
  const focusCompleted = focusTasks.filter(t => t.completed).length;
  const focusProgress = focusTasks.length > 0 ? (focusCompleted / focusTasks.length) * 100 : 0;

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header XP Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <XpBar 
          current={stats.currentXp} 
          max={stats.xpToNextLevel} 
          level={stats.level} 
        />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Focus Goal - Takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 glass rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Today&apos;s Focus</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {stats.todayFocus}
            </h2>
            
            {focusNode && (
              <p className="text-muted text-lg mb-6 max-w-xl">{focusNode.description}</p>
            )}

            <div className="flex items-center gap-6 mb-8">
              <ProgressRing progress={focusProgress} size={100} strokeWidth={8}>
                <div className="text-center">
                  <span className="text-2xl font-bold text-foreground">{Math.round(focusProgress)}%</span>
                </div>
              </ProgressRing>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>{focusCompleted} of {focusTasks.length} tasks done</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>{focusNode?.xpValue || 0} XP available</span>
                </div>
              </div>
            </div>

            {/* Focus Tasks */}
            <div className="space-y-2">
              {focusTasks.map((task, i) => (
                <motion.button
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => focusNode && onTaskToggle(focusNode.id, task.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group ${
                    task.completed
                      ? 'bg-success/5 border-success/30'
                      : 'bg-card/50 border-border hover:border-primary/30 hover:bg-card-hover'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-success border-success' : 'border-muted group-hover:border-primary'
                  }`}>
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-background" />}
                  </div>
                  <span className={`flex-1 text-left ${task.completed ? 'text-muted line-through' : 'text-foreground'}`}>
                    {task.title}
                  </span>
                  <span className="text-xs font-mono text-primary">+{task.xpReward} XP</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column Stats */}
        <div className="space-y-6">
          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-3xl p-6"
          >
            <StreakFlame days={stats.streakDays} longest={stats.longestStreak} size="lg" />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="glass rounded-2xl p-4 text-center">
              <Trophy className="w-6 h-6 text-primary-glow mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.level}</div>
              <div className="text-xs text-muted">Level</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{(stats.totalXp / 1000).toFixed(1)}k</div>
              <div className="text-xs text-muted">Total XP</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <Clock className="w-6 h-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.todayTasksTotal}</div>
              <div className="text-xs text-muted">Tasks Today</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.todayTasksCompleted}</div>
              <div className="text-xs text-muted">Completed</div>
            </div>
          </motion.div>

          {/* Daily Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-3xl p-6"
          >
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Daily Progress</h3>
            <div className="flex items-end justify-between h-24 gap-1">
              {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t-sm relative group"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm transition-all group-hover:bg-primary-glow"
                    style={{ height: `${h}%` }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
