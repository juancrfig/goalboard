export type NodeStatus = 'locked' | 'available' | 'active' | 'completed';
export type Category = 'devops' | 'business' | 'teaching' | 'health' | 'creative';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
}

export interface SkillNode {
  id: string;
  label: string;
  description: string;
  category: Category;
  status: NodeStatus;
  progress: number; // 0-100
  xpValue: number;
  prerequisites: string[];
  tasks: Task[];
  position: { x: number; y: number };
}

export interface UserStats {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXp: number;
  streakDays: number;
  longestStreak: number;
  todayFocus: string;
  todayTasksCompleted: number;
  todayTasksTotal: number;
}

export interface XpTransaction {
  id: string;
  amount: number;
  source: string;
  timestamp: Date;
}

export interface DailyLog {
  date: string;
  xpEarned: number;
  tasksCompleted: number;
  focusMinutes: number;
}
