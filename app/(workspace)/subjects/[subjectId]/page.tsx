import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  FlaskConical,
  Sparkles,
} from "lucide-react";

import { SubjectProgress } from "@/components/subject-progress";
import { getLabsBySubject } from "@/lib/labs";
import { getSubjectById, subjects } from "@/lib/subjects";

type SubjectPageProps = {
  params: Promise<{ subjectId: string }>;
};

export function generateStaticParams() {
  return subjects.map((item) => ({ subjectId: item.id }));
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { subjectId } = await params;
  const item = getSubjectById(subjectId);

  return item
    ? {
        title: item.name,
        description: item.description,
      }
    : {};
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subjectId } = await params;
  const item = getSubjectById(subjectId);

  if (!item) {
    notFound();
  }

  const relatedLabs = getLabsBySubject(item.id);

  return (
    <div className="space-y-7">
      <Link
        href="/subjects"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All subjects
      </Link>

      <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-7 text-white dark:bg-gradient-to-br dark:from-[#121a25] dark:to-[#0b1017] sm:p-10">
        <div className="physics-grid absolute inset-0 opacity-25" />
        <div className="relative max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            Interactive learning path
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
            {item.name}
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            {item.overview}
          </p>
          <div className="mt-7 max-w-xl rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
            <SubjectProgress
              lessonIds={item.lessons.map((lesson) => lesson.id)}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Smart lessons
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Learn the model, apply it, then move into a lab and quiz.
            </p>
          </div>
          <Link
            href={`/quiz?subject=${encodeURIComponent(item.name)}`}
            className="text-xs font-bold text-cyan-700 dark:text-cyan-400"
          >
            Quiz this subject
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {item.lessons.map((lesson, index) => (
            <article
              key={lesson.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-xl bg-cyan-50 text-xs font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {lesson.durationMinutes} min
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    {lesson.xpReward} XP
                  </span>
                </div>
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">
                {lesson.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {lesson.description}
              </p>
              <Link
                href={`/lessons/${lesson.id}`}
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-700 transition hover:gap-3 dark:text-cyan-400"
              >
                Open lesson
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Related labs
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Turn the concepts into interactive experiments.
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {relatedLabs.map((lab) => (
            <Link
              key={lab.id}
              href={`/lab/${lab.id}`}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow transition hover:-translate-y-0.5 hover:border-violet-300 dark:border-white/[0.08] dark:bg-[#0e131b] dark:hover:border-violet-400/30"
            >
              <FlaskConical
                className="size-5 text-violet-600 dark:text-violet-400"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-sm font-bold text-slate-950 dark:text-white">
                {lab.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {lab.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                Open lab
                <ArrowRight
                  className="size-3 transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
