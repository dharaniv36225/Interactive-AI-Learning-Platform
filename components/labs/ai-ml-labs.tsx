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

function buildLossPoints(
  epochs: number,
  learningRate: number,
  progress: number,
) {
  const pointCount = Math.max(2, Math.floor(progress * 40));
  return Array.from({ length: pointCount }, (_, index) => {
    const epochProgress = index / 39;
    const loss = Math.max(
      0.03,
      Math.exp(-epochProgress * epochs * learningRate) +
        0.025 * Math.sin(index),
    );
    return `${20 + epochProgress * 560},${320 - (1 - Math.min(1, loss)) * 260}`;
  }).join(" ");
}

function TrainingSimulatorLab({
  epochs,
  learningRate,
  setEpochs,
  setLearningRate,
  isRunning,
  isPaused,
  onRunComplete,
  runSignal,
}: {
  epochs: number;
  learningRate: number;
  setEpochs: (value: number) => void;
  setLearningRate: (value: number) => void;
  isRunning: boolean;
  isPaused: boolean;
  onRunComplete: () => void;
  runSignal: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [runSignal]);

  usePausableAnimation({
    durationMs: 4_000,
    isPaused,
    isRunning,
    onComplete: onRunComplete,
    onProgress: setProgress,
    runSignal,
  });

  const lossPoints = buildLossPoints(epochs, learningRate, isRunning ? progress : 0);
  const finalLoss = Math.max(0.03, Math.exp(-epochs * learningRate));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <LabCanvas>
        <svg viewBox="0 0 600 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Model training loss curve">
          <line x1="20" y1="320" x2="580" y2="320" stroke="#475569" />
          <line x1="20" y1="50" x2="20" y2="320" stroke="#475569" />
          <polyline points={lossPoints} fill="none" stroke="#34d399" strokeWidth="5" className="drop-shadow-[0_0_10px_rgba(52,211,153,.6)]" />
          <text x="30" y="70" fill="#94a3b8" fontSize="11">training loss</text>
          <text x="500" y="345" fill="#94a3b8" fontSize="11">epochs</text>
        </svg>
      </LabCanvas>
      <div className="space-y-3">
        <RangeControl label="Epochs" value={epochs} min={5} max={100} onChange={setEpochs} />
        <RangeControl label="Learning rate" value={learningRate} min={0.01} max={0.3} step={0.01} onChange={setLearningRate} />
        <Metric label="Final loss" value={finalLoss.toFixed(3)} tone="emerald" />
        <Metric
          label="Training state"
          value={
            !isRunning
              ? "Ready"
              : progress >= 1
                ? "Completed"
                : isPaused
                  ? "Paused"
                  : "Training"
          }
        />
      </div>
    </div>
  );
}

export function AiMlLabs({
  lab,
  isRunning,
  isPaused,
  onRunComplete,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [layers, setLayers] = useState(3);
  const [neurons, setNeurons] = useState(4);
  const [epochs, setEpochs] = useState(30);
  const [learningRate, setLearningRate] = useState(0.08);
  const [threshold, setThreshold] = useState(70);
  const [imageScene, setImageScene] = useState("street");
  const [text, setText] = useState("Interactive learning makes complex ideas easier to explore.");
  const [task, setTask] = useState("sentiment");
  const [dataset, setDataset] = useState("moons");
  const [complexity, setComplexity] = useState(4);
  const [trainingSize, setTrainingSize] = useState(70);

  useEffect(() => {
    setLayers(3);
    setNeurons(4);
    setEpochs(30);
    setLearningRate(0.08);
    setThreshold(70);
    setImageScene("street");
    setText("Interactive learning makes complex ideas easier to explore.");
    setTask("sentiment");
    setDataset("moons");
    setComplexity(4);
    setTrainingSize(70);
  }, [resetSignal]);

  if (lab.id === "neural-network-visualizer") {
    const layerCounts = [3, ...Array.from({ length: layers }, () => neurons), 2];
    const maxLayers = layerCounts.length;
    const connections = layerCounts
      .slice(0, -1)
      .reduce((total, count, index) => total + count * layerCounts[index + 1], 0);
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas>
          <svg viewBox="0 0 640 360" className="h-full min-h-[360px] w-full" role="img" aria-label="Neural network architecture">
            {layerCounts.slice(0, -1).flatMap((count, layerIndex) =>
              Array.from({ length: count }, (_, sourceIndex) =>
                Array.from({ length: layerCounts[layerIndex + 1] }, (__, targetIndex) => {
                  const x1 = 60 + (layerIndex * 520) / (maxLayers - 1);
                  const x2 = 60 + ((layerIndex + 1) * 520) / (maxLayers - 1);
                  const y1 = 180 + (sourceIndex - (count - 1) / 2) * 48;
                  const y2 = 180 + (targetIndex - (layerCounts[layerIndex + 1] - 1) / 2) * 48;
                  return <line key={`${layerIndex}-${sourceIndex}-${targetIndex}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="1" />;
                }),
              ),
            )}
            {layerCounts.flatMap((count, layerIndex) =>
              Array.from({ length: count }, (_, neuronIndex) => {
                const x = 60 + (layerIndex * 520) / (maxLayers - 1);
                const y = 180 + (neuronIndex - (count - 1) / 2) * 48;
                return <circle key={`${layerIndex}-${neuronIndex}`} cx={x} cy={y} r="13" fill={layerIndex === 0 ? "#22d3ee" : layerIndex === maxLayers - 1 ? "#34d399" : "#a78bfa"} className="drop-shadow-[0_0_7px_rgba(167,139,250,.65)]" />;
              }),
            )}
          </svg>
        </LabCanvas>
        <div className="space-y-3">
          <RangeControl label="Hidden layers" value={layers} min={1} max={5} onChange={setLayers} />
          <RangeControl label="Neurons per layer" value={neurons} min={2} max={6} onChange={setNeurons} />
          <Metric label="Trainable connections" value={connections.toLocaleString()} tone="violet" />
          <Metric label="Capacity" value={connections > 100 ? "High" : connections > 40 ? "Medium" : "Low"} />
        </div>
      </div>
    );
  }

  if (lab.id === "ai-training-simulator") {
    return (
      <TrainingSimulatorLab
        epochs={epochs}
        learningRate={learningRate}
        setEpochs={setEpochs}
        setLearningRate={setLearningRate}
        isRunning={isRunning}
        isPaused={isPaused}
        onRunComplete={onRunComplete}
        runSignal={runSignal}
      />
    );
  }

  if (lab.id === "computer-vision-demo") {
    const detections = imageScene === "street"
      ? [{ label: "Car", confidence: 94, style: "left-[12%] top-[48%] h-28 w-52" }, { label: "Person", confidence: 81, style: "right-[18%] top-[28%] h-48 w-20" }, { label: "Signal", confidence: 68, style: "left-[47%] top-[16%] h-24 w-16" }]
      : [{ label: "Cat", confidence: 97, style: "left-[28%] top-[28%] h-48 w-56" }, { label: "Sofa", confidence: 74, style: "left-[16%] bottom-[12%] h-28 w-[68%]" }];
    const visible = isRunning
      ? detections.filter((detection) => detection.confidence >= threshold)
      : [];
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <LabCanvas className={imageScene === "street" ? "bg-gradient-to-b from-sky-900 to-slate-900" : "bg-gradient-to-br from-amber-950 to-slate-900"}>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-slate-700/70" />
          {visible.map((detection) => (
            <div key={detection.label} className={`absolute border-4 border-emerald-300 ${detection.style}`}>
              <span className="absolute -top-7 left-0 bg-emerald-300 px-2 py-1 text-[10px] font-black text-slate-950">
                {detection.label} {detection.confidence}%
              </span>
            </div>
          ))}
        </LabCanvas>
        <div className="space-y-4">
          <SegmentedControl label="Image" value={imageScene} options={[{ value: "street", label: "Street scene" }, { value: "room", label: "Indoor scene" }]} onChange={setImageScene} />
          <RangeControl label="Confidence threshold" value={threshold} min={40} max={99} unit="%" onChange={setThreshold} />
          <Metric label="Accepted detections" value={String(visible.length)} tone="emerald" />
          <Metric label="Filtered detections" value={String(detections.length - visible.length)} tone="rose" />
        </div>
      </div>
    );
  }

  if (lab.id === "nlp-explorer") {
    const tokens = text.trim() ? text.trim().split(/\s+/) : [];
    const positiveWords = ["learning", "easier", "great", "good", "smart", "helpful"];
    const positive = tokens.filter((token) => positiveWords.some((word) => token.toLowerCase().includes(word))).length;
    const sentiment = Math.min(99, 50 + positive * 12);
    return (
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <label className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.025]">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">Input text</span>
            <textarea value={text} onChange={(event) => setText(event.target.value)} rows={6} className="mt-3 w-full resize-none bg-transparent text-sm leading-7 outline-none" />
          </label>
          <SegmentedControl label="NLP task" value={task} options={[{ value: "sentiment", label: "Sentiment" }, { value: "tokens", label: "Tokenize" }, { value: "summary", label: "Key phrase" }]} onChange={setTask} />
        </div>
        <LabCanvas className="p-8">
          <div className="flex min-h-[300px] flex-wrap content-center justify-center gap-3">
            {tokens.map((token, index) => (
              <span key={`${token}-${index}`} className={`rounded-xl border px-4 py-3 font-mono text-sm ${positiveWords.some((word) => token.toLowerCase().includes(word)) ? "border-emerald-300 bg-emerald-300/15 text-emerald-100" : "border-violet-300/40 bg-violet-300/10 text-violet-100"}`}>
                {token}
                <span className="ml-2 text-[9px] opacity-50">#{index + 1}</span>
              </span>
            ))}
          </div>
        </LabCanvas>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Tokens" value={String(tokens.length)} />
          <Metric label="Sentiment confidence" value={`${sentiment}% positive`} tone="emerald" />
          <Metric label="Context use" value={`${Math.min(100, tokens.length * 5)}%`} tone="violet" />
        </div>
      </div>
    );
  }

  const generalization = Math.max(
    35,
    Math.min(98, 55 + trainingSize * 0.45 - Math.abs(complexity - 5) * 4),
  );
  const points = Array.from({ length: 36 }, (_, index) => ({
    x: 10 + ((index * 47) % 90),
    y:
      dataset === "moons"
        ? 50 + Math.sin(index * 0.65) * 28
        : 50 + Math.cos(index * 1.8) * 35,
    className: index % 2 === 0 ? "bg-cyan-300" : "bg-violet-300",
  }));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
      <LabCanvas>
        <div className="absolute inset-0">
          <div
            className="absolute inset-8 rounded-[45%] border-4 border-emerald-300/50 transition-all"
            style={{
              transform: `rotate(${complexity * 5}deg) scale(${0.75 + complexity / 35})`,
              borderRadius: `${20 + complexity * 5}%`,
            }}
          />
          {points.map((point, index) => (
            <span key={index} className={`absolute size-3 rounded-full ${point.className}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} />
          ))}
        </div>
      </LabCanvas>
      <div className="space-y-4">
        <SegmentedControl label="Dataset" value={dataset} options={[{ value: "moons", label: "Two moons" }, { value: "clusters", label: "Clusters" }]} onChange={setDataset} />
        <RangeControl label="Training data" value={trainingSize} min={20} max={100} unit="%" onChange={setTrainingSize} />
        <RangeControl label="Model complexity" value={complexity} min={1} max={10} onChange={setComplexity} />
        <Metric label="Validation score" value={`${generalization.toFixed(1)}%`} tone="emerald" />
        <Metric label="Fit diagnosis" value={complexity > 8 ? "Overfitting risk" : complexity < 3 ? "Underfitting risk" : "Balanced fit"} tone={complexity > 8 || complexity < 3 ? "rose" : "cyan"} />
      </div>
    </div>
  );
}
