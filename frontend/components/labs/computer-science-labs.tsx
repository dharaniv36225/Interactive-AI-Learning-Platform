"use client";

import { useEffect, useRef, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";
import { usePausableAnimation } from "@/components/labs/use-pausable-animation";

const initialNumbers = [46, 18, 72, 31, 63, 25, 88, 39];

function createSortFrames(values: number[]) {
  const working = [...values];
  const frames = [[...working]];

  for (let end = working.length - 1; end > 0; end -= 1) {
    for (let index = 0; index < end; index += 1) {
      if (working[index] > working[index + 1]) {
        [working[index], working[index + 1]] = [
          working[index + 1],
          working[index],
        ];
        frames.push([...working]);
      }
    }
  }

  return frames;
}

const sortFrames = createSortFrames(initialNumbers);

export function ComputerScienceLabs({
  lab,
  isRunning,
  isPaused,
  onRunComplete,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const packetRef = useRef<SVGCircleElement | null>(null);
  const lastSortFrameRef = useRef(-1);
  const [structure, setStructure] = useState("stack");
  const [items, setItems] = useState(["A", "B", "C"]);
  const [nextItem, setNextItem] = useState("D");
  const [algorithm, setAlgorithm] = useState("merge");
  const [numbers, setNumbers] = useState(initialNumbers);
  const [target, setTarget] = useState(63);
  const [searchMethod, setSearchMethod] = useState("binary");
  const [payload, setPayload] = useState(40);
  const [bandwidth, setBandwidth] = useState(20);
  const [packetLoss, setPacketLoss] = useState(2);
  const [indexed, setIndexed] = useState(true);
  const [rows, setRows] = useState(10000);
  const [selectivity, setSelectivity] = useState(5);

  useEffect(() => {
    setStructure("stack");
    setItems(["A", "B", "C"]);
    setNextItem("D");
    setAlgorithm("merge");
    setNumbers(initialNumbers);
    setTarget(63);
    setSearchMethod("binary");
    setPayload(40);
    setBandwidth(20);
    setPacketLoss(2);
    setIndexed(true);
    setRows(10000);
    setSelectivity(5);
    packetRef.current?.setAttribute("cx", "70");
    packetRef.current?.setAttribute("cy", "180");
  }, [resetSignal]);

  const hasTimedAnimation =
    lab.id === "sorting-visualizer" || lab.id === "network-simulator";

  usePausableAnimation({
    durationMs: lab.id === "sorting-visualizer" ? 3_500 : 4_000,
    isPaused,
    isRunning: isRunning && hasTimedAnimation,
    onComplete: onRunComplete,
    runSignal,
    onProgress: (progress) => {
      if (lab.id === "sorting-visualizer") {
        const frameIndex = Math.min(
          sortFrames.length - 1,
          Math.floor(progress * sortFrames.length),
        );

        if (lastSortFrameRef.current !== frameIndex) {
          lastSortFrameRef.current = frameIndex;
          setNumbers(sortFrames[frameIndex]);
        }
        return;
      }

      if (lab.id === "network-simulator") {
        const route = [
          { x: 70, y: 180 },
          { x: 220, y: 80 },
          { x: 390, y: 180 },
          { x: 540, y: 180 },
        ];
        const scaled = progress * (route.length - 1);
        const segment = Math.min(route.length - 2, Math.floor(scaled));
        const localProgress = scaled - segment;
        const from = route[segment];
        const to = route[segment + 1];
        const x = from.x + (to.x - from.x) * localProgress;
        const y = from.y + (to.y - from.y) * localProgress;

        packetRef.current?.setAttribute("cx", x.toFixed(2));
        packetRef.current?.setAttribute("cy", y.toFixed(2));
      }
    },
  });

  if (lab.id === "data-structures-visualizer") {
    function insertItem() {
      const value = nextItem.trim().slice(0, 3);
      if (!value) return;
      setItems((current) =>
        structure === "queue" ? [...current, value] : [...current, value],
      );
      setNextItem(String.fromCharCode(65 + ((items.length + 1) % 26)));
    }
    function removeItem() {
      setItems((current) =>
        structure === "queue" ? current.slice(1) : current.slice(0, -1),
      );
    }
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <LabCanvas>
          <div
            className={`absolute inset-0 flex p-10 ${
              structure === "stack"
                ? "flex-col-reverse items-center justify-center"
                : "items-center justify-center"
            }`}
          >
            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={`grid place-items-center border-2 border-cyan-300 bg-cyan-300/10 text-xl font-black text-cyan-100 ${
                  structure === "stack"
                    ? "h-14 w-52 rounded-lg"
                    : "h-24 w-20 rounded-xl"
                }`}
              >
                {item}
              </div>
            ))}
            {items.length === 0 ? (
              <p className="text-sm text-slate-400">Structure is empty</p>
            ) : null}
          </div>
        </LabCanvas>
        <div className="space-y-4">
          <SegmentedControl
            label="Structure"
            value={structure}
            options={[
              { value: "stack", label: "Stack (LIFO)" },
              { value: "queue", label: "Queue (FIFO)" },
            ]}
            onChange={setStructure}
          />
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              New item
            </span>
            <div className="mt-2 flex gap-2">
              <input
                value={nextItem}
                onChange={(event) => setNextItem(event.target.value)}
                className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none dark:border-white/[0.08] dark:bg-white/[0.04]"
              />
              <button type="button" onClick={insertItem} className="rounded-xl bg-cyan-500 px-4 text-xs font-bold text-slate-950">
                Insert
              </button>
              <button type="button" onClick={removeItem} className="rounded-xl border border-slate-200 px-4 text-xs font-bold dark:border-white/[0.08]">
                Remove
              </button>
            </div>
          </label>
          <Metric label="Items" value={String(items.length)} />
          <Metric
            label="Next removal"
            value={
              structure === "queue"
                ? items[0] ?? "None"
                : items.at(-1) ?? "None"
            }
            tone="violet"
          />
        </div>
      </div>
    );
  }

  if (lab.id === "sorting-visualizer") {
    const max = Math.max(...numbers);
    const comparisons =
      algorithm === "bubble"
        ? (numbers.length * (numbers.length - 1)) / 2
        : Math.ceil(numbers.length * Math.log2(numbers.length));
    return (
      <div className="space-y-5">
        <LabCanvas>
          <div className="absolute inset-0 flex items-end justify-center gap-3 p-10">
            {numbers.map((number, index) => (
              <div key={`${number}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-cyan-100">{number}</span>
                <div
                  className="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-violet-600 to-cyan-300 transition-all duration-700"
                  style={{ height: `${(number / max) * 250}px` }}
                />
              </div>
            ))}
          </div>
        </LabCanvas>
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <SegmentedControl
            label="Algorithm"
            value={algorithm}
            options={[
              { value: "bubble", label: "Bubble sort" },
              { value: "merge", label: "Merge sort" },
              { value: "quick", label: "Quick sort" },
            ]}
            onChange={setAlgorithm}
          />
          <Metric
            label="Time complexity"
            value={algorithm === "bubble" ? "O(n²)" : "O(n log n)"}
            tone="violet"
          />
          <Metric label="Estimated comparisons" value={String(comparisons)} />
        </div>
      </div>
    );
  }

  if (lab.id === "searching-visualizer") {
    const sorted = [...initialNumbers].sort((a, b) => a - b);
    const foundIndex = sorted.indexOf(target);
    const steps =
      searchMethod === "linear"
        ? foundIndex === -1
          ? sorted.length
          : foundIndex + 1
        : Math.ceil(Math.log2(sorted.length + 1));
    return (
      <div className="space-y-5">
        <LabCanvas>
          <div className="absolute inset-0 flex items-center justify-center gap-3 p-8">
            {sorted.map((number, index) => (
              <div
                key={number}
                className={`grid size-16 place-items-center rounded-xl border-2 font-mono text-lg font-black transition ${
                  number === target
                    ? "scale-110 border-emerald-300 bg-emerald-300/20 text-emerald-100"
                    : searchMethod === "binary" &&
                        Math.abs(index - Math.floor(sorted.length / 2)) < 2
                      ? "border-amber-300 bg-amber-300/10 text-amber-100"
                      : "border-slate-600 bg-slate-800 text-slate-300"
                }`}
              >
                {number}
              </div>
            ))}
          </div>
        </LabCanvas>
        <div className="grid gap-3 md:grid-cols-4">
          <SegmentedControl
            label="Search method"
            value={searchMethod}
            options={[
              { value: "linear", label: "Linear" },
              { value: "binary", label: "Binary" },
            ]}
            onChange={setSearchMethod}
          />
          <RangeControl label="Target" value={target} min={10} max={90} onChange={setTarget} />
          <Metric label="Result" value={foundIndex >= 0 ? `Index ${foundIndex}` : "Not found"} tone={foundIndex >= 0 ? "emerald" : "rose"} />
          <Metric label="Search steps" value={String(steps)} />
        </div>
      </div>
    );
  }

  if (lab.id === "network-simulator") {
    const transferSeconds = payload / bandwidth + 0.04;
    const delivered = Math.max(0, 100 - packetLoss);
    const nodes = [
      { x: 70, y: 180, label: "Client" },
      { x: 220, y: 80, label: "Router A" },
      { x: 220, y: 280, label: "Router B" },
      { x: 390, y: 180, label: "Gateway" },
      { x: 540, y: 180, label: "Server" },
    ];
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <svg viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Packet network diagram">
            {[[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]].map(([from, to], index) => (
              <line key={index} x1={nodes[from].x} y1={nodes[from].y} x2={nodes[to].x} y2={nodes[to].y} stroke="#475569" strokeWidth="5" />
            ))}
            {nodes.map((node) => (
              <g key={node.label}>
                <circle cx={node.x} cy={node.y} r="34" fill="#0f172a" stroke="#22d3ee" strokeWidth="3" />
                <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#cffafe" fontSize="10">{node.label}</text>
              </g>
            ))}
            <circle
              ref={packetRef}
              cx="70"
              cy="180"
              r="8"
              fill="#a78bfa"
              className="drop-shadow-[0_0_8px_#a78bfa]"
            />
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Payload" value={payload} min={1} max={200} unit=" MB" onChange={setPayload} />
          <RangeControl label="Bandwidth" value={bandwidth} min={1} max={100} unit=" MB/s" onChange={setBandwidth} />
          <RangeControl label="Packet loss" value={packetLoss} min={0} max={20} unit="%" onChange={setPacketLoss} />
          <Metric label="Transfer time" value={`${transferSeconds.toFixed(2)} s`} />
          <Metric label="Delivery rate" value={`${delivered}%`} tone="emerald" />
        </div>
      </div>
    );
  }

  const scanned = indexed
    ? Math.ceil(Math.log2(rows)) + Math.ceil((rows * selectivity) / 100)
    : Math.ceil((rows * selectivity) / 100 + rows * 0.7);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <LabCanvas>
        <div className="absolute inset-0 p-8">
          <div className="overflow-hidden rounded-xl border border-slate-700">
            <div className="grid grid-cols-4 bg-slate-800 px-4 py-3 text-[10px] font-bold uppercase text-slate-400">
              <span>ID</span><span>Name</span><span>Subject</span><span>Score</span>
            </div>
            {["101,Ada,AI,94", "102,Linus,Systems,89", "103,Grace,Databases,98", "104,Alan,Algorithms,96", "105,Radia,Networks,93"].map((row, index) => (
              <div key={row} className={`grid grid-cols-4 px-4 py-3 text-xs ${index % 2 ? "bg-white/[0.03]" : ""}`}>
                {row.split(",").map((cell) => <span key={cell} className="text-slate-200">{cell}</span>)}
              </div>
            ))}
          </div>
          <pre className="mt-5 overflow-x-auto rounded-xl bg-black/30 p-4 text-xs text-cyan-200">
            <code>SELECT * FROM learners WHERE score &gt; 90;</code>
          </pre>
        </div>
      </LabCanvas>
      <div className="space-y-3">
        <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-white/[0.08]">
          <span className="text-xs font-bold">Use score index</span>
          <input type="checkbox" checked={indexed} onChange={(event) => setIndexed(event.target.checked)} className="size-5 accent-cyan-500" />
        </label>
        <RangeControl label="Table rows" value={rows} min={1000} max={100000} step={1000} onChange={setRows} />
        <RangeControl label="Query selectivity" value={selectivity} min={1} max={50} unit="%" onChange={setSelectivity} />
        <Metric label="Rows examined" value={scanned.toLocaleString()} tone={indexed ? "emerald" : "rose"} />
        <Metric label="Query plan" value={indexed ? "Index range scan" : "Full table scan"} tone="violet" />
      </div>
    </div>
  );
}
