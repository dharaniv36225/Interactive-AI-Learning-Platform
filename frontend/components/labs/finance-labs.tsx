"use client";

import { useEffect, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FinanceLabs({
  lab,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [monthly, setMonthly] = useState(300);
  const [risk, setRisk] = useState("balanced");
  const [income, setIncome] = useState(5000);
  const [housing, setHousing] = useState(1600);
  const [living, setLiving] = useState(1400);
  const [goals, setGoals] = useState(800);
  const [portfolio, setPortfolio] = useState("balanced");
  const [horizon, setHorizon] = useState(12);

  useEffect(() => {
    setPrincipal(5000);
    setRate(7);
    setYears(10);
    setMonthly(300);
    setRisk("balanced");
    setIncome(5000);
    setHousing(1600);
    setLiving(1400);
    setGoals(800);
    setPortfolio("balanced");
    setHorizon(12);
  }, [resetSignal]);

  if (lab.id === "compound-interest") {
    const future = principal * (1 + rate / 100) ** years;
    const points = Array.from({ length: years + 1 }, (_, year) => {
      const value = principal * (1 + rate / 100) ** year;
      return `${20 + (year / years) * 560},${320 - (value / future) * 260}`;
    }).join(" ");
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <svg key={runSignal} viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Compound growth chart">
            <defs><linearGradient id="growth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#34d399" stopOpacity=".45" /><stop offset="1" stopColor="#34d399" stopOpacity="0" /></linearGradient></defs>
            <polyline points={points} fill="none" stroke="#34d399" strokeWidth="6" />
            <polygon points={`20,320 ${points} 580,320`} fill="url(#growth)" />
            <text x="30" y="45" fill="#d1fae5" fontSize="14">{money(future)}</text>
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Starting principal" value={principal} min={500} max={50000} step={500} unit=" $" onChange={setPrincipal} />
          <RangeControl label="Annual return" value={rate} min={1} max={15} step={0.5} unit="%" onChange={setRate} />
          <RangeControl label="Time" value={years} min={1} max={30} unit=" yr" onChange={setYears} />
          <Metric label="Future value" value={money(future)} tone="emerald" />
          <Metric label="Interest earned" value={money(future - principal)} />
        </div>
      </div>
    );
  }

  if (lab.id === "investment-simulator") {
    const returns = { conservative: 0.04, balanced: 0.07, growth: 0.1 };
    const monthlyRate = returns[risk as keyof typeof returns] / 12;
    const months = years * 12;
    const future = principal * (1 + monthlyRate) ** months + monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    const contributed = principal + monthly * months;
    return (
      <div className="space-y-5">
        <LabCanvas>
          <div className="absolute inset-0 flex items-end justify-center gap-20 p-12">
            {[{ label: "Contributed", value: contributed, color: "bg-cyan-400" }, { label: "Projected", value: future, color: "bg-emerald-400" }].map((item) => (
              <div key={item.label} className="flex h-64 w-36 flex-col justify-end">
                <span className="mb-2 text-center text-xs font-bold text-white">{money(item.value)}</span>
                <div className={`rounded-t-2xl ${item.color}`} style={{ height: `${Math.max(30, (item.value / future) * 220)}px` }} />
                <span className="py-3 text-center text-xs text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </LabCanvas>
        <div className="grid gap-3 md:grid-cols-4">
          <RangeControl label="Monthly contribution" value={monthly} min={50} max={2000} step={50} unit=" $" onChange={setMonthly} />
          <RangeControl label="Years" value={years} min={1} max={35} onChange={setYears} />
          <SegmentedControl label="Strategy" value={risk} options={[{ value: "conservative", label: "Conservative" }, { value: "balanced", label: "Balanced" }, { value: "growth", label: "Growth" }]} onChange={setRisk} />
          <Metric label="Projected balance" value={money(future)} tone="emerald" />
        </div>
      </div>
    );
  }

  if (lab.id === "budget-planner") {
    const expenses = housing + living + goals;
    const surplus = income - expenses;
    const rows = [
      { label: "Housing", value: housing, setter: setHousing, color: "bg-violet-400" },
      { label: "Living", value: living, setter: setLiving, color: "bg-cyan-400" },
      { label: "Goals", value: goals, setter: setGoals, color: "bg-emerald-400" },
    ];
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <LabCanvas>
          <div className="absolute inset-0 grid place-items-center p-10">
            <div className="w-full max-w-xl overflow-hidden rounded-full border-4 border-white/10 bg-slate-800">
              <div className="flex h-24">
                {rows.map((row) => <div key={row.label} className={`${row.color} grid place-items-center text-[10px] font-black text-slate-950`} style={{ width: `${Math.min(100, (row.value / income) * 100)}%` }}>{row.label}</div>)}
                {surplus > 0 ? <div className="grid place-items-center bg-amber-300 text-[10px] font-black text-slate-950" style={{ width: `${(surplus / income) * 100}%` }}>Free</div> : null}
              </div>
            </div>
          </div>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Monthly income" value={income} min={1500} max={15000} step={100} unit=" $" onChange={setIncome} />
          {rows.map((row) => <RangeControl key={row.label} label={row.label} value={row.value} min={0} max={Math.max(500, income)} step={50} unit=" $" onChange={row.setter} />)}
          <Metric label="Monthly surplus" value={money(surplus)} tone={surplus >= 0 ? "emerald" : "rose"} />
        </div>
      </div>
    );
  }

  const profiles = {
    cautious: { risk: 4, return: 4.5 },
    balanced: { risk: 10, return: 7.2 },
    growth: { risk: 18, return: 10.4 },
  };
  const selected = profiles[portfolio as keyof typeof profiles];
  const projected = principal * (1 + selected.return / 100) ** horizon;
  const dots = Object.entries(profiles);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
      <LabCanvas>
        <svg viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Risk and return scatter plot">
          <line x1="50" y1="310" x2="560" y2="310" stroke="#64748b" />
          <line x1="50" y1="40" x2="50" y2="310" stroke="#64748b" />
          {dots.map(([name, profile]) => {
            const active = name === portfolio;
            return <g key={name}><circle cx={70 + profile.risk * 24} cy={300 - profile.return * 21} r={active ? 22 : 14} fill={active ? "#34d399" : "#a78bfa"} /><text x={70 + profile.risk * 24} y={270 - profile.return * 21} textAnchor="middle" fill="#e2e8f0" fontSize="11">{name}</text></g>;
          })}
          <text x="470" y="340" fill="#94a3b8" fontSize="11">risk →</text>
          <text x="12" y="45" fill="#94a3b8" fontSize="11">return</text>
        </svg>
      </LabCanvas>
      <div className="space-y-4">
        <SegmentedControl label="Portfolio" value={portfolio} options={[{ value: "cautious", label: "Cautious" }, { value: "balanced", label: "Balanced" }, { value: "growth", label: "Growth" }]} onChange={setPortfolio} />
        <RangeControl label="Time horizon" value={horizon} min={1} max={30} unit=" yr" onChange={setHorizon} />
        <Metric label="Expected return" value={`${selected.return}% / year`} tone="emerald" />
        <Metric label="Volatility" value={`${selected.risk}%`} tone="rose" />
        <Metric label="Projected value" value={money(projected)} />
      </div>
    </div>
  );
}
