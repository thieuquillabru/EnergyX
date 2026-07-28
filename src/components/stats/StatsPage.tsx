'use client';

import { useState, useMemo } from 'react';
import type { AppData } from '@/types';
import { DEFAULT_TIMER_SETTINGS } from '@/lib/constants';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { getHabitCompletionRates, getMoodTrend, getFocusTime, getExerciseAndMeditation, getHabitCategoryBreakdown, getPeriodDays, getSummaryStats } from '@/lib/stats';
import { formatShortDate } from '@/hooks/useToday';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const EMPTY_STATE: AppData = {
  profile: null,
  passions: [],
  habits: [],
  goals: [],
  journal: [],
  pomodoroSessions: [],
  timerSettings: DEFAULT_TIMER_SETTINGS,
  books: [],
  games: [],
  skills: [],
  fitnessSessions: [],
  meditationSessions: [],
  favoriteQuotes: [],
  challenges: [],
  xpHistory: [],
  waterToday: 0,
};

export function StatsPage() {
  const { habits, journal, pomodoroSessions, fitnessSessions, meditationSessions, books, goals } = useApp();
  const [period, setPeriod] = useState<7 | 30 | 90>(7);

  const days = useMemo(() => getPeriodDays(period), [period]);

  const habitRates = useMemo(() => getHabitCompletionRates({ ...EMPTY_STATE, habits }, days), [habits, days]);
  const moodTrend = useMemo(() => getMoodTrend({ ...EMPTY_STATE, journal }, days), [journal, days]);
  const focusTime = useMemo(() => getFocusTime({ ...EMPTY_STATE, pomodoroSessions }, days), [pomodoroSessions, days]);
  const exerciseMeditation = useMemo(() => getExerciseAndMeditation({ ...EMPTY_STATE, fitnessSessions, meditationSessions }, days), [fitnessSessions, meditationSessions, days]);
  const categoryBreakdown = useMemo(() => getHabitCategoryBreakdown({ ...EMPTY_STATE, habits }), [habits]);
  const summary = useMemo(() => getSummaryStats({ ...EMPTY_STATE, habits, journal, pomodoroSessions, fitnessSessions, meditationSessions, books, goals }, period), [habits, journal, pomodoroSessions, fitnessSessions, meditationSessions, books, goals, period]);

  const axisStyle = { tick: { fill: 'var(--muted-foreground)', fontSize: 11 }, axisLine: { stroke: 'var(--border)' } };
  const gridStyle = { stroke: 'var(--border)', strokeOpacity: 0.5 };

  return (
    <div className="space-y-6">
      <PageHeader title="Statistiques" description="Suivez votre progression au fil du temps.">
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          {([7, 30, 90] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1 rounded-md text-xs transition-colors',
                period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              {p} jours
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{summary.habitRate}%</p>
          <p className="text-xs text-muted-foreground">Habitudes</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{summary.avgMood > 0 ? summary.avgMood.toFixed(1) : '—'}</p>
          <p className="text-xs text-muted-foreground">Humeur moy.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{summary.totalFocusMin}</p>
          <p className="text-xs text-muted-foreground">Focus (min)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{summary.totalExercise}</p>
          <p className="text-xs text-muted-foreground">Exercice (min)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{summary.totalMeditation}</p>
          <p className="text-xs text-muted-foreground">Méditation (min)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{summary.totalBooks}</p>
          <p className="text-xs text-muted-foreground">Livres terminés</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit completion rate */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-medium text-sm mb-4">Taux de complétion des habitudes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={habitRates}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="date" tickFormatter={(d: string) => formatShortDate(d)} {...axisStyle} />
              <YAxis domain={[0, 100]} {...axisStyle} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                labelFormatter={(d: string) => formatShortDate(d)}
                formatter={(v: number) => [`${v.toFixed(0)}%`, 'Complétion']}
              />
              <Area type="monotone" dataKey="rate" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mood trend */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-medium text-sm mb-4">Évolution de l&apos;humeur</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="date" tickFormatter={(d: string) => formatShortDate(d)} {...axisStyle} />
              <YAxis domain={[1, 5]} {...axisStyle} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                labelFormatter={(d: string) => formatShortDate(d)}
                formatter={(v: number) => [v || 'N/A', 'Humeur']}
              />
              <Line type="monotone" dataKey="mood" stroke="var(--chart-2)" connectNulls dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Focus time */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-medium text-sm mb-4">Temps de focus quotidien</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={focusTime}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="date" tickFormatter={(d: string) => formatShortDate(d)} {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                labelFormatter={(d: string) => formatShortDate(d)}
                formatter={(v: number) => [`${v} min`, 'Focus']}
              />
              <Bar dataKey="minutes" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exercise + Meditation */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-medium text-sm mb-4">Exercice & Méditation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={exerciseMeditation}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="date" tickFormatter={(d: string) => formatShortDate(d)} {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                labelFormatter={(d: string) => formatShortDate(d)}
              />
              <Legend />
              <Bar dataKey="exercise" name="Exercice" stackId="a" fill="var(--chart-4)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="meditation" name="Méditation" stackId="a" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-medium text-sm mb-4">Répartition des habitudes par catégorie</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }: { name: string; value: number }) => `${name} (${value})`}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
