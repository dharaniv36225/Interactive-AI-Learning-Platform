"use client";

import { Bell, Mic, Moon, RotateCcw, Sun } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { PageHeader } from "@/components/page-header";
import { ToggleRow } from "@/components/toggle-row";
import { useSettingsStore } from "@/stores/settingsStore";
import type { ThemePreference } from "@/types";

const themes: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export default function SettingsPage() {
  const {
    settings,
    setTheme,
    toggleVoice,
    toggleNotifications,
    resetSettings,
  } = useSettingsStore(
    useShallow((state) => ({
      settings: state.settings,
      setTheme: state.setTheme,
      toggleVoice: state.toggleVoice,
      toggleNotifications: state.toggleNotifications,
      resetSettings: state.resetSettings,
    })),
  );

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Shape the interface and learning experience around how you focus best."
        actions={
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-white/[0.09] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Restore defaults
          </button>
        }
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
        <div className="border-b border-slate-200/80 px-5 py-5 dark:border-white/[0.08] sm:px-6">
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">Appearance</h2>
          <p className="mt-1 text-xs text-slate-500">Choose the visual environment for your study sessions.</p>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isSelected = settings.theme === theme.value;

            return (
              <button
                key={theme.value}
                type="button"
                onClick={() => setTheme(theme.value)}
                className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-50/50 ring-1 ring-cyan-500 dark:bg-cyan-400/[0.06]"
                    : "border-slate-200 hover:border-slate-300 dark:border-white/[0.08] dark:hover:border-white/[0.14]"
                }`}
                aria-pressed={isSelected}
              >
                <div className={`h-24 rounded-xl border p-3 ${theme.value === "dark" ? "border-white/10 bg-[#080b10]" : "border-slate-200 bg-slate-50"}`}>
                  <div className={`h-3 w-12 rounded ${theme.value === "dark" ? "bg-white/10" : "bg-slate-200"}`} />
                  <div className="mt-3 grid grid-cols-[1fr_2fr] gap-2">
                    <div className={`h-12 rounded ${theme.value === "dark" ? "bg-white/[0.06]" : "bg-white"}`} />
                    <div className={`h-12 rounded ${theme.value === "dark" ? "bg-white/[0.08]" : "bg-white"}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Icon className={`size-4 ${isSelected ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"}`} aria-hidden="true" />
                  <span className="text-sm font-semibold text-slate-950 dark:text-white">{theme.label}</span>
                  {isSelected && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">Active</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
        <div className="border-b border-slate-200/80 px-5 py-5 dark:border-white/[0.08] sm:px-6">
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">Learning experience</h2>
          <p className="mt-1 text-xs text-slate-500">Control how the tutor and reminders interact with you.</p>
        </div>
        <div className="divide-y divide-slate-200/80 dark:divide-white/[0.08]">
          <ToggleRow
            title="Voice responses"
            description="Allow the AI tutor to read explanations and lab guidance aloud."
            enabled={settings.voiceEnabled}
            icon={Mic}
            onToggle={toggleVoice}
          />
          <ToggleRow
            title="Learning notifications"
            description="Receive streak reminders, quiz prompts, and personalized recommendations."
            enabled={settings.notificationsEnabled}
            icon={Bell}
            onToggle={toggleNotifications}
          />
        </div>
      </section>

      <p className="text-center text-[11px] text-slate-400 dark:text-slate-600">
        Preferences are saved locally and remain available across sessions.
      </p>
    </div>
  );
}
