import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Code2,
  FlaskConical,
  Layers3,
} from "lucide-react";

import {
  getBranchStaticParams,
  getBtechBranch,
  getBtechSemester,
  getBtechYear,
  getSubjectsForBranch,
} from "@/lib/btech-curriculum";

type BranchPageProps = {
  params: Promise<{ yearId: string; semesterId: string; branchId: string }>;
};

export function generateStaticParams() {
  return getBranchStaticParams();
}

export async function generateMetadata({
  params,
}: BranchPageProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBtechBranch(branchId);

  return branch
    ? {
        title: `${branch.shortName} Subjects`,
        description: branch.description,
      }
    : {};
}

export default async function UniversityBranchPage({ params }: BranchPageProps) {
  const { yearId, semesterId, branchId } = await params;
  const year = getBtechYear(yearId);
  const semester = getBtechSemester(yearId, semesterId);
  const branch = getBtechBranch(branchId);
  const subjects = getSubjectsForBranch(yearId, semesterId, branchId);

  if (!year || !semester || !branch) {
    notFound();
  }

  return (
    <div className="space-y-7">
      <Link
        href={`/university/${yearId}/${semesterId}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {semester.title}
      </Link>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-7 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-9">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
          {year.title} / {semester.title}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950 dark:text-white">
          {branch.shortName}: {branch.name}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
          {branch.description}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/university/${yearId}/${semesterId}/${branchId}/${subject.id}`}
            className="group flex min-h-72 flex-col rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/[0.08] dark:bg-[#0e131b]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                <BookOpenCheck className="size-5" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/[0.06]">
                {subject.credits} credits
              </span>
            </div>
            <h2 className="mt-6 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
              {subject.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
              {subject.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 dark:bg-white/[0.04]">
                <Layers3 className="size-3" aria-hidden="true" />
                {subject.units.length} units
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 dark:bg-white/[0.04]">
                <FlaskConical className="size-3" aria-hidden="true" />
                3D lab
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 dark:bg-white/[0.04]">
                <Code2 className="size-3" aria-hidden="true" />
                {subject.codingPracticeIds.length} coding
              </span>
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400">
              Open subject
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
