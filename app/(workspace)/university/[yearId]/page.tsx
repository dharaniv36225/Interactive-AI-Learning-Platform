import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  GitBranch,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  getBranchesForSemester,
  getBtechYear,
  getYearStaticParams,
} from "@/lib/btech-curriculum";

type YearPageProps = {
  params: Promise<{ yearId: string }>;
};

export function generateStaticParams() {
  return getYearStaticParams();
}

export async function generateMetadata({
  params,
}: YearPageProps): Promise<Metadata> {
  const { yearId } = await params;
  const year = getBtechYear(yearId);

  return year
    ? {
        title: year.title,
        description: year.description,
      }
    : {};
}

export default async function UniversityYearPage({ params }: YearPageProps) {
  const { yearId } = await params;
  const year = getBtechYear(yearId);

  if (!year) {
    notFound();
  }

  return (
    <div className="space-y-7">
      <Link
        href="/university"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Virtual B.Tech University
      </Link>

      <PageHeader
        eyebrow="Semester pathway"
        title={year.title}
        description={year.description}
        actions={
          <Link
            href="/coding-practice"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-cyan-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300"
          >
            <Code2 className="size-4" aria-hidden="true" />
            Practice coding
          </Link>
        }
      />

      <section className="grid gap-5">
        {year.semesters.map((semester) => {
          const branches = getBranchesForSemester(year.id, semester.id);

          return (
          <Link
            key={semester.id}
            href={`/university/${year.id}/${semester.id}`}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
                  {semester.title}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white">
                  {semester.focus}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-500">
                <span className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/[0.04]">
                  {semester.subjects.length} subjects
                </span>
                <span className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/[0.04]">
                  {branches.length} branches
                </span>
                <span className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/[0.04]">
                  {semester.subjects.filter((subject) => subject.codingPracticeIds.length > 0).length} coding
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.025]"
                >
                  <div className="flex items-center gap-2">
                    <GitBranch className="size-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-950 dark:text-white">
                      {branch.shortName}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    {branch.subjectCount} subjects in this semester.
                  </p>
                </div>
              ))}
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400">
              Open semester
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </Link>
        )})}
      </section>
    </div>
  );
}
