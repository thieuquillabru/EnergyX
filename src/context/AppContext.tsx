import { useCallback, useEffect, useState, useMemo, useRef, type ReactNode } from 'react';
import { format } from 'date-fns';
import { createContext, useContext } from 'react';
import type {
  AppData,
  Habit,
  Goal,
  JournalEntry,
  PomodoroSession,
  TimerSettings,
  Book,
  Game,
  Skill,
  FitnessSession,
  MeditationSession,
  UserPassion,
  Challenge,
  XPRecord,
  UserProfile,
} from '@/types';
import { DEFAULT_TIMER_SETTINGS } from '@/lib/constants';

// ── localStorage helpers ─────────────────────────
const STORAGE_KEY = 'energyx_data';

function loadAppData(): AppData {
  try {
    if (typeof window === 'undefined') return getEmptyState();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyState();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return { ...getEmptyState(), ...parsed };
  } catch {
    return getEmptyState();
  }
}

function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or private browsing
  }
}

function getEmptyState(): AppData {
  return {
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
}

// ── Context ──────────────────────────────────────
interface AppContextValue extends AppData {
  hydrated: boolean;

  // Profile
  setProfile: (p: UserProfile) => void;

  // Passions
  addPassion: (p: UserPassion) => void;
  removePassion: (id: string) => void;

  // Habits
  addHabit: (h: Habit) => void;
  updateHabit: (h: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;

  // Goals
  addGoal: (g: Goal) => void;
  updateGoal: (g: Goal) => void;
  deleteGoal: (id: string) => void;

  // Journal
  upsertJournalEntry: (e: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;

  // Pomodoro
  addPomodoroSession: (s: PomodoroSession) => void;
  setTimerSettings: (s: TimerSettings) => void;

  // Books
  addBook: (b: Book) => void;
  updateBook: (b: Book) => void;
  deleteBook: (id: string) => void;

  // Games
  addGame: (g: Game) => void;
  updateGame: (g: Game) => void;
  deleteGame: (id: string) => void;

  // Skills
  addSkill: (s: Skill) => void;
  updateSkill: (s: Skill) => void;
  deleteSkill: (id: string) => void;

  // Fitness
  addFitnessSession: (s: FitnessSession) => void;
  updateFitnessSession: (s: FitnessSession) => void;
  deleteFitnessSession: (id: string) => void;

  // Meditation
  addMeditationSession: (s: MeditationSession) => void;
  deleteMeditationSession: (id: string) => void;

  // Quotes / Challenges
  toggleFavoriteQuote: (id: string) => void;
  addChallenge: (c: Challenge) => void;
  updateChallenge: (c: Challenge) => void;
  deleteChallenge: (id: string) => void;

  // XP
  addXP: (date: string, xp: number) => void;

  // Water
  setWaterToday: (n: number) => void;

  // Import/Export
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(getEmptyState);

  // Load from localStorage after mount (avoids hydration mismatch)
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // Use functional update to avoid dependency on `data`
    setData(prev => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppData>;
          const merged = { ...prev, ...parsed };
          const today = format(new Date(), 'yyyy-MM-dd');
          if ((merged as any)._lastWaterDate !== today) {
            (merged as any).waterToday = 0;
            (merged as any)._lastWaterDate = today;
          }
          return merged;
        }
      } catch { /* keep empty state */ }
      return prev;
    });
    setHydrated(true);
  }, []);

  // Persist on change (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data, hydrated]);

  // ── Updaters ─────────────────────────────────
  const update = useCallback((partial: Partial<AppData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const setProfile = useCallback((profile: UserProfile) => update({ profile }), [update]);

  const addPassion = useCallback((p: UserPassion) => {
    setData((prev) => ({ ...prev, passions: [...prev.passions, p] }));
  }, []);

  const removePassion = useCallback((id: string) => {
    setData((prev) => ({ ...prev, passions: prev.passions.filter((p) => p.id !== id) }));
  }, []);

  const addHabit = useCallback((h: Habit) => {
    setData((prev) => ({ ...prev, habits: [...prev.habits, h] }));
  }, []);

  const updateHabit = useCallback((h: Habit) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((x) => (x.id === h.id ? h : x)),
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setData((prev) => ({ ...prev, habits: prev.habits.filter((x) => x.id !== id) }));
  }, []);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    setData((prev) => {
      const habits = prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        const completed = h.completions.includes(date)
          ? h.completions.filter((d) => d !== date)
          : [...h.completions, date];
        return { ...h, completions: completed };
      });
      return { ...prev, habits };
    });
  }, []);

  const addGoal = useCallback((g: Goal) => {
    setData((prev) => ({ ...prev, goals: [...prev.goals, g] }));
  }, []);

  const updateGoal = useCallback((g: Goal) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((x) => (x.id === g.id ? g : x)),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((prev) => ({ ...prev, goals: prev.goals.filter((x) => x.id !== id) }));
  }, []);

  const upsertJournalEntry = useCallback((e: JournalEntry) => {
    setData((prev) => {
      const idx = prev.journal.findIndex((j) => j.date === e.date);
      if (idx >= 0) {
        const journal = [...prev.journal];
        journal[idx] = e;
        return { ...prev, journal };
      }
      return { ...prev, journal: [...prev.journal, e] };
    });
  }, []);

  const deleteJournalEntry = useCallback((id: string) => {
    setData((prev) => ({ ...prev, journal: prev.journal.filter((x) => x.id !== id) }));
  }, []);

  const addPomodoroSession = useCallback((s: PomodoroSession) => {
    setData((prev) => ({
      ...prev,
      pomodoroSessions: [...prev.pomodoroSessions, s],
    }));
  }, []);

  const setTimerSettings = useCallback((s: TimerSettings) => update({ timerSettings: s }), [update]);

  const addBook = useCallback((b: Book) => {
    setData((prev) => ({ ...prev, books: [...prev.books, b] }));
  }, []);

  const updateBook = useCallback((b: Book) => {
    setData((prev) => ({
      ...prev,
      books: prev.books.map((x) => (x.id === b.id ? b : x)),
    }));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setData((prev) => ({ ...prev, books: prev.books.filter((x) => x.id !== id) }));
  }, []);

  const addGame = useCallback((g: Game) => {
    setData((prev) => ({ ...prev, games: [...prev.games, g] }));
  }, []);

  const updateGame = useCallback((g: Game) => {
    setData((prev) => ({
      ...prev,
      games: prev.games.map((x) => (x.id === g.id ? g : x)),
    }));
  }, []);

  const deleteGame = useCallback((id: string) => {
    setData((prev) => ({ ...prev, games: prev.games.filter((x) => x.id !== id) }));
  }, []);

  const addSkill = useCallback((s: Skill) => {
    setData((prev) => ({ ...prev, skills: [...prev.skills, s] }));
  }, []);

  const updateSkill = useCallback((s: Skill) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((x) => (x.id === s.id ? s : x)),
    }));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((x) => x.id !== id) }));
  }, []);

  const addFitnessSession = useCallback((s: FitnessSession) => {
    setData((prev) => ({
      ...prev,
      fitnessSessions: [...prev.fitnessSessions, s],
    }));
  }, []);

  const updateFitnessSession = useCallback((s: FitnessSession) => {
    setData((prev) => ({
      ...prev,
      fitnessSessions: prev.fitnessSessions.map((x) => (x.id === s.id ? s : x)),
    }));
  }, []);

  const deleteFitnessSession = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      fitnessSessions: prev.fitnessSessions.filter((x) => x.id !== id),
    }));
  }, []);

  const addMeditationSession = useCallback((s: MeditationSession) => {
    setData((prev) => ({
      ...prev,
      meditationSessions: [...prev.meditationSessions, s],
    }));
  }, []);

  const deleteMeditationSession = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      meditationSessions: prev.meditationSessions.filter((x) => x.id !== id),
    }));
  }, []);

  const toggleFavoriteQuote = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      favoriteQuotes: prev.favoriteQuotes.includes(id)
        ? prev.favoriteQuotes.filter((q) => q !== id)
        : [...prev.favoriteQuotes, id],
    }));
  }, []);

  const addChallenge = useCallback((c: Challenge) => {
    setData((prev) => ({ ...prev, challenges: [...prev.challenges, c] }));
  }, []);

  const updateChallenge = useCallback((c: Challenge) => {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.map((x) => (x.id === c.id ? c : x)),
    }));
  }, []);

  const deleteChallenge = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.filter((x) => x.id !== id),
    }));
  }, []);

  const addXP = useCallback((date: string, xp: number) => {
    setData((prev) => {
      const history = [...prev.xpHistory];
      const idx = history.findIndex((h) => h.date === date);
      if (idx >= 0) {
        history[idx] = { date, xp: history[idx].xp + xp };
      } else {
        history.push({ date, xp });
      }
      return { ...prev, xpHistory: history };
    });
  }, []);

  const setWaterToday = useCallback((n: number) => update({ waterToday: n }), [update]);

  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data]);

  const importData = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as Partial<AppData>;
      setData({ ...getEmptyState(), ...parsed });
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetAll = useCallback(() => {
    setData(getEmptyState());
  }, []);

  const contextValue = useMemo(() => ({
    ...data,
    hydrated,
    setProfile, addPassion, removePassion,
    addHabit, updateHabit, deleteHabit, toggleHabitCompletion,
    addGoal, updateGoal, deleteGoal,
    upsertJournalEntry, deleteJournalEntry,
    addPomodoroSession, setTimerSettings,
    addBook, updateBook, deleteBook,
    addGame, updateGame, deleteGame,
    addSkill, updateSkill, deleteSkill,
    addFitnessSession, updateFitnessSession, deleteFitnessSession,
    addMeditationSession, deleteMeditationSession,
    toggleFavoriteQuote, addChallenge, updateChallenge, deleteChallenge,
    addXP, setWaterToday,
    exportData, importData, resetAll,
  }), [data, hydrated]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
