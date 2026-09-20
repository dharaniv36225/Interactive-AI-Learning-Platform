"use client";

import { memo } from "react";

import { useUserStore } from "@/stores/userStore";

type SubjectProgressProps = {
  lessonIds: string[];
};

function SubjectProgressComponent({ lessonIds }: SubjectProgressProps) {
  const completed = useUserStore((state) =>
    lessonIds.reduce(
      (count, id) =>
        count + (state.user.completedLessonIds.includes(id) ? 1 : 0),
      0,
    ),
  );
  const percentage =
    lessonIds.length === 0 ? 0 : Math.round((completed / lessonIds.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-semibold">
        <span className="text-slate-500">
          {completed} of {lessonIds.length} lessons
        </span>
        <span className="text-cyan-700 dark:text-cyan-400">{percentage}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export const SubjectProgress = memo(SubjectProgressComponent);
