import dynamic from "next/dynamic";
import { Code2, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { codingPracticeProblems } from "@/lib/btech-curriculum";

const CodingPracticePanel = dynamic(
  () =>
    import("@/components/university/coding-practice-panel").then(
      (module) => module.CodingPracticePanel,
    ),
  {
    loading: () => (
      <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="h-[520px] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
        <div className="h-[620px] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
      </div>
    ),
  },
);

export const metadata = {
  title: "Coding Practice",
  description:
    "B.Tech coding practice for C, C++, Java, Python, JavaScript, and SQL with AI review.",
};

export default function CodingPracticePage() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Compiler practice"
        title="Coding Practice Platform"
        description="Solve B.Tech programming problems in C, C++, Java, Python, JavaScript, and SQL with test cases, hints, AI code review, and debugging prompts."
        actions={
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300">
            <Code2 className="size-4 text-cyan-500" aria-hidden="true" />
            {codingPracticeProblems.length} problems
          </div>
        }
      />

      <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-sm leading-6 text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-400/[0.06] dark:text-cyan-100">
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
          <p>
            This editor keeps code execution browser-safe and prepares test cases for a sandboxed compiler service. AI review uses the existing tutor route.
          </p>
        </div>
      </section>

      <CodingPracticePanel />
    </div>
  );
}
