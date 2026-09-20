"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizAttempt } from "@/types";

type QuizStore = {
  attempts: QuizAttempt[];
  recordAttempt: (attempt: QuizAttempt) => void;
  getAccuracy: () => number;
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      attempts: [],
      recordAttempt: (attempt) =>
        set((state) => ({
          attempts: [attempt, ...state.attempts].slice(0, 50),
        })),
      getAccuracy: () => {
        const totals = get().attempts.reduce(
          (result, attempt) => ({
            score: result.score + attempt.score,
            questions: result.questions + attempt.totalQuestions,
          }),
          { score: 0, questions: 0 },
        );

        return totals.questions === 0 ? 0 : Math.round((totals.score / totals.questions) * 100);
      },
    }),
    {
      name: "ai-physics-quiz-store",
      skipHydration: true,
      version: 3,
      migrate: () => ({ attempts: [] }),
    },
  ),
);
