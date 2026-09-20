"use client";

import { useEffect, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";

export function EnvironmentalLabs({
  lab,
  isRunning,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [temperature, setTemperature] = useState(24);
  const [humidity, setHumidity] = useState(55);
  const [emissions, setEmissions] = useState(36);
  const [years, setYears] = useState(30);
  const [travel, setTravel] = useState(800);
  const [homeEnergy, setHomeEnergy] = useState(450);
  const [diet, setDiet] = useState("mixed");
  const [source, setSource] = useState("solar");
  const [resource, setResource] = useState(65);
  const [capacity, setCapacity] = useState(20);

  useEffect(() => {
    setTemperature(24);
    setHumidity(55);
    setEmissions(36);
    setYears(30);
    setTravel(800);
    setHomeEnergy(450);
    setDiet("mixed");
    setSource("solar");
    setResource(65);
    setCapacity(20);
  }, [resetSignal]);

  if (lab.id === "water-cycle") {
    const evaporation = Math.max(0, temperature * (1 - humidity / 120));
    const precipitation = Math.max(0, humidity * 0.13 - temperature * 0.08);
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-24 bg-cyan-800" />
            <div className="absolute bottom-20 left-0 h-32 w-72 rounded-tr-[100%] bg-emerald-800" />
            <div className="absolute right-10 top-12 h-20 w-52 rounded-full bg-slate-300/80" />
            {isRunning
              ? Array.from({ length: Math.round(evaporation / 3) }, (_, index) => (
                  <span key={`e-${index}`} className="absolute bottom-20 h-16 w-px animate-pulse bg-cyan-200" style={{ left: `${50 + index * 4}%`, animationDelay: `${index * 100}ms` }} />
                ))
              : null}
            {isRunning
              ? Array.from({ length: Math.round(precipitation) }, (_, index) => (
                  <span key={`p-${index}-${runSignal}`} className="absolute top-28 h-10 w-1 animate-bounce rounded-full bg-cyan-300" style={{ right: `${12 + index * 4}%`, animationDelay: `${index * 90}ms` }} />
                ))
              : null}
            <div className="absolute left-16 top-16 size-24 rounded-full bg-amber-300 shadow-[0_0_45px_rgba(251,191,36,.7)]" />
          </div>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Air temperature" value={temperature} min={5} max={45} unit="°C" onChange={setTemperature} />
          <RangeControl label="Humidity" value={humidity} min={10} max={100} unit="%" onChange={setHumidity} />
          <Metric label="Evaporation rate" value={`${evaporation.toFixed(1)} mm/day`} />
          <Metric label="Precipitation potential" value={`${precipitation.toFixed(1)} mm`} tone="violet" />
        </div>
      </div>
    );
  }

  if (lab.id === "climate-change") {
    const warming = (emissions / 36) * (years / 30) * 1.1;
    const points = Array.from({ length: 31 }, (_, index) => {
      const progress = index / 30;
      const value = progress * warming + Math.sin(index * 0.9) * 0.03;
      return `${20 + progress * 560},${320 - value * 115}`;
    }).join(" ");
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <svg key={runSignal} viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Climate warming projection">
            {[1, 2, 3].map((level) => <line key={level} x1="20" y1={320 - level * 90} x2="580" y2={320 - level * 90} stroke="#334155" strokeDasharray="5 6" />)}
            <polyline points={points} fill="none" stroke="#fb7185" strokeWidth="6" className="drop-shadow-[0_0_10px_rgba(251,113,133,.5)]" />
            <text x="30" y="45" fill="#94a3b8" fontSize="11">projected warming</text>
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Annual emissions" value={emissions} min={5} max={60} unit=" GtCO2" onChange={setEmissions} />
          <RangeControl label="Projection horizon" value={years} min={10} max={80} unit=" yr" onChange={setYears} />
          <Metric label="Relative warming" value={`+${warming.toFixed(2)}°C`} tone={warming > 2 ? "rose" : "amber"} />
          <Metric label="Scenario" value={emissions < 20 ? "Strong mitigation" : emissions < 40 ? "Moderate pathway" : "High emissions"} />
        </div>
      </div>
    );
  }

  if (lab.id === "carbon-footprint") {
    const dietFactor = diet === "plant" ? 0.9 : diet === "mixed" ? 1.7 : 2.8;
    const travelFootprint = travel * 0.00021;
    const energyFootprint = homeEnergy * 0.00042;
    const annual = (travelFootprint + energyFootprint + dietFactor) * 12;
    const categories = [
      { label: "Travel", value: travelFootprint * 12, color: "bg-cyan-400" },
      { label: "Home", value: energyFootprint * 12, color: "bg-violet-400" },
      { label: "Food", value: dietFactor * 12, color: "bg-amber-400" },
    ];
    const max = Math.max(...categories.map((item) => item.value));
    return (
      <div className="space-y-5">
        <LabCanvas>
          <div className="absolute inset-0 flex items-end justify-center gap-12 p-10">
            {categories.map((item) => (
              <div key={item.label} className="flex h-64 w-28 flex-col justify-end">
                <div className={`rounded-t-xl ${item.color}`} style={{ height: `${(item.value / max) * 210}px` }} />
                <p className="py-3 text-center text-xs font-bold text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </LabCanvas>
        <div className="grid gap-3 md:grid-cols-4">
          <RangeControl label="Monthly travel" value={travel} min={0} max={3000} step={50} unit=" km" onChange={setTravel} />
          <RangeControl label="Home energy" value={homeEnergy} min={100} max={1500} step={25} unit=" kWh" onChange={setHomeEnergy} />
          <SegmentedControl label="Diet" value={diet} options={[{ value: "plant", label: "Plant-rich" }, { value: "mixed", label: "Mixed" }, { value: "meat", label: "Meat-heavy" }]} onChange={setDiet} />
          <Metric label="Annual footprint" value={`${annual.toFixed(1)} tCO2e`} tone={annual < 20 ? "emerald" : annual < 35 ? "amber" : "rose"} />
        </div>
      </div>
    );
  }

  const factors = { solar: 0.2, wind: 0.36, hydro: 0.52 };
  const dailyEnergy = capacity * 24 * factors[source as keyof typeof factors] * (resource / 100);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
      <LabCanvas>
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-sky-800 to-emerald-950">
          {source === "solar" ? (
            <div className="absolute inset-x-0 bottom-10 flex justify-center gap-4">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 w-28 -skew-x-12 border-4 border-cyan-200 bg-blue-600/70 [background-image:linear-gradient(#fff2_1px,transparent_1px),linear-gradient(90deg,#fff2_1px,transparent_1px)] [background-size:20px_20px]" />)}
            </div>
          ) : source === "wind" ? (
            <div className="absolute inset-0 flex items-center justify-around">
              {Array.from({ length: 3 }, (_, index) => <div key={index} className="relative h-60 w-4 bg-slate-200"><div className={`absolute -left-16 -top-4 size-36 rounded-full border-y-[10px] border-cyan-200 ${isRunning ? "animate-spin" : ""}`} /></div>)}
            </div>
          ) : (
            <div className="absolute inset-x-0 bottom-0 h-52 bg-cyan-700"><div className="absolute left-1/2 top-6 h-44 w-80 -translate-x-1/2 rounded-t-[50%] border-8 border-slate-300 bg-slate-700" /></div>
          )}
        </div>
      </LabCanvas>
      <div className="space-y-4">
        <SegmentedControl label="Energy source" value={source} options={[{ value: "solar", label: "Solar" }, { value: "wind", label: "Wind" }, { value: "hydro", label: "Hydro" }]} onChange={setSource} />
        <RangeControl label="Resource quality" value={resource} min={20} max={100} unit="%" onChange={setResource} />
        <RangeControl label="Installed capacity" value={capacity} min={1} max={100} unit=" kW" onChange={setCapacity} />
        <Metric label="Daily generation" value={`${dailyEnergy.toFixed(1)} kWh`} tone="emerald" />
        <Metric label="Capacity factor" value={`${(factors[source as keyof typeof factors] * resource).toFixed(1)}%`} />
      </div>
    </div>
  );
}
