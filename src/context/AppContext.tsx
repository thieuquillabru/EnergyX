'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useIsHydrated } from '@/hooks/useIsHydrated';
import {
  User,
  Habit,
  Goal,
  JournalEntry,
  Book,
  Game,
  Skill,
  Workout,
  MeditationSession,
  PomodoroSession,
  ThemeType,
  Passion,
  PomodoroSettings,
  DailyView,
  MoodEntry,
  MotivationalQuote,
  Challenge,
} from '@/types';

const STORAGE_KEY = 'energyx_data';

/**
 * Reads the persisted state once, synchronously, so it can be used as a lazy
 * `useState` initialiser. Returns `null` on the server or when nothing is
 * stored, in which case every slice falls back to its default value.
 */
type SavedData = Record<string, unknown>;

let savedDataCache: SavedData | null | undefined;

function readSavedData(): SavedData | null {
  if (savedDataCache !== undefined) return savedDataCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    savedDataCache = raw ? (JSON.parse(raw) as SavedData) : null;
  } catch (e) {
    console.error('Failed to load saved data:', e);
    savedDataCache = null;
  }
  return savedDataCache;
}

/** Lazy initialiser factory: persisted value if present, otherwise `fallback`. */
function persisted<T>(key: string, fallback: T) {
  return (): T => {
    const saved = readSavedData();
    const value = saved?.[key];
    return value === undefined || value === null ? fallback : (value as T);
  };
}

// Default Themes
export const defaultThemes: ThemeType[] = [
  {
    id: 'ocean',
    name: 'Océan',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#22d3ee',
    background: '#f0f9ff',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    id: 'forest',
    name: 'Forêt',
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#4ade80',
    background: '#f0fdf4',
    surface: '#ffffff',
    text: '#14532d',
    textSecondary: '#4d7c0f',
    border: '#bbf7d0',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    id: 'sunset',
    name: 'Coucher de Soleil',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    background: '#fff7ed',
    surface: '#ffffff',
    text: '#7c2d12',
    textSecondary: '#9a3412',
    border: '#fed7aa',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    id: 'lavender',
    name: 'Lavande',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    background: '#faf5ff',
    surface: '#ffffff',
    text: '#4c1d95',
    textSecondary: '#6d28d9',
    border: '#ddd6fe',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#f472b6',
    background: '#fdf2f8',
    surface: '#ffffff',
    text: '#831843',
    textSecondary: '#be185d',
    border: '#fbcfe8',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    id: 'midnight',
    name: 'Minuit',
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#818cf8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    id: 'emerald',
    name: 'Émeraude',
    primary: '#14b8a6',
    secondary: '#0d9488',
    accent: '#2dd4bf',
    background: '#f0fdfa',
    surface: '#ffffff',
    text: '#134e4a',
    textSecondary: '#0f766e',
    border: '#99f6e4',
    success: '#14b8a6',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    id: 'slate',
    name: 'Ardoise',
    primary: '#64748b',
    secondary: '#475569',
    accent: '#94a3b8',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textSecondary: '#475569',
    border: '#cbd5e1',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
];

// Default Motivational Quotes
export const defaultQuotes: MotivationalQuote[] = [
  { id: '1', text: "Le seul moyen de faire un excellent travail est d'aimer ce que vous faites.", author: "Steve Jobs", category: "motivation", isFavorite: false },
  { id: '2', text: "Le succès c'est pas toujours la grandeur. C'est la constance.", author: "Bobby Brown", category: "success", isFavorite: false },
  { id: '3', text: "Les seules limites à nos réalisations de demain sont nos doutes d'aujourd'hui.", author: "Franklin D. Roosevelt", category: "confidence", isFavorite: false },
  { id: '4', text: "L'échec est simplement l'opportunité de recommencer, cette fois plus intelligemment.", author: "Henry Ford", category: "resilience", isFavorite: false },
  { id: '5', text: "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est maintenant.", author: "Proverbe chinois", category: "action", isFavorite: false },
  { id: '6', text: "Votre temps est limité, ne le gaspillez pas en vivant la vie de quelqu'un d'autre.", author: "Steve Jobs", category: "authenticity", isFavorite: false },
  { id: '7', text: "La discipline est le pont entre les objectifs et les accomplissements.", author: "Jim Rohn", category: "discipline", isFavorite: false },
  { id: '8', text: "Ne regardez pas en arrière, vous allez dans la mauvaise direction.", author: "Proverbe", category: "direction", isFavorite: false },
  { id: '9', text: "Le confort est l'ennemi de la croissance.", author: "Aristote", category: "growth", isFavorite: false },
  { id: '10', text: "Chaque champion a d'abord été un challenger qui a refusé de abandonner.", author: "Robin Sharma", category: "perseverance", isFavorite: false },
  { id: '11', text: "La vraie richesse est la capacité de jouir de la vie.", author: "Sénèque", category: "wisdom", isFavorite: false },
  { id: '12', text: "Ce n'est pas la charge qui brise le dos, c'est la manière dont vous la portez.", author: "Confucius", category: "resilience", isFavorite: false },
];

// Default Challenges
export const defaultChallenges: Challenge[] = [
  { id: '1', title: 'Défi des 30 jours', description: 'Accomplissez une habitude pendant 30 jours consécutifs', type: 'habit', duration: 30, startDate: new Date().toISOString(), progress: 0, completed: false, reward: 'Badge de persévérance' },
  { id: '2', title: 'Méditation Matinale', description: 'Méditez pendant 10 minutes chaque matin pendant une semaine', type: 'mindfulness', duration: 7, startDate: new Date().toISOString(), progress: 0, completed: false, reward: 'Esprit serein' },
  { id: '3', title: 'Lecteur Assidu', description: 'Lisez 30 minutes par jour pendant 2 semaines', type: 'learning', duration: 14, startDate: new Date().toISOString(), progress: 0, completed: false, reward: 'Badge de savoir' },
];

// Initial User Data
const initialUser: User = {
  id: '1',
  name: 'Utilisateur',
  createdAt: new Date().toISOString(),
  preferences: {
    theme: defaultThemes[0],
    themeMode: 'light',
    language: 'fr',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    weekStart: 'monday',
    notifications: {
      habits: true,
      goals: true,
      pomodoro: true,
      journal: true,
      motivation: true,
      water: true,
      exercise: true,
    },
  },
  passions: [],
  stats: {
    totalHabitsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalGoalsAchieved: 0,
    totalJournalEntries: 0,
    totalPomodoros: 0,
    totalMeditationMinutes: 0,
    totalExerciseMinutes: 0,
    level: 1,
    xp: 0,
    achievements: [],
  },
};

// Pomodoro Settings
const defaultPomodoroSettings: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
};

// Interface du contexte
interface AppContextType {
  // User
  user: User;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Habits
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string, date: string) => void;
  
  // Goals
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  
  // Mood
  moodHistory: MoodEntry[];
  addMoodEntry: (entry: MoodEntry) => void;
  
  // Books
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  // Games
  games: Game[];
  addGame: (game: Game) => void;
  updateGame: (id: string, updates: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  
  // Skills
  skills: Skill[];
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  
  // Workouts
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  
  // Meditation
  meditationSessions: MeditationSession[];
  addMeditationSession: (session: MeditationSession) => void;
  
  // Pomodoro
  pomodoroSessions: PomodoroSession[];
  addPomodoroSession: (session: PomodoroSession) => void;
  pomodoroSettings: PomodoroSettings;
  setPomodoroSettings: (settings: PomodoroSettings) => void;
  
  // Themes
  themes: ThemeType[];
  currentTheme: ThemeType;
  setCurrentTheme: (themeId: string) => void;
  addCustomTheme: (theme: ThemeType) => void;
  
  // Passions
  passions: Passion[];
  addPassion: (passion: Passion) => void;
  updatePassion: (id: string, updates: Partial<Passion>) => void;
  deletePassion: (id: string) => void;
  
  // Quotes
  quotes: MotivationalQuote[];
  toggleQuoteFavorite: (id: string) => void;
  
  // Challenges
  challenges: Challenge[];
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  
  // Stats
  updateStats: (updates: Partial<User['stats']>) => void;
  addXP: (amount: number) => void;
  
  // Water Tracking
  waterIntake: number;
  addWater: (amount: number) => void;
  
  // Daily View
  getDailyView: (date: string) => DailyView;
  
  // Data Management
  exportData: () => string;
  importData: (data: string) => boolean;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(persisted('user', initialUser));
  const [habits, setHabits] = useState<Habit[]>(persisted<Habit[]>('habits', []));
  const [goals, setGoals] = useState<Goal[]>(persisted<Goal[]>('goals', []));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(persisted<JournalEntry[]>('journalEntries', []));
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(persisted<MoodEntry[]>('moodHistory', []));
  const [books, setBooks] = useState<Book[]>(persisted<Book[]>('books', []));
  const [games, setGames] = useState<Game[]>(persisted<Game[]>('games', []));
  const [skills, setSkills] = useState<Skill[]>(persisted<Skill[]>('skills', []));
  const [workouts, setWorkouts] = useState<Workout[]>(persisted<Workout[]>('workouts', []));
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>(persisted<MeditationSession[]>('meditationSessions', []));
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(persisted<PomodoroSession[]>('pomodoroSessions', []));
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(persisted('pomodoroSettings', defaultPomodoroSettings));
  const [themes, setThemes] = useState<ThemeType[]>(persisted('themes', defaultThemes));
  const [passions, setPassions] = useState<Passion[]>(persisted<Passion[]>('passions', []));
  const [quotes, setQuotes] = useState<MotivationalQuote[]>(persisted('quotes', defaultQuotes));
  const [challenges, setChallenges] = useState<Challenge[]>(persisted('challenges', defaultChallenges));
  const [waterIntake, setWaterIntake] = useState<number>(persisted('waterIntake', 0));
  const isHydrated = useIsHydrated();


  // Persist on change. Gated on hydration so the first (server-matching)
  // render never overwrites the stored data.
  useEffect(() => {
    if (!isHydrated) return;
    const data = {
      user,
      habits,
      goals,
      journalEntries,
      moodHistory,
      books,
      games,
      skills,
      workouts,
      meditationSessions,
      pomodoroSessions,
      pomodoroSettings,
      themes,
      passions,
      quotes,
      challenges,
      waterIntake,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Quota exceeded / private mode: don't crash the app
      console.error('Failed to save data:', e);
    }
  }, [isHydrated, user, habits, goals, journalEntries, moodHistory, books, games, skills, workouts, meditationSessions, pomodoroSessions, pomodoroSettings, themes, passions, quotes, challenges, waterIntake]);

  // XP / level (handles multiple level-ups in one go)
  const addXP = useCallback((amount: number) => {
    setUser(prev => {
      let xp = prev.stats.xp + amount;
      let level = prev.stats.level;
      while (xp >= level * 100) {
        xp -= level * 100;
        level += 1;
      }
      return { ...prev, stats: { ...prev.stats, xp, level } };
    });
  }, []);

  // User functions
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  // Habits functions
  const addHabit = useCallback((habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const completeHabit = useCallback((id: string, date: string) => {
    let didComplete = false;
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      // Guard against double completion for the same day
      if (h.completions.some(c => c.date === date && c.completed)) return h;

      didComplete = true;
      const newCompletions = [...h.completions, { date, completed: true }];

      // A streak only continues if the previous completion was the day before
      const previousDay = new Date(`${date}T00:00:00`);
      previousDay.setDate(previousDay.getDate() - 1);
      const previousDayStr = previousDay.toISOString().split('T')[0];
      const isConsecutive = h.streaks.lastCompleted === previousDayStr;
      const newStreak = isConsecutive ? h.streaks.current + 1 : 1;

      return {
        ...h,
        completions: newCompletions,
        streaks: {
          ...h.streaks,
          current: newStreak,
          longest: Math.max(h.streaks.longest, newStreak),
          lastCompleted: date,
        },
      };
    }));
    if (didComplete) addXP(10);
  }, [addXP]);

  // Goals functions
  const addGoal = useCallback((goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // Journal functions
  const addJournalEntry = useCallback((entry: JournalEntry) => {
    setJournalEntries(prev => [...prev, entry]);
  }, []);

  const updateJournalEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteJournalEntry = useCallback((id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  // Mood functions
  const addMoodEntry = useCallback((entry: MoodEntry) => {
    setMoodHistory(prev => {
      const existing = prev.findIndex(m => m.date === entry.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = entry;
        return updated;
      }
      return [...prev, entry];
    });
  }, []);

  // Books functions
  const addBook = useCallback((book: Book) => {
    setBooks(prev => [...prev, book]);
  }, []);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  }, []);

  // Games functions
  const addGame = useCallback((game: Game) => {
    setGames(prev => [...prev, game]);
  }, []);

  const updateGame = useCallback((id: string, updates: Partial<Game>) => {
    setGames(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGame = useCallback((id: string) => {
    setGames(prev => prev.filter(g => g.id !== id));
  }, []);

  // Skills functions
  const addSkill = useCallback((skill: Skill) => {
    setSkills(prev => [...prev, skill]);
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  }, []);

  // Workouts functions
  const addWorkout = useCallback((workout: Workout) => {
    setWorkouts(prev => [...prev, workout]);
    addXP(20);
  }, [addXP]);

  const updateWorkout = useCallback((id: string, updates: Partial<Workout>) => {
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }, []);

  // Meditation functions
  const addMeditationSession = useCallback((session: MeditationSession) => {
    setMeditationSessions(prev => [...prev, session]);
    addXP(15);
  }, [addXP]);

  // Pomodoro functions
  const addPomodoroSession = useCallback((session: PomodoroSession) => {
    setPomodoroSessions(prev => [...prev, session]);
    if (session.type === 'focus') {
      addXP(5);
    }
  }, [addXP]);

  // Theme functions
  const currentTheme = useMemo(
    () => themes.find(t => t.id === user.preferences.theme.id) || themes[0],
    [themes, user.preferences.theme.id]
  );

  const setCurrentTheme = useCallback((themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setUser(prev => ({
        ...prev,
        preferences: { ...prev.preferences, theme },
      }));
    }
  }, [themes]);

  const addCustomTheme = useCallback((theme: ThemeType) => {
    setThemes(prev => [...prev, theme]);
  }, []);

  // Passion functions
  const addPassion = useCallback((passion: Passion) => {
    setPassions(prev => [...prev, passion]);
  }, []);

  const updatePassion = useCallback((id: string, updates: Partial<Passion>) => {
    setPassions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePassion = useCallback((id: string) => {
    setPassions(prev => prev.filter(p => p.id !== id));
  }, []);

  // Quote functions
  const toggleQuoteFavorite = useCallback((id: string) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
  }, []);

  // Challenge functions
  const addChallenge = useCallback((challenge: Challenge) => {
    setChallenges(prev => [...prev, challenge]);
  }, []);

  const updateChallenge = useCallback((id: string, updates: Partial<Challenge>) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  // Stats functions
  const updateStats = useCallback((updates: Partial<User['stats']>) => {
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, ...updates },
    }));
  }, []);

  // Water tracking
  const addWater = useCallback((amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  }, []);

  // Get daily view
  const getDailyView = useCallback((date: string): DailyView => {
    const dateHabits = habits.map(h => ({
      ...h,
      completions: h.completions.filter(c => c.date === date),
    }));
    const mood = moodHistory.find(m => m.date === date);
    const journal = journalEntries.find(j => j.date === date);
    const dayWorkouts = workouts.filter(w => w.date === date);
    const dayMeditations = meditationSessions.filter(m => m.date.startsWith(date));
    const dayPomodoros = pomodoroSessions.filter(p => p.completedAt.startsWith(date));

    return {
      date,
      habits: dateHabits,
      mood,
      journal,
      workouts: dayWorkouts,
      meditations: dayMeditations,
      pomodoros: dayPomodoros,
      water: waterIntake,
      sleep: 0,
    };
  }, [habits, moodHistory, journalEntries, workouts, meditationSessions, pomodoroSessions, waterIntake]);

  // Export data
  const exportData = useCallback((): string => {
    const data = {
      user,
      habits,
      goals,
      journalEntries,
      moodHistory,
      books,
      games,
      skills,
      workouts,
      meditationSessions,
      pomodoroSessions,
      pomodoroSettings,
      themes,
      passions,
      quotes,
      challenges,
      waterIntake,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [user, habits, goals, journalEntries, moodHistory, books, games, skills, workouts, meditationSessions, pomodoroSessions, pomodoroSettings, themes, passions, quotes, challenges, waterIntake]);

  // Import data
  const importData = useCallback((data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.user) setUser(parsed.user);
      if (parsed.habits) setHabits(parsed.habits);
      if (parsed.goals) setGoals(parsed.goals);
      if (parsed.journalEntries) setJournalEntries(parsed.journalEntries);
      if (parsed.moodHistory) setMoodHistory(parsed.moodHistory);
      if (parsed.books) setBooks(parsed.books);
      if (parsed.games) setGames(parsed.games);
      if (parsed.skills) setSkills(parsed.skills);
      if (parsed.workouts) setWorkouts(parsed.workouts);
      if (parsed.meditationSessions) setMeditationSessions(parsed.meditationSessions);
      if (parsed.pomodoroSessions) setPomodoroSessions(parsed.pomodoroSessions);
      if (parsed.pomodoroSettings) setPomodoroSettings(parsed.pomodoroSettings);
      if (parsed.themes) setThemes(parsed.themes);
      if (parsed.passions) setPassions(parsed.passions);
      if (parsed.quotes) setQuotes(parsed.quotes);
      if (parsed.challenges) setChallenges(parsed.challenges);
      if (parsed.waterIntake !== undefined) setWaterIntake(parsed.waterIntake);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }, []);

  // Reset data
  const resetData = useCallback(() => {
    setUser(initialUser);
    setHabits([]);
    setGoals([]);
    setJournalEntries([]);
    setMoodHistory([]);
    setBooks([]);
    setGames([]);
    setSkills([]);
    setWorkouts([]);
    setMeditationSessions([]);
    setPomodoroSessions([]);
    setPomodoroSettings(defaultPomodoroSettings);
    setThemes(defaultThemes);
    setPassions([]);
    setQuotes(defaultQuotes);
    setChallenges(defaultChallenges);
    setWaterIntake(0);
    savedDataCache = null;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: AppContextType = useMemo(() => ({
    user,
    setUser,
    updateUser,
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    moodHistory,
    addMoodEntry,
    books,
    addBook,
    updateBook,
    deleteBook,
    games,
    addGame,
    updateGame,
    deleteGame,
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    workouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    meditationSessions,
    addMeditationSession,
    pomodoroSessions,
    addPomodoroSession,
    pomodoroSettings,
    setPomodoroSettings,
    themes,
    currentTheme,
    setCurrentTheme,
    addCustomTheme,
    passions,
    addPassion,
    updatePassion,
    deletePassion,
    quotes,
    toggleQuoteFavorite,
    challenges,
    addChallenge,
    updateChallenge,
    updateStats,
    addXP,
    waterIntake,
    addWater,
    getDailyView,
    exportData,
    importData,
    resetData,
  }), [
    user, updateUser,
    habits, addHabit, updateHabit, deleteHabit, completeHabit,
    goals, addGoal, updateGoal, deleteGoal,
    journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry,
    moodHistory, addMoodEntry,
    books, addBook, updateBook, deleteBook,
    games, addGame, updateGame, deleteGame,
    skills, addSkill, updateSkill, deleteSkill,
    workouts, addWorkout, updateWorkout, deleteWorkout,
    meditationSessions, addMeditationSession,
    pomodoroSessions, addPomodoroSession, pomodoroSettings,
    themes, currentTheme, setCurrentTheme, addCustomTheme,
    passions, addPassion, updatePassion, deletePassion,
    quotes, toggleQuoteFavorite,
    challenges, addChallenge, updateChallenge,
    updateStats, addXP,
    waterIntake, addWater,
    getDailyView, exportData, importData, resetData,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
