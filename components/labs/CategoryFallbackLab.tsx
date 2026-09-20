"use client";

import { memo, useEffect, useMemo, useState } from "react";

import { LabCanvas, Metric, RangeControl } from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";

function CategoryVisual({
  category,
  primary,
  secondary,
  isRunning,
  runSignal,
}: {
  category: LabRendererProps["lab"]["category"];
  primary: number;
  secondary: number;
  isRunning: boolean;
  runSignal: number;
}) {
  const bars = [0.45, 0.72, 0.58, 0.9, 0.66].map(
    (ratio, index) => Math.min(100, ratio * primary + index * secondary * 0.08),
  );

  if (category === "builder") {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-4 p-8">
        {bars.slice(0, 4).map((value, index) => (
          <div key={index} className="flex items-center gap-4">
            {index > 0 ? <span className="h-1 w-8 bg-cyan-400" /> : null}
            <div
              className="grid size-20 place-items-center rounded-xl border-2 border-violet-300 bg-violet-300/15 font-mono text-sm font-black text-violet-100"
              style={{ transform: `scale(${0.8 + value / 500})` }}
            >
              N{index + 1}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (category === "calculator") {
    const rotation = -120 + (primary / 100) * 240;
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative size-64 rounded-full border-[18px] border-slate-700 border-t-emerald-300 border-r-cyan-300">
          <span
            className="absolute left-1/2 top-1/2 h-2 w-24 origin-left rounded-full bg-amber-300"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <span className="absolute inset-x-0 bottom-12 text-center text-3xl font-black text-white">
            {(primary * secondary / 100).toFixed(1)}
          </span>
        </div>
      </div>
    );
  }

  if (category === "explorer") {
    return (
      <svg viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Interactive explorer map">
        {[65, 115, 165].map((radius) => (
          <circle key={radius} cx="300" cy="180" r={radius} fill="none" stroke="#334155" />
        ))}
        <circle cx="300" cy="180" r="28" fill="#f59e0b" />
        {bars.slice(0, 3).map((value, index) => {
          const angle = isRunning
            ? (runSignal * 0.5 + index * 2.1 + primary / 50) % (Math.PI * 2)
            : index * 2.1;
          const radius = 65 + index * 50;
          return (
            <circle
              key={index}
              cx={300 + Math.cos(angle) * radius}
              cy={180 + Math.sin(angle) * radius}
              r={10 + value / 20}
              fill={["#22d3ee", "#a78bfa", "#34d399"][index]}
            />
          );
        })}
      </svg>
    );
  }

  if (category === "planner") {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-3 p-8">
        {bars.slice(0, 4).map((value, index) => (
          <div key={index} className="flex items-center gap-3">
            {index > 0 ? <span className="text-2xl text-emerald-300">-&gt;</span> : null}
            <div className="w-24 rounded-xl border border-emerald-300/40 bg-emerald-300/10 p-4 text-center">
              <span className="text-[10px] text-slate-400">Step {index + 1}</span>
              <span className="mt-3 block text-xl font-black text-emerald-100">{Math.round(value)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (category === "simulation") {
    const points = Array.from({ length: 48 }, (_, index) => {
      const x = 35 + index * 11;
      const y = 290 - Math.sin((index / 47) * Math.PI) * primary * 2.1;
      return `${x},${y}`;
    }).join(" ");
    const progress = isRunning ? (runSignal % 8) / 7 : 0;
    return (
      <svg viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Interactive simulation curve">
        <line x1="35" y1="290" x2="565" y2="290" stroke="#64748b" strokeWidth="2" />
        <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="6" />
        <circle cx={35 + progress * 530} cy={290 - Math.sin(progress * Math.PI) * primary * 2.1} r="12" fill="#f8fafc" stroke="#a78bfa" strokeWidth="5" />
      </svg>
    );
  }

  return (
    <div className="absolute inset-0 flex items-end justify-center gap-5 p-10">
      {bars.map((value, index) => (
        <div
          key={index}
          className="w-16 rounded-t-lg bg-cyan-400 transition-all"
          style={{ height: `${Math.max(24, value * 2.4)}px`, opacity: 0.55 + index * 0.1 }}
        />
      ))}
    </div>
  );
}

function CategoryFallbackLabComponent({
  lab,
  isRunning,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [primary, setPrimary] = useState(55);
  const [secondary, setSecondary] = useState(40);

  useEffect(() => {
    setPrimary(55);
    setSecondary(40);
  }, [resetSignal]);

  const output = useMemo(
    () => (primary * (0.4 + secondary / 100)).toFixed(1),
    [primary, secondary],
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
      <LabCanvas>
        <CategoryVisual
          category={lab.category}
          primary={primary}
          secondary={secondary}
          isRunning={isRunning}
          runSignal={runSignal}
        />
      </LabCanvas>
      <aside className="space-y-3">
        <RangeControl label={lab.primaryControl} value={primary} min={0} max={100} onChange={setPrimary} />
        <RangeControl label={lab.secondaryControl} value={secondary} min={0} max={100} onChange={setSecondary} />
        <Metric label={lab.outputLabel} value={output} />
        <Metric label="Mode" value={lab.category} tone="violet" />
        {lab.formula ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300">
            {lab.formula}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

export const CategoryFallbackLab = memo(CategoryFallbackLabComponent);
