/* ===== Types EnergyX ===== */

// ── Navigation ──────────────────────────────────
export type PageId =
  | 'dashboard'
  | 'habits'
  | 'goals'
  | 'journal'
  | 'timer'
  | 'library'
  | 'gaming'
  | 'skills'
  | 'fitness'
  | 'meditation'
  | 'motivation'
  | 'stats'
  | 'profile'
  | 'settings';

// ── Profile ─────────────────────────────────────
export interface UserProfile {
  name: string;
  avatar: string; // data URL or emoji like "😀"
  theme: ThemeId;
  weekStart: 'monday' | 'sunday';
  domains: DomainId[];
  isOnboarded: boolean;
}

// ── Theme ────────────────────────────────────────
export type ThemeId =
  | 'midnight'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'lavender'
  | 'rose'
  | 'slate'
  | 'custom';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  emoji: string;
  vars: Record<string, string>; // CSS custom-property values
}

// ── Domains ──────────────────────────────────────
export type DomainId =
  | 'sante'
  | 'forme'
  | 'mental'
  | 'apprentissage'
  | 'productivite'
  | 'creativite'
  | 'relations'
  | 'finances';

export const DOMAIN_LABELS: Record<DomainId, string> = {
  sante: 'Santé',
  forme: 'Forme physique',
  mental: 'Mental',
  apprentissage: 'Apprentissage',
  productivite: 'Productivité',
  creativite: 'Créativité',
  relations: 'Relations',
  finances: 'Finances',
};

// ── Passions ──────────────────────────────────────
export type PassionCategory =
  | 'sports'
  | 'art'
  | 'music'
  | 'reading'
  | 'gaming'
  | 'coding'
  | 'cooking'
  | 'other';

export const PASSION_CATEGORY_LABELS: Record<PassionCategory, string> = {
  sports: 'Sport',
  art: 'Art',
  music: 'Musique',
  reading: 'Lecture',
  gaming: 'Jeux vidéo',
  coding: 'Code',
  cooking: 'Cuisine',
  other: 'Autre',
};

export interface PassionItem {
  id: string;
  name: string;
  emoji: string;
  category: PassionCategory;
  keywords: string[];
}

export interface UserPassion {
  id: string;
  name: string;
  emoji: string;
  category: PassionCategory;
}

// ── Habits ───────────────────────────────────────
export type HabitCategory =
  | DomainId
  | 'personnel';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: HabitCategory;
  reminderTime: string | null; // "HH:mm"
  completions: string[]; // ISO date strings "YYYY-MM-DD"
}

// ── Goals ────────────────────────────────────────
export type GoalPriority = 1 | 2 | 3 | 4;

export interface GoalMilestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  name: string;
  category: HabitCategory;
  priority: GoalPriority;
  deadline: string | null; // "YYYY-MM-DD"
  milestones: GoalMilestone[];
  manualProgress: number; // 0-100 (ignored when milestones exist)
  createdAt: string;
}

// ── Journal ──────────────────────────────────────
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export const MOOD_LABELS: Record<MoodLevel, string> = {
  1: 'Très mauvais',
  2: 'Mauvais',
  3: 'Neutre',
  4: 'Bon',
  5: 'Excellent',
};

export const MOOD_EMOJIS: Record<MoodLevel, string> = {
  1: '😞',
  2: '😟',
  3: '😐',
  4: '😊',
  5: '🤩',
};

export interface JournalEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  mood: MoodLevel | null;
  gratitudes: string[];
  energy: number; // 0-10
  sleep: number; // 0-12 (hours)
  water: number; // glasses
  exercise: number; // minutes
  note: string;
  tags: string[];
}

// ── Timer (Pomodoro) ─────────────────────────────
export type PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSession {
  id: string;
  date: string; // "YYYY-MM-DD"
  phase: PomodoroPhase;
  duration: number; // seconds (actual completed)
  task: string;
  startedAt: string; // ISO
}

export interface TimerSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

// ── Library ──────────────────────────────────────
export type BookStatus = 'to_read' | 'reading' | 'finished' | 'abandoned';

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  to_read: 'À lire',
  reading: 'En lecture',
  finished: 'Terminé',
  abandoned: 'Abandonné',
};

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  currentPage: number;
  totalPages: number;
  rating: number; // 0-5
  notes: string;
}

// ── Gaming ──────────────────────────────────────
export type GameStatus = 'playing' | 'finished' | 'paused' | 'dropped';

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  playing: 'En cours',
  finished: 'Terminé',
  paused: 'En pause',
  dropped: 'Abandonné',
};

export interface Game {
  id: string;
  title: string;
  platform: string;
  status: GameStatus;
  hoursPlayed: number;
  rating: number; // 0-5
  notes: string;
}

// ── Skills ───────────────────────────────────────
export type ResourceType = 'course' | 'book' | 'video' | 'article' | 'podcast';

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  course: 'Cours',
  book: 'Livre',
  video: 'Vidéo',
  article: 'Article',
  podcast: 'Podcast',
};

export interface SkillResource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  done: boolean;
}

export interface PracticeEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  duration: number; // minutes
  note: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-10
  resources: SkillResource[];
  practiceLog: PracticeEntry[];
}

// ── Fitness ──────────────────────────────────────
export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number; // kg
}

export interface FitnessSession {
  id: string;
  date: string; // "YYYY-MM-DD"
  type: string;
  exercises: Exercise[];
  calories: number;
  duration: number; // minutes
  note: string;
}

// ── Meditation ──────────────────────────────────
export type MeditationType =
  | 'zen'
  | 'respiration'
  | 'corps'
  | 'marche'
  | 'mantra'
  | 'visualisation'
  | 'gratitude';

export const MEDITATION_TYPE_LABELS: Record<MeditationType, string> = {
  zen: 'Zen',
  respiration: 'Respiration',
  corps: 'Scan corporel',
  marche: 'Marche consciente',
  mantra: 'Mantra',
  visualisation: 'Visualisation',
  gratitude: 'Gratitude',
};

export const MEDITATION_TYPE_EMOJIS: Record<MeditationType, string> = {
  zen: '🧘',
  respiration: '🌬️',
  corps: '🧍',
  marche: '🚶',
  mantra: '🗣️',
  visualisation: '🌈',
  gratitude: '🙏',
};

export interface MeditationSession {
  id: string;
  date: string; // "YYYY-MM-DD"
  type: MeditationType;
  duration: number; // minutes
  note: string;
}

// ── Motivation ───────────────────────────────────
export interface Quote {
  id: string;
  text: string;
  author: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  startDate: string | null; // "YYYY-MM-DD"
  completed: boolean;
}

// ── Achievements ─────────────────────────────────
export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  compute: (data: AppData) => { current: number; target: number };
}

// ── XP ───────────────────────────────────────────
export interface XPRecord {
  date: string;
  xp: number;
}

// ── Global state ─────────────────────────────────
export interface AppData {
  profile: UserProfile | null;
  passions: UserPassion[];
  habits: Habit[];
  goals: Goal[];
  journal: JournalEntry[];
  pomodoroSessions: PomodoroSession[];
  timerSettings: TimerSettings;
  books: Book[];
  games: Game[];
  skills: Skill[];
  fitnessSessions: FitnessSession[];
  meditationSessions: MeditationSession[];
  favoriteQuotes: string[]; // quote ids
  challenges: Challenge[];
  xpHistory: XPRecord[];
  waterToday: number;
}
