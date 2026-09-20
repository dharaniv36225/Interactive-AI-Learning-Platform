"use client";

import { Check, Sparkles } from "lucide-react";

import { useUserStore } from "@/stores/userStore";
import type { Lesson } from "@/types";

type LessonCompletionButtonProps = {
  lesson: Lesson;
  subjectName: string;
};

export function LessonCompletionButton({
  lesson,
  subjectName,
}: LessonCompletionButtonProps) {
  const isCompleted = useUserStore((state) =>
    state.user.completedLessonIds.includes(lesson.id),
  );
  const completeLesson = useUserStore((state) => state.completeLesson);

  return (
    <button
      type="button"
      onClick={() => completeLesson(subjectName, lesson)}
      disabled={isCompleted}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-default disabled:bg-emerald-100 disabled:text-emerald-700 dark:disabled:bg-emerald-400/10 dark:disabled:text-emerald-300"
    >
      {isCompleted ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          Lesson completed
        </>
      ) : (
        <>
          <Sparkles className="size-4" aria-hidden="true" />
          Complete and earn {lesson.xpReward} XP
        </>
      )}
    </button>
  );
}
