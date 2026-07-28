import type { AchievementDef, AppData } from '@/types';
import { format, subDays, differenceInDays } from 'date-fns';

export function computeStreak(completions: string[]): number {
  if (!completions.length) return 0;
  const sorted = [...completions].sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T12:00:00');
    const curr = new Date(sorted[i] + 'T12:00:00');
    if (differenceInDays(prev, curr) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
}

export function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
}

export function getLast90Days(): string[] {
  const days: string[] = [];
  for (let i = 89; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
}

export function getTotalXP(data: AppData): number {
  return data.xpHistory.reduce((sum, h) => sum + h.xp, 0);
}

export function getLevel(totalXP: number): number {
  const XP_PER_LEVEL = 500;
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function getLevelProgress(totalXP: number): number {
  const XP_PER_LEVEL = 500;
  return (totalXP % XP_PER_LEVEL) / XP_PER_LEVEL;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-habit',
    name: 'Premier pas',
    description: 'Crée ta première habitude',
    emoji: '🌱',
    compute: (data) => ({ current: Math.min(data.habits.length, 1), target: 1 }),
  },
  {
    id: 'habit-master',
    name: 'Maître des habitudes',
    description: 'Crée 10 habitudes',
    emoji: '🏆',
    compute: (data) => ({ current: data.habits.length, target: 10 }),
  },
  {
    id: 'streak-3',
    name: 'En forme !',
    description: 'Atteins une série de 3 jours',
    emoji: '🔥',
    compute: (data) => {
      const max = data.habits.reduce((m, h) => Math.max(m, computeStreak(h.completions)), 0);
      return { current: Math.min(max, 3), target: 3 };
    },
  },
  {
    id: 'streak-7',
    name: 'Une semaine entière',
    description: 'Atteins une série de 7 jours',
    emoji: '💪',
    compute: (data) => {
      const max = data.habits.reduce((m, h) => Math.max(m, computeStreak(h.completions)), 0);
      return { current: Math.min(max, 7), target: 7 };
    },
  },
  {
    id: 'streak-30',
    name: 'Mois accompli',
    description: 'Atteins une série de 30 jours',
    emoji: '👑',
    compute: (data) => {
      const max = data.habits.reduce((m, h) => Math.max(m, computeStreak(h.completions)), 0);
      return { current: Math.min(max, 30), target: 30 };
    },
  },
  {
    id: 'first-journal',
    name: 'Journalier',
    description: 'Écris ta première entrée de journal',
    emoji: '📝',
    compute: (data) => ({ current: Math.min(data.journal.length, 1), target: 1 }),
  },
  {
    id: 'journal-7',
    name: 'Écrivain',
    description: 'Écris 7 entrées de journal',
    emoji: '✍️',
    compute: (data) => ({ current: Math.min(data.journal.length, 7), target: 7 }),
  },
  {
    id: 'first-pomodoro',
    name: 'Focus !',
    description: 'Termine ta première session Pomodoro',
    emoji: '🍅',
    compute: (data) => {
      const count = data.pomodoroSessions.filter((s) => s.phase === 'focus').length;
      return { current: Math.min(count, 1), target: 1 };
    },
  },
  {
    id: 'pomodoro-10',
    name: 'Productif',
    description: 'Termine 10 sessions Pomodoro',
    emoji: '⚡',
    compute: (data) => {
      const count = data.pomodoroSessions.filter((s) => s.phase === 'focus').length;
      return { current: Math.min(count, 10), target: 10 };
    },
  },
  {
    id: 'pomodoro-50',
    name: 'Machine à focus',
    description: 'Termine 50 sessions Pomodoro',
    emoji: '🚀',
    compute: (data) => {
      const count = data.pomodoroSessions.filter((s) => s.phase === 'focus').length;
      return { current: Math.min(count, 50), target: 50 };
    },
  },
  {
    id: 'first-goal',
    name: 'Objectif fixé',
    description: 'Crée ton premier objectif',
    emoji: '🎯',
    compute: (data) => ({ current: Math.min(data.goals.length, 1), target: 1 }),
  },
  {
    id: 'goal-done',
    name: 'Objectif atteint',
    description: 'Termine un objectif (100%)',
    emoji: '✅',
    compute: (data) => {
      const done = data.goals.filter((g) => {
        if (g.milestones.length > 0) return g.milestones.every((m) => m.done);
        return g.manualProgress >= 100;
      }).length;
      return { current: Math.min(done, 1), target: 1 };
    },
  },
  {
    id: 'book-finished',
    name: 'Grand lecteur',
    description: 'Termine un livre',
    emoji: '📚',
    compute: (data) => {
      const done = data.books.filter((b) => b.status === 'finished').length;
      return { current: Math.min(done, 1), target: 1 };
    },
  },
  {
    id: 'first-meditation',
    name: 'Serein',
    description: 'Fais ta première session de méditation',
    emoji: '🧘',
    compute: (data) => ({ current: Math.min(data.meditationSessions.length, 1), target: 1 }),
  },
  {
    id: 'passion-collector',
    name: 'Curieux',
    description: 'Ajoute 5 passions',
    emoji: '🌈',
    compute: (data) => ({ current: Math.min(data.passions.length, 5), target: 5 }),
  },
  {
    id: 'level-5',
    name: 'Apprenti',
    description: 'Atteins le niveau 5',
    emoji: '⭐',
    compute: (data) => {
      const total = data.xpHistory.reduce((s, h) => s + h.xp, 0);
      const level = Math.floor(total / 500) + 1;
      return { current: Math.min(level, 5), target: 5 };
    },
  },
];
