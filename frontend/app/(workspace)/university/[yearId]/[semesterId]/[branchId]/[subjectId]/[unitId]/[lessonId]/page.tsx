import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Code2,
  FlaskConical,
  Lightbulb,
  Sigma,
  Target,
} from "lucide-react";

import {
  getBtechLesson,
  getBtechSubject,
  getBtechUnit,
} from "@/lib/btech-curriculum";
import { getBtechLab } from "@/lib/btech-labs";

const BtechLabRenderer = dynamic(
  () =>
    import("@/components/university/btech-lab-renderer").then(
      (module) => module.BtechLabRenderer,
    ),
  {
    loading: () => (
      <div className="h-[560px] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
    ),
  },
);

const BtechQuizPanel = dynamic(
  () =>
    import("@/components/university/btech-quiz-panel").then(
      (module) => module.BtechQuizPanel,
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
    ),
  },
);

const LessonAiTools = dynamic(
  () =>
    import("@/components/university/lesson-ai-tools").then(
      (module) => module.LessonAiTools,
    ),
  {
    loading: () => (
      <div className="h-72 animate-pulse rounded-2xl border border-violet-200 bg-violet-50 dark:border-violet-400/20 dark:bg-violet-400/[0.06]" />
    ),
  },
);

type LessonPageProps = {
  params: Promise<{
    yearId: string;
    semesterId: string;
    branchId: string;
    subjectId: string;
    unitId: string;
    lessonId: string;
  }>;
};

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { yearId, semesterId, branchId, subjectId, unitId, lessonId } =
    await params;
  const lesson = getBtechLesson(
    yearId,
    semesterId,
    branchId,
    subjectId,
    unitId,
    lessonId,
  );

  return lesson
    ? {
        title: lesson.title,
        description: lesson.detailedExplanation,
      }
    : {};
}

export default async function UniversityLessonPage({ params }: LessonPageProps) {
  const { yearId, semesterId, branchId, subjectId, unitId, lessonId } =
    await params;
  const subject = getBtechSubject(yearId, semesterId, branchId, subjectId);
  const unit = getBtechUnit(yearId, semesterId, branchId, subjectId, unitId);
  const lesson = getBtechLesson(
    yearId,
    semesterId,
    branchId,
    subjectId,
    unitId,
    lessonId,
  );

  if (!subject || !unit || !lesson) {
    notFound();
  }

  const lab = getBtechLab(lesson.related3dLabId);

  return (
    <article className="mx-auto max-w-6xl space-y-7">
      <Link
        href={`/university/${yearId}/${semesterId}/${branchId}/${subjectId}/${unitId}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {unit.title}
      </Link>

      <header className="rounded-2xl border border-slate-200/80 bg-white p-7 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-9">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
          {lesson.year} / {lesson.semester} / {lesson.branch.toUpperCase()} / {lesson.subject}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950 dark:text-white">
          {lesson.title}
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-500">
          {lesson.detailedExplanation}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={lesson.aiTutorShortcut}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950"
          >
            Ask AI Tutor
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/coding-practice"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 transition hover:border-cyan-300 dark:border-white/[0.08] dark:text-slate-300"
          >
            <Code2 className="size-3.5" aria-hidden="true" />
            Coding Practice
          </Link>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <div className="flex items-center gap-3">
              <BookOpenCheck className="size-5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-950 dark:text-white">
                Detailed theory
              </h2>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {lesson.detailedExplanation}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              The learning flow is theory, visualization, Run Lab, generated quiz, coding practice, and AI tutor feedback. Use the lab controls to test the model before answering questions.
            </p>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
              <Lightbulb className="size-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <h2 className="mt-4 text-sm font-bold text-slate-950 dark:text-white">
                Examples
              </h2>
              {lesson.examples.map((example) => (
                <p key={example} className="mt-3 text-xs leading-6 text-slate-500">
                  {example}
                </p>
              ))}
            </section>
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
              <Target className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <h2 className="mt-4 text-sm font-bold text-slate-950 dark:text-white">
                Real-world applications
              </h2>
              {lesson.realWorldApplications.map((application) => (
                <p key={application} className="mt-3 text-xs leading-6 text-slate-500">
                  {application}
                </p>
              ))}
            </section>
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Key points
            </h2>
            <ul className="mt-4 space-y-2">
              {lesson.keyPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <span className="mt-2 size-1.5 rounded-full bg-cyan-500" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-slate-950 p-5 text-white">
            <Sigma className="size-5 text-violet-300" aria-hidden="true" />
            <h2 className="mt-4 text-sm font-bold">Formulas</h2>
            <div className="mt-4 space-y-2">
              {lesson.formulas.map((formula) => (
                <p key={formula} className="rounded-lg bg-white/[0.06] px-3 py-2 font-mono text-xs text-cyan-200">
                  {formula}
                </p>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-400/20 dark:bg-cyan-400/[0.06]">
            <FlaskConical className="size-5 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
            <h2 className="mt-4 text-sm font-bold text-cyan-950 dark:text-cyan-100">
              Visualization
            </h2>
            <p className="mt-3 text-xs leading-6 text-cyan-900 dark:text-cyan-100">
              {lesson.visualizationDescription}
            </p>
          </section>
        </aside>
      </section>

      <LessonAiTools lesson={lesson} />

      {lab ? <BtechLabRenderer lab={lab} /> : null}

      <BtechQuizPanel lesson={lesson} />
    </article>
  );
}
