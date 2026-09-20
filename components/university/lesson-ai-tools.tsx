"use client";

import { BrainCircuit, LoaderCircle, Mic2, Presentation, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { AiStudyNotes } from "@/components/ai-study-notes";
import type { BtechLesson } from "@/lib/btech-lessons";
import type { TutorApiResponse } from "@/types";

type LessonAiToolsProps = {
  lesson: BtechLesson;
};

export function LessonAiTools({ lesson }: LessonAiToolsProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [whiteboardStep, setWhiteboardStep] = useState(0);
  const whiteboardSteps = useMemo(
    () => [
      `Define ${lesson.title}`,
      "Map inputs, constraints, and outputs",
      `Run the ${lesson.subject} lab`,
      "Finish quiz, coding practice, and revision",
    ],
    [lesson.subject, lesson.title],
  );

  async function askHighlightedText() {
    const selectedText = window.getSelection()?.toString().trim();
    const prompt = selectedText
      ? `Explain this highlighted text from ${lesson.subject}: ${selectedText}. Use clean study-note sections, beginner-friendly language, a real-world example, practical application, and a short summary. Do not use Markdown symbols.`
      : `Explain ${lesson.title} from ${lesson.subject}. Use clean study-note sections with Introduction, Key Concepts, Step by step explanation, Formula explanation, Real-world example, Practical applications, Interview tips, and Summary. Do not use Markdown symbols.`;

    setIsAsking(true);
    setAnswer(null);
    setError(null);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const body = (await response.json()) as TutorApiResponse | { error?: string };

      if (!response.ok || !("message" in body)) {
        throw new Error("error" in body && body.error ? body.error : "AI explanation failed.");
      }

      setAnswer(body.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "AI explanation failed.");
    } finally {
      setIsAsking(false);
    }
  }

  function readLessonAloud() {
    if (!("speechSynthesis" in window)) {
      setError("Speech synthesis is not available in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${lesson.title}. ${lesson.detailedExplanation}. Key points: ${lesson.keyPoints.join(", ")}.`,
    );
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-400/20 dark:bg-violet-400/[0.06]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
            AI lesson tools
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
            Doubt solver, voice teacher, whiteboard, and avatar
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void askHighlightedText()}
            disabled={isAsking}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white transition hover:bg-violet-500 disabled:opacity-60"
          >
            {isAsking ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <BrainCircuit className="size-3.5" aria-hidden="true" />}
            Ask highlighted text
          </button>
          <button
            type="button"
            onClick={readLessonAloud}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 text-xs font-bold text-violet-700 transition hover:bg-violet-50 dark:border-violet-400/20 dark:bg-white/[0.04] dark:text-violet-300"
          >
            <Mic2 className="size-3.5" aria-hidden="true" />
            Voice Teacher
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border border-violet-200 bg-white p-4 dark:border-white/[0.08] dark:bg-[#0e131b]">
          <div className="flex items-center gap-2">
            <Presentation className="size-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
            <p className="text-xs font-bold text-slate-950 dark:text-white">
              AI Whiteboard Teacher
            </p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {whiteboardSteps.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => setWhiteboardStep(index)}
                className={`rounded-xl border p-3 text-left text-xs font-semibold ${
                  whiteboardStep === index
                    ? "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-400/30 dark:bg-violet-400/[0.08] dark:text-violet-100"
                    : "border-slate-200 text-slate-500 dark:border-white/[0.08]"
                }`}
              >
                Step {index + 1}
                <span className="mt-1 block font-normal">{step}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-cyan-400 text-slate-950">
              <UserRound className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold">AI Avatar Teacher</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Ready to explain {lesson.title}.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-300">
            Today I would start with the visual model, run the lab once, then solve two quiz questions before coding.
          </p>
        </div>
      </div>

      {answer || error ? (
        <div className="mt-5 rounded-xl border border-violet-200 bg-white p-4 text-sm leading-6 text-slate-700 dark:border-white/[0.08] dark:bg-[#0e131b] dark:text-slate-200">
          <AiStudyNotes text={error ?? answer ?? ""} tone={error ? "error" : "default"} />
        </div>
      ) : null}
    </section>
  );
}

export default LessonAiTools;
