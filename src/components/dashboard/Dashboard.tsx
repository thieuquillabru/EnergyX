'use client';

import { useMemo, useCallback } from 'react';
import type { PageId } from '@/types';
import { useApp } from '@/context/AppContext';
import { useToday, useTodayFormatted } from '@/hooks/useToday';
import { StatCard } from '@/components/ui/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { QUOTES, XP_PER_LEVEL } from '@/lib/constants';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { CheckCircle, Target, Flame, Droplets, ChevronRight, Zap } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const {
    profile,
    habits,
    goals,
    journal,
    pomodoroSessions,
    passions,
    waterToday,
    setWaterToday,
    toggleHabitCompletion,
    xpHistory,
    meditationSessions,
    fitnessSessions,
  } = useApp();

  const today = useToday();
  const todayFormatted = useTodayFormatted();

  // Quote of the day (derived from date, no Math.random)
  const quote = useMemo(() => {
    if (!today) return null;
    const dayOfYear = Math.floor(
      (new Date(today + 'T12:00:00').getTime() - new Date(new Date(today + 'T12:00:00').getFullYear(), 0, 1).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
  }, [today]);

  // KPIs
  const totalXP = useMemo(() => xpHistory.reduce((s, h) => s + h.xp, 0), [xpHistory]);
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;

  const todayJournal = useMemo(() => journal.find((j) => j.date === today), [journal, today]);

  const weekStart = useMemo(() => {
    if (!today) return today;
    const d = new Date(today + 'T12:00:00');
    const day = d.getDay();
    const offset = profile?.weekStart === 'sunday' ? day : (day === 0 ? 6 : day - 1);
    return format(subDays(d, offset), 'yyyy-MM-dd');
  }, [today, profile?.weekStart]);

  const weekFocus = useMemo(() => {
    return pomodoroSessions
      .filter((s) => s.date >= weekStart && s.phase === 'focus')
      .reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
  }, [pomodoroSessions, weekStart]);

  const weekExercise = useMemo(() => {
    return fitnessSessions
      .filter((s) => s.date >= weekStart)
      .reduce((sum, s) => sum + s.duration, 0);
  }, [fitnessSessions, weekStart]);

  const weekMeditation = useMemo(() => {
    return meditationSessions
      .filter((s) => s.date >= weekStart)
      .reduce((sum, s) => sum + s.duration, 0);
  }, [meditationSessions, weekStart]);

  const handleWaterPlus = useCallback(() => setWaterToday(Math.min(waterToday + 1, 20)), [waterToday, setWaterToday]);
  const handleWaterMinus = useCallback(() => setWaterToday(Math.max(waterToday - 1, 0)), [waterToday, setWaterToday]);

  // Active goals
  const activeGoals = useMemo(() => {
    return goals.filter((g) => {
      const progress = g.milestones.length > 0
        ? (g.milestones.filter((m) => m.done).length / g.milestones.length) * 100
        : g.manualProgress;
      return progress < 100;
    }).slice(0, 3);
  }, [goals]);

  // Quick access based on passions
  const quickAccess = useMemo(() => {
    const catMap: Record<string, PageId> = {
      sports: 'fitness',
      music: 'timer',
      reading: 'library',
      gaming: 'gaming',
      coding: 'skills',
      cooking: 'journal',
      art: 'journal',
    };
    return passions.slice(0, 4).map((p) => ({
      ...p,
      page: catMap[p.category] || 'habits',
    }));
  }, [passions]);

  if (!today) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={todayFormatted || 'Bonjour'}
        description={profile ? `Niveau ${level} — ${totalXP} XP` : undefined}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Habitudes du jour"
          value={`${habits.filter((h) => h.completions.includes(today)).length}/${habits.length}`}
          icon={<CheckCircle size={18} />}
          onClick={() => onNavigate('habits')}
        />
        <StatCard
          label="Objectifs actifs"
          value={activeGoals.length}
          icon={<Target size={18} />}
          onClick={() => onNavigate('goals')}
        />
        <StatCard
          label="Focus (semaine)"
          value={`${weekFocus} min`}
          icon={<Flame size={18} />}
          onClick={() => onNavigate('timer')}
        />
        <StatCard
          label="Exercice + Méditation"
          value={`${weekExercise + weekMeditation} min`}
          icon={<Zap size={18} />}
          onClick={() => onNavigate('fitness')}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's habits */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Habitudes du jour</h2>
            <button
              type="button"
              onClick={() => onNavigate('habits')}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ChevronRight size={12} />
            </button>
          </div>
          {habits.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune habitude. Créez-en dans la section Habitudes.</p>
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 6).map((h) => {
                const done = h.completions.includes(today);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => toggleHabitCompletion(h.id, today)}
                    className="flex w-full items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left"
                  >
                    <span className="text-xl">{h.icon}</span>
                    <span className={cn(
                      'flex-1 text-sm',
                      done && 'line-through text-muted-foreground'
                    )}>
                      {h.name}
                    </span>
                    <CheckCircle
                      size={18}
                      className={done ? 'text-primary' : 'text-muted-foreground'}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mood + Water */}
        <div className="space-y-6">
          {/* Hydration */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h2 className="font-semibold">Hydratation</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Droplets size={24} className="text-blue-400" />
                <span className="text-3xl font-bold">{waterToday}</span>
                <span className="text-sm text-muted-foreground">verres</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleWaterMinus}
                  className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent text-lg"
                  aria-label="Retirer un verre"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={handleWaterPlus}
                  className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent text-lg"
                  aria-label="Ajouter un verre"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quote */}
          {quote && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-sm italic">&ldquo;{quote.text}&rdquo;</p>
              <p className="text-xs text-muted-foreground">— {quote.author}</p>
            </div>
          )}

          {/* Active goals */}
          {activeGoals.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Objectifs en cours</h2>
                <button
                  type="button"
                  onClick={() => onNavigate('goals')}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Voir tout <ChevronRight size={12} />
                </button>
              </div>
              {activeGoals.map((g) => {
                const progress = g.milestones.length > 0
                  ? Math.round((g.milestones.filter((m) => m.done).length / g.milestones.length) * 100)
                  : g.manualProgress;
                return (
                  <div key={g.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{g.name}</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Passions + Quick Access */}
      {passions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-semibold">Mes passions</h2>
          <div className="flex flex-wrap gap-2">
            {passions.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm"
              >
                {p.emoji} {p.name}
              </span>
            ))}
          </div>
          {quickAccess.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAccess.map((qa) => (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => onNavigate(qa.page)}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {qa.emoji} Accéder <ChevronRight size={12} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Week stats preview */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold mb-3">Stats de la semaine</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold">{weekFocus}</p>
            <p className="text-xs text-muted-foreground">min de focus</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{weekExercise}</p>
            <p className="text-xs text-muted-foreground">min d&apos;exercice</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{weekMeditation}</p>
            <p className="text-xs text-muted-foreground">min de méditation</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{todayJournal?.mood ?? '—'}</p>
            <p className="text-xs text-muted-foreground">humeur du jour</p>
          </div>
        </div>
      </div>
    </div>
  );
}


