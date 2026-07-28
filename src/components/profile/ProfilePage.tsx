'use client';

import { useMemo } from 'react';
import { DEFAULT_TIMER_SETTINGS } from '@/lib/constants';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Avatar } from '@/components/ui/AvatarEl';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { getTotalXPFromRecords, getLevel, getLevelProgress } from '@/lib/achievements';
import type { AppData } from '@/types';
import { cn } from '@/lib/utils';

const EMPTY: AppData = {
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

export function ProfilePage() {
  const { profile, habits, journal, pomodoroSessions, goals, books, meditationSessions, skills, xpHistory, passions } = useApp();

  const totalXP = useMemo(() => getTotalXPFromRecords(xpHistory), [xpHistory]);

  const level = getLevel(totalXP);
  const levelProgress = getLevelProgress(totalXP);

  const achievementsState = useMemo(() => {
    const data = { ...EMPTY, habits, journal, pomodoroSessions, goals, books, meditationSessions, skills, xpHistory };
    return ACHIEVEMENTS.map((a) => {
      const result = a.compute(data);
      const unlocked = result.current >= result.target;
      return { ...a, current: result.current, target: result.target, unlocked };
    });
  }, [habits, journal, pomodoroSessions, goals, books, meditationSessions, skills, xpHistory]);

  const globalStats = useMemo(() => {
    const totalHabitsCompleted = habits.reduce((s, h) => s + h.completions.length, 0);
    const totalFocusSessions = pomodoroSessions.filter((s) => s.phase === 'focus').length;
    const totalMeditation = meditationSessions.reduce((s, e) => s + e.duration, 0);
    return { totalHabitsCompleted, totalFocusSessions, totalMeditation, totalPassions: passions.length, totalSkills: skills.length };
  }, [habits, pomodoroSessions, meditationSessions, passions, skills]);

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Profil" description="Votre niveau et vos succès." />

      {/* Profile card */}
      <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-6">
        <Avatar
          src={profile.avatar.startsWith('data:') ? profile.avatar : undefined}
          emoji={profile.avatar.startsWith('data:') ? undefined : profile.avatar}
          name={profile.name}
          size="lg"
        />
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Niveau {level}</span>
            <span className="text-sm text-primary">{totalXP} XP</span>
          </div>
          <div className="w-48 h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(levelProgress * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round(levelProgress * 500)} / 500 XP vers le niveau {level + 1}
          </p>
        </div>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{globalStats.totalHabitsCompleted}</p>
          <p className="text-xs text-muted-foreground">Complétions</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{globalStats.totalFocusSessions}</p>
          <p className="text-xs text-muted-foreground">Pomodoros</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{globalStats.totalMeditation}</p>
          <p className="text-xs text-muted-foreground">Min. méditation</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{globalStats.totalPassions}</p>
          <p className="text-xs text-muted-foreground">Passions</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="text-xl font-bold">{globalStats.totalSkills}</p>
          <p className="text-xs text-muted-foreground">Compétences</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <h2 className="font-semibold">Succès</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievementsState.map((a) => (
            <div
              key={a.id}
              className={cn(
                'rounded-xl border border-border bg-card p-4 flex items-center gap-3',
                a.unlocked ? 'border-primary/30' : 'opacity-60'
              )}
            >
              <span className="text-3xl">{a.unlocked ? a.emoji : '🔒'}</span>
              <div className="flex-1 min-w-0">
                <h3 className={cn('text-sm font-medium', !a.unlocked && 'text-muted-foreground')}>{a.name}</h3>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </div>
              <div className="text-right shrink-0">
                {a.unlocked ? (
                  <span className="text-xs text-primary font-medium">Débloqué</span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {a.current}/{a.target}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
