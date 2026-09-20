"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  History,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { PageHeader } from "@/components/page-header";
import { subjectsMeta } from "@/lib/subjects-meta";
import { useQuizStore } from "@/stores/quizStore";
import { useUserStore } from "@/stores/userStore";
import type {
  QuizAttempt,
  QuizDifficulty,
  QuizQuestion,
  QuizStatus,
} from "@/types";

const optionLetters = ["A", "B", "C", "D"];
const questionCache = new Map<string, QuizQuestion[]>();

const difficultyStyles: Record<QuizDifficulty, string> = {
  easy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  medium:
    "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  hard: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
};

function shuffleQuestions(questions: QuizQuestion[]) {
  const result = [...questions];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [
      result[randomIndex],
      result[index],
    ];
  }

  return result.slice(0, 10);
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatAttemptDate(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function QuizPage() {
  const { attempts, recordAttempt } = useQuizStore(
    useShallow((state) => ({
      attempts: state.attempts,
      recordAttempt: state.recordAttempt,
    })),
  );
  const recordQuizActivity = useUserStore(
    (state) => state.recordQuizActivity,
  );
  const [selectedSubject, setSelectedSubject] = useState(subjectsMeta[0].name);
  const [selectedLesson, setSelectedLesson] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    QuizDifficulty | "all"
  >("all");
  const [status, setStatus] = useState<QuizStatus>("setup");
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);
  const [questionBank, setQuestionBank] = useState<QuizQuestion[]>([]);
  const [isQuestionBankLoading, setIsQuestionBankLoading] = useState(true);
  const [isGeneratingPractice, setIsGeneratingPractice] = useState(false);
  const [practiceError, setPracticeError] = useState<string | null>(null);

  const subject =
    subjectsMeta.find((item) => item.name === selectedSubject) ??
    subjectsMeta[0];
  const selectedLessonTitle =
    subject.lessons.find((lesson) => lesson.id === selectedLesson)?.title ??
    "all";
  const availableQuestions = useMemo(
    () =>
      questionBank.filter(
        (question) =>
          question.subject === selectedSubject &&
          (selectedLesson === "all" ||
            question.lessonId === selectedLesson) &&
          (selectedDifficulty === "all" ||
            question.difficulty === selectedDifficulty),
      ),
    [questionBank, selectedDifficulty, selectedLesson, selectedSubject],
  );
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;
  const hasAnswered = selectedAnswer !== undefined;
  const isCorrect =
    currentQuestion !== undefined &&
    selectedAnswer === currentQuestion.correctAnswer;
  const isLastQuestion =
    currentQuestionIndex === activeQuestions.length - 1;

  useEffect(() => {
    void useQuizStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    const requestedSubject = parameters.get("subject");
    const requestedLesson = parameters.get("lesson");

    if (
      requestedSubject &&
      subjectsMeta.some((item) => item.name === requestedSubject)
    ) {
      setSelectedSubject(requestedSubject);
      setSelectedLesson(requestedLesson || "all");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const cacheKey = [
      selectedSubject,
      selectedLesson,
      selectedDifficulty,
    ].join(":");
    const cachedQuestions = questionCache.get(cacheKey);

    if (cachedQuestions) {
      setQuestionBank(cachedQuestions);
      setIsQuestionBankLoading(false);
      return () => controller.abort();
    }

    setIsQuestionBankLoading(true);
    setPracticeError(null);

    const parameters = new URLSearchParams({
      subject: selectedSubject,
      lesson: selectedLesson,
      difficulty: selectedDifficulty,
    });

    void fetch(`/api/quiz/questions?${parameters}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json()) as {
          questions?: QuizQuestion[];
          error?: string;
        };

        if (!response.ok || !body.questions) {
          throw new Error(body.error ?? "Quiz questions could not be loaded.");
        }

        questionCache.set(cacheKey, body.questions);
        setQuestionBank(body.questions);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setQuestionBank([]);
        setPracticeError(
          error instanceof Error
            ? error.message
            : "Quiz questions could not be loaded.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsQuestionBankLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedDifficulty, selectedLesson, selectedSubject]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const timer = window.setInterval(
      () => setElapsedSeconds((seconds) => seconds + 1),
      1000,
    );

    return () => window.clearInterval(timer);
  }, [status]);

  function changeSubject(subjectName: string) {
    setSelectedSubject(subjectName);
    setSelectedLesson("all");
    setStatus("setup");
  }

  function startQuiz() {
    if (availableQuestions.length === 0) {
      return;
    }

    setActiveQuestions(shuffleQuestions(availableQuestions));
    setCurrentQuestionIndex(0);
    setAnswers({});
    setElapsedSeconds(0);
    setLastAttempt(null);
    setStatus("active");
  }

  function answerQuestion(answer: string) {
    if (!currentQuestion || hasAnswered) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: answer,
    }));
  }

  function finishQuiz() {
    const score = activeQuestions.reduce(
      (total, question) =>
        total + (answers[question.id] === question.correctAnswer ? 1 : 0),
      0,
    );
    const xp = score * 25;
    const attempt: QuizAttempt = {
      id: `quiz-attempt-${Date.now()}`,
      subject: selectedSubject,
      lesson:
        selectedLesson === "all" ? "All lessons" : selectedLessonTitle,
      difficulty:
        selectedDifficulty === "all" ? "mixed" : selectedDifficulty,
      score,
      totalQuestions: activeQuestions.length,
      durationSeconds: elapsedSeconds,
      completedAt: new Date().toISOString(),
    };

    recordAttempt(attempt);
    recordQuizActivity(
      `${selectedSubject} quiz`,
      `${score} of ${activeQuestions.length} correct`,
      xp,
    );
    setLastAttempt(attempt);
    setStatus("completed");
  }

  function continueQuiz() {
    if (!hasAnswered) {
      return;
    }

    if (isLastQuestion) {
      finishQuiz();
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  }

  function resetQuiz() {
    setStatus("setup");
    setActiveQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setElapsedSeconds(0);
    setLastAttempt(null);
  }

  async function generateAiPractice() {
    setIsGeneratingPractice(true);
    setPracticeError(null);

    try {
      const difficulty =
        selectedDifficulty === "all" ? "medium" : selectedDifficulty;
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: selectedSubject,
          lesson: selectedLessonTitle,
          lessonId: selectedLesson,
          difficulty,
        }),
      });
      const body = (await response.json()) as {
        questions?: QuizQuestion[];
        error?: string;
      };

      if (!response.ok || !body.questions?.length) {
        throw new Error(
          body.error ?? "Gemini could not generate practice questions.",
        );
      }

      setActiveQuestions(body.questions);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setElapsedSeconds(0);
      setLastAttempt(null);
      setSelectedDifficulty(difficulty);
      setStatus("active");
    } catch (error) {
      setPracticeError(
        error instanceof Error
          ? error.message
          : "Gemini could not generate practice questions.",
      );
    } finally {
      setIsGeneratingPractice(false);
    }
  }

  const lastScorePercentage = lastAttempt
    ? Math.round((lastAttempt.score / lastAttempt.totalQuestions) * 100)
    : 0;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Knowledge check"
        title="Quiz Arena"
        description={`Build a focused challenge from ${isQuestionBankLoading ? "loading" : questionBank.length} matching questions or generate a fresh Gemini practice set.`}
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/[0.07] dark:text-amber-300">
            <Zap className="size-3.5" aria-hidden="true" />
            25 XP per correct answer
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[310px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                Build your quiz
              </h2>
              <p className="mt-1 text-[10px] text-slate-400">
                Subject, lesson, and difficulty
              </p>
            </div>
            <Target className="size-4 text-cyan-500" aria-hidden="true" />
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Subject
              </span>
              <select
                value={selectedSubject}
                onChange={(event) => changeSubject(event.target.value)}
                disabled={status === "active"}
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-[#111720]"
              >
                {subjectsMeta.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Lesson
              </span>
              <select
                value={selectedLesson}
                onChange={(event) => {
                  setSelectedLesson(event.target.value);
                  setStatus("setup");
                }}
                disabled={status === "active"}
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-[#111720]"
              >
                <option value="all">All lessons</option>
                {subject.lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Difficulty
              </span>
              <select
                value={selectedDifficulty}
                onChange={(event) => {
                  setSelectedDifficulty(
                    event.target.value as QuizDifficulty | "all",
                  );
                  setStatus("setup");
                }}
                disabled={status === "active"}
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-[#111720]"
              >
                <option value="all">Mixed difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Matching questions</span>
              <span className="font-bold text-slate-950 dark:text-white">
                {isQuestionBankLoading ? "..." : availableQuestions.length}
              </span>
            </div>
            <p className="mt-2 text-[10px] leading-5 text-slate-400">
              Each round uses up to 10 shuffled questions.
            </p>
          </div>

          {status !== "active" ? (
            <button
              type="button"
              onClick={startQuiz}
              disabled={
                isQuestionBankLoading || availableQuestions.length === 0
              }
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-white/[0.06] dark:disabled:text-slate-600"
            >
              <Trophy className="size-4" aria-hidden="true" />
              Start quiz
            </button>
          ) : null}
          {status !== "active" ? (
            <button
              type="button"
              onClick={() => void generateAiPractice()}
              disabled={isGeneratingPractice}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 text-xs font-bold text-violet-700 transition hover:bg-violet-100 disabled:opacity-50 dark:border-violet-400/20 dark:bg-violet-400/[0.07] dark:text-violet-300"
            >
              {isGeneratingPractice ? (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <WandSparkles className="size-4" aria-hidden="true" />
              )}
              Generate AI practice
            </button>
          ) : null}
          {practiceError ? (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[10px] leading-5 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/[0.07] dark:text-rose-300"
            >
              {practiceError}
            </p>
          ) : null}
        </aside>

        <div className="min-h-[620px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
          {status === "setup" ? (
            <div className="flex min-h-[620px] items-center justify-center p-7 text-center">
              <div className="max-w-lg">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <CircleHelp className="size-7" aria-hidden="true" />
                </span>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                  {selectedSubject}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white">
                  Ready for a focused challenge?
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Select your lesson and difficulty. You will see instant
                  feedback after each answer, while the timer tracks your pace.
                </p>
                {availableQuestions.length === 0 ? (
                  <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/[0.07] dark:text-amber-300">
                    No questions match this exact combination. Choose mixed
                    difficulty or all lessons.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {status === "active" && currentQuestion ? (
            <div className="flex min-h-[620px] flex-col">
              <div className="border-b border-slate-200/80 px-5 py-4 dark:border-white/[0.08] sm:px-7">
                <div className="flex items-center justify-between gap-4 text-[10px] font-semibold">
                  <span className="text-slate-500">
                    Question {currentQuestionIndex + 1} of{" "}
                    {activeQuestions.length}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-mono text-slate-700 dark:bg-white/[0.06] dark:text-slate-300">
                    <Clock3 className="size-3" aria-hidden="true" />
                    {formatTimer(elapsedSeconds)}
                  </span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all"
                    style={{
                      width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 p-5 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${difficultyStyles[currentQuestion.difficulty]}`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {currentQuestion.lesson}
                  </span>
                </div>
                <h2 className="text-balance mt-5 max-w-3xl text-xl font-bold leading-8 tracking-[-0.025em] text-slate-950 dark:text-white sm:text-2xl">
                  {currentQuestion.question}
                </h2>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswer === option;
                    const isAnswer = currentQuestion.correctAnswer === option;
                    let optionStyle =
                      "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/30 dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-cyan-400/30 dark:hover:bg-cyan-400/[0.04]";

                    if (hasAnswered && isAnswer) {
                      optionStyle =
                        "border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-400/35 dark:bg-emerald-400/[0.08] dark:text-emerald-100";
                    } else if (hasAnswered && isSelected) {
                      optionStyle =
                        "border-rose-400 bg-rose-50 text-rose-950 dark:border-rose-400/35 dark:bg-rose-400/[0.08] dark:text-rose-100";
                    } else if (hasAnswered) {
                      optionStyle =
                        "border-slate-200 bg-slate-50 opacity-50 dark:border-white/[0.06] dark:bg-white/[0.01]";
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => answerQuestion(option)}
                        disabled={hasAnswered}
                        className={`flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition ${optionStyle}`}
                      >
                        <span
                          className={`grid size-7 shrink-0 place-items-center rounded-lg border text-[10px] font-bold ${
                            hasAnswered && isAnswer
                              ? "border-emerald-400 bg-emerald-500 text-white"
                              : hasAnswered && isSelected
                                ? "border-rose-400 bg-rose-500 text-white"
                                : "border-slate-200 text-slate-400 dark:border-white/10"
                          }`}
                        >
                          {hasAnswered && isAnswer ? (
                            <Check
                              className="size-3.5"
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          ) : hasAnswered && isSelected ? (
                            <X
                              className="size-3.5"
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          ) : (
                            optionLetters[optionIndex]
                          )}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered ? (
                  <div
                    className={`mt-6 rounded-xl border p-4 ${
                      isCorrect
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/[0.06]"
                        : "border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/[0.06]"
                    }`}
                  >
                    <div className="flex gap-3">
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-xl text-white ${
                          isCorrect ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2
                            className="size-4"
                            aria-hidden="true"
                          />
                        ) : (
                          <CircleHelp
                            className="size-4"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-950 dark:text-white">
                          {isCorrect
                            ? "Exactly right"
                            : `Correct answer: ${currentQuestion.correctAnswer}`}
                        </p>
                        <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/80 px-5 py-4 dark:border-white/[0.08] sm:px-7">
                <span className="text-[10px] text-slate-400">
                  {hasAnswered
                    ? isCorrect
                      ? "+25 XP when the quiz is completed"
                      : "Review the explanation"
                    : "Choose the best answer"}
                </span>
                <button
                  type="button"
                  onClick={continueQuiz}
                  disabled={!hasAnswered}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100 dark:disabled:bg-white/[0.06] dark:disabled:text-slate-600"
                >
                  {isLastQuestion ? "Finish quiz" : "Next question"}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : null}

          {status === "completed" && lastAttempt ? (
            <div className="flex min-h-[620px] items-center justify-center p-6 sm:p-10">
              <div className="w-full max-w-lg text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
                  <Trophy className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
                  Quiz complete
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white">
                  {lastScorePercentage >= 80
                    ? "Excellent work."
                    : lastScorePercentage >= 60
                      ? "Solid progress."
                      : "Keep building."}
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  You scored {lastAttempt.score} out of{" "}
                  {lastAttempt.totalQuestions} in {lastAttempt.subject}.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                    <Target
                      className="mx-auto size-4 text-violet-600 dark:text-violet-400"
                      aria-hidden="true"
                    />
                    <p className="mt-2 text-sm font-bold">
                      {lastScorePercentage}%
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">
                      accuracy
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                    <Clock3
                      className="mx-auto size-4 text-amber-600 dark:text-amber-400"
                      aria-hidden="true"
                    />
                    <p className="mt-2 text-sm font-bold">
                      {formatTimer(lastAttempt.durationSeconds)}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">
                      time
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                    <Sparkles
                      className="mx-auto size-4 text-cyan-600 dark:text-cyan-400"
                      aria-hidden="true"
                    />
                    <p className="mt-2 text-sm font-bold">
                      +{lastAttempt.score * 25}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">
                      XP
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetQuiz}
                  className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Build another quiz
                </button>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {selectedLesson !== "all" ? (
                    <Link
                      href={`/lessons/${selectedLesson}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition hover:border-cyan-300 dark:border-white/[0.08] dark:text-slate-300"
                    >
                      Review lesson
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  ) : null}
                  <Link
                    href={`/tutor?subject=${encodeURIComponent(selectedSubject)}${
                      selectedLesson !== "all"
                        ? `&lesson=${encodeURIComponent(selectedLessonTitle)}`
                        : ""
                    }`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 text-xs font-bold text-violet-700 transition hover:bg-violet-50 dark:border-violet-400/20 dark:text-violet-300 dark:hover:bg-violet-400/[0.06]"
                  >
                    Ask AI Tutor
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Quiz history
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Completed attempts saved in this browser
            </p>
          </div>
          <History className="size-5 text-slate-400" aria-hidden="true" />
        </div>

        {attempts.length > 0 ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:border-white/[0.08]">
                  <th className="pb-3">Quiz</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Completed</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 10).map((attempt) => (
                  <tr
                    key={attempt.id}
                    className="border-b border-slate-100 text-xs last:border-0 dark:border-white/[0.05]"
                  >
                    <td className="py-4">
                      <p className="font-bold text-slate-950 dark:text-white">
                        {attempt.subject}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {attempt.lesson}
                      </p>
                    </td>
                    <td className="py-4 capitalize text-slate-500">
                      {attempt.difficulty}
                    </td>
                    <td className="py-4 font-semibold">
                      {attempt.score}/{attempt.totalQuestions}
                    </td>
                    <td className="py-4 font-semibold text-cyan-700 dark:text-cyan-400">
                      {Math.round(
                        (attempt.score / attempt.totalQuestions) * 100,
                      )}
                      %
                    </td>
                    <td className="py-4 text-slate-500">
                      {formatTimer(attempt.durationSeconds)}
                    </td>
                    <td className="py-4 text-slate-500">
                      {formatAttemptDate(attempt.completedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-white/[0.12]">
            <Trophy
              className="mx-auto size-5 text-slate-400"
              aria-hidden="true"
            />
            <p className="mt-3 text-xs font-semibold text-slate-500">
              Complete your first quiz to start a history.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
