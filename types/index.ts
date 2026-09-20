export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  tier: AchievementTier;
  progress: number;
  unlocked: boolean;
};

export type ActivityType = "lesson" | "quiz" | "tutor" | "lab" | "account";

export type RecentActivity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  xp: number;
  createdAt: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  avatarInitials: string;
  role: string;
  isAuthenticated: boolean;
  xp: number;
  level: number;
  learningStreak: number;
  weeklyGoalMinutes: number;
  weeklyStudyMinutes: number;
  completedLessons: number;
  completedLessonIds: string[];
  completedLabIds: string[];
  labActivities: LabActivity[];
  tutorSessionCount: number;
  lastActiveDate: string;
  joinedAt: string;
  recentActivity: RecentActivity[];
};

export type LoginInput = {
  username: string;
  email: string;
  avatarInitials: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  xpReward: number;
  overview: string;
  content: string[];
  keyConcepts: string[];
  examples: string[];
  formulas: string[];
  applications: string[];
  summary: string;
  relatedLabIds: string[];
};

export type Subject = {
  id: string;
  name: string;
  description: string;
  overview: string;
  accent: "cyan" | "violet" | "emerald" | "amber" | "rose";
  lessons: Lesson[];
};

export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "reactive-nonmetal"
  | "noble-gas"
  | "lanthanide"
  | "actinide";

export type LabCategory =
  | "simulation"
  | "visualizer"
  | "builder"
  | "calculator"
  | "explorer"
  | "planner";

export type LabDefinition = {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  category: LabCategory;
  xpReward: number;
  primaryControl: string;
  secondaryControl: string;
  outputLabel: string;
  formula?: string;
};

export type LabActivity = {
  id: string;
  labId: string;
  labTitle: string;
  subjectName: string;
  xpEarned: number;
  completedAt: string;
};

export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuizStatus = "setup" | "active" | "completed";

export type QuizQuestion = {
  id: string;
  subject: string;
  lessonId: string;
  lesson: string;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type QuizAttempt = {
  id: string;
  subject: string;
  lesson: string;
  difficulty: QuizDifficulty | "mixed";
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  completedAt: string;
};

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  title: string;
  topic: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

export type TutorApiResponse = {
  message: string;
  model: string;
  mode: "gemini" | "demo";
};

export type TutorApiError = {
  error: string;
};

export type TutorRequestMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GeminiStatusResponse = {
  configured: boolean;
  model: string;
};

export type ThemePreference = "light" | "dark";

export type Settings = {
  theme: ThemePreference;
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
};
