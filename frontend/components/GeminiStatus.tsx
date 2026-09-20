"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  LoaderCircle,
  TerminalSquare,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { GeminiStatusResponse } from "@/types";

export function GeminiStatus() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/tutor", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Status request failed");
        }

        return (await response.json()) as GeminiStatusResponse;
      })
      .then((status) => setIsConfigured(status.configured))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setIsConfigured(false);
        }
      });

    return () => controller.abort();
  }, []);

  const isChecking = isConfigured === null;

  return (
    <>
      <div
        className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
          isConfigured
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07]"
            : "border-rose-200 bg-rose-50 dark:border-rose-400/20 dark:bg-rose-400/[0.07]"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-xl ${
              isConfigured
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {isChecking ? (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            ) : isConfigured ? (
              <CheckCircle2 className="size-4" aria-hidden="true" />
            ) : (
              <AlertTriangle className="size-4" aria-hidden="true" />
            )}
          </span>
          <div>
            <p
              className={`text-xs font-bold ${
                isConfigured
                  ? "text-emerald-900 dark:text-emerald-100"
                  : "text-rose-900 dark:text-rose-100"
              }`}
            >
              {isChecking
                ? "Checking Gemini connection"
                : isConfigured
                  ? "Gemini Connected"
                  : "Gemini API Key Missing"}
            </p>
            <p
              className={`mt-1 text-[11px] leading-5 ${
                isConfigured
                  ? "text-emerald-700 dark:text-emerald-300/80"
                  : "text-rose-700 dark:text-rose-300/80"
              }`}
            >
              {isChecking
                ? "Checking the server-side configuration."
                : isConfigured
                  ? "Live server-side Gemini responses are enabled."
                  : "Demo mode is active. Chat remains available while Gemini is configured."}
            </p>
          </div>
        </div>
        {isConfigured === false ? (
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white transition hover:bg-rose-700"
          >
            <KeyRound className="size-3.5" aria-hidden="true" />
            Setup Gemini
          </button>
        ) : null}
      </div>

      {isGuideOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsGuideOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="gemini-setup-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/[0.1] dark:bg-[#0e131b] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                  Server configuration
                </p>
                <h2
                  id="gemini-setup-title"
                  className="mt-2 text-xl font-bold tracking-[-0.03em] text-slate-950 dark:text-white"
                >
                  Setup Gemini
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/[0.06] dark:hover:text-white"
                aria-label="Close Gemini setup guide"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <ol className="mt-7 space-y-5">
              <li className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-cyan-50 text-[10px] font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  1
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-950 dark:text-white">
                    Create a key in Google AI Studio
                  </p>
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-400"
                  >
                    aistudio.google.com
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-cyan-50 text-[10px] font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  2
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-950 dark:text-white">
                    Add the server-only key to <code>.env.local</code>
                  </p>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-[11px] text-cyan-200">
                    <code>GEMINI_API_KEY=YOUR_KEY</code>
                  </pre>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-cyan-50 text-[10px] font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  3
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-950 dark:text-white">
                    Restart the development server
                  </p>
                  <pre className="mt-2 flex items-center gap-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-[11px] text-cyan-200">
                    <TerminalSquare
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <code>npm run dev</code>
                  </pre>
                </div>
              </li>
            </ol>
          </section>
        </div>
      ) : null}
    </>
  );
}

export default GeminiStatus;
