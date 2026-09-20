"use client";

import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  LoaderCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { AiStudyNotes } from "@/components/ai-study-notes";
import { LabRenderer } from "@/components/labs/LabRenderer";
import { useUserStore } from "@/stores/userStore";
import type { LabDefinition, TutorApiResponse } from "@/types";

type LabWorkspaceProps = {
  lab: LabDefinition;
  subjectName: string;
  relatedLessonId?: string;
};

const continuousLabIds = new Set([
  "solar-system-explorer",
  "electric-circuit",
  "wave-simulator",
]);

export function LabWorkspace({
  lab,
  subjectName,
  relatedLessonId,
}: LabWorkspaceProps) {
  const [runSignal, setRunSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [wasFirstRun, setWasFirstRun] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAskingTutor, setIsAskingTutor] = useState(false);
  const recordLabActivity = useUserStore((state) => state.recordLabActivity);
  const recordTutorQuestion = useUserStore((state) => state.recordTutorQuestion);
  const runningRef = useRef(false);
  const rewardedRunRef = useRef(0);

  const finishRun = useCallback(() => {
    runningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  function reset() {
    runningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    setResetSignal((signal) => signal + 1);
    setLastReward(null);
    setWasFirstRun(false);
  }

  function runLab() {
    if (runningRef.current && !isPaused) {
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      return;
    }

    runningRef.current = true;
    setIsRunning(true);
    setIsPaused(false);
    setRunSignal((signal) => signal + 1);
  }

  function togglePause() {
    if (!isRunning) {
      return;
    }

    setIsPaused((paused) => !paused);
  }

  useEffect(() => {
    if (
      !isRunning ||
      runSignal === 0 ||
      rewardedRunRef.current === runSignal
    ) {
      return;
    }

    rewardedRunRef.current = runSignal;
    const result = recordLabActivity(lab, subjectName);
    setLastReward(result.xpEarned);
    setWasFirstRun(result.completed);
  }, [isRunning, lab, recordLabActivity, runSignal, subjectName]);

  useEffect(() => {
    if (
      !isRunning ||
      isPaused ||
      runSignal === 0 ||
      continuousLabIds.has(lab.id)
    ) {
      return;
    }

    const fallbackTimer = window.setTimeout(finishRun, 6000);

    return () => window.clearTimeout(fallbackTimer);
  }, [finishRun, isPaused, isRunning, lab.id, runSignal]);

  async function askTutor() {
    const question = `Explain the ${lab.title} lab in ${subjectName}. Connect the current controls (${lab.primaryControl} and ${lab.secondaryControl}) to the measured output (${lab.outputLabel})${lab.formula ? ` using ${lab.formula}` : ""}. Give me one observation to test next.`;

    setIsAskingTutor(true);
    setAiError(null);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: question }],
        }),
      });
      const body = (await response.json()) as
        | TutorApiResponse
        | { error?: string };

      if (!response.ok || !("message" in body)) {
        throw new Error(
          "error" in body && body.error
            ? body.error
            : "The AI tutor could not explain this lab.",
        );
      }

      setAiExplanation(body.message);
      recordTutorQuestion(question);
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : "The AI tutor could not explain this lab.",
      );
    } finally {
      setIsAskingTutor(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/lab"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All labs
      </Link>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
        <header className="flex flex-col gap-4 border-b border-slate-200/80 p-5 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-400">
              {subjectName} · {lab.category}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white">
              {lab.title}
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
              {lab.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:border-slate-300 dark:border-white/[0.08] dark:text-slate-300"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset
            </button>
            {isRunning ? (
              <button
                type="button"
                onClick={togglePause}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:border-slate-300 dark:border-white/[0.08] dark:text-slate-300"
              >
                <Pause className="size-3.5" aria-hidden="true" />
                {isPaused ? "Resume" : "Pause"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={runLab}
              disabled={isRunning}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-500 px-4 text-xs font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-violet-300 dark:disabled:bg-violet-500/40"
            >
              <Play className="size-3.5 fill-current" aria-hidden="true" />
              {isPaused
                ? "Paused"
                : isRunning
                  ? "Running..."
                  : "Run Lab"}
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <LabRenderer
            lab={lab}
            isRunning={isRunning}
            isPaused={isPaused}
            onRunComplete={finishRun}
            resetSignal={resetSignal}
            runSignal={runSignal}
          />
          <div className="mt-4">
            {lastReward !== null ? (
              <p
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07] dark:text-emerald-300"
              >
                {wasFirstRun
                  ? `Experiment saved · +${lastReward} XP`
                  : "Experiment saved · first-run XP was already earned"}
              </p>
            ) : (
              <p className="flex items-center gap-2 text-[10px] text-slate-400">
                <Sparkles className="size-3.5" aria-hidden="true" />
                First completed run earns {lab.xpReward} XP.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {relatedLessonId ? (
          <Link
            href={`/lessons/${relatedLessonId}`}
            className="inline-flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-cyan-300 dark:border-white/[0.08] dark:bg-[#0e131b] dark:text-slate-300"
          >
            Review Lesson
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
        <Link
          href={`/quiz?subject=${encodeURIComponent(subjectName)}${
            relatedLessonId
              ? `&lesson=${encodeURIComponent(relatedLessonId)}`
              : ""
          }`}
          className="inline-flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-amber-300 dark:border-white/[0.08] dark:bg-[#0e131b] dark:text-slate-300"
        >
          Take Quiz
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => void askTutor()}
          disabled={isAskingTutor}
          className="inline-flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-violet-300 dark:border-white/[0.08] dark:bg-[#0e131b] dark:text-slate-300"
        >
          <span className="inline-flex items-center gap-2">
            {isAskingTutor ? (
              <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <BrainCircuit className="size-3.5 text-violet-500" aria-hidden="true" />
            )}
            Ask AI Tutor
          </span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </section>

      {aiExplanation || aiError ? (
        <section
          aria-live="polite"
          className={`rounded-2xl border p-5 text-sm leading-7 ${
            aiError
              ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/[0.07] dark:text-rose-200"
              : "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-400/20 dark:bg-violet-400/[0.07] dark:text-violet-100"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-65">
            AI lab explanation
          </p>
          <div className="mt-3">
            <AiStudyNotes text={aiError ?? aiExplanation ?? ""} tone={aiError ? "error" : "default"} />
          </div>
          {!aiError ? (
            <Link
              href={`/tutor?subject=${encodeURIComponent(subjectName)}&lab=${encodeURIComponent(lab.title)}`}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-violet-700 dark:text-violet-300"
            >
              Continue in AI Tutor
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export default LabWorkspace;
