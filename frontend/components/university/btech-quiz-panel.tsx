"use client";

import { LoaderCircle, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  generateBtechQuestionBank,
  getBtechQuizCacheKey,
  type BtechQuizQuestion,
} from "@/lib/btech-quiz";
import type { BtechLesson } from "@/lib/btech-lessons";

type BtechQuizPanelProps = {
  lesson: BtechLesson;
};

export function BtechQuizPanel({ lesson }: BtechQuizPanelProps) {
  const [questions, setQuestions] = useState<BtechQuizQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheKey = useMemo(() => getBtechQuizCacheKey(lesson.id), [lesson.id]);

  useEffect(() => {
    const cached = window.localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as BtechQuizQuestion[];
        setQuestions(parsed);
        return;
      } catch {
        window.localStorage.removeItem(cacheKey);
      }
    }

    const generated = generateBtechQuestionBank({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      subject: lesson.subject,
      keyPoints: lesson.keyPoints,
      branch: lesson.branch,
      unit: lesson.unit,
      formulas: lesson.formulas,
      examples: lesson.examples,
    });
    setQuestions(generated);
    window.localStorage.setItem(cacheKey, JSON.stringify(generated));
  }, [cacheKey, lesson]);

  async function generateWithAi() {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/quiz-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          subject: lesson.subject,
          keyPoints: lesson.keyPoints,
          branch: lesson.branch,
          unit: lesson.unit,
          formulas: lesson.formulas,
          examples: lesson.examples,
          count: 20,
        }),
      });
      const body = (await response.json()) as {
        questions?: BtechQuizQuestion[];
        error?: string;
      };

      if (!response.ok || !body.questions?.length) {
        throw new Error(body.error ?? "AI quiz generation failed.");
      }

      const merged = [...body.questions, ...questions].slice(0, 120);
      setQuestions(merged);
      setSelectedQuestion(0);
      setSelectedAnswer(null);
      window.localStorage.setItem(cacheKey, JSON.stringify(merged));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "AI quiz generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  const question = questions[selectedQuestion];
  const isCorrect = selectedAnswer !== null && selectedAnswer === question?.correctAnswer;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
            Quiz engine
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
            100+ question bank
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Seed generator plus Gemini expansion cached in localStorage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void generateWithAi()}
          disabled={isGenerating}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 px-4 text-xs font-bold text-amber-700 transition hover:bg-amber-50 disabled:opacity-60 dark:border-amber-400/20 dark:text-amber-300"
        >
          {isGenerating ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Sparkles className="size-3.5" aria-hidden="true" />}
          Gemini quiz boost
        </button>
      </div>

      {question ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 p-2 dark:border-white/[0.08]">
            {questions.slice(0, 120).map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedQuestion(index);
                  setSelectedAnswer(null);
                }}
                className={`mb-1 flex h-9 w-full items-center justify-between rounded-lg px-3 text-left text-xs font-semibold ${
                  selectedQuestion === index
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                }`}
              >
                Q{index + 1}
                <span className="capitalize">{item.difficulty}</span>
              </button>
            ))}
          </aside>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Trophy className="size-3.5" aria-hidden="true" />
              {question.subject} / {question.difficulty}
            </div>
            <h3 className="mt-3 text-lg font-bold leading-7 text-slate-950 dark:text-white">
              {question.question}
            </h3>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedAnswer(option)}
                  className={`rounded-xl border p-4 text-left text-sm font-semibold transition ${
                    selectedAnswer === option
                      ? option === question.correctAnswer
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/[0.08] dark:text-emerald-100"
                        : "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-400/30 dark:bg-rose-400/[0.08] dark:text-rose-100"
                      : "border-slate-200 hover:border-amber-300 dark:border-white/[0.08]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedAnswer ? (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-slate-300">
                <p className="font-bold text-slate-950 dark:text-white">
                  {isCorrect ? "Correct" : `Correct answer: ${question.correctAnswer}`}
                </p>
                <p className="mt-1">{question.explanation}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-5 flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 dark:border-white/[0.12]">
          Generating question bank...
        </div>
      )}

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/[0.07] dark:text-rose-300">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => {
          window.localStorage.removeItem(cacheKey);
          const generated = generateBtechQuestionBank({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          subject: lesson.subject,
          keyPoints: lesson.keyPoints,
          branch: lesson.branch,
          unit: lesson.unit,
          formulas: lesson.formulas,
          examples: lesson.examples,
        });
          setQuestions(generated);
          setSelectedQuestion(0);
          setSelectedAnswer(null);
        }}
        className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Reset cached questions
      </button>
    </section>
  );
}

export default BtechQuizPanel;
