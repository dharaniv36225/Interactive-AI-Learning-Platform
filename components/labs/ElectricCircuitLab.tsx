"use client";

import { memo, useEffect, useMemo, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";
import { calculateCircuit } from "@/lib/physics";

function ElectricCircuitLabComponent({
  isRunning,
  isPaused,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(220);
  const [closed, setClosed] = useState(true);

  const circuit = useMemo(
    () => calculateCircuit({ voltage, resistance, closed }),
    [closed, resistance, voltage],
  );
  const currentMilliAmps = circuit.current * 1000;
  const brightness = Math.min(1, circuit.current / 0.08);
  const isCurrentFlowing = isRunning && !isPaused && closed;
  const visualBrightness = isCurrentFlowing ? brightness : 0;
  const particleDuration = Math.max(0.7, 3.2 - brightness * 2.4);
  const operatingState = !isRunning
    ? "Ready"
    : isPaused
      ? "Paused"
    : !closed
    ? "Open circuit"
    : currentMilliAmps > 120
      ? "High current"
      : currentMilliAmps < 5
        ? "Very dim"
        : "Operating";

  useEffect(() => {
    setVoltage(12);
    setResistance(220);
    setClosed(true);
  }, [resetSignal]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <LabCanvas>
        <svg
          viewBox="0 0 640 390"
          className="h-full min-h-[390px] w-full"
          role="img"
          aria-label="Closed loop electric circuit with a battery, resistor, switch, and glowing bulb"
        >
          <defs>
            <filter id="bulb-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation={10 + brightness * 18} />
            </filter>
            <linearGradient id="wire-current" x1="0" x2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="0.5" stopColor="#f8fafc" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
            <path
              id="circuit-path"
              d="M110 300 H530 V92 H390 M286 92 H110 V300"
            />
          </defs>

          <path
            d="M110 300 H530 V92 H390 M286 92 H110 V300"
            fill="none"
            stroke={closed ? "#22d3ee" : "#334155"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="7"
          />

          <g transform="translate(110 196)">
            <line x1="-22" y1="-35" x2="22" y2="-35" stroke="#fbbf24" strokeWidth="7" />
            <line x1="-13" y1="35" x2="13" y2="35" stroke="#fbbf24" strokeWidth="7" />
            <text x="34" y="5" fill="#fde68a" fontSize="15" fontWeight="700">
              {voltage} V
            </text>
          </g>

          <g transform="translate(338 92)">
            <path
              d="M-52 0 l13 -20 l18 40 l18 -40 l18 40 l18 -40 l19 20"
              fill="none"
              stroke="#c4b5fd"
              strokeLinejoin="round"
              strokeWidth="7"
            />
            <text x="0" y="-38" fill="#ddd6fe" fontSize="14" fontWeight="700" textAnchor="middle">
              {resistance} ohm
            </text>
          </g>

          <g transform="translate(530 196)">
            <circle
              r={62 + visualBrightness * 12}
              fill={`rgba(250, 204, 21, ${visualBrightness * 0.55})`}
              filter="url(#bulb-glow)"
            />
            <circle
              r="43"
              fill={
                isCurrentFlowing
                  ? `rgba(250, 204, 21, ${0.18 + visualBrightness * 0.82})`
                  : "#172033"
              }
              stroke={isCurrentFlowing ? "#fef08a" : "#64748b"}
              strokeWidth="6"
            />
            <path d="M-18 5 Q0 -24 18 5 Q0 27 -18 5" fill="none" stroke="#fff7cc" strokeWidth="4" />
            <rect x="-22" y="43" width="44" height="28" rx="7" fill="#94a3b8" />
          </g>

          <g transform="translate(210 300)">
            <circle cx="-34" cy="0" r="7" fill="#e2e8f0" />
            <circle cx="34" cy="0" r="7" fill="#e2e8f0" />
            <line
              x1="-30"
              y1="-2"
              x2="27"
              y2={closed ? -2 : -38}
              stroke={closed ? "#34d399" : "#fb7185"}
              strokeLinecap="round"
              strokeWidth="8"
            />
            <text x="0" y="34" fill="#cbd5e1" fontSize="13" textAnchor="middle">
              {closed ? "closed" : "open"}
            </text>
          </g>

          {isCurrentFlowing
            ? Array.from({ length: 12 }, (_, index) => (
                <circle
                  key={`${runSignal}-${index}`}
                  r="5"
                  fill="url(#wire-current)"
                  className="drop-shadow-[0_0_8px_#67e8f9]"
                >
                  <animateMotion
                    begin={`${(-particleDuration * index) / 12}s`}
                    dur={`${particleDuration}s`}
                    path="M110 300 H530 V92 H110 V300"
                    repeatCount="indefinite"
                  />
                </circle>
              ))
            : null}
        </svg>
      </LabCanvas>

      <aside className="space-y-3">
        <RangeControl
          label="Voltage"
          value={voltage}
          min={1}
          max={24}
          unit=" V"
          onChange={setVoltage}
        />
        <RangeControl
          label="Resistance"
          value={resistance}
          min={20}
          max={1000}
          step={10}
          unit=" ohm"
          onChange={setResistance}
        />
        <button
          type="button"
          onClick={() => setClosed((current) => !current)}
          aria-pressed={closed}
          className={`h-11 w-full rounded-xl border text-xs font-bold transition ${
            closed
              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200"
              : "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200"
          }`}
        >
          Switch {closed ? "closed" : "open"}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Current" value={`${currentMilliAmps.toFixed(1)} mA`} />
          <Metric label="Power" value={`${circuit.power.toFixed(2)} W`} tone="amber" />
        </div>
        <Metric
          label="Bulb brightness"
          value={
            isCurrentFlowing ? `${Math.round(brightness * 100)}%` : "Off"
          }
          detail="Scaled from circuit current"
          tone={isCurrentFlowing ? "emerald" : "rose"}
        />
        <Metric
          label="Circuit state"
          value={operatingState}
          tone={
            !isRunning
              ? "cyan"
              : !closed
              ? "rose"
              : currentMilliAmps > 120
                ? "amber"
                : "emerald"
          }
        />
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-cyan-200">
          <p>
            I = V / R = {voltage} / {resistance} ={" "}
            {circuit.current.toFixed(4)} A
          </p>
          <p className="mt-1">
            P = VI = {voltage} x {circuit.current.toFixed(4)} ={" "}
            {circuit.power.toFixed(3)} W
          </p>
        </div>
      </aside>
    </div>
  );
}

export const ElectricCircuitLab = memo(ElectricCircuitLabComponent);
