import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenCheck, Clock3, Sparkles } from "lucide-react";

import {
  getBtechSubject,
  getBtechUnit,
} from "@/lib/btech-curriculum";

type UnitPageProps = {
  params: Promise<{
    yearId: string;
    semesterId: string;
    branchId: string;
    subjectId: string;
    unitId: string;
  }>;
};

export async function generateMetadata({
  params,
}: UnitPageProps): Promise<Metadata> {
  const { yearId, semesterId, branchId, subjectId, unitId } = await params;
  const unit = getBtechUnit(yearId, semesterId, branchId, subjectId, unitId);

  return unit
    ? {
        title: unit.title,
        description: unit.description,
      }
    : {};
}

export default async function UniversityUnitPage({ params }: UnitPageProps) {
  const { yearId, semesterId, branchId, subjectId, unitId } = await params;
  const subject = getBtechSubject(yearId, semesterId, branchId, subjectId);
  const unit = getBtechUnit(yearId, semesterId, branchId, subjectId, unitId);

  if (!subject || !unit) {
    notFound();
  }

  return (
    <div className="space-y-7">
      <Link
        href={`/university/${yearId}/${semesterId}/${branchId}/${subjectId}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {subject.title}
      </Link>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-7 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-9">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
          Unit path
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-slate-950 dark:text-white">
          {unit.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
          {unit.description}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {unit.lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            href={`/university/${yearId}/${semesterId}/${branchId}/${subjectId}/${unitId}/${lesson.id}`}
            className="group rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/[0.08] dark:bg-[#0e131b]"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-cyan-50 text-xs font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <Clock3 className="size-3.5" aria-hidden="true" />
                30 min
              </span>
            </div>
            <h2 className="mt-5 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
              {lesson.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {lesson.detailedExplanation}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 dark:bg-white/[0.04]">
                <BookOpenCheck className="size-3" aria-hidden="true" />
                Theory
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 dark:bg-white/[0.04]">
                <Sparkles className="size-3" aria-hidden="true" />
                AI help
              </span>
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400">
              Open lesson
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
