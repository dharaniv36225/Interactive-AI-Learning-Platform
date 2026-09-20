import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenCheck, GitBranch } from "lucide-react";

import {
  getBranchesForSemester,
  getBtechSemester,
  getBtechYear,
  getSemesterStaticParams,
} from "@/lib/btech-curriculum";

type SemesterPageProps = {
  params: Promise<{ yearId: string; semesterId: string }>;
};

export function generateStaticParams() {
  return getSemesterStaticParams();
}

export async function generateMetadata({
  params,
}: SemesterPageProps): Promise<Metadata> {
  const { yearId, semesterId } = await params;
  const semester = getBtechSemester(yearId, semesterId);

  return semester
    ? {
        title: semester.title,
        description: semester.focus,
      }
    : {};
}

export default async function UniversitySemesterPage({
  params,
}: SemesterPageProps) {
  const { yearId, semesterId } = await params;
  const year = getBtechYear(yearId);
  const semester = getBtechSemester(yearId, semesterId);
  const branches = getBranchesForSemester(yearId, semesterId);

  if (!year || !semester) {
    notFound();
  }

  return (
    <div className="space-y-7">
      <Link
        href={`/university/${yearId}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {year.title}
      </Link>

      <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-7 text-white sm:p-10">
        <div className="physics-grid absolute inset-0 opacity-25" />
        <div className="relative max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            {year.title}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
            {semester.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
            {semester.focus}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {branches.map((branch) => (
          <Link
            key={branch.id}
            href={`/university/${yearId}/${semesterId}/${branch.id}`}
            className="group rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/[0.08] dark:bg-[#0e131b]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                <GitBranch className="size-5" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/[0.06]">
                {branch.subjectCount} subjects
              </span>
            </div>
            <h2 className="mt-6 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
              {branch.shortName}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {branch.name}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {branch.description}
            </p>
            <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <BookOpenCheck className="size-3.5" aria-hidden="true" />
              Branch subjects
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400">
              Open branch
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
