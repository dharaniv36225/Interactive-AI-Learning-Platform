"use client";

import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Binary,
  Bot,
  BrainCircuit,
  CircuitBoard,
  Coins,
  Dna,
  FlaskConical,
  Leaf,
  LoaderCircle,
  Orbit,
  Search,
  Sigma,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { subjectsMeta } from "@/lib/subjects-meta";
import type { LabDefinition } from "@/types";

const subjectById = new Map(
  subjectsMeta.map((subject) => [subject.id, subject] as const),
);

const subjectVisuals: Record<
  string,
  { Icon: LucideIcon; className: string }
> = {
  physics: {
    Icon: Orbit,
    className:
      "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
  },
  chemistry: {
    Icon: FlaskConical,
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  },
  biology: {
    Icon: Dna,
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  mathematics: {
    Icon: Sigma,
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  "computer-science": {
    Icon: Binary,
    className:
      "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
  },
  "artificial-intelligence": {
    Icon: BrainCircuit,
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  },
  "machine-learning": {
    Icon: Atom,
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  },
  robotics: {
    Icon: Bot,
    className:
      "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
  },
  electronics: {
    Icon: CircuitBoard,
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  "environmental-science": {
    Icon: Leaf,
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  finance: {
    Icon: Coins,
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  agriculture: {
    Icon: Sprout,
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
};

export function LabCatalog() {
  const [labs, setLabs] = useState<LabDefinition[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void import("@/lib/labs").then((module) => {
      if (isMounted) {
        setLabs(module.labs);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredLabs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return labs.filter(
      (lab) =>
        (selectedSubjectId === "all" ||
          lab.subjectId === selectedSubjectId) &&
        (!query ||
          lab.title.toLowerCase().includes(query) ||
          lab.description.toLowerCase().includes(query)),
    );
  }, [labs, searchQuery, selectedSubjectId]);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Interactive experiments"
        title="Multi-Subject Labs"
        description="Explore science, technology, mathematics, finance, and agriculture through adjustable simulations, builders, and calculators."
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07] dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {isLoading ? "Loading lab catalog" : `${labs.length} labs ready`}
          </div>
        }
      />

      <section className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] md:grid-cols-[1fr_280px]">
        <label className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400"
            aria-hidden="true"
          />
          <span className="sr-only">Search labs</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-white/[0.025]"
            placeholder="Search labs..."
          />
        </label>
        <label>
          <span className="sr-only">Filter labs by subject</span>
          <select
            value={selectedSubjectId}
            onChange={(event) => setSelectedSubjectId(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-[#111720]"
          >
            <option value="all">All subjects</option>
            {subjectsMeta.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center">
          <LoaderCircle
            className="size-6 animate-spin text-cyan-500"
            aria-hidden="true"
          />
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredLabs.map((lab) => {
            const subject = subjectById.get(lab.subjectId);
            const visual =
              subjectVisuals[lab.subjectId] ?? subjectVisuals.physics;
            const LabIcon = visual.Icon;

            return (
              <article
                key={lab.id}
                className="group flex min-h-64 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow transition hover:-translate-y-0.5 hover:border-violet-300 dark:border-white/[0.08] dark:bg-[#0e131b] dark:hover:border-violet-400/30"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`grid size-10 place-items-center rounded-xl ${visual.className}`}
                  >
                    <LabIcon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/[0.06]">
                    {lab.category}
                  </span>
                </div>
                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-400">
                  {subject?.name ?? "Interactive Lab"}
                </p>
                <h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">
                  {lab.title}
                </h2>
                <p className="mt-2 flex-1 text-xs leading-5 text-slate-500">
                  {lab.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                  <Sparkles className="size-3.5" aria-hidden="true" />+
                  {lab.xpReward} XP on first run
                </div>
                <Link
                  href={`/lab/${lab.id}`}
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white transition group-hover:bg-violet-500 dark:bg-white dark:text-slate-950"
                >
                  Open lab
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </section>
      )}

      {!isLoading && filteredLabs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-white/[0.12]">
          No labs match this search.
        </div>
      ) : null}
    </div>
  );
}

export default LabCatalog;
