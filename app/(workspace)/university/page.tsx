import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  Code2,
  GraduationCap,
  Layers3,
  Route,
  Trophy,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import {
  aiUniversityCapabilities,
  btechCurriculum,
  getUniversityStats,
} from "@/lib/btech-curriculum";

const AiLearningPathGenerator = dynamic(
  () =>
    import("@/components/university/ai-learning-path-generator").then(
      (module) => module.AiLearningPathGenerator,
    ),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-2xl border border-violet-200 bg-violet-50/70 dark:border-violet-400/20 dark:bg-violet-400/[0.06]" />
    ),
  },
);

const VisualizationEngine = dynamic(
  () =>
    import("@/components/university/visualization-engine").then(
      (module) => module.VisualizationEngine,
    ),
  {
    loading: () => (
      <div className="h-[460px] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
    ),
  },
);

export const metadata = {
  title: "Virtual B.Tech University",
  description:
    "AI-powered B.Tech curriculum with lessons, labs, quizzes, coding practice, visualizations, and career guidance.",
};

export default function UniversityPage() {
  const stats = getUniversityStats();

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="AI-powered university"
        title="Virtual B.Tech University"
        description="A scalable engineering curriculum across four years, eight semesters, major branches, AI tutors, labs, visualizations, quizzes, and coding practice."
        actions={
          <Link
            href="/coding-practice"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
          >
            <Code2 className="size-4" aria-hidden="true" />
            Coding Practice
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="B.Tech years"
          value={String(stats.years)}
          detail={`${stats.semesters} semester pathways`}
          icon={GraduationCap}
          tone="cyan"
        />
        <StatCard
          label="Subjects"
          value={String(stats.subjects)}
          detail={`${stats.lessons} structured lessons`}
          icon={BookOpenCheck}
          tone="violet"
        />
        <StatCard
          label="Visual scenes"
          value={String(stats.visualizations)}
          detail={`${stats.labs} linked labs`}
          icon={Layers3}
          tone="emerald"
        />
        <StatCard
          label="Quiz banks"
          value={String(stats.quizzes)}
          detail={`${stats.codingProblems} coding challenges`}
          icon={Trophy}
          tone="amber"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {btechCurriculum.map((year) => {
          const subjectCount = year.semesters.reduce(
            (total, semester) => total + semester.subjects.length,
            0,
          );

          return (
            <Link
              key={year.id}
              href={`/university/${year.id}`}
              className="group flex min-h-64 flex-col rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/[0.08] dark:bg-[#0e131b] dark:hover:border-cyan-400/30"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                <GraduationCap className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
                {year.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                {year.description}
              </p>
              <div className="mt-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>{year.semesters.length} semesters</span>
                <span>{subjectCount} subjects</span>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400">
                Open year
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>

      <AiLearningPathGenerator />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
              AI ecosystem
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
              Intelligent learning services
            </h2>
          </div>
          <Link href="/tutor" className="inline-flex items-center gap-2 text-xs font-bold text-violet-700 dark:text-violet-300">
            Open AI Tutor
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {aiUniversityCapabilities.map((capability) => (
            <article
              key={capability.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.025]"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                  <BrainCircuit className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                    {capability.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {capability.description}
                  </p>
                  <p className="mt-3 text-[10px] font-semibold text-slate-400">
                    Signals: {capability.signals.join(", ")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="visualizations">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
              3D visualization engine
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
              Concept simulations and Three-ready scenes
            </h2>
          </div>
          <span className="hidden items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-white sm:inline-flex">
            <Route className="size-3.5" aria-hidden="true" />
            Route split
          </span>
        </div>
        <VisualizationEngine />
      </section>
    </div>
  );
}
