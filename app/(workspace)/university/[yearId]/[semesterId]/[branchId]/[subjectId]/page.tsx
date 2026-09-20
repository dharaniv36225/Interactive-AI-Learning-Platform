import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Code2,
  FlaskConical,
  Layers3,
  Trophy,
} from "lucide-react";

import {
  getBtechBranch,
  getBtechSemester,
  getBtechSubject,
  getBtechYear,
} from "@/lib/btech-curriculum";
import { getBtechLab } from "@/lib/btech-labs";

type SubjectPageProps = {
  params: Promise<{
    yearId: string;
    semesterId: string;
    branchId: string;
    subjectId: string;
  }>;
};

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { yearId, semesterId, branchId, subjectId } = await params;
  const subject = getBtechSubject(yearId, semesterId, branchId, subjectId);

  return subject
    ? {
        title: subject.title,
        description: subject.description,
      }
    : {};
}

export default async function UniversitySubjectPage({
  params,
}: SubjectPageProps) {
  const { yearId, semesterId, branchId, subjectId } = await params;
  const year = getBtechYear(yearId);
  const semester = getBtechSemester(yearId, semesterId);
  const branch = getBtechBranch(branchId);
  const subject = getBtechSubject(yearId, semesterId, branchId, subjectId);

  if (!year || !semester || !branch || !subject) {
    notFound();
  }

  const lab = getBtechLab(subject.labId);
  const lessonCount = subject.units.reduce(
    (total, unit) => total + unit.lessons.length,
    0,
  );

  return (
    <div className="space-y-7">
      <Link
        href={`/university/${yearId}/${semesterId}/${branchId}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {branch.shortName} subjects
      </Link>

      <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-7 text-white sm:p-10">
        <div className="physics-grid absolute inset-0 opacity-25" />
        <div className="relative max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            {year.title} / {semester.title} / {branch.shortName}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
            {subject.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
            {subject.description}
          </p>
          <div className="mt-7 grid gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 sm:grid-cols-4">
            <span className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              {subject.credits} credits
            </span>
            <span className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              {subject.units.length} units
            </span>
            <span className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              {lessonCount} lessons
            </span>
            <span className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              120+ quiz questions
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid gap-4 md:grid-cols-2">
          {subject.units.map((unit) => (
            <Link
              key={unit.id}
              href={`/university/${yearId}/${semesterId}/${branchId}/${subjectId}/${unit.id}`}
              className="group rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/[0.08] dark:bg-[#0e131b]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                <Layers3 className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
                {unit.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {unit.description}
              </p>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {unit.lessons.length} lessons
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400">
                Open unit
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Subject tools
            </h2>
            <div className="mt-4 grid gap-2">
              <Link
                href={lab ? `#${lab.id}` : "/lab"}
                className="inline-flex h-10 items-center justify-between rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 dark:border-white/[0.08] dark:text-slate-300"
              >
                <span className="inline-flex items-center gap-2">
                  <FlaskConical className="size-3.5 text-violet-500" aria-hidden="true" />
                  {lab?.title ?? "3D Lab"}
                </span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/coding-practice"
                className="inline-flex h-10 items-center justify-between rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 dark:border-white/[0.08] dark:text-slate-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Code2 className="size-3.5 text-cyan-500" aria-hidden="true" />
                  Coding Practice
                </span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/quiz"
                className="inline-flex h-10 items-center justify-between rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 dark:border-white/[0.08] dark:text-slate-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Trophy className="size-3.5 text-amber-500" aria-hidden="true" />
                  Quiz Engine
                </span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href={`/tutor?subject=${encodeURIComponent(subject.title)}`}
                className="inline-flex h-10 items-center justify-between rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 dark:border-white/[0.08] dark:text-slate-300"
              >
                <span className="inline-flex items-center gap-2">
                  <BrainCircuit className="size-3.5 text-violet-500" aria-hidden="true" />
                  AI Tutor
                </span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
