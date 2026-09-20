import Link from "next/link";
import {
  ArrowRight,
  Atom,
  BookOpenText,
  Clock3,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SubjectProgress } from "@/components/subject-progress";
import { subjects } from "@/lib/subjects";

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

export default function SubjectsPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Explore the universe"
        title="Subjects"
        description="Choose a field, follow its smart lessons, move into a related lab, and test your understanding."
        actions={
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-right dark:border-white/[0.08] dark:bg-white/[0.03]">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Curriculum
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-950 dark:text-white">
              {subjects.length} subjects ·{" "}
              {subjects.reduce((total, item) => total + item.lessons.length, 0)}{" "}
              lessons
            </p>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((item) => {
          const totalMinutes = item.lessons.reduce(
            (total, lesson) => total + lesson.durationMinutes,
            0,
          );

          return (
            <article
              key={item.id}
              className="group flex min-h-80 flex-col rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/[0.08] dark:bg-[#0e131b] dark:hover:border-cyan-400/30"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid size-11 place-items-center rounded-xl ${accentStyles[item.accent]}`}
                >
                  <Atom className="size-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/[0.06]">
                  {item.lessons.length} lessons
                </span>
              </div>
              <h2 className="mt-6 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
                {item.name}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
              <div className="mt-5 flex items-center gap-4 text-[10px] font-semibold text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpenText className="size-3.5" aria-hidden="true" />
                  Guided path
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  {totalMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  XP rewards
                </span>
              </div>
              <div className="mt-5">
                <SubjectProgress
                  lessonIds={item.lessons.map((lesson) => lesson.id)}
                />
              </div>
              <Link
                href={`/subjects/${item.id}`}
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white transition group-hover:bg-cyan-500 group-hover:text-slate-950 dark:bg-white dark:text-slate-950"
              >
                Explore {item.name}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}
