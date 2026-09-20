import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  FlaskConical,
  Lightbulb,
  Sigma,
  Sparkles,
  Target,
} from "lucide-react";

import { LessonCompletionButton } from "@/components/lesson-completion-button";
import { getLabById } from "@/lib/labs";
import { getLessonById, subjects } from "@/lib/subjects";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export function generateStaticParams() {
  return subjects.flatMap((item) =>
    item.lessons.map((lesson) => ({ lessonId: lesson.id })),
  );
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const result = getLessonById(lessonId);

  return result
    ? {
        title: result.lesson.title,
        description: result.lesson.description,
      }
    : {};
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const result = getLessonById(lessonId);

  if (!result) {
    notFound();
  }

  const { lesson, subject } = result;
  const relatedLabs = lesson.relatedLabIds
    .map((id) => getLabById(id))
    .filter((lab) => lab !== undefined);

  return (
    <article className="mx-auto max-w-5xl space-y-7">
      <Link
        href={`/subjects/${subject.id}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {subject.name}
      </Link>

      <header className="rounded-2xl border border-slate-200/80 bg-white p-7 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-9">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
          {subject.name} lesson
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950 dark:text-white">
          {lesson.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
          {lesson.overview}
        </p>
        <div className="mt-6">
          <LessonCompletionButton
            lesson={lesson}
            subjectName={subject.name}
          />
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <div className="flex items-center gap-3">
              <BookOpenCheck
                className="size-5 text-cyan-600 dark:text-cyan-400"
                aria-hidden="true"
              />
              <h2 className="text-base font-bold text-slate-950 dark:text-white">
                Lesson content
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {lesson.content.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 text-slate-600 dark:text-slate-300"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
              <Lightbulb
                className="size-5 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-sm font-bold text-slate-950 dark:text-white">
                Worked example
              </h2>
              {lesson.examples.map((example) => (
                <p
                  key={example}
                  className="mt-3 text-xs leading-6 text-slate-500"
                >
                  {example}
                </p>
              ))}
            </section>
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
              <Target
                className="size-5 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-sm font-bold text-slate-950 dark:text-white">
                Real-life application
              </h2>
              {lesson.applications.map((application) => (
                <p
                  key={application}
                  className="mt-3 text-xs leading-6 text-slate-500"
                >
                  {application}
                </p>
              ))}
            </section>
          </div>

          <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-400/20 dark:bg-cyan-400/[0.06]">
            <Sparkles
              className="size-5 text-cyan-700 dark:text-cyan-300"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-sm font-bold text-cyan-950 dark:text-cyan-100">
              Summary
            </h2>
            <p className="mt-3 text-xs leading-6 text-cyan-800 dark:text-cyan-200/80">
              {lesson.summary}
            </p>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Key concepts
            </h2>
            <ul className="mt-4 space-y-2">
              {lesson.keyConcepts.map((concept) => (
                <li
                  key={concept}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <span className="size-1.5 rounded-full bg-cyan-500" />
                  {concept}
                </li>
              ))}
            </ul>
          </section>

          {lesson.formulas.length > 0 ? (
            <section className="rounded-2xl border border-slate-200/80 bg-slate-950 p-5 text-white dark:border-white/[0.08]">
              <Sigma className="size-5 text-violet-300" aria-hidden="true" />
              <h2 className="mt-4 text-sm font-bold">Formulas</h2>
              <div className="mt-4 space-y-2">
                {lesson.formulas.map((formula) => (
                  <p
                    key={formula}
                    className="rounded-lg bg-white/[0.06] px-3 py-2 font-mono text-xs text-cyan-200"
                  >
                    {formula}
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Continue the flow
            </h2>
            <div className="mt-4 grid gap-2">
              {relatedLabs.slice(0, 2).map((lab) => (
                <Link
                  key={lab.id}
                  href={`/lab/${lab.id}`}
                  className="inline-flex h-10 items-center justify-between rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-300 dark:border-white/[0.08] dark:text-slate-300"
                >
                  <span className="inline-flex items-center gap-2">
                    <FlaskConical
                      className="size-3.5 text-violet-500"
                      aria-hidden="true"
                    />
                    {lab.title}
                  </span>
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              ))}
              <Link
                href={`/quiz?subject=${encodeURIComponent(subject.name)}&lesson=${encodeURIComponent(lesson.id)}`}
                className="inline-flex h-10 items-center justify-between rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-amber-300 dark:border-white/[0.08] dark:text-slate-300"
              >
                Quiz this lesson
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href={`/tutor?subject=${encodeURIComponent(subject.name)}&lesson=${encodeURIComponent(lesson.title)}`}
                className="inline-flex h-10 items-center justify-between rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 dark:border-white/[0.08] dark:text-slate-300"
              >
                <span className="inline-flex items-center gap-2">
                  <BrainCircuit
                    className="size-3.5 text-cyan-500"
                    aria-hidden="true"
                  />
                  Ask AI Tutor
                </span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </article>
  );
}
