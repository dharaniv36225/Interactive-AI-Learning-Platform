"use client";

import { useEffect, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";

export function MathematicsLabs({
  lab,
  isRunning,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);
  const [shape, setShape] = useState("rectangle");
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(5);
  const [chance, setChance] = useState(50);
  const [trials, setTrials] = useState(100);
  const [successes, setSuccesses] = useState(50);
  const [angle, setAngle] = useState(35);
  const [dataset, setDataset] = useState("4, 7, 8, 8, 10, 13");

  useEffect(() => {
    setSlope(1);
    setIntercept(0);
    setShape("rectangle");
    setWidth(8);
    setHeight(5);
    setChance(50);
    setTrials(100);
    setSuccesses(50);
    setAngle(35);
    setDataset("4, 7, 8, 8, 10, 13");
  }, [resetSignal]);

  useEffect(() => {
    if (lab.id !== "probability-simulator" || !isRunning || runSignal === 0) {
      return;
    }

    let total = 0;
    for (let index = 0; index < trials; index += 1) {
      total += Math.random() * 100 < chance ? 1 : 0;
    }
    setSuccesses(total);
  }, [chance, isRunning, lab.id, runSignal, trials]);

  if (lab.id === "graph-plotter") {
    const x1 = -10;
    const x2 = 10;
    const y1 = slope * x1 + intercept;
    const y2 = slope * x2 + intercept;
    const toX = (value: number) => 300 + value * 25;
    const toY = (value: number) => 180 - value * 15;
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <svg viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Linear graph plot">
            {Array.from({ length: 11 }, (_, index) => (
              <g key={index}>
                <line x1={50 + index * 50} y1="0" x2={50 + index * 50} y2="360" stroke="#1e293b" />
                <line x1="0" y1={30 + index * 30} x2="600" y2={30 + index * 30} stroke="#1e293b" />
              </g>
            ))}
            <line x1="0" y1="180" x2="600" y2="180" stroke="#64748b" strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="360" stroke="#64748b" strokeWidth="2" />
            <line x1={toX(x1)} y1={toY(y1)} x2={toX(x2)} y2={toY(y2)} stroke="#22d3ee" strokeWidth="5" />
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Slope m" value={slope} min={-5} max={5} step={0.25} onChange={setSlope} />
          <RangeControl label="Intercept b" value={intercept} min={-10} max={10} onChange={setIntercept} />
          <Metric label="Equation" value={`y = ${slope}x ${intercept >= 0 ? "+" : "-"} ${Math.abs(intercept)}`} />
          <Metric label="At x = 5" value={`y = ${(slope * 5 + intercept).toFixed(2)}`} tone="violet" />
        </div>
      </div>
    );
  }

  if (lab.id === "geometry-explorer") {
    const area =
      shape === "rectangle"
        ? width * height
        : shape === "triangle"
          ? (width * height) / 2
          : Math.PI * (width / 2) ** 2;
    const perimeter =
      shape === "rectangle"
        ? 2 * (width + height)
        : shape === "triangle"
          ? width + 2 * Math.sqrt((width / 2) ** 2 + height ** 2)
          : Math.PI * width;
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <LabCanvas>
          <div className="absolute inset-0 grid place-items-center">
            {shape === "rectangle" ? (
              <div
                className="border-4 border-cyan-300 bg-cyan-300/15 shadow-[0_0_30px_rgba(34,211,238,.25)]"
                style={{ width: `${width * 24}px`, height: `${height * 24}px` }}
              />
            ) : shape === "triangle" ? (
              <div
                className="h-0 w-0 border-x-transparent border-b-violet-400/70"
                style={{
                  borderLeftWidth: `${width * 12}px`,
                  borderRightWidth: `${width * 12}px`,
                  borderBottomWidth: `${height * 24}px`,
                }}
              />
            ) : (
              <div
                className="rounded-full border-4 border-amber-300 bg-amber-300/15"
                style={{ width: `${width * 24}px`, height: `${width * 24}px` }}
              />
            )}
          </div>
        </LabCanvas>
        <div className="space-y-4">
          <SegmentedControl
            label="Shape"
            value={shape}
            options={[
              { value: "rectangle", label: "Rectangle" },
              { value: "triangle", label: "Triangle" },
              { value: "circle", label: "Circle" },
            ]}
            onChange={setShape}
          />
          <RangeControl label={shape === "circle" ? "Diameter" : "Width / base"} value={width} min={2} max={12} unit=" cm" onChange={setWidth} />
          {shape !== "circle" ? <RangeControl label="Height" value={height} min={2} max={10} unit=" cm" onChange={setHeight} /> : null}
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Area" value={`${area.toFixed(1)} cm²`} />
            <Metric label="Perimeter" value={`${perimeter.toFixed(1)} cm`} tone="amber" />
          </div>
        </div>
      </div>
    );
  }

  if (lab.id === "probability-simulator") {
    const observed = trials === 0 ? 0 : (successes / trials) * 100;
    return (
      <div className="space-y-5">
        <LabCanvas>
          <div className="absolute inset-0 flex items-end justify-center gap-16 p-10">
            <div className="flex h-64 w-28 flex-col justify-end rounded-t-2xl border border-cyan-300/30 bg-cyan-300/5">
              <div className="rounded-t-xl bg-cyan-400" style={{ height: `${chance}%` }} />
              <p className="py-3 text-center text-xs font-bold text-cyan-100">Expected</p>
            </div>
            <div className="flex h-64 w-28 flex-col justify-end rounded-t-2xl border border-violet-300/30 bg-violet-300/5">
              <div key={runSignal} className="rounded-t-xl bg-violet-400 transition-all" style={{ height: `${observed}%` }} />
              <p className="py-3 text-center text-xs font-bold text-violet-100">Observed</p>
            </div>
          </div>
        </LabCanvas>
        <div className="grid gap-3 md:grid-cols-4">
          <RangeControl label="Success chance" value={chance} min={5} max={95} unit="%" onChange={setChance} />
          <RangeControl label="Trials" value={trials} min={10} max={1000} step={10} onChange={setTrials} />
          <Metric label="Successes" value={String(successes)} tone="violet" />
          <Metric label="Experimental probability" value={`${observed.toFixed(1)}%`} />
        </div>
      </div>
    );
  }

  if (lab.id === "trigonometry-visualizer") {
    const radians = (angle * Math.PI) / 180;
    const x = 180 + Math.cos(radians) * 125;
    const y = 180 - Math.sin(radians) * 125;
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <svg viewBox="0 0 360 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Unit circle trigonometry diagram">
            <circle cx="180" cy="180" r="125" fill="none" stroke="#475569" strokeWidth="3" />
            <line x1="40" y1="180" x2="320" y2="180" stroke="#475569" />
            <line x1="180" y1="40" x2="180" y2="320" stroke="#475569" />
            <line x1="180" y1="180" x2={x} y2={y} stroke="#a78bfa" strokeWidth="5" />
            <line x1={x} y1={y} x2={x} y2="180" stroke="#22d3ee" strokeDasharray="6 5" />
            <line x1="180" y1={y} x2={x} y2={y} stroke="#f59e0b" strokeDasharray="6 5" />
            <circle cx={x} cy={y} r="9" fill="#f8fafc" />
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Angle" value={angle} min={0} max={360} unit="°" onChange={setAngle} />
          <Metric label="sin θ" value={Math.sin(radians).toFixed(3)} />
          <Metric label="cos θ" value={Math.cos(radians).toFixed(3)} tone="amber" />
          <Metric label="tan θ" value={Math.abs(Math.cos(radians)) < 0.001 ? "undefined" : Math.tan(radians).toFixed(3)} tone="violet" />
        </div>
      </div>
    );
  }

  const values = dataset
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(Number.isFinite);
  const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const variance = values.length ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length : 0;
  const max = Math.max(1, ...values);

  return (
    <div className="space-y-5">
      <LabCanvas>
        <div className="absolute inset-0 flex items-end justify-center gap-3 p-10">
          {values.map((value, index) => (
            <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-slate-300">{value}</span>
              <div
                className="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-300"
                style={{ height: `${Math.max(8, (value / max) * 240)}px` }}
              />
            </div>
          ))}
        </div>
      </LabCanvas>
      <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        <label className="rounded-xl border border-slate-200 p-3 dark:border-white/[0.08]">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">Dataset</span>
          <input value={dataset} onChange={(event) => setDataset(event.target.value)} className="mt-2 h-10 w-full rounded-lg bg-slate-100 px-3 text-sm outline-none dark:bg-white/[0.05]" />
        </label>
        <Metric label="Mean" value={mean.toFixed(2)} />
        <Metric label="Std. deviation" value={Math.sqrt(variance).toFixed(2)} tone="violet" />
        <Metric label="Sample size" value={String(values.length)} tone="amber" />
      </div>
    </div>
  );
}
