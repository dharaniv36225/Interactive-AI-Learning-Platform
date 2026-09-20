"use client";

import type { LucideIcon } from "lucide-react";

type ToggleRowProps = {
  title: string;
  description: string;
  enabled: boolean;
  icon: LucideIcon;
  onToggle: () => void;
};

export function ToggleRow({ title, description, enabled, icon: Icon, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
      <div className="flex min-w-0 items-start gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          enabled ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-700"
        }`}
        aria-pressed={enabled}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
