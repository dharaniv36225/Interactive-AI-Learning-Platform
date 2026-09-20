"use client";

import { LoaderCircle, Sparkles, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { AiStudyNotes } from "@/components/ai-study-notes";
import {
  btechBranches,
  btechCurriculum,
  type BtechBranchId,
  type BtechYearId,
} from "@/lib/btech-curriculum";

const goals = [
  "AI Engineer",
  "Full Stack Developer",
  "Data Scientist",
  "Cyber Security Analyst",
  "Cloud Engineer",
  "Robotics Engineer",
];

export function AiLearningPathGenerator() {
  const [yearId, setYearId] = useState<BtechYearId>("year-1");
  const [branchId, setBranchId] = useState<BtechBranchId>("cse");
  const [goal, setGoal] = useState(goals[0]);
  const [hours, setHours] = useState(8);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedYear = useMemo(
    () => btechCurriculum.find((year) => year.id === yearId) ?? btechCurriculum[0],
    [yearId],
  );

  async function generatePlan() {
    const branch =
      btechBranches.find((item) => item.id === branchId) ?? btechBranches[0];

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: selectedYear.title,
          branch: branch.name,
          goal,
          weeklyHours: hours,
        }),
      });
      const body = (await response.json()) as { plan?: string; error?: string };

      if (!response.ok || !body.plan) {
        throw new Error("error" in body && body.error ? body.error : "The AI tutor could not generate a plan.");
      }

      setPlan(body.plan);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The AI tutor could not generate a plan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5 dark:border-violet-400/20 dark:bg-violet-400/[0.06] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
            AI learning path
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
            Generate a semester-wise study plan
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            The plan uses the existing tutor API and the new B.Tech curriculum graph.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-violet-700 dark:bg-white/[0.08] dark:text-violet-200">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Adaptive AI-ready
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_1fr_140px_auto]">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Current year
          </span>
          <select
            value={yearId}
            onChange={(event) => setYearId(event.target.value as BtechYearId)}
            className="mt-2 h-11 w-full rounded-xl border border-violet-200 bg-white px-3 text-sm outline-none focus:border-violet-400 dark:border-white/[0.1] dark:bg-[#111720]"
          >
            {btechCurriculum.map((year) => (
              <option key={year.id} value={year.id}>
                {year.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Branch
          </span>
          <select
            value={branchId}
            onChange={(event) => setBranchId(event.target.value as BtechBranchId)}
            className="mt-2 h-11 w-full rounded-xl border border-violet-200 bg-white px-3 text-sm outline-none focus:border-violet-400 dark:border-white/[0.1] dark:bg-[#111720]"
          >
            {btechBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.shortName}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Career goal
          </span>
          <select
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-violet-200 bg-white px-3 text-sm outline-none focus:border-violet-400 dark:border-white/[0.1] dark:bg-[#111720]"
          >
            {goals.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Hours/week
          </span>
          <input
            type="number"
            min={2}
            max={40}
            value={hours}
            onChange={(event) => setHours(Number(event.target.value))}
            className="mt-2 h-11 w-full rounded-xl border border-violet-200 bg-white px-3 text-sm outline-none focus:border-violet-400 dark:border-white/[0.1] dark:bg-[#111720]"
          />
        </label>

        <button
          type="button"
          onClick={() => void generatePlan()}
          disabled={isLoading}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 md:mt-[26px]"
        >
          {isLoading ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <WandSparkles className="size-4" aria-hidden="true" />
          )}
          Generate
        </button>
      </div>

      {plan || error ? (
        <div className="mt-5 rounded-xl border border-violet-200 bg-white p-4 text-sm leading-6 text-slate-700 dark:border-white/[0.08] dark:bg-[#0e131b] dark:text-slate-200">
          <AiStudyNotes text={error ?? plan ?? ""} tone={error ? "error" : "default"} />
        </div>
      ) : null}
    </section>
  );
}

export default AiLearningPathGenerator;
