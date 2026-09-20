"use client";

import { memo, useEffect, useMemo, useState } from "react";

import { LabCanvas, Metric } from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";
import {
  elementCategories,
  getCategoryColor,
  periodicElements,
  type PeriodicElement,
} from "@/lib/periodic-table-data";
import type { ElementCategory } from "@/types";

function PeriodicTableLabComponent({
  isPaused,
  isRunning,
  resetSignal,
}: LabRendererProps) {
  const [selectedNumber, setSelectedNumber] = useState(6);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ElementCategory | "all">(
    "all",
  );

  useEffect(() => {
    setSelectedNumber(6);
    setSearch("");
    setCategoryFilter("all");
  }, [resetSignal]);

  const selected = useMemo(
    () =>
      periodicElements.find((item) => item.atomicNumber === selectedNumber) ??
      periodicElements[5],
    [selectedNumber],
  );

  const filteredElements = useMemo(() => {
    const query = search.trim().toLowerCase();
    return periodicElements.filter((element) => {
      const matchesCategory =
        categoryFilter === "all" || element.category === categoryFilter;
      const matchesSearch =
        query.length === 0 ||
        element.name.toLowerCase().includes(query) ||
        element.symbol.toLowerCase().includes(query) ||
        String(element.atomicNumber).includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, search]);

  const visibleNumbers = useMemo(
    () => new Set(filteredElements.map((element) => element.atomicNumber)),
    [filteredElements],
  );

  function renderCell(element: PeriodicElement) {
    const visible = visibleNumbers.has(element.atomicNumber);
    const color = getCategoryColor(element.category);
    const isSelected = element.atomicNumber === selectedNumber;

    return (
      <button
        key={element.atomicNumber}
        type="button"
        onClick={() => setSelectedNumber(element.atomicNumber)}
        disabled={!visible}
        style={{
          gridRow: element.gridRow,
          gridColumn: element.gridCol,
          borderColor: color,
          backgroundColor: `${color}22`,
          color,
        }}
        className={`min-h-[52px] rounded-lg border p-1.5 text-left transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-15 sm:min-h-[58px] ${
          isSelected ? "ring-2 ring-white" : ""
        } ${
          isSelected && isRunning && !isPaused ? "animate-pulse" : ""
        }`}
        aria-label={`${element.name}, atomic number ${element.atomicNumber}`}
      >
        <span className="text-[8px] opacity-80 sm:text-[9px]">
          {element.atomicNumber}
        </span>
        <span className="block text-sm font-black sm:text-base">
          {element.symbol}
        </span>
        <span className="block truncate text-[7px] opacity-75 sm:text-[8px]">
          {element.name}
        </span>
      </button>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Search elements
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, symbol, or atomic number"
              className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 dark:border-white/[0.08] dark:bg-white/[0.04]"
            />
          </label>
          <label className="sm:w-56">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Filter by category
            </span>
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value as ElementCategory | "all")
              }
              className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 dark:border-white/[0.08] dark:bg-white/[0.04]"
            >
              <option value="all">All categories</option>
              {elementCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {elementCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                setCategoryFilter((current) =>
                  current === category.id ? "all" : category.id,
                )
              }
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${
                categoryFilter === category.id
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-slate-200 text-slate-500 dark:border-white/[0.08]"
              }`}
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.label}
            </button>
          ))}
        </div>

        <LabCanvas className="overflow-x-auto p-3 sm:p-4">
          <div
            className="grid min-w-[720px] gap-1"
            style={{
              gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
              gridTemplateRows: "repeat(9, minmax(52px, auto))",
            }}
          >
            {periodicElements.map((element) => renderCell(element))}
          </div>
        </LabCanvas>
      </div>

      <aside className="space-y-3">
        <Metric label="Element" value={selected.name} tone="violet" />
        <Metric label="Symbol" value={selected.symbol} />
        <Metric
          label="Atomic number"
          value={String(selected.atomicNumber)}
          tone="cyan"
        />
        <Metric
          label="Atomic mass"
          value={`${selected.atomicMass} u`}
          tone="amber"
        />
        <Metric
          label="Category"
          value={
            selected.category === "reactive-nonmetal"
              ? "Nonmetals"
              : selected.categoryLabel
          }
          tone="emerald"
        />
        <Metric label="Period" value={String(selected.period)} />
        <Metric label="Group" value={String(selected.group)} />
        <Metric
          label="Electron configuration"
          value={selected.electronConfiguration}
          tone="violet"
        />
        <Metric label="Common uses" value={selected.commonUses} />
        <p className="rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-600 dark:bg-white/[0.03] dark:text-slate-300">
          {selected.explanation}
        </p>
      </aside>
    </div>
  );
}

export const PeriodicTableLab = memo(PeriodicTableLabComponent);
