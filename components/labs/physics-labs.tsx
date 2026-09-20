"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import { LabCanvas, Metric, RangeControl } from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";

function WaveLab({
  frequency,
  amplitude,
  setFrequency,
  setAmplitude,
  isRunning,
  isPaused,
  runSignal,
}: {
  frequency: number;
  amplitude: number;
  setFrequency: (value: number) => void;
  setAmplitude: (value: number) => void;
  isRunning: boolean;
  isPaused: boolean;
  runSignal: number;
}) {
  const animationRef = useRef<number | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const phaseRef = useRef(0);
  const activeRunRef = useRef(0);
  const createPath = useMemo(
    () => (phase: number) =>
      Array.from({ length: 121 }, (_, index) => {
        const x = (index / 120) * 600;
        const y =
          180 -
          Math.sin(
            (index / 120) * Math.PI * 2 * (frequency / 2) + phase,
          ) *
            amplitude;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      }).join(" "),
    [amplitude, frequency],
  );
  const path = createPath(0);
  const wavelength = 340 / frequency;

  useEffect(() => {
    if (activeRunRef.current !== runSignal) {
      activeRunRef.current = runSignal;
      phaseRef.current = 0;
    }

    if (!isRunning || isPaused || runSignal === 0) {
      pathRef.current?.setAttribute("d", createPath(phaseRef.current));
      return;
    }

    const startedAt = performance.now();
    const startingPhase = phaseRef.current;

    function animate(now: number) {
      const elapsed = (now - startedAt) / 1000;
      phaseRef.current = startingPhase + elapsed * frequency * 0.8;
      pathRef.current?.setAttribute(
        "d",
        createPath(phaseRef.current),
      );
      animationRef.current = window.requestAnimationFrame(animate);
    }

    animationRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [createPath, frequency, isPaused, isRunning, runSignal]);

  return (
    <div className="space-y-5">
      <LabCanvas>
        <svg
          key={runSignal}
          viewBox="0 0 600 360"
          className="h-full min-h-[360px] w-full"
          role="img"
          aria-label="Waveform visualizer"
        >
          <line x1="0" y1="180" x2="600" y2="180" stroke="#334155" />
          <path
            ref={pathRef}
            d={path}
            fill="none"
            stroke="#a78bfa"
            strokeWidth="5"
            className="drop-shadow-[0_0_12px_rgba(167,139,250,.75)]"
          />
        </svg>
      </LabCanvas>
      <div className="grid gap-3 md:grid-cols-4">
        <RangeControl
          label="Frequency"
          value={frequency}
          min={2}
          max={20}
          unit=" Hz"
          onChange={setFrequency}
        />
        <RangeControl
          label="Amplitude"
          value={amplitude}
          min={20}
          max={130}
          onChange={setAmplitude}
        />
        <Metric label="Wavelength" value={`${wavelength.toFixed(1)} m`} />
        <Metric
          label="Period"
          value={`${(1 / frequency).toFixed(3)} s`}
          tone="violet"
        />
      </div>
    </div>
  );
}

function OpticsLab({
  objectDistance,
  focalLength,
  setObjectDistance,
  setFocalLength,
}: {
  objectDistance: number;
  focalLength: number;
  setObjectDistance: (value: number) => void;
  setFocalLength: (value: number) => void;
}) {
  const denominator = 1 / focalLength - 1 / objectDistance;
  const imageDistance = Math.abs(denominator) < 0.001 ? 500 : 1 / denominator;
  const magnification = -imageDistance / objectDistance;
  const objectX = Math.max(30, 300 - objectDistance * 3);
  const imageX = Math.min(570, Math.max(310, 300 + Math.abs(imageDistance) * 3));
  const imageHeight = Math.min(130, Math.abs(magnification) * 100);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <LabCanvas>
        <svg
          viewBox="0 0 600 360"
          className="h-full min-h-[360px] w-full"
          role="img"
          aria-label="Converging lens ray diagram"
        >
          <line x1="20" y1="200" x2="580" y2="200" stroke="#475569" />
          <path
            d="M300 40 Q260 200 300 320 Q340 200 300 40"
            fill="#22d3ee33"
            stroke="#67e8f9"
            strokeWidth="4"
          />
          <line
            x1={objectX}
            y1="100"
            x2={objectX}
            y2="200"
            stroke="#f59e0b"
            strokeWidth="7"
          />
          <path
            d={`M${objectX} 100 L300 100 L${imageX} ${200 + imageHeight}`}
            fill="none"
            stroke="#fde68a"
            strokeWidth="2"
          />
          <path
            d={`M${objectX} 100 L300 200 L${imageX} ${200 + imageHeight}`}
            fill="none"
            stroke="#c4b5fd"
            strokeWidth="2"
          />
          <line
            x1={imageX}
            y1="200"
            x2={imageX}
            y2={200 + imageHeight}
            stroke="#a78bfa"
            strokeWidth="7"
          />
          <circle cx={300 - focalLength * 3} cy="200" r="5" fill="#f8fafc" />
          <circle cx={300 + focalLength * 3} cy="200" r="5" fill="#f8fafc" />
        </svg>
      </LabCanvas>
      <div className="space-y-3">
        <RangeControl
          label="Object distance"
          value={objectDistance}
          min={25}
          max={90}
          unit=" cm"
          onChange={setObjectDistance}
        />
        <RangeControl
          label="Focal length"
          value={focalLength}
          min={10}
          max={24}
          unit=" cm"
          onChange={setFocalLength}
        />
        <Metric
          label="Image distance"
          value={`${imageDistance.toFixed(1)} cm`}
        />
        <Metric
          label="Image"
          value={magnification < 0 ? "Real, inverted" : "Virtual, upright"}
          detail={`${Math.abs(magnification).toFixed(2)}x magnification`}
          tone="violet"
        />
      </div>
    </div>
  );
}

function PhysicsLabsComponent({
  lab,
  isRunning,
  isPaused,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [frequency, setFrequency] = useState(6);
  const [amplitude, setAmplitude] = useState(80);
  const [objectDistance, setObjectDistance] = useState(55);
  const [focalLength, setFocalLength] = useState(15);

  useEffect(() => {
    setFrequency(6);
    setAmplitude(80);
    setObjectDistance(55);
    setFocalLength(15);
  }, [resetSignal]);

  if (lab.id === "wave-simulator") {
    return (
      <WaveLab
        frequency={frequency}
        amplitude={amplitude}
        setFrequency={setFrequency}
        setAmplitude={setAmplitude}
        isRunning={isRunning}
        isPaused={isPaused}
        runSignal={runSignal}
      />
    );
  }

  return (
    <OpticsLab
      objectDistance={objectDistance}
      focalLength={focalLength}
      setObjectDistance={setObjectDistance}
      setFocalLength={setFocalLength}
    />
  );
}

export const PhysicsLabs = memo(PhysicsLabsComponent);
