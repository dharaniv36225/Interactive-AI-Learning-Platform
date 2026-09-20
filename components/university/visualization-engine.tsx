"use client";

import { Box, Layers3, Network, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType } from "react";

import { visualizationCatalog } from "@/lib/btech-curriculum";

type ThreeSceneComponent = ComponentType<{
  category: string;
  progress: number;
  title: string;
}>;

function VisualizationPreview({
  conceptId,
  category,
  progress,
}: {
  conceptId: string;
  category: string;
  progress: number;
}) {
  const normalizedCategory = category.toLowerCase();
  const normalizedId = conceptId.toLowerCase();

  if (normalizedId.includes("memory") || normalizedId.includes("recursion")) {
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Memory allocation visualization preview">
        <rect x="80" y="72" width="160" height="220" rx="18" fill="#111827" stroke="#22d3ee" />
        <rect x="400" y="72" width="160" height="220" rx="18" fill="#111827" stroke="#a78bfa" />
        <text x="110" y="104" fill="#67e8f9" fontSize="14" fontWeight="900">Stack frames</text>
        <text x="435" y="104" fill="#c4b5fd" fontSize="14" fontWeight="900">Heap blocks</text>
        {[0, 1, 2, 3].map((index) => (
          <rect key={index} x="105" y={245 - index * 36} width="110" height="28" rx="7" fill={progress * 4 > index ? "#22d3ee" : "#334155"} />
        ))}
        {[0, 1, 2].map((index) => (
          <circle key={index} cx={445 + index * 42} cy={180 + Math.sin(progress * Math.PI + index) * 45} r="18" fill={progress > index * 0.25 ? "#a78bfa" : "#475569"} />
        ))}
        <path d={`M215 180 C290 ${100 + progress * 120}, 345 ${250 - progress * 110}, 430 180`} stroke="#f59e0b" strokeWidth="5" fill="none" strokeDasharray="12 10" />
      </svg>
    );
  }

  if (normalizedId.includes("queue")) {
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Queue visualization preview">
        <path d="M80 190 H560" stroke="#475569" strokeWidth="72" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((index) => (
          <rect key={index} x={105 + index * 78 - progress * 46} y="157" width="54" height="66" rx="13" fill={index / 5 < progress ? "#22d3ee" : "#334155"} />
        ))}
        <text x="92" y="118" fill="#67e8f9" fontSize="14" fontWeight="900">Front</text>
        <text x="486" y="118" fill="#c4b5fd" fontSize="14" fontWeight="900">Rear</text>
      </svg>
    );
  }

  if (normalizedId.includes("linked-list")) {
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Linked list visualization preview">
        {[0, 1, 2, 3, 4].map((index) => (
          <g key={index} transform={`translate(${70 + index * 110} ${170 + Math.sin(progress * Math.PI + index) * 18})`}>
            <rect width="70" height="50" rx="14" fill={progress > index * 0.16 ? "#22d3ee" : "#334155"} />
            <text x="35" y="31" textAnchor="middle" fill="#020617" fontSize="14" fontWeight="900">N{index + 1}</text>
            {index < 4 ? <path d="M74 25 H106" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" /> : null}
          </g>
        ))}
      </svg>
    );
  }

  if (normalizedId.includes("binary-search")) {
    const active = Math.floor(progress * 8);

    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Binary search visualization preview">
        {Array.from({ length: 9 }, (_, index) => (
          <rect key={index} x={65 + index * 58} y="160" width="46" height="54" rx="10" fill={index === active ? "#f59e0b" : index < active ? "#334155" : "#22d3ee"} />
        ))}
        <path d={`M88 115 L${88 + active * 58} 150`} stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
        <text x="76" y="92" fill="#e2e8f0" fontSize="14">Compare middle, discard half</text>
      </svg>
    );
  }

  if (normalizedId.includes("packet") || normalizedId.includes("tcp") || normalizedId.includes("routing")) {
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Network packet visualization preview">
        {[100, 320, 540].map((x, index) => (
          <rect key={x} x={x - 48} y="145" width="96" height="70" rx="18" fill={progress > index * 0.25 ? "#22d3ee" : "#334155"} />
        ))}
        <path d="M150 180 H270 M370 180 H490" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
        <circle cx={100 + progress * 440} cy={180 + Math.sin(progress * Math.PI * 3) * 38} r="16" fill="#f59e0b" />
      </svg>
    );
  }

  if (normalizedId.includes("solar") || normalizedId.includes("projectile") || normalizedId.includes("wave")) {
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Physics visualization preview">
        <circle cx="320" cy="180" r="38" fill="#facc15" />
        {[75, 128, 178].map((radius, index) => {
          const angle = progress * Math.PI * 2 * (index + 1) + index;
          return (
            <g key={radius}>
              <ellipse cx="320" cy="180" rx={radius * 1.35} ry={radius} fill="none" stroke="#475569" />
              <circle cx={320 + Math.cos(angle) * radius * 1.35} cy={180 + Math.sin(angle) * radius} r={10 + index * 3} fill={["#22d3ee", "#a78bfa", "#f59e0b"][index]} />
            </g>
          );
        })}
      </svg>
    );
  }

  if (normalizedCategory.includes("data-structures")) {
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Data structure visualization preview">
        {[0, 1, 2, 3, 4].map((index) => (
          <g key={index} transform={`translate(${90 + index * 105}, ${190 - index * 22})`}>
            <rect width="76" height="56" rx="14" fill={index <= progress * 5 ? "#22d3ee" : "#334155"} />
            <text x="38" y="35" textAnchor="middle" fill="#020617" fontSize="16" fontWeight="800">
              {index + 1}
            </text>
            {index < 4 ? <path d="M82 28 H104" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" /> : null}
          </g>
        ))}
      </svg>
    );
  }

  if (normalizedCategory.includes("algorithms")) {
    const bars = [72, 140, 92, 210, 128, 250, 165, 105];
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Algorithm visualization preview">
        {bars.map((height, index) => (
          <rect
            key={index}
            x={80 + index * 62}
            y={300 - height}
            width="38"
            height={height}
            rx="10"
            fill={index / bars.length <= progress ? "#22d3ee" : "#475569"}
          />
        ))}
        <path d={`M80 ${300 - progress * 210} H560`} stroke="#a78bfa" strokeWidth="4" strokeDasharray="10 10" />
      </svg>
    );
  }

  if (
    normalizedCategory.includes("ai-ml") ||
    normalizedCategory.includes("nlp") ||
    normalizedCategory.includes("computer-vision")
  ) {
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="AI visualization preview">
        {[120, 320, 520].map((x, layer) =>
          [95, 180, 265].slice(0, layer === 1 ? 3 : 2).map((y, index) => (
            <g key={`${x}-${y}`}>
              {x < 520 ? (
                <path
                  d={`M${x + 24} ${y} C${x + 90} ${y - 40 + index * 35}, ${x + 130} ${180}, ${x + 176} ${180}`}
                  stroke="#334155"
                  strokeWidth="3"
                  fill="none"
                />
              ) : null}
              <circle cx={x} cy={y} r={24} fill={progress > layer / 3 ? "#a78bfa" : "#334155"} />
            </g>
          )),
        )}
        <path d="M90 320 C180 220 250 250 320 165 C405 65 500 130 565 70" fill="none" stroke="#22d3ee" strokeWidth="5" />
      </svg>
    );
  }

  if (normalizedCategory.includes("robotics")) {
    return (
      <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Robotics visualization preview">
        <path d="M60 280 C180 80 340 320 575 95" fill="none" stroke="#f8fafc" strokeWidth="16" />
        <circle cx={80 + progress * 470} cy={260 - Math.sin(progress * Math.PI) * 150} r="34" fill="#22d3ee" />
        <path d={`M${80 + progress * 470} ${260 - Math.sin(progress * Math.PI) * 150} L560 90`} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 8" />
        <rect x="500" y="120" width="55" height="90" rx="12" fill="#ef4444" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 640 360" className="h-full min-h-[320px] w-full" role="img" aria-label="Engineering visualization preview">
      <circle cx="320" cy="180" r="88" fill="none" stroke="#334155" strokeWidth="18" />
      <circle cx="320" cy="180" r="42" fill="#22d3ee" />
      <path d={`M320 180 L${320 + Math.cos(progress * Math.PI * 2) * 145} ${180 + Math.sin(progress * Math.PI * 2) * 145}`} stroke="#a78bfa" strokeWidth="8" strokeLinecap="round" />
      <circle cx={320 + Math.cos(progress * Math.PI * 2) * 145} cy={180 + Math.sin(progress * Math.PI * 2) * 145} r="20" fill="#f59e0b" />
    </svg>
  );
}

export function VisualizationEngine() {
  const [selectedId, setSelectedId] = useState(visualizationCatalog[0].id);
  const [progress, setProgress] = useState(0.35);
  const [ThreeConceptScene, setThreeConceptScene] =
    useState<ThreeSceneComponent | null>(null);
  const [isThreeSceneLoading, setIsThreeSceneLoading] = useState(false);
  const selected = useMemo(
    () => visualizationCatalog.find((item) => item.id === selectedId) ?? visualizationCatalog[0],
    [selectedId],
  );
  const categories = useMemo(
    () => Array.from(new Set(visualizationCatalog.map((item) => item.category))),
    [],
  );

  function stepForward() {
    setProgress((value) => (value >= 0.95 ? 0.05 : value + 0.18));
  }

  useEffect(() => {
    if (selected.engine !== "three-ready" || ThreeConceptScene) {
      return;
    }

    let isActive = true;
    setIsThreeSceneLoading(true);

    void import("@/components/university/three-concept-scene")
      .then((module) => {
        if (isActive) {
          setThreeConceptScene(() => module.default);
        }
      })
      .catch(() => {
        if (isActive) {
          setThreeConceptScene(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsThreeSceneLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [ThreeConceptScene, selected.engine]);

  return (
    <section className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
              Visualization engine
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
              Concept scenes
            </h2>
          </div>
          <Layers3 className="size-5 text-cyan-500" aria-hidden="true" />
        </div>

        <label className="mt-5 block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Scene
          </span>
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-cyan-400 dark:border-white/[0.08] dark:bg-[#111720]"
          >
            {categories.map((category) => (
              <optgroup key={category} label={category}>
                {visualizationCatalog
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.025]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Engine
            </span>
            <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[10px] font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              {selected.engine === "three-ready" ? "3D-ready" : selected.engine.toUpperCase()}
            </span>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
            {selected.description}
          </p>
          {selected.engine === "three-ready" ? (
            <p className="mt-3 text-[11px] leading-5 text-slate-500">
              This route keeps a dependency-safe boundary for Three.js, React Three Fiber, and Drei adapters without loading those packages into navigation.
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={stepForward}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            <Play className="size-3.5 fill-current" aria-hidden="true" />
            Step scene
          </button>
          <button
            type="button"
            onClick={() => setProgress(0.35)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-cyan-300 dark:border-white/[0.08]"
            aria-label="Reset scene"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </aside>

      <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 surface-shadow dark:border-white/[0.08]">
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
              {selected.category}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-white">
              {selected.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold text-slate-300">
            {selected.engine === "three-ready" ? (
              <Box className="size-3.5 text-violet-300" aria-hidden="true" />
            ) : (
              <Network className="size-3.5 text-cyan-300" aria-hidden="true" />
            )}
            Lazy scene boundary
          </div>
        </div>
        {selected.engine === "three-ready" ? (
          ThreeConceptScene ? (
            <ThreeConceptScene
              category={selected.category}
              progress={progress}
              title={selected.title}
            />
          ) : (
            <div className="flex min-h-[360px] items-center justify-center bg-slate-950 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              {isThreeSceneLoading ? "Loading 3D scene" : "3D scene ready after selection"}
            </div>
          )
        ) : (
          <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_top,#1e293b,transparent_55%),linear-gradient(135deg,#020617,#0f172a)] p-4">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
            <div className="relative">
              <VisualizationPreview
                conceptId={selected.id}
                category={selected.category}
                progress={progress}
              />
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
