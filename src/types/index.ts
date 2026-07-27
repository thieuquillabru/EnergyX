// Types pour l'application EnergyX - Développement Personnel Complet

export interface User {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  preferences: UserPreferences;
  passions: Passion[];
  stats: UserStats;
}

export interface UserPreferences {
  theme: ThemeType;
  themeMode: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  timezone: string;
  weekStart: 'sunday' | 'monday';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  habits: boolean;
  goals: boolean;
  pomodoro: boolean;
  journal: boolean;
  motivation: boolean;
  water: boolean;
  exercise: boolean;
}

export interface ThemeType {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface Passion {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: 'reading' | 'gaming' | 'sports' | 'music' | 'art' | 'cooking' | 'coding' | 'other';
  trackingEnabled: boolean;
  goals: PassionGoal[];
}

export interface PassionGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  completed: boolean;
}

export interface UserStats {
  totalHabitsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalGoalsAchieved: number;
  totalJournalEntries: number;
  totalPomodoros: number;
  totalMeditationMinutes: number;
  totalExerciseMinutes: number;
  level: number;
  xp: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Habits Types
export interface Habit {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  timesPerWeek?: number;
  targetDays?: number[];
  reminder?: Reminder;
  streaks: HabitStreak;
  completions: HabitCompletion[];
  createdAt: string;
  isActive: boolean;
}

export type HabitCategory = 'health' | 'fitness' | 'mental' | 'learning' | 'social' | 'productivity' | 'creativity' | 'finance' | 'passion';
export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Reminder {
  time: string;
  enabled: boolean;
  days?: number[];
}

export interface HabitStreak {
  current: number;
  longest: number;
  lastCompleted?: string;
}

export interface HabitCompletion {
  date: string;
  completed: boolean;
  notes?: string;
}

// Goals Types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  priority: Priority;
  targetDate?: string;
  milestones: Milestone[];
  progress: number;
  status: GoalStatus;
  createdAt: string;
  completedAt?: string;
}

export type GoalCategory = 'career' | 'health' | 'finance' | 'relationships' | 'education' | 'personal' | 'fitness' | 'passion';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

// Journal Types
export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  tags: string[];
  gratitude: string[];
  energy: number;
  sleep: number;
  water: number;
  exercise: number;
  attachments?: string[];
  weather?: string;
  location?: string;
}

export type Mood = 'excellent' | 'good' | 'okay' | 'bad' | 'terrible';

export interface MoodEntry {
  date: string;
  mood: Mood;
  note?: string;
}

// Timer / Pomodoro Types
export interface PomodoroSession {
  id: string;
  type: 'focus' | 'short_break' | 'long_break';
  duration: number;
  completedAt: string;
  task?: string;
}

export interface PomodoroSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

// Library Types (Reading)
export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  status: BookStatus;
  rating?: number;
  notes?: string[];
  currentPage?: number;
  totalPages?: number;
  startDate?: string;
  finishDate?: string;
  category: string;
  isFavorite: boolean;
}

export type BookStatus = 'want_to_read' | 'reading' | 'completed' | 'paused';

// Gaming Types
export interface Game {
  id: string;
  title: string;
  platform: string;
  cover?: string;
  status: GameStatus;
  hoursPlayed: number;
  rating?: number;
  review?: string;
  genre: string;
  releaseDate?: string;
  isFavorite: boolean;
  achievements?: GameAchievement[];
}

export type GameStatus = 'backlog' | 'playing' | 'completed' | 'on_hold' | 'dropped';

export interface GameAchievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Skills / Learning Types
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  progress: number;
  resources: Resource[];
  practiceLog: PracticeLog[];
  createdAt: string;
}

export type SkillCategory = 'programming' | 'language' | 'music' | 'art' | 'business' | 'science' | 'life';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Resource {
  id: string;
  title: string;
  url?: string;
  type: 'course' | 'book' | 'video' | 'article' | 'podcast';
  completed: boolean;
  notes?: string;
}

export interface PracticeLog {
  id: string;
  date: string;
  duration: number;
  notes?: string;
}

// Fitness Types
export interface Workout {
  id: string;
  title: string;
  type: WorkoutType;
  exercises: Exercise[];
  duration: number;
  calories?: number;
  date: string;
  notes?: string;
}

export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'sports' | 'custom';

export interface Exercise {
  id: string;
  name: string;
  sets?: ExerciseSet[];
  duration?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  calories?: number;
}

export interface ExerciseSet {
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  completed: boolean;
}

export interface BodyMetric {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

// Meditation Types
export interface MeditationSession {
  id: string;
  title: string;
  type: MeditationType;
  duration: number;
  date: string;
  completed: boolean;
  guided?: boolean;
  instructor?: string;
}

export type MeditationType = 'mindfulness' | 'breathing' | 'visualization' | 'body_scan' | 'loving_kindness' | 'sleep' | 'focus' | 'custom';

export interface MeditationProgram {
  id: string;
  title: string;
  description: string;
  sessions: number;
  duration: number;
  category: string;
  sessionsCompleted: number;
}

// Motivation Types
export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: string;
  isFavorite: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  duration: number;
  startDate: string;
  endDate?: string;
  participants?: number;
  progress: number;
  completed: boolean;
  reward?: string;
}

export type ChallengeType = 'habit' | 'fitness' | 'learning' | 'mindfulness' | 'social' | 'creative';

// Settings Types
export interface AppSettings {
  general: UserPreferences;
  themes: ThemeSettings;
  data: DataSettings;
}

export interface ThemeSettings {
  customThemes: ThemeType[];
  currentTheme: string;
}

export interface DataSettings {
  backupEnabled: boolean;
  backupFrequency: string;
  lastBackup?: string;
  exportFormat: 'json' | 'csv';
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration?: number;
  type: EventType;
  relatedId?: string;
  reminder?: boolean;
}

export type EventType = 'habit' | 'goal' | 'workout' | 'meditation' | 'reading' | 'gaming' | 'custom';

// Daily View Types
export interface DailyView {
  date: string;
  habits: Habit[];
  mood?: MoodEntry;
  journal?: JournalEntry;
  workouts?: Workout[];
  meditations?: MeditationSession[];
  pomodoros?: PomodoroSession[];
  water: number;
  calories?: number;
  sleep: number;
}

// Statistics Types
export interface Statistics {
  habits: HabitStatistics;
  goals: GoalStatistics;
  mood: MoodStatistics;
  fitness: FitnessStatistics;
  productivity: ProductivityStatistics;
}

export interface HabitStatistics {
  completionRate: number;
  averageStreak: number;
  totalCompletions: number;
  mostProductiveDay: string;
  categoryBreakdown: Record<HabitCategory, number>;
}

export interface GoalStatistics {
  activeGoals: number;
  completedGoals: number;
  completionRate: number;
  averageTimeToComplete: number;
}

export interface MoodStatistics {
  averageMood: number;
  moodTrend: 'up' | 'down' | 'stable';
  bestDay: string;
  worstDay: string;
  moodHistory: MoodEntry[];
}

export interface FitnessStatistics {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  averageWorkoutDuration: number;
  favoriteWorkout: WorkoutType;
}

export interface ProductivityStatistics {
  totalPomodoros: number;
  averageDailyPomodoros: number;
  mostProductiveHour: number;
  weeklyTrend: number[];
}
