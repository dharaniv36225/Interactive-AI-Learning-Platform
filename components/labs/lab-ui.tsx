"use client";

import type { ReactNode } from "react";

export function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-white/[0.025]">
      <span className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
        <span className="text-sm normal-case tracking-normal text-slate-950 dark:text-white">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-cyan-500"
      />
    </label>
  );
}

const metricTones = {
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-400/20 dark:bg-cyan-400/[0.07] dark:text-cyan-100",
  violet:
    "border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-400/20 dark:bg-violet-400/[0.07] dark:text-violet-100",
  emerald:
    "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07] dark:text-emerald-100",
  amber:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/[0.07] dark:text-amber-100",
  rose: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-400/20 dark:bg-rose-400/[0.07] dark:text-rose-100",
};

export function Metric({
  label,
  value,
  detail,
  tone = "cyan",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: keyof typeof metricTones;
}) {
  return (
    <div className={`rounded-xl border p-3 ${metricTones[tone]}`}>
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] opacity-65">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tracking-[-0.03em]">{value}</p>
      {detail ? <p className="mt-1 text-[10px] opacity-70">{detail}</p> : null}
    </div>
  );
}

export function LabCanvas({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative min-h-[360px] overflow-hidden rounded-2xl border border-slate-800 bg-[#071019] ${className}`}
    >
      <div className="physics-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative min-h-[360px]">{children}</div>
    </div>
  );
}

export function SegmentedControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-3 py-2 text-[10px] font-bold transition ${
              value === option.value
                ? "border-cyan-400 bg-cyan-500 text-slate-950"
                : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
