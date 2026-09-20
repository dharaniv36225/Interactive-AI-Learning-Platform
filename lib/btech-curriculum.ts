import { btechLabCatalog as labCatalog } from "@/lib/btech-labs";

export type { BtechBranch, BtechBranchId } from "@/lib/btech-branches";
export {
  btechBranches,
  getBtechBranch,
} from "@/lib/btech-branches";
export type { BtechLabConceptType, BtechLabDefinition } from "@/lib/btech-labs";
export {
  btechLabCatalog,
  getBtechLab,
  getBtechLabsByConcept,
} from "@/lib/btech-labs";
export type { BtechLesson, BtechUnit } from "@/lib/btech-lessons";
export type {
  BtechSubject,
  BtechSubjectPlan,
  CodingDifficulty,
  CodingLanguage,
  CodingPracticeProblem,
} from "@/lib/btech-subjects";
export {
  btechSubjectPlans,
  codingPracticeProblems,
  createBtechSubject,
  getBtechSubjectPlan,
  getCodingPracticeProblems,
} from "@/lib/btech-subjects";
export type { BtechQuizDifficulty, BtechQuizQuestion } from "@/lib/btech-quiz";
export {
  generateBtechQuestionBank,
  getBtechQuizCacheKey,
} from "@/lib/btech-quiz";
export type { BtechSemester, BtechYear, BtechYearId } from "@/lib/btech-years";
export {
  btechCurriculum,
  btechYears,
  getAllBtechLessons,
  getAllBtechSubjects,
  getBranchStaticParams,
  getBranchesForSemester,
  getBtechLesson,
  getBtechSemester,
  getBtechSubject,
  getBtechUnit,
  getBtechYear,
  getLessonStaticParams,
  getSemesterStaticParams,
  getSubjectsForBranch,
  getSubjectStaticParams,
  getUnitStaticParams,
  getUniversityStats,
  getYearStaticParams,
} from "@/lib/btech-years";

export type VisualizationItem = {
  id: string;
  title: string;
  category: string;
  engine: "three-ready" | "svg" | "canvas";
  description: string;
};

export type AiUniversityCapability = {
  id: string;
  title: string;
  description: string;
  signals: string[];
};

function getVisualizationEngine(mode: "svg" | "canvas" | "three") {
  return mode === "three" ? "three-ready" : mode;
}

export const visualizationCatalog: VisualizationItem[] = labCatalog.map(
  (lab) => ({
    id: lab.id,
    title: lab.title,
    category: lab.conceptType,
    engine: getVisualizationEngine(lab.visualizationMode),
    description: lab.description,
  }),
);

export const aiUniversityCapabilities: AiUniversityCapability[] = [
  {
    id: "learning-path",
    title: "AI Learning Path Generator",
    description: "Generates roadmap, daily plan, lessons, labs, quizzes, coding practice, and revision checkpoints.",
    signals: ["year", "branch", "goal", "weekly hours"],
  },
  {
    id: "adaptive-engine",
    title: "AI Adaptive Learning Engine",
    description: "Analyzes quiz mistakes, weak topics, lab progress, coding performance, and study time.",
    signals: ["quiz mistakes", "lab history", "coding performance", "study time"],
  },
  {
    id: "doubt-solver",
    title: "AI Doubt Solver Inside Lessons",
    description: "Explains highlighted lesson text with the server-side Gemini tutor route.",
    signals: ["selected text", "lesson id", "subject"],
  },
  {
    id: "voice-teacher",
    title: "AI Voice Teacher",
    description: "Reads lessons aloud using browser SpeechSynthesis without exposing API keys.",
    signals: ["lesson content", "voice setting"],
  },
  {
    id: "whiteboard-teacher",
    title: "AI Whiteboard Teacher",
    description: "Creates step-by-step animated explanation stages for each concept.",
    signals: ["topic", "unit", "visualization"],
  },
  {
    id: "student-twin",
    title: "AI Student Twin",
    description: "Tracks strengths, weaknesses, interests, speed, and mastery score.",
    signals: ["mastery", "attempts", "completion", "pace"],
  },
  {
    id: "exam-predictor",
    title: "AI Exam Predictor",
    description: "Predicts expected score, high-risk topics, and revision priorities.",
    signals: ["difficulty mix", "accuracy", "time", "weak topics"],
  },
  {
    id: "study-buddy",
    title: "AI Study Buddy Chat",
    description: "Provides motivational learning support and daily focus.",
    signals: ["streak", "goal", "recent activity"],
  },
  {
    id: "generated-labs",
    title: "AI Generated Labs",
    description: "Creates lab controls, explanation, and simulation plans from prompts.",
    signals: ["prompt", "concept", "branch"],
  },
  {
    id: "scene-generator",
    title: "AI 3D Scene Generator",
    description: "Generates 3D scene configs with labels and animation steps.",
    signals: ["concept", "objects", "animation"],
  },
  {
    id: "avatar-teacher",
    title: "AI Avatar Teacher",
    description: "Shows an animated professor card that explains lessons.",
    signals: ["lesson", "voice", "whiteboard"],
  },
  {
    id: "daily-challenges",
    title: "AI Daily Challenges",
    description: "Creates daily missions from progress and weak-topic data.",
    signals: ["profile", "weak topics", "available time"],
  },
  {
    id: "achievement-engine",
    title: "AI Achievement Engine",
    description: "Awards badges and rewards based on authentic learning milestones.",
    signals: ["xp", "completion", "streak"],
  },
  {
    id: "homework-solver",
    title: "AI Homework Solver",
    description: "Accepts uploaded question images and returns solve-and-explain guidance.",
    signals: ["image", "subject", "question"],
  },
  {
    id: "diagram-explainer",
    title: "AI Diagram Explainer",
    description: "Accepts uploaded diagram images and explains the concept and labels.",
    signals: ["diagram", "lesson", "branch"],
  },
];
