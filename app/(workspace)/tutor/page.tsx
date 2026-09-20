"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  AlertCircle,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  Clipboard,
  LoaderCircle,
  Mic,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Trash2,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { formatUtcTime } from "@/lib/format";
import { useChatStore } from "@/stores/chatStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserStore } from "@/stores/userStore";
import type {
  ChatMessage,
  ChatSession,
  TutorApiError,
  TutorApiResponse,
  TutorRequestMessage,
} from "@/types";
import { AiStudyNotes, cleanAiResponseText } from "@/components/ai-study-notes";

const GeminiStatus = dynamic(
  () =>
    import("@/components/GeminiStatus").then((module) => module.GeminiStatus),
  {
    loading: () => (
      <div className="h-14 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
    ),
  },
);

const XP_PER_QUESTION = 10;
const MAX_MESSAGE_LENGTH = 4_000;

const suggestedQuestions = [
  "Explain gravity",
  "What is photosynthesis",
  "How do neural networks learn",
  "Explain compound interest",
  "What is an algorithm",
];

const emptySession: ChatSession = {
  id: "empty-session",
  title: "Learning tutor",
  topic: "General learning",
  messages: [],
  createdAt: "2026-06-11T00:00:00.000Z",
  updatedAt: "2026-06-11T00:00:00.000Z",
};

type RetryState = {
  messages: TutorRequestMessage[];
  sessionId: string;
};

function getApiErrorMessage(value: unknown) {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return null;
  }

  const error = (value as TutorApiError).error;
  return typeof error === "string" && error.trim() ? error : null;
}

function getApiResponse(value: unknown): TutorApiResponse | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("message" in value) ||
    !("model" in value)
  ) {
    return null;
  }

  const response = value as TutorApiResponse;

  return typeof response.message === "string" &&
    response.message.trim() &&
    typeof response.model === "string"
    ? response
    : null;
}

function toRequestMessages(messages: ChatMessage[]): TutorRequestMessage[] {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role === "user" ? ("user" as const) : ("assistant" as const),
      content: message.content,
    }));
}

function getSessionTitle(question: string) {
  const normalized = question.replace(/\s+/g, " ").trim();
  return normalized.length > 46 ? `${normalized.slice(0, 43)}...` : normalized;
}

function getSpeechRecognitionError(error: string) {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was denied. Allow microphone access in your browser and try again.";
    case "no-speech":
      return "No speech was detected. Try speaking again.";
    case "audio-capture":
      return "No microphone is available.";
    case "network":
      return "Voice recognition could not reach the browser speech service.";
    default:
      return "Voice recognition stopped unexpectedly. Please try again.";
  }
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
}

export default function TutorPage() {
  const [inputValue, setInputValue] = useState("");
  const [respondingSessionId, setRespondingSessionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryState, setRetryState] = useState<RetryState | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const {
    sessions,
    activeSessionId,
    setActiveSession,
    addMessage,
    clearConversation,
    createSession,
    updateSessionTitle,
  } = useChatStore(
    useShallow((state) => ({
      sessions: state.sessions,
      activeSessionId: state.activeSessionId,
      setActiveSession: state.setActiveSession,
      addMessage: state.addMessage,
      clearConversation: state.clearConversation,
      createSession: state.createSession,
      updateSessionTitle: state.updateSessionTitle,
    })),
  );
  const recordTutorQuestion = useUserStore((state) => state.recordTutorQuestion);
  const tutorSessionCount = useUserStore((state) => state.user.tutorSessionCount);
  const voiceEnabled = useSettingsStore((state) => state.settings.voiceEnabled);
  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? sessions[0] ?? emptySession;
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceBaseDraftRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResponding = respondingSessionId !== null;
  const isActiveSessionResponding = respondingSessionId === activeSession.id;

  useEffect(() => {
    void useChatStore.persist.rehydrate();

    const parameters = new URLSearchParams(window.location.search);
    const subject = parameters.get("subject")?.trim();
    const lesson = parameters.get("lesson")?.trim();
    const lab = parameters.get("lab")?.trim();
    const context = [
      subject ? `in ${subject}` : "",
      lesson ? `for the lesson "${lesson}"` : "",
      lab ? `for the lab "${lab}"` : "",
    ]
      .filter(Boolean)
      .join(" ");

    if (context) {
      setInputValue(`Help me understand this topic ${context}.`);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeSession.messages, isActiveSessionResponding]);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();

      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    },
    [],
  );

  async function requestGemini(messages: TutorRequestMessage[], sessionId: string) {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setRespondingSessionId(sessionId);
    setErrorMessage(null);
    setRetryState(null);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });

      const responseBody: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getApiErrorMessage(responseBody) ?? "Gemini could not complete the request.");
      }

      const tutorResponse = getApiResponse(responseBody);

      if (!tutorResponse) {
        throw new Error("Gemini returned an invalid response.");
      }

      const assistantMessage: ChatMessage = {
        id: `message-assistant-${Date.now()}`,
        role: "assistant",
        content: tutorResponse.message.trim(),
        createdAt: new Date().toISOString(),
      };

      addMessage(assistantMessage, sessionId);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      const friendlyMessage =
        error instanceof TypeError
          ? "The tutor service could not be reached. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Gemini could not complete the request.";
      setErrorMessage(friendlyMessage);
      setRetryState({ messages, sessionId });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setRespondingSessionId(null);
      }
    }
  }

  function submitMessage(content: string) {
    const trimmedContent = content.trim();

    if (!trimmedContent || isResponding || activeSession.id === emptySession.id) {
      return;
    }

    const targetSessionId = activeSession.id;
    const userMessage: ChatMessage = {
      id: `message-user-${Date.now()}`,
      role: "user",
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };
    const requestMessages = [
      ...toRequestMessages(activeSession.messages),
      { role: "user" as const, content: trimmedContent },
    ];

    addMessage(userMessage, targetSessionId);

    if (activeSession.messages.length === 0) {
      updateSessionTitle(targetSessionId, getSessionTitle(trimmedContent));
    }

    recordTutorQuestion(trimmedContent);
    setInputValue("");
    void requestGemini(requestMessages, targetSessionId);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage(inputValue);
  }

  function handleNewConversation() {
    abortControllerRef.current?.abort();
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    createSession();
    setInputValue("");
    setErrorMessage(null);
    setRetryState(null);
    setIsListening(false);
    setSpeakingMessageId(null);
  }

  function handleClearConversation() {
    abortControllerRef.current?.abort();
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    clearConversation(activeSession.id);
    setInputValue("");
    setErrorMessage(null);
    setRetryState(null);
    setIsListening(false);
    setSpeakingMessageId(null);
  }

  async function handleCopyMessage(message: ChatMessage) {
    try {
      await copyToClipboard(
        message.role === "assistant"
          ? cleanAiResponseText(message.content)
          : message.content,
      );
      setCopiedMessageId(message.id);
      setErrorMessage(null);

      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }

      copyResetTimerRef.current = setTimeout(() => setCopiedMessageId(null), 1_800);
    } catch {
      setErrorMessage("The response could not be copied to the clipboard.");
    }
  }

  function speakMessage(message: ChatMessage) {
    if (!voiceEnabled) {
      setErrorMessage("Enable voice responses in Settings to use text-to-speech.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      setErrorMessage("Text-to-speech is not supported by this browser.");
      return;
    }

    if (speakingMessageId === message.id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      cleanAiResponseText(message.content),
    );
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => {
      setSpeakingMessageId(null);
      setErrorMessage("The browser could not read this response aloud.");
    };
    setErrorMessage(null);
    setSpeakingMessageId(message.id);
    window.speechSynthesis.speak(utterance);
  }

  function startVoiceInput() {
    if (!voiceEnabled) {
      setErrorMessage("Enable voice responses in Settings to use voice input.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognitionApi = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      setErrorMessage("Voice input is not supported by this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    voiceBaseDraftRef.current = inputValue.trim();

    recognition.onresult = (event) => {
      let transcript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0]?.transcript ?? "";
      }

      const base = voiceBaseDraftRef.current;
      setInputValue(`${base}${base && transcript ? " " : ""}${transcript}`.trim());
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      setErrorMessage(getSpeechRecognitionError(event.error));
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setErrorMessage(null);
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setErrorMessage("Voice input could not be started. Please try again.");
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Gemini powered"
        title="AI Learning Tutor"
        description="Ask a question from any subject and continue with a tutor that remembers the conversation context."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400">
              {tutorSessionCount} sessions
            </span>
          </div>
        }
      />

      <GeminiStatus />

      <section className="grid min-h-[700px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] lg:grid-cols-[265px_1fr]">
        <aside className="border-b border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.018] lg:border-b-0 lg:border-r">
          <button
            type="button"
            onClick={handleNewConversation}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100"
          >
            <Plus className="size-4" aria-hidden="true" />
            New conversation
          </button>

          <p className="mb-2 mt-6 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Recent sessions
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:max-h-[390px] lg:overflow-y-auto">
            {sessions.map((session) => {
              const isActive = session.id === activeSession.id;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => {
                    setActiveSession(session.id);
                    setErrorMessage(null);
                    setRetryState(null);
                  }}
                  className={`min-w-52 rounded-xl border px-3 py-3 text-left transition lg:min-w-0 ${
                    isActive
                      ? "border-slate-200 bg-white shadow-sm dark:border-white/[0.09] dark:bg-white/[0.05]"
                      : "border-transparent hover:bg-white/80 dark:hover:bg-white/[0.025]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-xs font-semibold ${
                        isActive ? "text-slate-950 dark:text-white" : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {session.title}
                    </span>
                    <ChevronRight
                      className={`size-3.5 shrink-0 ${
                        isActive ? "text-cyan-500" : "text-slate-300 dark:text-slate-700"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="mt-1.5 block text-[10px] text-slate-400">
                    {session.messages.length} messages
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 hidden rounded-xl border border-violet-200 bg-violet-50 p-4 lg:block dark:border-violet-400/15 dark:bg-violet-400/[0.05]">
            <Sparkles className="size-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
            <p className="mt-3 text-xs font-bold text-violet-950 dark:text-violet-100">Earn as you learn</p>
            <p className="mt-1.5 text-[10px] leading-5 text-violet-700/80 dark:text-violet-300/70">
              Every question adds {XP_PER_QUESTION} XP to your persisted profile.
            </p>
          </div>
        </aside>

        <div className="flex min-h-[580px] min-w-0 flex-col">
          <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3.5 dark:border-white/[0.08] sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                <BrainCircuit className="size-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xs font-bold text-slate-950 dark:text-white">{activeSession.title}</h2>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Conversation memory enabled · {activeSession.messages.length} messages
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearConversation}
              disabled={activeSession.messages.length === 0 && !isActiveSessionResponding}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-semibold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
              aria-label="Clear conversation"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {activeSession.messages.length === 0 && !isActiveSessionResponding ? (
              <div className="mx-auto flex min-h-[390px] max-w-xl flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <Bot className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
                  What would you like to understand?
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Ask Gemini about a concept, equation, experiment, or problem-solving approach.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => submitMessage(question)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-slate-400 dark:hover:border-cyan-400/30 dark:hover:bg-cyan-400/[0.06] dark:hover:text-cyan-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {activeSession.messages.map((message) => {
                  const isUser = message.role === "user";

                  return (
                    <div key={message.id} className={`group flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                      {!isUser && (
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                          <Bot className="size-4" aria-hidden="true" />
                        </span>
                      )}
                      <div className={`max-w-[84%] sm:max-w-[74%] ${isUser ? "text-right" : "text-left"}`}>
                        {isUser ? (
                          <p className="inline-block whitespace-pre-wrap rounded-2xl rounded-tr-md bg-slate-950 px-4 py-3 text-left text-sm leading-6 text-white dark:bg-white dark:text-slate-950">
                            {message.content}
                          </p>
                        ) : (
                          <div className="inline-block rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-left dark:bg-white/[0.055]">
                            <AiStudyNotes text={message.content} />
                          </div>
                        )}
                        <div
                          className={`mt-1.5 flex items-center gap-1 px-1 ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <p className="mr-1 text-[9px] text-slate-400">
                            {isUser ? "You" : "Gemini"} ·{" "}
                            <time dateTime={message.createdAt}>{formatUtcTime(message.createdAt)}</time>
                          </p>
                          {!isUser && (
                            <>
                              <button
                                type="button"
                                onClick={() => void handleCopyMessage(message)}
                                className="grid size-6 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
                                aria-label="Copy response"
                                title="Copy response"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="size-3 text-emerald-500" aria-hidden="true" />
                                ) : (
                                  <Clipboard className="size-3" aria-hidden="true" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => speakMessage(message)}
                                className={`grid size-6 place-items-center rounded-md transition hover:bg-slate-100 dark:hover:bg-white/[0.06] ${
                                  speakingMessageId === message.id
                                    ? "text-cyan-600 dark:text-cyan-300"
                                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                                aria-label={
                                  speakingMessageId === message.id ? "Stop reading response" : "Read response aloud"
                                }
                                title={speakingMessageId === message.id ? "Stop reading" : "Read aloud"}
                              >
                                {speakingMessageId === message.id ? (
                                  <Square className="size-2.5 fill-current" aria-hidden="true" />
                                ) : (
                                  <Volume2 className="size-3" aria-hidden="true" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {isUser && (
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                          <UserRound className="size-4" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                  );
                })}

                {isActiveSessionResponding && (
                  <div className="flex gap-3" role="status" aria-label="Gemini is typing">
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                      <Bot className="size-4" aria-hidden="true" />
                    </span>
                    <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3.5 dark:bg-white/[0.055]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-slate-500">Gemini is thinking</span>
                        <span className="flex items-center gap-1">
                          {[0, 1, 2].map((dot) => (
                            <span
                              key={dot}
                              className="size-1.5 animate-pulse rounded-full bg-cyan-500"
                              style={{ animationDelay: `${dot * 140}ms` }}
                            />
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {errorMessage && (
              <div
                className="mx-auto mt-5 flex max-w-2xl items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-400/20 dark:bg-rose-400/[0.07] dark:text-rose-100"
                role="alert"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-500" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">Tutor request failed</p>
                  <p className="mt-1 text-[11px] leading-5 text-rose-700 dark:text-rose-300/80">{errorMessage}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {retryState && (
                    <button
                      type="button"
                      onClick={() => void requestGemini(retryState.messages, retryState.sessionId)}
                      disabled={isResponding}
                      className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 text-[10px] font-bold text-white transition hover:bg-rose-700 disabled:opacity-50"
                    >
                      <RotateCcw className="size-3" aria-hidden="true" />
                      Retry
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setRetryState(null);
                    }}
                    className="grid size-7 place-items-center rounded-lg text-rose-500 transition hover:bg-rose-100 dark:hover:bg-rose-400/10"
                    aria-label="Dismiss error"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200/80 p-4 dark:border-white/[0.08] sm:p-5">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => submitMessage(question)}
                  disabled={isResponding}
                  className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-500 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.08] dark:text-slate-500 dark:hover:border-cyan-400/30 dark:hover:text-cyan-300"
                >
                  {question}
                </button>
              ))}
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10 dark:border-white/[0.09] dark:bg-white/[0.025]"
            >
              <button
                type="button"
                onClick={startVoiceInput}
                disabled={isResponding}
                className={`grid size-9 shrink-0 place-items-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  isListening
                    ? "bg-rose-100 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"
                    : "text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-white/[0.05] dark:hover:text-slate-200"
                }`}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                aria-pressed={isListening}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? (
                  <Square className="size-3 fill-current" aria-hidden="true" />
                ) : (
                  <Mic className="size-4" aria-hidden="true" />
                )}
              </button>
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage(inputValue);
                  }
                }}
                className="max-h-32 min-h-9 min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600"
                placeholder={isListening ? "Listening..." : "Ask Gemini any learning question..."}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={1}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isResponding}
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-white/[0.06] dark:disabled:text-slate-600"
                aria-label={isResponding ? "Waiting for Gemini" : "Send message"}
              >
                {isResponding ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="size-4" aria-hidden="true" />
                )}
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between px-1 text-[9px] text-slate-400">
              <span>{isListening ? "Listening for your question..." : `Questions earn ${XP_PER_QUESTION} XP`}</span>
              <span>
                {inputValue.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
