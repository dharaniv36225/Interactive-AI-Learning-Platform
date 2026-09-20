"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, ChatSession } from "@/types";

const initialSession: ChatSession = {
  id: "session-physics-tutor",
  title: "Learning tutor",
  topic: "General learning",
  messages: [],
  createdAt: "2026-06-11T00:00:00.000Z",
  updatedAt: "2026-06-11T00:00:00.000Z",
};

type ChatStore = {
  sessions: ChatSession[];
  activeSessionId: string;
  setActiveSession: (sessionId: string) => void;
  addMessage: (message: ChatMessage, sessionId?: string) => void;
  clearConversation: (sessionId?: string) => void;
  createSession: () => string;
  updateSessionTitle: (sessionId: string, title: string) => void;
};

const initialChatState = {
  sessions: [initialSession],
  activeSessionId: initialSession.id,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      ...initialChatState,
      setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
      addMessage: (message, sessionId) =>
        set((state) => {
          const targetSessionId = sessionId ?? state.activeSessionId;

          return {
            sessions: state.sessions.map((session) =>
              session.id === targetSessionId
                ? {
                    ...session,
                    messages: [...session.messages, message],
                    updatedAt: message.createdAt,
                  }
                : session,
            ),
          };
        }),
      clearConversation: (sessionId) =>
        set((state) => {
          const targetSessionId = sessionId ?? state.activeSessionId;
          const updatedAt = new Date().toISOString();

          return {
            sessions: state.sessions.map((session) =>
              session.id === targetSessionId
                ? {
                    ...session,
                    title: "Learning tutor",
                    topic: "General learning",
                    messages: [],
                    updatedAt,
                  }
                : session,
            ),
          };
        }),
      createSession: () => {
        const timestamp = Date.now();
        const id = `session-${timestamp}`;
        const createdAt = new Date(timestamp).toISOString();
        const session: ChatSession = {
          id,
          title: "New learning session",
          topic: "General learning",
          messages: [],
          createdAt,
          updatedAt: createdAt,
        };

        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
        }));

        return id;
      },
      updateSessionTitle: (sessionId, title) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  title: title.trim().slice(0, 48) || session.title,
                }
              : session,
          ),
        })),
    }),
    {
      name: "ai-physics-chat-store",
      skipHydration: true,
      version: 2,
      migrate: () => initialChatState,
    },
  ),
);
