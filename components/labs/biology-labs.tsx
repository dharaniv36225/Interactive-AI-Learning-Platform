"use client";

import { useEffect, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";
import { usePausableAnimation } from "@/components/labs/use-pausable-animation";

const organelles = {
  nucleus: {
    label: "Nucleus",
    description: "Stores DNA and coordinates gene expression.",
    position: "left-[43%] top-[38%]",
    color: "bg-violet-400",
  },
  mitochondria: {
    label: "Mitochondrion",
    description: "Produces ATP through cellular respiration.",
    position: "left-[23%] top-[58%]",
    color: "bg-amber-400",
  },
  membrane: {
    label: "Cell membrane",
    description: "Controls movement of substances into and out of the cell.",
    position: "right-[10%] top-[46%]",
    color: "bg-cyan-400",
  },
  ribosome: {
    label: "Ribosome",
    description: "Builds proteins from messenger RNA instructions.",
    position: "right-[31%] top-[67%]",
    color: "bg-emerald-400",
  },
} as const;

export function BiologyLabs({
  lab,
  isRunning,
  isPaused,
  onRunComplete,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [selectedOrganelle, setSelectedOrganelle] =
    useState<keyof typeof organelles>("nucleus");
  const [system, setSystem] = useState("circulatory");
  const [heartRate, setHeartRate] = useState(72);
  const [activity, setActivity] = useState(3);
  const [light, setLight] = useState(65);
  const [co2, setCo2] = useState(55);
  const [water, setWater] = useState(70);
  const [growthLight, setGrowthLight] = useState(75);
  const [nutrients, setNutrients] = useState(65);
  const [growthProgress, setGrowthProgress] = useState(0);
  const [chainLength, setChainLength] = useState(4);
  const [producerEnergy, setProducerEnergy] = useState(10000);
  const [dna, setDna] = useState("ATGCGTAC");
  const [mutationIndex, setMutationIndex] = useState(3);

  useEffect(() => {
    setSelectedOrganelle("nucleus");
    setSystem("circulatory");
    setHeartRate(72);
    setActivity(3);
    setLight(65);
    setCo2(55);
    setWater(70);
    setGrowthLight(75);
    setNutrients(65);
    setGrowthProgress(0);
    setChainLength(4);
    setProducerEnergy(10000);
    setDna("ATGCGTAC");
    setMutationIndex(3);
  }, [resetSignal]);

  usePausableAnimation({
    durationMs: 5_000,
    isPaused,
    isRunning: isRunning && lab.id === "plant-growth",
    onComplete: onRunComplete,
    onProgress: setGrowthProgress,
    runSignal,
  });

  if (lab.id === "cell-explorer") {
    const selected = organelles[selectedOrganelle];
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <LabCanvas>
          <div className="absolute inset-0 grid place-items-center p-8">
            <div className="relative h-72 w-full max-w-lg rounded-[48%] border-8 border-cyan-300/70 bg-emerald-300/10 shadow-[inset_0_0_80px_rgba(16,185,129,.15)]">
              <div className="absolute left-[38%] top-[29%] size-28 rounded-full border-4 border-violet-300 bg-violet-400/20" />
              <div className="absolute left-[18%] top-[53%] h-10 w-20 rotate-12 rounded-full border-4 border-amber-300 bg-amber-400/20" />
              {Object.entries(organelles).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setSelectedOrganelle(key as keyof typeof organelles)
                  }
                  className={`absolute ${item.position} size-5 rounded-full ${item.color} ring-4 transition ${
                    selectedOrganelle === key
                      ? "scale-125 ring-white/70"
                      : "ring-transparent"
                  }`}
                  aria-label={`Inspect ${item.label}`}
                />
              ))}
            </div>
          </div>
        </LabCanvas>
        <div className="space-y-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Select an organelle
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(organelles).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setSelectedOrganelle(key as keyof typeof organelles)
                  }
                  className={`rounded-xl border p-3 text-left text-xs font-semibold ${
                    selectedOrganelle === key
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
                      : "border-slate-200 dark:border-white/[0.08]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <Metric label={selected.label} value="Active" tone="emerald" />
          <p className="rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-600 dark:bg-white/[0.03] dark:text-slate-300">
            {selected.description}
          </p>
        </div>
      </div>
    );
  }

  if (lab.id === "human-body-explorer") {
    const cardiacOutput = (heartRate * (55 + activity * 6)) / 1000;
    const systems = {
      circulatory: ["Heart", "Blood vessels", "Moves oxygen and nutrients"],
      respiratory: ["Lungs", "Airways", "Exchanges oxygen and carbon dioxide"],
      digestive: ["Stomach", "Intestines", "Breaks food into absorbable nutrients"],
      nervous: ["Brain", "Nerves", "Coordinates sensation, thought, and action"],
    };
    const selected = systems[system as keyof typeof systems];
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <LabCanvas>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-80 w-48">
              <div className="absolute left-1/2 top-3 size-20 -translate-x-1/2 rounded-full border-4 border-slate-400" />
              <div className="absolute left-1/2 top-24 h-52 w-36 -translate-x-1/2 rounded-[45%] border-4 border-slate-400" />
              <div
                key={`${system}-${runSignal}`}
                className={`absolute left-1/2 top-36 -translate-x-1/2 ${
                  isRunning ? "animate-pulse" : ""
                } ${
                  system === "circulatory"
                    ? "text-rose-400"
                    : system === "respiratory"
                      ? "text-cyan-300"
                      : system === "digestive"
                        ? "text-amber-300"
                        : "text-violet-300"
                }`}
              >
                <div className="grid h-28 w-24 place-items-center rounded-[45%] border-4 border-current bg-current/10 text-center text-xs font-bold">
                  {selected[0]}
                </div>
              </div>
            </div>
          </div>
        </LabCanvas>
        <div className="space-y-4">
          <SegmentedControl
            label="Body system"
            value={system}
            options={Object.keys(systems).map((value) => ({
              value,
              label: value[0].toUpperCase() + value.slice(1),
            }))}
            onChange={setSystem}
          />
          <RangeControl label="Heart rate" value={heartRate} min={45} max={180} unit=" bpm" onChange={setHeartRate} />
          <RangeControl label="Activity level" value={activity} min={1} max={10} onChange={setActivity} />
          <Metric label="Cardiac output" value={`${cardiacOutput.toFixed(1)} L/min`} tone="rose" />
          <p className="text-xs leading-5 text-slate-500">{selected[2]}.</p>
        </div>
      </div>
    );
  }

  if (lab.id === "photosynthesis-simulator") {
    const rate = Math.min(100, (light * 0.58 + co2 * 0.42) * (1 - Math.abs(light - co2) / 250));
    const oxygen = rate * 0.08;
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -right-12 -top-12 size-44 rounded-full bg-amber-300 transition-shadow"
              style={{ boxShadow: `0 0 ${light * 1.5}px rgba(251,191,36,.7)` }}
            />
            <div className="absolute bottom-0 left-1/2 h-48 w-5 -translate-x-1/2 bg-emerald-700" />
            <div
              key={runSignal}
              className="absolute bottom-36 left-1/2 h-36 w-60 -translate-x-1/2 rounded-[100%_0_100%_0] bg-emerald-400 shadow-[0_0_45px_rgba(52,211,153,.35)]"
              style={{ transform: `translateX(-50%) scale(${0.65 + rate / 250}) rotate(-8deg)` }}
            />
            {isRunning
              ? Array.from({ length: Math.round(rate / 12) }, (_, index) => (
                  <span
                    key={index}
                    className="absolute bottom-40 size-3 animate-bounce rounded-full border border-cyan-200 bg-cyan-300/30"
                    style={{
                      left: `${22 + index * 8}%`,
                      animationDelay: `${index * 120}ms`,
                    }}
                  />
                ))
              : null}
          </div>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Light intensity" value={light} min={0} max={100} unit="%" onChange={setLight} />
          <RangeControl label="CO2 availability" value={co2} min={0} max={100} unit="%" onChange={setCo2} />
          <Metric label="Photosynthesis rate" value={`${rate.toFixed(0)}%`} tone="emerald" />
          <Metric label="Oxygen output" value={`${oxygen.toFixed(1)} units/h`} />
        </div>
      </div>
    );
  }

  if (lab.id === "plant-growth") {
    const healthFactor = Math.min(water, growthLight, nutrients) / 100;
    const visibleGrowth = growthProgress * (0.55 + healthFactor * 0.45);
    const stemHeight = 24 + visibleGrowth * 190;
    const leafScale = Math.max(0, (visibleGrowth - 0.28) / 0.72);
    const stage =
      visibleGrowth < 0.12
        ? "Seed"
        : visibleGrowth < 0.38
          ? "Germinating"
          : visibleGrowth < 0.72
            ? "Seedling"
            : "Young plant";

    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <LabCanvas>
          <svg
            viewBox="0 0 600 380"
            className="h-full min-h-[380px] w-full"
            role="img"
            aria-label="Seed growing into a plant"
          >
            <defs>
              <linearGradient id="plant-sky" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#0f2942" />
                <stop offset="1" stopColor="#071019" />
              </linearGradient>
              <filter id="plant-glow">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>
            <rect width="600" height="380" fill="url(#plant-sky)" />
            <circle
              cx="500"
              cy="72"
              r={28 + growthLight * 0.12}
              fill="#fde047"
              opacity={0.45 + growthLight / 220}
              filter="url(#plant-glow)"
            />
            <rect y="300" width="600" height="80" fill="#3f2b20" />
            <path
              d={`M300 320 C 292 276, 310 ${330 - stemHeight * 0.45}, 300 ${320 - stemHeight}`}
              fill="none"
              stroke="#4ade80"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <ellipse
              cx="300"
              cy="316"
              rx="25"
              ry="14"
              fill="#b7793f"
              stroke="#f0b46e"
              strokeWidth="3"
            />
            <g
              style={{
                opacity: leafScale,
                transform: `translateY(${(1 - leafScale) * 32}px) scale(${0.4 + leafScale * 0.6})`,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            >
              <ellipse
                cx="255"
                cy={205 - visibleGrowth * 78}
                rx="58"
                ry="24"
                fill="#34d399"
                transform={`rotate(-24 255 ${205 - visibleGrowth * 78})`}
              />
              <ellipse
                cx="348"
                cy={178 - visibleGrowth * 72}
                rx="62"
                ry="25"
                fill="#22c55e"
                transform={`rotate(24 348 ${178 - visibleGrowth * 72})`}
              />
            </g>
            {isRunning && !isPaused
              ? Array.from({ length: 7 }, (_, index) => (
                  <circle
                    key={`${runSignal}-${index}`}
                    cx={120 + index * 54}
                    cy={75 + (index % 3) * 34}
                    r="5"
                    fill="#7dd3fc"
                    className="animate-bounce"
                    style={{ animationDelay: `${index * 110}ms` }}
                  />
                ))
              : null}
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl
            label="Water level"
            value={water}
            min={0}
            max={100}
            unit="%"
            onChange={setWater}
          />
          <RangeControl
            label="Light level"
            value={growthLight}
            min={0}
            max={100}
            unit="%"
            onChange={setGrowthLight}
          />
          <RangeControl
            label="Soil nutrients"
            value={nutrients}
            min={0}
            max={100}
            unit="%"
            onChange={setNutrients}
          />
          <Metric label="Growth stage" value={stage} tone="emerald" />
          <Metric
            label="Growth potential"
            value={`${Math.round(healthFactor * 100)}%`}
            detail="Limited by the scarcest resource"
            tone={healthFactor > 0.65 ? "emerald" : "amber"}
          />
        </div>
      </div>
    );
  }

  if (lab.id === "food-chain-builder") {
    const trophicNames = ["Producer", "Primary consumer", "Secondary consumer", "Tertiary consumer", "Apex predator"];
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-center gap-3 rounded-2xl border border-slate-800 bg-[#071019] p-8">
          {trophicNames.slice(0, chainLength).map((name, index) => {
            const energy = producerEnergy * 0.1 ** index;
            return (
              <div key={name} className="flex items-center gap-3">
                {index > 0 ? <span className="text-2xl text-emerald-300">→</span> : null}
                <div
                  className="grid place-items-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-center text-emerald-100"
                  style={{ width: `${Math.max(105, 155 - index * 10)}px`, height: `${120 - index * 8}px` }}
                >
                  <span className="text-xs font-bold">{name}</span>
                  <span className="mt-2 text-[10px] opacity-70">{energy.toFixed(0)} kJ</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <RangeControl label="Trophic levels" value={chainLength} min={2} max={5} onChange={setChainLength} />
          <RangeControl label="Producer energy" value={producerEnergy} min={1000} max={20000} step={1000} unit=" kJ" onChange={setProducerEnergy} />
          <Metric label="Top-level energy" value={`${(producerEnergy * 0.1 ** (chainLength - 1)).toFixed(1)} kJ`} tone="emerald" />
          <Metric label="Transfer efficiency" value="10%" detail="Approximate ecological rule" tone="amber" />
        </div>
      </div>
    );
  }

  const normalizedDna = dna
    .toUpperCase()
    .replace(/[^ATCG]/g, "")
    .slice(0, 20);
  const complements: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };
  const complement = normalizedDna
    .split("")
    .map((base) => complements[base])
    .join("");
  const mutationPosition = Math.min(
    mutationIndex,
    Math.max(0, normalizedDna.length - 1),
  );
  const replacement =
    normalizedDna[mutationPosition] === "A" ? "G" : "A";
  const mutated = normalizedDna
    ? `${normalizedDna.slice(0, mutationPosition)}${replacement}${normalizedDna.slice(mutationPosition + 1)}`
    : "";

  return (
    <div className="space-y-5">
      <LabCanvas>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-5">
          {[normalizedDna, complement].map((strand, row) => (
            <div key={row} className="flex flex-wrap justify-center gap-2">
              {strand.split("").map((base, index) => (
                <span
                  key={`${row}-${index}`}
                  className={`grid size-10 place-items-center rounded-full border font-mono text-xs font-black ${
                    row === 0
                      ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                      : "border-violet-300 bg-violet-300/15 text-violet-100"
                  }`}
                >
                  {base}
                </span>
              ))}
            </div>
          ))}
        </div>
      </LabCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_240px_240px]">
        <label className="rounded-xl border border-slate-200 p-3 dark:border-white/[0.08]">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">DNA sequence</span>
          <input
            value={dna}
            onChange={(event) => setDna(event.target.value)}
            className="mt-2 h-10 w-full rounded-lg bg-slate-100 px-3 font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-white/[0.05]"
          />
        </label>
        <RangeControl label="Mutation position" value={mutationIndex} min={0} max={Math.max(0, normalizedDna.length - 1)} onChange={setMutationIndex} />
        <Metric label="Mutated strand" value={mutated || "Add bases"} tone="rose" />
      </div>
    </div>
  );
}
