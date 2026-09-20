"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  Check,
  Clock3,
  Filter,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { PageHeader } from "@/components/page-header";
import { useUserStore } from "@/stores/userStore";
import type { Lesson, Subject } from "@/types";

export type LessonCatalogSubject = Pick<
  Subject,
  "id" | "name" | "description" | "accent"
> & {
  lessons: Array<
    Pick<
      Lesson,
      "id" | "title" | "description" | "durationMinutes" | "xpReward"
    >
  >;
};

type LessonsPageProps = {
  subjects: LessonCatalogSubject[];
};

const accentStyles = {
  cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
  violet:
    "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  amber:
    "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
};

export default function LessonsPage({ subjects }: LessonsPageProps) {
  const { completedLessons, completedLessonIds, completeLesson } = useUserStore(
    useShallow((state) => ({
      completedLessons: state.user.completedLessons,
      completedLessonIds: state.user.completedLessonIds,
      completeLesson: state.completeLesson,
    })),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return subjects
      .filter(
        (subject) =>
          selectedSubjectId === "all" || subject.id === selectedSubjectId,
      )
      .map((subject) => ({
        ...subject,
        lessons: subject.lessons.filter(
          (lesson) =>
            !query ||
            lesson.title.toLowerCase().includes(query) ||
            lesson.description.toLowerCase().includes(query) ||
            subject.name.toLowerCase().includes(query),
        ),
      }))
      .filter((subject) => subject.lessons.length > 0);
  }, [searchQuery, selectedSubjectId, subjects]);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Learning library"
        title="Subjects and lessons"
        description="Explore twelve practical subjects, complete focused lessons, and earn XP that updates your dashboard."
        actions={
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-right dark:border-white/[0.08] dark:bg-white/[0.03]">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Completed
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-950 dark:text-white">
              {completedLessons} /{" "}
              {subjects.reduce(
                (total, subject) => total + subject.lessons.length,
                0,
              )}
            </p>
          </div>
        }
      />

      <section className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] md:grid-cols-[1fr_260px]">
        <label className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400"
            aria-hidden="true"
          />
          <span className="sr-only">Search lessons</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/[0.08] dark:bg-white/[0.025]"
            placeholder="Search lessons..."
          />
        </label>
        <label className="relative">
          <Filter
            className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400"
            aria-hidden="true"
          />
          <span className="sr-only">Filter by subject</span>
          <select
            value={selectedSubjectId}
            onChange={(event) => setSelectedSubjectId(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/[0.08] dark:bg-[#111720]"
          >
            <option value="all">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {filteredSubjects.length > 0 ? (
        <div className="space-y-8">
          {filteredSubjects.map((subject) => (
            <section key={subject.id}>
              <div className="mb-4 flex items-start gap-3">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${accentStyles[subject.accent]}`}
                >
                  <BookOpenCheck className="size-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-950 dark:text-white">
                    {subject.name}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {subject.description}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {subject.lessons.map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);

                  return (
                    <article
                      key={lesson.id}
                      className="flex min-h-56 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${accentStyles[subject.accent]}`}
                        >
                          {subject.name}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <Check className="size-3.5" aria-hidden="true" />
                            Complete
                          </span>
                        ) : null}
                      </div>
                      <Link
                        href={`/lessons/${lesson.id}`}
                        className="mt-5 text-base font-bold text-slate-950 transition hover:text-cyan-700 dark:text-white dark:hover:text-cyan-300"
                      >
                        {lesson.title}
                      </Link>
                      <p className="mt-2 flex-1 text-xs leading-5 text-slate-500">
                        {lesson.description}
                      </p>
                      <div className="mt-5 flex items-center gap-4 text-[10px] font-semibold text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="size-3.5" aria-hidden="true" />
                          {lesson.durationMinutes} min
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Sparkles className="size-3.5" aria-hidden="true" />
                          +{lesson.xpReward} XP
                        </span>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <Link
                          href={`/lessons/${lesson.id}`}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-cyan-400/[0.06]"
                        >
                          Open lesson
                        </Link>
                        <button
                          type="button"
                          onClick={() => completeLesson(subject.name, lesson)}
                          disabled={isCompleted}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-default disabled:bg-emerald-50 disabled:text-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100 dark:disabled:bg-emerald-400/10 dark:disabled:text-emerald-300"
                        >
                          {isCompleted ? (
                            <>
                              <Check className="size-4" aria-hidden="true" />
                              Complete
                            </>
                          ) : (
                            <>
                              <BookOpenCheck
                                className="size-4"
                                aria-hidden="true"
                              />
                              Mark done
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/[0.12]">
          <Search className="mx-auto size-6 text-slate-400" aria-hidden="true" />
          <h2 className="mt-4 text-sm font-bold text-slate-950 dark:text-white">
            No lessons found
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Try a different search or subject filter.
          </p>
        </section>
      )}
    </div>
  );
}
