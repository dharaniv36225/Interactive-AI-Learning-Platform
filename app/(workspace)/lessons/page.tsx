import dynamic from "next/dynamic";

import type { LessonCatalogSubject } from "@/components/lesson-browser";
import { subjects } from "@/lib/subjects";

const LessonBrowser = dynamic(
  () =>
    import("@/components/lesson-browser").then(
      (module) => module.default,
    ),
  {
    loading: () => (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
          />
        ))}
      </div>
    ),
  },
);

export default function LessonsPage() {
  const catalog: LessonCatalogSubject[] = subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    description: subject.description,
    accent: subject.accent,
    lessons: subject.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      durationMinutes: lesson.durationMinutes,
      xpReward: lesson.xpReward,
    })),
  }));

  return <LessonBrowser subjects={catalog} />;
}
