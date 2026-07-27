'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { currentTheme, user, habits, goals, journalEntries, moodHistory, waterIntake, pomodoroSessions, meditationSessions, workouts, quotes } = useApp();

  const today = new Date().toISOString().split('T')[0];

  // Calculate today's habits completion
  const todayHabits = useMemo(() => {
    return habits.filter(h => h.isActive);
  }, [habits]);

  const todayCompletedHabits = useMemo(() => {
    return todayHabits.filter(h => h.completions.some(c => c.date === today && c.completed)).length;
  }, [todayHabits, today]);

  // Active goals
  const activeGoals = useMemo(() => {
    return goals.filter(g => g.status === 'active');
  }, [goals]);

  // Recent mood
  const recentMood = useMemo(() => {
    return moodHistory[moodHistory.length - 1];
  }, [moodHistory]);

  // Today's pomodoros
  const todayPomodoros = useMemo(() => {
    return pomodoroSessions.filter(s => s.completedAt.startsWith(today) && s.type === 'focus').length;
  }, [pomodoroSessions, today]);

  // Weekly stats
  const weekStats = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    const weekMeditation = meditationSessions.filter(s => s.date >= weekAgoStr).reduce((acc, s) => acc + s.duration, 0);
    const weekWorkouts = workouts.filter(w => w.date >= weekAgoStr);
    const weekCalories = weekWorkouts.reduce((acc, w) => acc + (w.calories || 0), 0);
    
    return { weekMeditation, weekWorkouts: weekWorkouts.length, weekCalories };
  }, [meditationSessions, workouts]);

  // Random motivational quote
  const randomQuote = useMemo(() => {
    const favorites = quotes.filter(q => q.isFavorite);
    const source = favorites.length > 0 ? favorites : quotes;
    return source[Math.floor(Math.random() * source.length)];
  }, [quotes]);

  // Mood emoji
  const getMoodEmoji = (mood: string) => {
    const moods: Record<string, string> = {
      excellent: '😄',
      good: '🙂',
      okay: '😐',
      bad: '😔',
      terrible: '😢',
    };
    return moods[mood] || '😐';
  };

  // Mood color
  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      excellent: currentTheme.success,
      good: currentTheme.primary,
      okay: currentTheme.warning,
      bad: '#f97316',
      terrible: currentTheme.error,
    };
    return colors[mood] || currentTheme.textSecondary;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>
            Bonjour, {user.name}! 👋
          </h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="lg">
            ⭐ Niveau {user.stats.level}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hover onClick={() => onNavigate('habits')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${currentTheme.primary}20` }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={currentTheme.primary}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: currentTheme.text }}>
                {todayCompletedHabits}/{todayHabits.length}
              </p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Habitudes du jour</p>
            </div>
          </div>
        </Card>

        <Card hover onClick={() => onNavigate('goals')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${currentTheme.secondary}20` }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={currentTheme.secondary}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: currentTheme.text }}>{activeGoals.length}</p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Objectifs actifs</p>
            </div>
          </div>
        </Card>

        <Card hover onClick={() => onNavigate('timer')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${currentTheme.accent}20` }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={currentTheme.accent}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: currentTheme.text }}>{todayPomodoros}</p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Pomodoros aujourd'hui</p>
            </div>
          </div>
        </Card>

        <Card hover onClick={() => onNavigate('profile')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${currentTheme.success}20` }}>
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: currentTheme.text }}>{user.stats.currentStreak}</p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Jours consécutifs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: currentTheme.text }}>Habitudes du jour</h2>
            <button
              onClick={() => onNavigate('habits')}
              className="text-sm font-medium hover:underline"
              style={{ color: currentTheme.primary }}
            >
              Voir tout →
            </button>
          </div>
          
          {todayHabits.length === 0 ? (
            <div className="text-center py-8" style={{ color: currentTheme.textSecondary }}>
              <p>Aucune habitude définie</p>
              <button
                onClick={() => onNavigate('habits')}
                className="mt-2 font-medium"
                style={{ color: currentTheme.primary }}
              >
                Créer votre première habitude
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayHabits.slice(0, 5).map((habit) => {
                const isCompleted = habit.completions.some(c => c.date === today && c.completed);
                return (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{ backgroundColor: currentTheme.background }}
                  >
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted ? 'scale-110' : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: isCompleted ? currentTheme.success : currentTheme.border,
                        color: isCompleted ? 'white' : currentTheme.textSecondary,
                      }}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-lg">{habit.icon}</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted ? 'line-through' : ''}`} style={{ color: currentTheme.text }}>
                        {habit.title}
                      </p>
                      <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                        Série: {habit.streaks.current} jours
                      </p>
                    </div>
                    <Badge variant={isCompleted ? 'success' : 'default'} size="sm">
                      {isCompleted ? '✓ Complété' : 'En attente'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Actions & Mood */}
        <div className="space-y-6">
          {/* Mood Tracker */}
          <Card>
            <h3 className="font-bold mb-3" style={{ color: currentTheme.text }}>Humeur du jour</h3>
            {recentMood ? (
              <div className="text-center">
                <span className="text-5xl">{getMoodEmoji(recentMood.mood)}</span>
                <p className="mt-2 font-medium capitalize" style={{ color: getMoodColor(recentMood.mood) }}>
                  {recentMood.mood === 'excellent' ? 'Excellent' : 
                   recentMood.mood === 'good' ? 'Bien' : 
                   recentMood.mood === 'okay' ? 'Correct' : 
                   recentMood.mood === 'bad' ? 'Mauvais' : 'Terrible'}
                </p>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('journal')}
                className="w-full py-3 rounded-xl text-center font-medium transition-colors"
                style={{ backgroundColor: currentTheme.background, color: currentTheme.primary }}
              >
                Comment vous sentez-vous ?
              </button>
            )}
          </Card>

          {/* Water Intake */}
          <Card>
            <h3 className="font-bold mb-3" style={{ color: currentTheme.text }}>Hydratation 💧</h3>
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ color: currentTheme.primary }}>{waterIntake}</p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>/ 8 verres</p>
              <ProgressBar value={waterIntake} max={8} className="mt-3" />
            </div>
          </Card>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Goals */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: currentTheme.text }}>Objectifs en cours</h2>
            <button
              onClick={() => onNavigate('goals')}
              className="text-sm font-medium hover:underline"
              style={{ color: currentTheme.primary }}
            >
              Voir tout →
            </button>
          </div>
          
          {activeGoals.length === 0 ? (
            <p className="text-center py-4" style={{ color: currentTheme.textSecondary }}>
              Aucun objectif actif
            </p>
          ) : (
            <div className="space-y-3">
              {activeGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-3 rounded-xl" style={{ backgroundColor: currentTheme.background }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium" style={{ color: currentTheme.text }}>{goal.title}</p>
                    <Badge
                      variant={goal.priority === 'high' || goal.priority === 'critical' ? 'error' : 
                               goal.priority === 'medium' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {goal.priority}
                    </Badge>
                  </div>
                  <ProgressBar value={goal.progress} showLabel size="sm" />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Weekly Stats */}
        <Card>
          <h3 className="font-bold mb-4" style={{ color: currentTheme.text }}>Cette semaine</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧘</span>
                <span style={{ color: currentTheme.text }}>Méditation</span>
              </div>
              <span className="font-bold" style={{ color: currentTheme.primary }}>{weekStats.weekMeditation} min</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💪</span>
                <span style={{ color: currentTheme.text }}>Entraînements</span>
              </div>
              <span className="font-bold" style={{ color: currentTheme.success }}>{weekStats.weekWorkouts}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <span style={{ color: currentTheme.text }}>Calories brûlées</span>
              </div>
              <span className="font-bold" style={{ color: currentTheme.accent }}>{weekStats.weekCalories} kcal</span>
            </div>
          </div>
        </Card>

        {/* Motivational Quote */}
        <Card style={{ backgroundColor: currentTheme.primary }}>
          <h3 className="font-bold mb-3 text-white">Citation du jour ✨</h3>
          <blockquote className="text-white">
            <p className="text-lg italic">"{randomQuote.text}"</p>
            <footer className="mt-2 text-white/80">— {randomQuote.author}</footer>
          </blockquote>
        </Card>
      </div>

      {/* Quick Access */}
      <Card>
        <h3 className="font-bold mb-4" style={{ color: currentTheme.text }}>Accès rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { id: 'habits', icon: '✓', label: 'Habitudes', color: currentTheme.primary },
            { id: 'timer', icon: '⏱️', label: 'Pomodoro', color: currentTheme.accent },
            { id: 'meditation', icon: '🧘', label: 'Méditer', color: currentTheme.success },
            { id: 'journal', icon: '📔', label: 'Journal', color: currentTheme.warning },
            { id: 'library', icon: '📚', label: 'Livres', color: '#8b5cf6' },
            { id: 'gaming', icon: '🎮', label: 'Jeux', color: '#ec4899' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: currentTheme.background }}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="font-medium text-sm" style={{ color: currentTheme.text }}>{item.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
