"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import {
  LabCanvas,
  Metric,
  RangeControl,
  SegmentedControl,
} from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";
import { usePausableAnimation } from "@/components/labs/use-pausable-animation";
import {
  calculateProjectileMotion,
  getGravityPreset,
  getProjectilePoint,
  gravityPresets,
  type GravityPresetId,
} from "@/lib/physics";

function ProjectileMotionLabComponent({
  isRunning,
  isPaused,
  onRunComplete,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(42);
  const [gravityId, setGravityId] = useState<GravityPresetId>("earth");
  const projectileRef = useRef<SVGCircleElement | null>(null);

  const gravity = getGravityPreset(gravityId);
  const motion = useMemo(
    () =>
      calculateProjectileMotion({
        velocity,
        angleDegrees: angle,
        gravity: gravity.gravity,
      }),
    [angle, gravity.gravity, velocity],
  );

  const trajectoryPoints = useMemo(() => {
    return Array.from({ length: 72 }, (_, index) => {
      const ratio = index / 71;
      const point = getProjectilePoint({
        velocity,
        angleRadians: motion.angleRadians,
        gravity: gravity.gravity,
        time: motion.flightTime * ratio,
      });
      const x = 34 + (point.x / Math.max(motion.range, 1)) * 532;
      const y = 318 - (point.y / Math.max(motion.maxHeight, 1)) * 250;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }, [gravity.gravity, motion, velocity]);

  useEffect(() => {
    setAngle(45);
    setVelocity(42);
    setGravityId("earth");
  }, [resetSignal]);

  useEffect(() => {
    const projectile = projectileRef.current;
    projectile?.setAttribute("cx", "34");
    projectile?.setAttribute("cy", "318");
  }, [angle, gravityId, resetSignal, velocity]);

  usePausableAnimation({
    durationMs: 3_500,
    isPaused,
    isRunning,
    runSignal,
    onComplete: onRunComplete,
    onProgress: (nextProgress) => {
      const point = getProjectilePoint({
        velocity,
        angleRadians: motion.angleRadians,
        gravity: gravity.gravity,
        time: motion.flightTime * nextProgress,
      });
      const x = 34 + (point.x / Math.max(motion.range, 1)) * 532;
      const y = 318 - (point.y / Math.max(motion.maxHeight, 1)) * 250;
      projectileRef.current?.setAttribute("cx", x.toFixed(2));
      projectileRef.current?.setAttribute("cy", y.toFixed(2));
    },
  });

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <LabCanvas>
        <svg
          viewBox="0 0 600 360"
          className="h-full min-h-[360px] w-full"
          role="img"
          aria-label="Projectile trajectory graph"
        >
          <defs>
            <linearGradient id="projectile-path" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {Array.from({ length: 7 }, (_, index) => (
            <g key={index}>
              <line x1={34 + index * 88} y1="46" x2={34 + index * 88} y2="318" stroke="#1e293b" />
              <line x1="34" y1={318 - index * 43} x2="566" y2={318 - index * 43} stroke="#1e293b" />
            </g>
          ))}
          <line x1="34" y1="318" x2="566" y2="318" stroke="#64748b" strokeWidth="2" />
          <line x1="34" y1="318" x2="34" y2="44" stroke="#64748b" strokeWidth="2" />
          <polyline
            points={trajectoryPoints}
            fill="none"
            stroke="url(#projectile-path)"
            strokeLinecap="round"
            strokeWidth="5"
            className="drop-shadow-[0_0_12px_rgba(34,211,238,.65)]"
          />
          <line
            x1="34"
            y1="318"
            x2={34 + Math.cos(motion.angleRadians) * 72}
            y2={318 - Math.sin(motion.angleRadians) * 72}
            stroke="#fbbf24"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="34" cy="318" r="10" fill="#f59e0b" />
          <circle
            ref={projectileRef}
            cx="34"
            cy="318"
            r="10"
            fill="#f8fafc"
            stroke="#22d3ee"
            strokeWidth="4"
            className="drop-shadow-[0_0_14px_rgba(34,211,238,.9)]"
          />
          <text x="46" y="344" fill="#94a3b8" fontSize="12">
            launch
          </text>
          <text x="454" y="344" fill="#94a3b8" fontSize="12">
            range {motion.range.toFixed(1)} m
          </text>
          <text x="48" y="60" fill="#cbd5e1" fontSize="12">
            g = {gravity.gravity} m/s2 ({gravity.label})
          </text>
          <text x="48" y="82" fill="#64748b" fontSize="11">
            click Run Lab to animate the launch
          </text>
        </svg>
      </LabCanvas>

      <aside className="space-y-3">
        <RangeControl
          label="Angle"
          value={angle}
          min={5}
          max={85}
          unit=" deg"
          onChange={setAngle}
        />
        <RangeControl
          label="Velocity"
          value={velocity}
          min={10}
          max={95}
          unit=" m/s"
          onChange={setVelocity}
        />
        <SegmentedControl
          label="Gravity preset"
          value={gravityId}
          options={gravityPresets.map((preset) => ({
            value: preset.id,
            label: preset.label,
          }))}
          onChange={(value) => setGravityId(value as GravityPresetId)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Range" value={`${motion.range.toFixed(1)} m`} />
          <Metric label="Max height" value={`${motion.maxHeight.toFixed(1)} m`} tone="amber" />
        </div>
        <Metric
          label="Flight time"
          value={`${motion.flightTime.toFixed(2)} s`}
          detail="Ignoring air resistance"
          tone="violet"
        />
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300">
          R = v^2 sin(2 theta) / g
        </div>
      </aside>
    </div>
  );
}

export const ProjectileMotionLab = memo(ProjectileMotionLabComponent);
