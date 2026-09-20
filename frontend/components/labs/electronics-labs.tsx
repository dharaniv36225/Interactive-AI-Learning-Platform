"use client";

import { useEffect, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";

const resistorColors = [
  { name: "Black", value: 0, className: "bg-black" },
  { name: "Brown", value: 1, className: "bg-amber-900" },
  { name: "Red", value: 2, className: "bg-red-600" },
  { name: "Orange", value: 3, className: "bg-orange-500" },
  { name: "Yellow", value: 4, className: "bg-yellow-400" },
  { name: "Green", value: 5, className: "bg-green-600" },
  { name: "Blue", value: 6, className: "bg-blue-600" },
  { name: "Violet", value: 7, className: "bg-violet-600" },
  { name: "Gray", value: 8, className: "bg-slate-500" },
  { name: "White", value: 9, className: "bg-white" },
] as const;

export function ElectronicsLabs({
  lab,
  isRunning,
  resetSignal,
}: LabRendererProps) {
  const [gate, setGate] = useState("AND");
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [supply, setSupply] = useState(5);
  const [resistance, setResistance] = useState(220);
  const [forwardVoltage, setForwardVoltage] = useState(2);
  const [band1, setBand1] = useState(2);
  const [band2, setBand2] = useState(2);
  const [multiplier, setMultiplier] = useState(1);
  const [gates, setGates] = useState(4);
  const [clock, setClock] = useState(10);
  const [enabledBlocks, setEnabledBlocks] = useState([true, true, false, true]);

  useEffect(() => {
    setGate("AND");
    setInputA(false);
    setInputB(false);
    setSupply(5);
    setResistance(220);
    setForwardVoltage(2);
    setBand1(2);
    setBand2(2);
    setMultiplier(1);
    setGates(4);
    setClock(10);
    setEnabledBlocks([true, true, false, true]);
  }, [resetSignal]);

  if (lab.id === "logic-gate-simulator") {
    const output =
      gate === "AND"
        ? inputA && inputB
        : gate === "OR"
          ? inputA || inputB
          : gate === "XOR"
            ? inputA !== inputB
            : !inputA;
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <div className="absolute inset-0 flex items-center justify-center gap-5">
            <div className="space-y-16">
              {[["A", inputA, setInputA], ["B", inputB, setInputB]].map(([label, value, setter]) => (
                <button key={String(label)} type="button" onClick={() => (setter as (next: boolean) => void)(!value)} className={`grid size-16 place-items-center rounded-xl border-4 font-black ${value ? "border-emerald-200 bg-emerald-400 text-slate-950" : "border-slate-600 bg-slate-800 text-slate-400"}`}>
                  {String(label)}={value ? "1" : "0"}
                </button>
              ))}
            </div>
            <div className="h-1 w-16 bg-slate-500" />
            <div className="grid h-44 w-56 place-items-center rounded-r-full rounded-l-2xl border-4 border-violet-300 bg-violet-300/15 text-3xl font-black text-violet-100">{gate}</div>
            <div className="h-1 w-16 bg-slate-500" />
            <div className={`grid size-20 place-items-center rounded-full border-4 text-2xl font-black ${output ? "border-emerald-100 bg-emerald-400 text-slate-950 shadow-[0_0_30px_#34d399]" : "border-slate-600 bg-slate-900 text-slate-500"}`}>{output ? "1" : "0"}</div>
          </div>
        </LabCanvas>
        <div className="space-y-4">
          <SegmentedControl label="Gate type" value={gate} options={["AND", "OR", "XOR", "NOT"].map((value) => ({ value, label: value }))} onChange={setGate} />
          <Metric label="Boolean expression" value={gate === "NOT" ? "¬A" : `A ${gate} B`} tone="violet" />
          <Metric label="Output" value={output ? "TRUE (1)" : "FALSE (0)"} tone={output ? "emerald" : "rose"} />
        </div>
      </div>
    );
  }

  if (lab.id === "led-circuit") {
    const current = Math.max(0, (supply - forwardVoltage) / resistance);
    const lit = isRunning && current > 0;
    const safe = current > 0.005 && current < 0.025;
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative h-64 w-[80%] rounded-3xl border-4 border-cyan-400">
              <div className="absolute -left-8 top-1/2 grid size-20 -translate-y-1/2 place-items-center rounded-xl bg-amber-300 font-black text-slate-950">{supply}V</div>
              <div className="absolute left-1/2 -top-7 -translate-x-1/2 rounded-xl border-4 border-amber-600 bg-amber-100 px-7 py-4 font-mono font-black text-slate-950">{resistance}Ω</div>
              <div className={`absolute -right-10 top-1/2 grid size-24 -translate-y-1/2 place-items-center rounded-full border-8 ${lit ? "border-white bg-rose-400 shadow-[0_0_55px_rgba(251,113,133,.9)]" : "border-slate-600 bg-slate-800"}`}>LED</div>
            </div>
          </div>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Supply voltage" value={supply} min={2} max={12} unit=" V" onChange={setSupply} />
          <RangeControl label="LED forward voltage" value={forwardVoltage} min={1.5} max={3.5} step={0.1} unit=" V" onChange={setForwardVoltage} />
          <RangeControl label="Series resistance" value={resistance} min={50} max={1000} step={10} unit=" Ω" onChange={setResistance} />
          <Metric label="LED current" value={`${(current * 1000).toFixed(1)} mA`} tone={safe ? "emerald" : "rose"} />
          <Metric label="Safety" value={safe ? "Safe operating range" : "Adjust resistance"} />
        </div>
      </div>
    );
  }

  if (lab.id === "resistor-tool") {
    const ohms = (band1 * 10 + band2) * 10 ** multiplier;
    return (
      <div className="space-y-5">
        <LabCanvas>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-24 bg-slate-400" />
            <div className="flex h-32 w-80 items-stretch justify-center gap-7 rounded-[45%] border-4 border-amber-700 bg-amber-200 px-14">
              {[band1, band2, multiplier].map((colorIndex, index) => <span key={index} className={`w-7 ${resistorColors[colorIndex].className}`} />)}
              <span className="w-7 bg-yellow-500" />
            </div>
            <div className="h-2 w-24 bg-slate-400" />
          </div>
        </LabCanvas>
        <div className="grid gap-4 md:grid-cols-4">
          {[["First digit", band1, setBand1], ["Second digit", band2, setBand2], ["Multiplier", multiplier, setMultiplier]].map(([label, value, setter]) => (
            <label key={String(label)} className="rounded-xl border border-slate-200 p-3 dark:border-white/[0.08]">
              <span className="text-[9px] font-bold uppercase text-slate-400">{String(label)}</span>
              <select value={Number(value)} onChange={(event) => (setter as (next: number) => void)(Number(event.target.value))} className="mt-2 h-10 w-full rounded-lg bg-slate-100 px-2 text-xs dark:bg-slate-900">
                {resistorColors.map((color, index) => <option key={color.name} value={index}>{color.name}</option>)}
              </select>
            </label>
          ))}
          <Metric label="Resistance" value={ohms >= 1000 ? `${(ohms / 1000).toFixed(1)} kΩ` : `${ohms} Ω`} detail="Gold tolerance: ±5%" tone="amber" />
        </div>
      </div>
    );
  }

  const active = enabledBlocks.filter(Boolean).length;
  const relativePower = active * clock * 0.24;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <LabCanvas>
        <div className="absolute inset-0 grid grid-cols-2 gap-6 p-10">
          {["Clock", "Counter", "Memory", "Output"].map((block, index) => (
            <button key={block} type="button" onClick={() => setEnabledBlocks((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} className={`rounded-2xl border-4 text-lg font-black transition ${enabledBlocks[index] ? "border-cyan-200 bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,.35)]" : "border-slate-700 bg-slate-900 text-slate-500"}`}>
              {block}
              <span className="mt-2 block text-[10px]">{enabledBlocks[index] ? "ACTIVE" : "OFF"}</span>
            </button>
          ))}
        </div>
      </LabCanvas>
      <div className="space-y-3">
        <RangeControl label="Gate count" value={gates} min={2} max={16} onChange={setGates} />
        <RangeControl label="Clock frequency" value={clock} min={1} max={100} unit=" MHz" onChange={setClock} />
        <Metric label="Active blocks" value={`${active} / 4`} />
        <Metric label="Relative power" value={`${relativePower.toFixed(1)} mW`} tone="amber" />
        <Metric label="Logic gates" value={String(gates * active)} tone="violet" />
      </div>
    </div>
  );
}
