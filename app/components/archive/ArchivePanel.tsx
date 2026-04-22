'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { TrendingUp, Flame, Clock, Target } from 'lucide-react';
import { DailyLog } from '@/lib/types';

interface ArchivePanelProps {
  logs: DailyLog[];
}

export default function ArchivePanel({ logs }: ArchivePanelProps) {
  const totalXp = logs.reduce((sum, l) => sum + l.xpEarned, 0);
  const totalTasks = logs.reduce((sum, l) => sum + l.tasksCompleted, 0);
  const totalFocus = logs.reduce((sum, l) => sum + l.focusMinutes, 0);
  const avgXp = Math.round(totalXp / logs.length);
  const bestDay = logs.reduce((best, l) => l.xpEarned > best.xpEarned ? l : best, logs[0]);

  const chartData = logs.map((l) => ({
    date: l.date.slice(5),
    xp: l.xpEarned,
    tasks: l.tasksCompleted,
    focus: Math.round(l.focusMinutes / 60 * 10) / 10,
  }));

  const heatmapData = logs.map((l) => ({
    date: l.date,
    intensity: l.xpEarned > 400 ? 4 : l.xpEarned > 300 ? 3 : l.xpEarned > 150 ? 2 : l.xpEarned > 0 ? 1 : 0,
    xp: l.xpEarned,
  }));

  const intensityColors = ['#1e293b', '#064e3b', '#059669', '#f59e0b', '#ea580c'];

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">The Archive</h2>
        <p className="text-muted">Your progression history. Patterns reveal truth.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: totalXp.toLocaleString(), icon: TrendingUp, color: 'text-primary' },
          { label: 'Tasks Done', value: totalTasks.toString(), icon: Target, color: 'text-success' },
          { label: 'Focus Hours', value: (totalFocus / 60).toFixed(1), icon: Clock, color: 'text-secondary' },
          { label: 'Best Day', value: `${bestDay.xpEarned} XP`, icon: Flame, color: 'text-primary-glow' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Curve */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6"
        >
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">XP Velocity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                }}
                itemStyle={{ color: '#ea580c' }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#ea580c"
                strokeWidth={2}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tasks Completed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6"
        >
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Tasks Completed</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                }}
              />
              <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.tasks > 5 ? '#ea580c' : entry.tasks > 3 ? '#f59e0b' : '#334155'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-6"
      >
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Activity Intensity</h3>
        <div className="flex flex-wrap gap-2">
          {heatmapData.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.03 }}
              className="group relative"
            >
              <div
                className="w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110 hover:brightness-125"
                style={{ backgroundColor: intensityColors[day.intensity] }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card-hover border border-border rounded-lg text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {day.date}: {day.xp} XP
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-muted">Less</span>
          {intensityColors.map((c, i) => (
            <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: c }} />
          ))}
          <span className="text-xs text-muted">More</span>
        </div>
      </motion.div>
    </div>
  );
}
