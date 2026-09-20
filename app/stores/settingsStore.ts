"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings, ThemePreference } from "@/types";

const initialSettings: Settings = {
  theme: "dark",
  voiceEnabled: true,
  notificationsEnabled: true,
};

type SettingsStore = {
  settings: Settings;
  setTheme: (theme: ThemePreference) => void;
  toggleVoice: () => void;
  toggleNotifications: () => void;
  resetSettings: () => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: initialSettings,
      setTheme: (theme) =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme,
          },
        })),
      toggleVoice: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            voiceEnabled: !state.settings.voiceEnabled,
          },
        })),
      toggleNotifications: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            notificationsEnabled: !state.settings.notificationsEnabled,
          },
        })),
      resetSettings: () => set({ settings: initialSettings }),
    }),
    {
      name: "ai-physics-settings-store",
      skipHydration: true,
    },
  ),
);
