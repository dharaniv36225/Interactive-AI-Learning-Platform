"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";
import { usePausableAnimation } from "@/components/labs/use-pausable-animation";

const PeriodicTableLab = dynamic(
  () =>
    import("@/components/labs/PeriodicTableLab").then(
      (module) => module.PeriodicTableLab,
    ),
  {
    loading: () => (
      <div className="grid min-h-[520px] place-items-center rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]">
        <p className="text-xs font-semibold text-slate-500">
          Loading periodic table...
        </p>
      </div>
    ),
  },
);

export function ChemistryLabs({
  lab,
  isRunning,
  isPaused,
  onRunComplete,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const [molecule, setMolecule] = useState("water");
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [reactantA, setReactantA] = useState(4);
  const [reactantB, setReactantB] = useState(3);
  const [substance, setSubstance] = useState("water");
  const [concentration, setConcentration] = useState(0);

  useEffect(() => {
    setProtons(6);
    setNeutrons(6);
    setElectrons(6);
    setMolecule("water");
    setAssemblyProgress(0);
    setReactantA(4);
    setReactantB(3);
    setSubstance("water");
    setConcentration(0);
  }, [resetSignal]);

  usePausableAnimation({
    durationMs: 4_000,
    isPaused,
    isRunning: isRunning && lab.id === "molecule-builder",
    onComplete: onRunComplete,
    onProgress: setAssemblyProgress,
    runSignal,
  });

  if (lab.id === "periodic-table") {
    return (
      <PeriodicTableLab
        lab={lab}
        isRunning={isRunning}
        isPaused={isPaused}
        onRunComplete={onRunComplete}
        resetSignal={resetSignal}
        runSignal={runSignal}
      />
    );
  }

  if (lab.id === "atom-builder") {
    const charge = protons - electrons;
    const shellElectrons = Array.from({ length: electrons }, (_, index) => {
      const shell = index < 2 ? 1 : 2;
      const shellCount = shell === 1 ? Math.min(electrons, 2) : Math.max(1, electrons - 2);
      const angle = ((index - (shell === 2 ? 2 : 0)) / shellCount) * Math.PI * 2;
      const radius = shell === 1 ? 55 : 105;
      return {
        x: 180 + Math.cos(angle) * radius,
        y: 180 + Math.sin(angle) * radius,
      };
    });
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <svg
            key={runSignal}
            viewBox="0 0 360 360"
            className="h-full min-h-[360px] w-full"
            role="img"
            aria-label="Atomic structure builder"
          >
            <circle cx="180" cy="180" r="55" fill="none" stroke="#475569" />
            <circle cx="180" cy="180" r="105" fill="none" stroke="#475569" />
            <circle cx="180" cy="180" r="34" fill="#f43f5e55" stroke="#fb7185" strokeWidth="3" />
            <text x="180" y="177" textAnchor="middle" fill="white" fontSize="13">
              {protons}p + {neutrons}n
            </text>
            {shellElectrons.map((electron, index) => (
              <circle
                key={`${index}-${electron.x}`}
                cx={electron.x}
                cy={electron.y}
                r="8"
                fill="#22d3ee"
                className="drop-shadow-[0_0_7px_#22d3ee]"
              />
            ))}
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          {[
            ["Protons", protons, setProtons],
            ["Neutrons", neutrons, setNeutrons],
            ["Electrons", electrons, setElectrons],
          ].map(([label, value, setter]) => (
            <div
              key={String(label)}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-white/[0.08]"
            >
              <span className="text-xs font-semibold">{String(label)}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    (setter as (next: number) => void)(
                      Math.max(0, Number(value) - 1),
                    )
                  }
                  className="size-8 rounded-lg bg-slate-100 dark:bg-white/[0.06]"
                >
                  -
                </button>
                <span className="w-5 text-center text-sm font-bold">
                  {Number(value)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    (setter as (next: number) => void)(
                      Math.min(18, Number(value) + 1),
                    )
                  }
                  className="size-8 rounded-lg bg-slate-100 dark:bg-white/[0.06]"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <Metric
            label="Net charge"
            value={charge === 0 ? "Neutral" : `${charge > 0 ? "+" : ""}${charge}`}
            tone={charge === 0 ? "emerald" : "rose"}
          />
          <Metric label="Mass number" value={String(protons + neutrons)} />
        </div>
      </div>
    );
  }

  if (lab.id === "molecule-builder") {
    const molecules = {
      water: { formula: "H2O", atoms: ["H", "O", "H"], mass: 18.015, shape: "Bent" },
      carbon: { formula: "CO2", atoms: ["O", "C", "O"], mass: 44.01, shape: "Linear" },
      methane: { formula: "CH4", atoms: ["H", "H", "C", "H", "H"], mass: 16.043, shape: "Tetrahedral" },
    };
    const selected = molecules[molecule as keyof typeof molecules];
    const atomPositions = selected.atoms.map((atom, index) => {
      const finalX =
        300 + (index - (selected.atoms.length - 1) / 2) * 92;
      const startX = index % 2 === 0 ? 72 + index * 18 : 528 - index * 18;
      const startY = 72 + (index % 3) * 112;

      return {
        atom,
        x: startX + (finalX - startX) * assemblyProgress,
        y: startY + (190 - startY) * assemblyProgress,
      };
    });
    return (
      <div className="space-y-5">
        <SegmentedControl
          label="Molecule recipe"
          value={molecule}
          options={[
            { value: "water", label: "Water" },
            { value: "carbon", label: "Carbon dioxide" },
            { value: "methane", label: "Methane" },
          ]}
          onChange={setMolecule}
        />
        <LabCanvas>
          <svg
            viewBox="0 0 600 380"
            className="h-full min-h-[380px] w-full"
            role="img"
            aria-label={`${selected.formula} molecule assembly`}
          >
            {atomPositions.slice(1).map((position, index) => {
              const previous = atomPositions[index];
              return (
                <line
                  key={`bond-${index}`}
                  x1={previous.x}
                  y1={previous.y}
                  x2={position.x}
                  y2={position.y}
                  stroke="#cbd5e1"
                  strokeLinecap="round"
                  strokeWidth="8"
                  opacity={Math.max(0, (assemblyProgress - 0.55) / 0.45)}
                />
              );
            })}
            {atomPositions.map(({ atom, x, y }, index) => {
              const radius = atom === "H" ? 34 : 48;
              const fill =
                atom === "H"
                  ? "#f1f5f9"
                  : atom === "O"
                    ? "#fb7185"
                    : "#64748b";
              return (
                <g key={`${atom}-${index}`} transform={`translate(${x} ${y})`}>
                  <circle
                    r={radius}
                    fill={fill}
                    stroke="#ffffff"
                    strokeOpacity="0.35"
                    strokeWidth="3"
                    className="drop-shadow-[0_0_18px_rgba(255,255,255,.18)]"
                  />
                  <text
                    y="7"
                    fill={atom === "H" ? "#0f172a" : "#ffffff"}
                    fontSize="24"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {atom}
                  </text>
                </g>
              );
            })}
          </svg>
        </LabCanvas>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Formula" value={selected.formula} />
          <Metric label="Molar mass" value={`${selected.mass} g/mol`} tone="amber" />
          <Metric label="Geometry" value={selected.shape} tone="violet" />
        </div>
      </div>
    );
  }

  if (lab.id === "reaction-simulator") {
    const product = Math.min(reactantA / 2, reactantB);
    const limiting = reactantA / 2 < reactantB ? "Reactant A" : "Reactant B";
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <LabCanvas>
          <div className="absolute inset-0 flex items-center justify-around p-6">
            <div className="text-center">
              <div className="mx-auto grid size-28 place-items-center rounded-full border-4 border-cyan-300 bg-cyan-300/10 text-2xl font-black text-cyan-100">
                {reactantA}A
              </div>
              <p className="mt-3 text-xs text-slate-400">2A</p>
            </div>
            <span className="text-4xl text-slate-500">+</span>
            <div className="text-center">
              <div className="mx-auto grid size-28 place-items-center rounded-3xl border-4 border-violet-300 bg-violet-300/10 text-2xl font-black text-violet-100">
                {reactantB}B
              </div>
              <p className="mt-3 text-xs text-slate-400">B</p>
            </div>
            <span className="text-4xl text-emerald-300">→</span>
            <div className="text-center">
              <div
                key={runSignal}
                className={`mx-auto grid size-32 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 text-2xl font-black text-slate-950 ${
                  isRunning ? "animate-pulse" : ""
                }`}
              >
                {product.toFixed(1)} A2B
              </div>
              <p className="mt-3 text-xs text-slate-400">product moles</p>
            </div>
          </div>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Reactant A" value={reactantA} min={1} max={12} unit=" mol" onChange={setReactantA} />
          <RangeControl label="Reactant B" value={reactantB} min={1} max={8} unit=" mol" onChange={setReactantB} />
          <Metric label="Product yield" value={`${product.toFixed(1)} mol`} tone="emerald" />
          <Metric label="Limiting reagent" value={limiting} tone="rose" />
        </div>
      </div>
    );
  }

  const presets = {
    lemon: 2,
    coffee: 5,
    water: 7,
    soap: 10,
    bleach: 12.5,
  };
  const basePh = presets[substance as keyof typeof presets];
  const ph = Math.min(14, Math.max(0, basePh + concentration));
  const acidity =
    ph < 6.5 ? "Acidic" : ph > 7.5 ? "Alkaline" : "Neutral";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <LabCanvas>
        <div className="absolute inset-0 grid place-items-center p-8">
          <div className="w-full max-w-xl">
            <div className="mb-5 flex justify-between text-[10px] font-bold text-slate-400">
              <span>strong acid</span>
              <span>neutral</span>
              <span>strong base</span>
            </div>
            <div className="relative h-16 rounded-full bg-gradient-to-r from-rose-500 via-amber-300 via-emerald-400 to-violet-500">
              <span
                className="absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-slate-950 text-sm font-black text-white shadow-xl transition-all"
                style={{ left: `${(ph / 14) * 100}%` }}
              >
                {ph.toFixed(1)}
              </span>
            </div>
            <div className="mt-12 text-center text-3xl font-black text-white">
              {acidity}
            </div>
          </div>
        </div>
      </LabCanvas>
      <div className="space-y-4">
        <SegmentedControl
          label="Test substance"
          value={substance}
          options={Object.keys(presets).map((value) => ({
            value,
            label: value[0].toUpperCase() + value.slice(1),
          }))}
          onChange={setSubstance}
        />
        <RangeControl
          label="Dilution adjustment"
          value={concentration}
          min={-2}
          max={2}
          step={0.1}
          onChange={setConcentration}
        />
        <Metric label="Measured pH" value={ph.toFixed(2)} tone={ph < 6.5 ? "rose" : ph > 7.5 ? "violet" : "emerald"} />
        <Metric
          label="Hydrogen ion level"
          value={`${(10 ** -ph).toExponential(2)} M`}
        />
      </div>
    </div>
  );
}
