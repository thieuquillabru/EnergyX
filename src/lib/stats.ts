import type { AppData } from '@/types';
import { DOMAIN_LABELS, type DomainId } from '@/types';
import { getLast7Days, getLast30Days, getLast90Days } from './achievements';

export interface HabitCompletionRate {
  date: string;
  rate: number;
}

export interface MoodDataPoint {
  date: string;
  mood: number | null;
}

export interface FocusDataPoint {
  date: string;
  minutes: number;
}

export interface ExerciseDataPoint {
  date: string;
  exercise: number;
  meditation: number;
}

export function getHabitCompletionRates(data: AppData, days: string[]): HabitCompletionRate[] {
  return days.map((date) => {
    const completed = data.habits.filter((h) => h.completions.includes(date)).length;
    const total = data.habits.length;
    return { date, rate: total > 0 ? (completed / total) * 100 : 0 };
  });
}

export function getMoodTrend(data: AppData, days: string[]): MoodDataPoint[] {
  return days.map((date) => {
    const entry = data.journal.find((j) => j.date === date);
    return { date, mood: entry?.mood ?? null };
  });
}

export function getFocusTime(data: AppData, days: string[]): FocusDataPoint[] {
  return days.map((date) => {
    const sessions = data.pomodoroSessions.filter(
      (s) => s.date === date && s.phase === 'focus'
    );
    const minutes = sessions.reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
    return { date, minutes };
  });
}

export function getExerciseAndMeditation(data: AppData, days: string[]): ExerciseDataPoint[] {
  return days.map((date) => {
    const exercise = data.fitnessSessions
      .filter((s) => s.date === date)
      .reduce((sum, s) => sum + s.duration, 0);
    const meditation = data.meditationSessions
      .filter((s) => s.date === date)
      .reduce((sum, s) => sum + s.duration, 0);
    return { date, exercise, meditation };
  });
}

export function getHabitCategoryBreakdown(data: AppData): { name: string; value: number; color: string }[] {
  const cats: Record<string, number> = {};
  for (const h of data.habits) {
    const cat = h.category || 'personnel';
    cats[cat] = (cats[cat] || 0) + 1;
  }
  const colors = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#38bdf8', '#ec4899'];
  return Object.entries(cats).map(([cat, value], i) => ({
    name: (DOMAIN_LABELS[cat as DomainId] || cat),
    value,
    color: colors[i % colors.length],
  }));
}

export function getPeriodDays(period: 7 | 30 | 90): string[] {
  if (period === 7) return getLast7Days();
  if (period === 30) return getLast30Days();
  return getLast90Days();
}

export function getSummaryStats(data: AppData, period: 7 | 30 | 90): {
  habitRate: number;
  avgMood: number;
  totalFocusMin: number;
  totalExercise: number;
  totalMeditation: number;
  totalBooks: number;
} {
  const days = getPeriodDays(period);
  const rates = getHabitCompletionRates(data, days);
  const moods = getMoodTrend(data, days).filter((m) => m.mood !== null) as { date: string; mood: number }[];
  const focus = getFocusTime(data, days);
  const exMed = getExerciseAndMeditation(data, days);

  const habitRate = rates.length > 0
    ? Math.round(rates.reduce((s, r) => s + r.rate, 0) / rates.length)
    : 0;

  const avgMood = moods.length > 0
    ? moods.reduce((s, m) => s + m.mood, 0) / moods.length
    : 0;

  const totalFocusMin = focus.reduce((s, f) => s + f.minutes, 0);
  const totalExercise = exMed.reduce((s, e) => s + e.exercise, 0);
  const totalMeditation = exMed.reduce((s, e) => s + e.meditation, 0);
  const totalBooks = data.books.filter((b) => b.status === 'finished').length;

  return { habitRate, avgMood: Math.round(avgMood * 10) / 10, totalFocusMin, totalExercise, totalMeditation, totalBooks };
}
