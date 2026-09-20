"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";

export function RoboticsLabs({
  lab,
  isRunning,
  isPaused,
  onRunComplete,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [speed, setSpeed] = useState(45);
  const [duration, setDuration] = useState(4);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState("right");
  const [distance, setDistance] = useState(75);
  const [noise, setNoise] = useState(8);
  const [gain, setGain] = useState(55);
  const [lineSpeed, setLineSpeed] = useState(50);
  const [detectionRange, setDetectionRange] = useState(45);
  const [obstacleX, setObstacleX] = useState(70);

  useEffect(() => {
    setSpeed(45);
    setDuration(4);
    setPosition({ x: 50, y: 50 });
    setDirection("right");
    setDistance(75);
    setNoise(8);
    setGain(55);
    setLineSpeed(50);
    setDetectionRange(45);
    setObstacleX(70);
  }, [resetSignal]);

  useEffect(() => {
    if (
      lab.id !== "robot-movement" ||
      !isRunning ||
      isPaused ||
      runSignal === 0
    ) {
      return;
    }

    const amount = Math.min(30, (speed * duration) / 20);
    setPosition((current) => ({
      x: Math.min(90, Math.max(10, current.x + (direction === "right" ? amount : direction === "left" ? -amount : 0))),
      y: Math.min(90, Math.max(10, current.y + (direction === "down" ? amount : direction === "up" ? -amount : 0))),
    }));
    const completeTimer = window.setTimeout(onRunComplete, 800);

    return () => window.clearTimeout(completeTimer);
  }, [direction, duration, isPaused, isRunning, lab.id, onRunComplete, runSignal, speed]);

  if (lab.id === "robot-movement") {
    const controls = [
      ["up", ArrowUp],
      ["left", ArrowLeft],
      ["down", ArrowDown],
      ["right", ArrowRight],
    ] as const;
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <div
            className="absolute grid size-20 place-items-center rounded-2xl border-4 border-cyan-200 bg-cyan-400 text-2xl font-black text-slate-950 shadow-[0_0_25px_rgba(34,211,238,.5)] transition-all duration-700"
            style={{ left: `${position.x}%`, top: `${position.y}%`, transform: "translate(-50%, -50%)" }}
          >
            R1
            <span className="absolute -bottom-3 left-2 size-5 rounded-full bg-slate-900" />
            <span className="absolute -bottom-3 right-2 size-5 rounded-full bg-slate-900" />
          </div>
        </LabCanvas>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {controls.map(([value, Icon]) => (
              <button key={value} type="button" onClick={() => setDirection(value)} className={`grid h-11 place-items-center rounded-xl border ${direction === value ? "border-cyan-400 bg-cyan-500 text-slate-950" : "border-slate-200 dark:border-white/[0.08]"}`} aria-label={`Move ${value}`}>
                <Icon className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
          <RangeControl label="Wheel speed" value={speed} min={10} max={100} unit="%" onChange={setSpeed} />
          <RangeControl label="Run time" value={duration} min={1} max={10} unit=" s" onChange={setDuration} />
          <Metric label="Planned displacement" value={`${((speed * duration) / 100).toFixed(1)} m`} />
          <Metric label="Heading" value={direction} tone="violet" />
        </div>
      </div>
    );
  }

  if (lab.id === "sensor-simulator") {
    const measured = distance + Math.sin(runSignal + distance) * noise;
    const reliability = Math.max(0, 100 - noise * 4 - distance / 4);
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <svg viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Ultrasonic sensor sweep">
            {[70, 130, 190, 250].map((radius) => <path key={radius} d={`M40 180 A${radius} ${radius} 0 0 1 ${40 + radius} ${180 - radius}`} fill="none" stroke="#22d3ee55" strokeWidth="3" />)}
            <path d="M40 180 L560 80" stroke="#22d3ee" strokeWidth="5" className="drop-shadow-[0_0_8px_#22d3ee]" />
            <rect x={Math.min(530, 40 + distance * 5)} y="55" width="35" height="150" rx="8" fill="#f59e0b" />
            <rect x="10" y="150" width="60" height="60" rx="12" fill="#a78bfa" />
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Target distance" value={distance} min={10} max={100} unit=" cm" onChange={setDistance} />
          <RangeControl label="Sensor noise" value={noise} min={0} max={20} unit="%" onChange={setNoise} />
          <Metric label="Measured distance" value={`${measured.toFixed(1)} cm`} />
          <Metric label="Reliability" value={`${reliability.toFixed(0)}%`} tone={reliability > 70 ? "emerald" : "rose"} />
        </div>
      </div>
    );
  }

  if (lab.id === "line-following-robot") {
    const error = Math.abs(gain - 60) * 0.8 + Math.max(0, lineSpeed - 70) * 0.5;
    const score = Math.max(0, 100 - error);
    return (
      <div className="space-y-5">
        <LabCanvas>
          <svg viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Line following robot track">
            <path d="M20 280 C140 40 260 330 390 90 C470 -20 540 170 580 70" fill="none" stroke="#f8fafc" strokeWidth="18" />
            <path d="M20 280 C140 40 260 330 390 90 C470 -20 540 170 580 70" fill="none" stroke="#0f172a" strokeWidth="5" strokeDasharray="10 9" />
            <g transform={`translate(${120 + (isRunning ? runSignal * 12 : 0)}, ${170 + (60 - gain)})`}>
              <rect x="-35" y="-25" width="70" height="50" rx="12" fill="#22d3ee" />
              <circle cx="-22" cy="28" r="10" fill="#020617" />
              <circle cx="22" cy="28" r="10" fill="#020617" />
            </g>
          </svg>
        </LabCanvas>
        <div className="grid gap-3 md:grid-cols-4">
          <RangeControl label="Motor speed" value={lineSpeed} min={10} max={100} unit="%" onChange={setLineSpeed} />
          <RangeControl label="Steering gain" value={gain} min={10} max={100} onChange={setGain} />
          <Metric label="Tracking score" value={`${score.toFixed(0)}%`} tone={score > 80 ? "emerald" : "amber"} />
          <Metric label="Path error" value={`${error.toFixed(1)} cm`} tone="rose" />
        </div>
      </div>
    );
  }

  const safetyMargin = obstacleX - detectionRange - speed / 5;
  const safe = safetyMargin > 5;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <LabCanvas>
        <div className="absolute inset-0">
          <div className="absolute bottom-24 left-10 grid size-20 place-items-center rounded-2xl bg-cyan-400 font-black text-slate-950">BOT</div>
          <div className="absolute bottom-16 h-36 w-16 rounded-xl bg-rose-500" style={{ left: `${obstacleX}%` }} />
          <div
            className={`absolute bottom-10 left-24 h-52 origin-bottom-left rounded-full border-2 transition-all ${safe ? "border-emerald-300 bg-emerald-300/10" : "border-rose-300 bg-rose-300/15"}`}
            style={{ width: `${detectionRange * 4}px`, clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }}
          />
        </div>
      </LabCanvas>
      <div className="space-y-3">
        <RangeControl label="Robot speed" value={speed} min={10} max={100} unit="%" onChange={setSpeed} />
        <RangeControl label="Detection range" value={detectionRange} min={15} max={80} unit=" cm" onChange={setDetectionRange} />
        <RangeControl label="Obstacle position" value={obstacleX} min={35} max={90} unit=" cm" onChange={setObstacleX} />
        <Metric label="Safety margin" value={`${safetyMargin.toFixed(1)} cm`} tone={safe ? "emerald" : "rose"} />
        <Metric label="Decision" value={safe ? "Proceed" : "Brake and turn"} tone={safe ? "cyan" : "amber"} />
      </div>
    </div>
  );
}
