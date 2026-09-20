"use client";

import { Droplets, Leaf, Sprout, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";

export function AgricultureLabs({
  lab,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [moisture, setMoisture] = useState(58);
  const [canopy, setCanopy] = useState(72);
  const [temperature, setTemperature] = useState(27);
  const [fieldArea, setFieldArea] = useState(5);
  const [depth, setDepth] = useState(12);
  const [method, setMethod] = useState("drip");
  const [crops, setCrops] = useState(["Legume", "Cereal", "Root", "Cover"]);
  const [organicMatter, setOrganicMatter] = useState(4);
  const [ph, setPh] = useState(6.5);
  const [nitrogen, setNitrogen] = useState(60);

  useEffect(() => {
    setMoisture(58);
    setCanopy(72);
    setTemperature(27);
    setFieldArea(5);
    setDepth(12);
    setMethod("drip");
    setCrops(["Legume", "Cereal", "Root", "Cover"]);
    setOrganicMatter(4);
    setPh(6.5);
    setNitrogen(60);
  }, [resetSignal]);

  if (lab.id === "smart-farming") {
    const fieldScore = Math.max(0, Math.min(100, moisture * 0.35 + canopy * 0.45 + (100 - Math.abs(25 - temperature) * 7) * 0.2));
    const sensors = [
      { label: "Soil moisture", value: `${moisture}%`, Icon: Droplets, tone: "text-cyan-400" },
      { label: "Canopy index", value: `${canopy}%`, Icon: Leaf, tone: "text-emerald-400" },
      { label: "Air temperature", value: `${temperature}°C`, Icon: Sun, tone: "text-amber-400" },
      { label: "Field health", value: `${fieldScore.toFixed(0)}%`, Icon: Sprout, tone: "text-violet-400" },
    ];
    return (
      <div className="space-y-5">
        <LabCanvas className="p-8">
          <div className="grid min-h-[300px] gap-4 sm:grid-cols-2">
            {sensors.map(({ label, value, Icon, tone }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <Icon className={`size-6 ${tone}`} aria-hidden="true" />
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black text-white">{value}</p>
                <div className="mt-4 h-1.5 rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: value }} /></div>
              </div>
            ))}
          </div>
        </LabCanvas>
        <div className="grid gap-3 md:grid-cols-4">
          <RangeControl label="Soil moisture" value={moisture} min={0} max={100} unit="%" onChange={setMoisture} />
          <RangeControl label="Canopy health" value={canopy} min={0} max={100} unit="%" onChange={setCanopy} />
          <RangeControl label="Temperature" value={temperature} min={5} max={45} unit="°C" onChange={setTemperature} />
          <Metric label="Recommendation" value={moisture < 40 ? "Irrigate now" : fieldScore > 75 ? "Crop thriving" : "Monitor field"} tone={fieldScore > 70 ? "emerald" : "amber"} />
        </div>
      </div>
    );
  }

  if (lab.id === "irrigation-simulator") {
    const efficiencies = { flood: 0.55, sprinkler: 0.75, drip: 0.92 };
    const efficiency = efficiencies[method as keyof typeof efficiencies];
    const water = (fieldArea * 10000 * (depth / 1000)) / efficiency;
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <LabCanvas>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900 to-emerald-950">
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-8 gap-2 p-8">
              {Array.from({ length: 24 }, (_, index) => <div key={index} className="relative h-20"><div className="absolute bottom-0 left-1/2 h-14 w-1 -translate-x-1/2 bg-emerald-600" /><div className="absolute left-1/2 top-1 size-8 -translate-x-1/2 rounded-full bg-emerald-400" />{method === "drip" ? <span className="absolute bottom-0 left-1/2 size-2 rounded-full bg-cyan-300" /> : null}</div>)}
            </div>
            {method === "sprinkler" ? <div key={runSignal} className="absolute bottom-24 left-1/2 h-44 w-[70%] -translate-x-1/2 rounded-t-full border-t-4 border-cyan-300/70" /> : null}
            {method === "flood" ? <div className="absolute inset-x-0 bottom-0 h-16 bg-cyan-500/40" /> : null}
          </div>
        </LabCanvas>
        <div className="space-y-4">
          <SegmentedControl label="Irrigation method" value={method} options={[{ value: "flood", label: "Flood" }, { value: "sprinkler", label: "Sprinkler" }, { value: "drip", label: "Drip" }]} onChange={setMethod} />
          <RangeControl label="Field area" value={fieldArea} min={1} max={50} unit=" ha" onChange={setFieldArea} />
          <RangeControl label="Application depth" value={depth} min={2} max={30} unit=" mm" onChange={setDepth} />
          <Metric label="Water required" value={`${Math.round(water).toLocaleString()} L`} />
          <Metric label="Efficiency" value={`${Math.round(efficiency * 100)}%`} tone="emerald" />
        </div>
      </div>
    );
  }

  if (lab.id === "crop-rotation") {
    const cropOptions = ["Legume", "Cereal", "Root", "Oilseed", "Cover"];
    const diversity = new Set(crops).size;
    const soilBenefit = Math.min(100, diversity * 18 + (crops.includes("Legume") ? 15 : 0) + (crops.includes("Cover") ? 12 : 0));
    return (
      <div className="space-y-5">
        <LabCanvas className="p-8">
          <div className="flex min-h-[300px] items-center justify-center gap-3">
            {crops.map((crop, index) => (
              <div key={index} className="flex items-center gap-3">
                {index > 0 ? <span className="text-2xl text-emerald-300">→</span> : null}
                <div className="w-28 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-center">
                  <span className="text-[9px] uppercase text-slate-400">Year {index + 1}</span>
                  <Sprout className="mx-auto my-4 size-8 text-emerald-300" aria-hidden="true" />
                  <select value={crop} onChange={(event) => setCrops((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} className="w-full bg-transparent text-center text-xs font-bold text-white outline-none">
                    {cropOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </LabCanvas>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Crop diversity" value={`${diversity} crop groups`} tone="emerald" />
          <Metric label="Soil benefit" value={`${soilBenefit}%`} />
          <Metric label="Nitrogen contribution" value={crops.includes("Legume") ? "Improved" : "Add a legume"} tone={crops.includes("Legume") ? "emerald" : "amber"} />
        </div>
      </div>
    );
  }

  const phScore = Math.max(0, 100 - Math.abs(ph - 6.5) * 28);
  const soilScore = Math.min(100, organicMatter * 11 + phScore * 0.35 + nitrogen * 0.25);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
      <LabCanvas>
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-b from-amber-800 to-amber-950">
            {Array.from({ length: Math.round(organicMatter * 4) }, (_, index) => <span key={index} className="absolute size-2 rounded-full bg-emerald-300/60" style={{ left: `${5 + (index * 17) % 90}%`, top: `${8 + (index * 29) % 80}%` }} />)}
            <div className="absolute left-1/2 top-8 h-44 w-2 -translate-x-1/2 bg-emerald-600" />
            <div className="absolute left-1/2 top-0 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400" />
          </div>
          <div className="absolute left-8 top-8 rounded-2xl border border-white/10 bg-black/25 p-4 text-white backdrop-blur">
            <p className="text-[9px] uppercase text-slate-400">Soil health</p>
            <p className="mt-1 text-4xl font-black">{soilScore.toFixed(0)}</p>
          </div>
        </div>
      </LabCanvas>
      <div className="space-y-3">
        <RangeControl label="Organic matter" value={organicMatter} min={0.5} max={10} step={0.5} unit="%" onChange={setOrganicMatter} />
        <RangeControl label="Soil pH" value={ph} min={3.5} max={9} step={0.1} onChange={setPh} />
        <RangeControl label="Available nitrogen" value={nitrogen} min={0} max={100} unit="%" onChange={setNitrogen} />
        <Metric label="Soil score" value={`${soilScore.toFixed(0)} / 100`} tone={soilScore > 70 ? "emerald" : "amber"} />
        <Metric label="pH diagnosis" value={ph < 5.8 ? "Too acidic" : ph > 7.5 ? "Too alkaline" : "Optimal range"} tone={ph >= 5.8 && ph <= 7.5 ? "emerald" : "rose"} />
      </div>
    </div>
  );
}
