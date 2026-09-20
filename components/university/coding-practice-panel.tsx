"use client";

import { BrainCircuit, CheckCircle2, LoaderCircle, Play, Sparkles, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AiStudyNotes } from "@/components/ai-study-notes";
import {
  codingPracticeProblems,
  type CodingDifficulty,
  type CodingLanguage,
  type CodingPracticeProblem,
} from "@/lib/btech-curriculum";
import type { TutorApiResponse } from "@/types";

type TestResult = {
  input: string;
  expectedOutput: string;
  passed: boolean;
  note: string;
};

function getStarter(problem: CodingPracticeProblem, language: CodingLanguage) {
  return (
    problem.starterCode[language] ??
    `// ${problem.title}\n// Solve this problem in ${language}.\n`
  );
}

export function CodingPracticePanel() {
  const [problemId, setProblemId] = useState(codingPracticeProblems[0].id);
  const [difficulty, setDifficulty] = useState<CodingDifficulty | "all">("all");
  const filteredProblems = useMemo(
    () =>
      difficulty === "all"
        ? codingPracticeProblems
        : codingPracticeProblems.filter((problem) => problem.difficulty === difficulty),
    [difficulty],
  );
  const selectedProblem =
    filteredProblems.find((problem) => problem.id === problemId) ??
    filteredProblems[0] ??
    codingPracticeProblems[0];
  const [language, setLanguage] = useState<CodingLanguage>(selectedProblem.languages[0]);
  const [source, setSource] = useState(() => getStarter(selectedProblem, selectedProblem.languages[0]));
  const [results, setResults] = useState<TestResult[]>([]);
  const [review, setReview] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const groupedProblems = useMemo(() => {
    return filteredProblems.reduce<Record<string, CodingPracticeProblem[]>>((groups, problem) => {
      const key = problem.subjectId;
      groups[key] = [...(groups[key] ?? []), problem];
      return groups;
    }, {});
  }, [filteredProblems]);

  useEffect(() => {
    const nextLanguage = selectedProblem.languages.includes(language)
      ? language
      : selectedProblem.languages[0];

    setLanguage(nextLanguage);
    setSource(getStarter(selectedProblem, nextLanguage));
    setResults([]);
    setReview(null);
    setReviewError(null);
  }, [language, selectedProblem]);

  function runSampleTests() {
    const normalizedSource = source.toLowerCase();
    const looksImplemented =
      source.trim().length > 36 &&
      !source.includes("TODO") &&
      !source.includes("// Solve this problem");
    const canDemoEvaluate =
      language === "JavaScript" || language === "SQL";
    const passesDemoChecks =
      language === "JavaScript"
        ? looksImplemented &&
          normalizedSource.includes("return") &&
          (normalizedSource.includes("function") ||
            normalizedSource.includes("=>") ||
            normalizedSource.includes("export"))
        : looksImplemented &&
          normalizedSource.includes("select") &&
          normalizedSource.includes("from") &&
          (normalizedSource.includes("group by") ||
            normalizedSource.includes("join") ||
            normalizedSource.includes("order by"));

    setResults(
      selectedProblem.testCases.map((testCase) => ({
        ...testCase,
        passed: canDemoEvaluate && passesDemoChecks,
        note: canDemoEvaluate
          ? passesDemoChecks
            ? "Demo evaluator passed structural checks. A production compiler/database runner should verify exact output."
            : "Demo evaluator found missing implementation structure. Add code before running a real compiler."
          : "No sandboxed compiler is connected for this language. Test cases are shown for validation and AI debugging.",
      })),
    );
  }

  async function askAiReview() {
    setIsReviewing(true);
    setReview(null);
    setReviewError(null);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Review this ${language} solution for the B.Tech coding problem "${selectedProblem.title}". Problem: ${selectedProblem.prompt}. Focus on ${selectedProblem.reviewFocus.join(", ")}.\n\n${source}`,
            },
          ],
        }),
      });
      const body = (await response.json()) as TutorApiResponse | { error?: string };

      if (!response.ok || !("message" in body)) {
        throw new Error("error" in body && body.error ? body.error : "AI code review failed.");
      }

      setReview(body.message);
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : "AI code review failed.");
    } finally {
      setIsReviewing(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
              Coding practice
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
              Problem bank
            </h2>
          </div>
          <Sparkles className="size-5 text-cyan-500" aria-hidden="true" />
        </div>

        <label className="mt-5 block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Problem
          </span>
          <select
            value={problemId}
            onChange={(event) => setProblemId(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-[#111720]"
          >
            {Object.entries(groupedProblems).map(([subjectId, problems]) => (
              <optgroup key={subjectId} label={subjectId.replace(/-/g, " ")}>
                {problems.map((problem) => (
                  <option key={problem.id} value={problem.id}>
                    {problem.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Difficulty
          </span>
          <select
            value={difficulty}
            onChange={(event) => {
              const nextDifficulty = event.target.value as CodingDifficulty | "all";
              setDifficulty(nextDifficulty);
              const nextProblem =
                nextDifficulty === "all"
                  ? codingPracticeProblems[0]
                  : codingPracticeProblems.find(
                      (problem) => problem.difficulty === nextDifficulty,
                    ) ?? codingPracticeProblems[0];
              setProblemId(nextProblem.id);
            }}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-[#111720]"
          >
            <option value="all">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label className="mt-4 block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Language
          </span>
          <select
            value={language}
            onChange={(event) => {
              const nextLanguage = event.target.value as CodingLanguage;
              setLanguage(nextLanguage);
              setSource(getStarter(selectedProblem, nextLanguage));
            }}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-[#111720]"
          >
            {selectedProblem.languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.025]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Difficulty
            </span>
            <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[10px] font-bold capitalize text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              {selectedProblem.difficulty}
            </span>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
            {selectedProblem.prompt}
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Hints
          </p>
          {selectedProblem.hints.map((hint) => (
            <p key={hint} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-white/[0.04]">
              {hint}
            </p>
          ))}
        </div>
      </aside>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
              {selectedProblem.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Browser-safe editor with AI review and compiler-service handoff points.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runSampleTests}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-500 px-4 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              <Play className="size-3.5 fill-current" aria-hidden="true" />
              Run code
            </button>
            <button
              type="button"
              onClick={() => void askAiReview()}
              disabled={isReviewing}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-violet-200 px-4 text-xs font-bold text-violet-700 transition hover:bg-violet-50 disabled:opacity-60 dark:border-violet-400/20 dark:text-violet-300 dark:hover:bg-violet-400/[0.06]"
            >
              {isReviewing ? (
                <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <BrainCircuit className="size-3.5" aria-hidden="true" />
              )}
              AI debug / explain
            </button>
          </div>
        </div>

        <textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          spellCheck={false}
          className="mt-5 min-h-[390px] w-full rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-6 text-cyan-50 outline-none focus:border-cyan-400 dark:border-white/[0.08]"
          aria-label="Code editor"
        />

        {results.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {results.map((result) => (
              <article
                key={`${result.input}-${result.expectedOutput}`}
                className={`rounded-xl border p-4 ${
                  result.passed
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/[0.06]"
                    : "border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  {result.passed ? (
                    <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <XCircle className="size-4 text-amber-600" aria-hidden="true" />
                  )}
                  {result.passed ? "Ready" : "Needs implementation"}
                </div>
                <p className="mt-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  Input: {result.input}
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  Expected: {result.expectedOutput}
                </p>
                <p className="mt-2 text-xs text-slate-500">{result.note}</p>
              </article>
            ))}
          </div>
        ) : null}

        {review || reviewError ? (
          <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950 dark:border-violet-400/20 dark:bg-violet-400/[0.06] dark:text-violet-100">
            <AiStudyNotes text={reviewError ?? review ?? ""} tone={reviewError ? "error" : "default"} />
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default CodingPracticePanel;
