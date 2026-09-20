"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Metric } from "@/components/labs/lab-ui";
import type { LabRendererProps } from "@/components/labs/types";
import { calculateOrbitalPeriod } from "@/lib/physics";

type Planet = {
  name: string;
  color: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  mass: string;
  gravity: string;
  temperature: string;
  distance: string;
  distanceAu: number;
  fact: string;
  hasRings?: boolean;
};

type DrawPlanet = Planet & {
  x: number;
  y: number;
  drawRadius: number;
};

const planets: Planet[] = [
  {
    name: "Mercury",
    color: "#a8a29e",
    radius: 4,
    orbitRadius: 44,
    orbitSpeed: 0.032,
    mass: "3.30 x 10^23 kg",
    gravity: "3.7 m/s2",
    temperature: "167 C average",
    distance: "57.9 million km",
    distanceAu: 0.39,
    fact: "Mercury has extreme day-night temperature swings because it has almost no atmosphere.",
  },
  {
    name: "Venus",
    color: "#fbbf24",
    radius: 7,
    orbitRadius: 67,
    orbitSpeed: 0.024,
    mass: "4.87 x 10^24 kg",
    gravity: "8.9 m/s2",
    temperature: "464 C average",
    distance: "108.2 million km",
    distanceAu: 0.72,
    fact: "Venus is hotter than Mercury because its dense atmosphere traps heat strongly.",
  },
  {
    name: "Earth",
    color: "#38bdf8",
    radius: 8,
    orbitRadius: 93,
    orbitSpeed: 0.02,
    mass: "5.97 x 10^24 kg",
    gravity: "9.8 m/s2",
    temperature: "15 C average",
    distance: "149.6 million km",
    distanceAu: 1,
    fact: "Earth's liquid water, atmosphere, and magnetic field make it unusually friendly to life.",
  },
  {
    name: "Mars",
    color: "#fb7185",
    radius: 6,
    orbitRadius: 119,
    orbitSpeed: 0.016,
    mass: "6.42 x 10^23 kg",
    gravity: "3.7 m/s2",
    temperature: "-65 C average",
    distance: "227.9 million km",
    distanceAu: 1.52,
    fact: "Mars has the tallest known volcano in the solar system, Olympus Mons.",
  },
  {
    name: "Jupiter",
    color: "#f97316",
    radius: 14,
    orbitRadius: 154,
    orbitSpeed: 0.009,
    mass: "1.90 x 10^27 kg",
    gravity: "24.8 m/s2",
    temperature: "-110 C cloud tops",
    distance: "778.5 million km",
    distanceAu: 5.2,
    fact: "Jupiter is more massive than all the other planets combined.",
  },
  {
    name: "Saturn",
    color: "#fde68a",
    radius: 12,
    orbitRadius: 190,
    orbitSpeed: 0.0068,
    mass: "5.68 x 10^26 kg",
    gravity: "10.4 m/s2",
    temperature: "-140 C cloud tops",
    distance: "1.43 billion km",
    distanceAu: 9.58,
    fact: "Saturn's rings are mostly ice particles, from tiny grains to house-sized chunks.",
    hasRings: true,
  },
  {
    name: "Uranus",
    color: "#67e8f9",
    radius: 10,
    orbitRadius: 222,
    orbitSpeed: 0.0048,
    mass: "8.68 x 10^25 kg",
    gravity: "8.7 m/s2",
    temperature: "-195 C cloud tops",
    distance: "2.87 billion km",
    distanceAu: 19.2,
    fact: "Uranus rotates on its side, likely because of a huge ancient collision.",
  },
  {
    name: "Neptune",
    color: "#6366f1",
    radius: 10,
    orbitRadius: 252,
    orbitSpeed: 0.0038,
    mass: "1.02 x 10^26 kg",
    gravity: "11.2 m/s2",
    temperature: "-200 C cloud tops",
    distance: "4.50 billion km",
    distanceAu: 30.1,
    fact: "Neptune has the fastest winds measured in the solar system.",
  },
];

function createStars(width: number, height: number) {
  return Array.from({ length: 150 }, (_, index) => {
    const seed = Math.sin(index * 91.7) * 10000;
    const seed2 = Math.sin(index * 37.3) * 10000;
    return {
      x: (seed - Math.floor(seed)) * width,
      y: (seed2 - Math.floor(seed2)) * height,
      radius: index % 9 === 0 ? 1.6 : 0.8,
      alpha: 0.35 + (index % 7) * 0.08,
    };
  });
}

function SolarSystemCanvasComponent({
  isRunning,
  isPaused,
  resetSignal,
  runSignal,
}: LabRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const planetPositionsRef = useRef<DrawPlanet[]>([]);
  const starsRef = useRef<ReturnType<typeof createStars>>([]);
  const elapsedRef = useRef(0);
  const drawFrameRef = useRef<((elapsed: number) => void) | null>(null);
  const selectedPlanetRef = useRef("Earth");
  const speedRef = useRef(1);
  const [selectedPlanetName, setSelectedPlanetName] = useState("Earth");
  const [speed, setSpeed] = useState(1);

  const selectedPlanet = useMemo(
    () =>
      planets.find((planet) => planet.name === selectedPlanetName) ??
      planets[2],
    [selectedPlanetName],
  );

  useEffect(() => {
    setSelectedPlanetName("Earth");
    setSpeed(1);
    elapsedRef.current = 0;
    drawFrameRef.current?.(0);
  }, [resetSignal]);

  useEffect(() => {
    selectedPlanetRef.current = selectedPlanetName;
    if (!isRunning) {
      drawFrameRef.current?.(elapsedRef.current);
    }
  }, [isRunning, selectedPlanetName]);

  useEffect(() => {
    speedRef.current = speed;
    if (!isRunning) {
      drawFrameRef.current?.(elapsedRef.current);
    }
  }, [isRunning, speed]);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }

    const canvasContext = canvasElement.getContext("2d");
    if (!canvasContext) {
      return;
    }
    const canvas = canvasElement;
    const context = canvasContext;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(rect.height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      starsRef.current = createStars(rect.width, rect.height);
      drawFrameRef.current?.(elapsedRef.current);
    }

    function draw(elapsed: number) {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width / 640, height / 430);
      const stars = starsRef.current;

      context.clearRect(0, 0, width, height);
      const gradient = context.createRadialGradient(centerX, centerY, 40, centerX, centerY, Math.max(width, height) * 0.7);
      gradient.addColorStop(0, "#101d32");
      gradient.addColorStop(1, "#020617");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        context.globalAlpha = star.alpha;
        context.fillStyle = "#e0f2fe";
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;

      planets.forEach((planet) => {
        context.strokeStyle = "rgba(148, 163, 184, 0.18)";
        context.lineWidth = 1;
        context.beginPath();
        context.ellipse(
          centerX,
          centerY,
          planet.orbitRadius * scale,
          planet.orbitRadius * scale * 0.72,
          0,
          0,
          Math.PI * 2,
        );
        context.stroke();
      });

      const sunGlow = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, 64 * scale);
      sunGlow.addColorStop(0, "rgba(253, 224, 71, 1)");
      sunGlow.addColorStop(0.45, "rgba(251, 146, 60, 0.62)");
      sunGlow.addColorStop(1, "rgba(251, 146, 60, 0)");
      context.fillStyle = sunGlow;
      context.beginPath();
      context.arc(centerX, centerY, 68 * scale, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#facc15";
      context.beginPath();
      context.arc(centerX, centerY, 24 * scale, 0, Math.PI * 2);
      context.fill();

      planetPositionsRef.current = planets.map((planet, index) => {
        const angle =
          elapsed * planet.orbitSpeed * speedRef.current * 9 + index * 0.84;
        const x = centerX + Math.cos(angle) * planet.orbitRadius * scale;
        const y = centerY + Math.sin(angle) * planet.orbitRadius * scale * 0.72;
        const drawRadius = Math.max(planet.radius * scale, 4);
        const selected = planet.name === selectedPlanetRef.current;

        if (planet.hasRings) {
          context.save();
          context.translate(x, y);
          context.rotate(-0.38);
          context.strokeStyle = "rgba(253, 230, 138, 0.85)";
          context.lineWidth = Math.max(2, 3 * scale);
          context.beginPath();
          context.ellipse(0, 0, drawRadius * 2.1, drawRadius * 0.78, 0, 0, Math.PI * 2);
          context.stroke();
          context.restore();
        }

        const planetGlow = context.createRadialGradient(x, y, 1, x, y, drawRadius * 2.4);
        planetGlow.addColorStop(0, planet.color);
        planetGlow.addColorStop(1, "rgba(15, 23, 42, 0)");
        context.fillStyle = planetGlow;
        context.beginPath();
        context.arc(x, y, drawRadius * 2.1, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = planet.color;
        context.beginPath();
        context.arc(x, y, drawRadius, 0, Math.PI * 2);
        context.fill();

        if (selected) {
          context.strokeStyle = "#ffffff";
          context.lineWidth = 2;
          context.beginPath();
          context.arc(x, y, drawRadius + 8, 0, Math.PI * 2);
          context.stroke();
        }

        return { ...planet, x, y, drawRadius };
      });
    }

    drawFrameRef.current = draw;
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    draw(0);

    return () => {
      observer.disconnect();
      drawFrameRef.current = null;
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (!isRunning || isPaused) {
      drawFrameRef.current?.(elapsedRef.current);
      return;
    }

    const startedAt = performance.now() - elapsedRef.current * 1000;

    function animate(now: number) {
      elapsedRef.current = (now - startedAt) / 1000;
      drawFrameRef.current?.(elapsedRef.current);
      animationRef.current = window.requestAnimationFrame(animate);
    }

    animationRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPaused, isRunning, runSignal]);

  const selectFromPointer = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const hit = [...planetPositionsRef.current]
      .reverse()
      .find((planet) => Math.hypot(planet.x - x, planet.y - y) <= planet.drawRadius + 10);

    if (hit) {
      setSelectedPlanetName(hit.name);
    }
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair"
          aria-label="Animated canvas solar system with clickable planets"
          role="img"
          onClick={(event) => selectFromPointer(event.clientX, event.clientY)}
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[10px] font-semibold text-cyan-100 backdrop-blur">
          Click a planet to inspect it
        </div>
      </div>

      <aside className="space-y-4">
        <label className="block rounded-xl border border-slate-200 bg-white p-3 dark:border-white/[0.08] dark:bg-white/[0.025]">
          <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Orbit speed
            <span className="text-sm normal-case tracking-normal text-slate-950 dark:text-white">
              {speed.toFixed(2)}x
            </span>
          </span>
          <input
            type="range"
            min={0.3}
            max={3}
            step={0.05}
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="mt-3 w-full accent-cyan-500"
          />
        </label>

        <div className="grid grid-cols-4 gap-2">
          {planets.map((planet) => (
            <button
              key={planet.name}
              type="button"
              onClick={() => setSelectedPlanetName(planet.name)}
              className={`grid h-10 place-items-center rounded-xl border text-[10px] font-black transition ${
                selectedPlanet.name === planet.name
                  ? "border-white bg-slate-950 text-white shadow-[0_0_18px_rgba(255,255,255,.22)] dark:bg-white dark:text-slate-950"
                  : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300"
              }`}
              title={planet.name}
            >
              {planet.name.slice(0, 2)}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.025]">
          <div className="flex items-center gap-3">
            <span
              className="size-5 rounded-full shadow-[0_0_16px_currentColor]"
              style={{ backgroundColor: selectedPlanet.color, color: selectedPlanet.color }}
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Selected planet
              </p>
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">
                {selectedPlanet.name}
              </h2>
            </div>
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500 dark:text-slate-300">
            {selectedPlanet.fact}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric label="Mass" value={selectedPlanet.mass} tone="violet" />
          <Metric label="Gravity" value={selectedPlanet.gravity} />
          <Metric label="Temperature" value={selectedPlanet.temperature} tone="amber" />
          <Metric label="From sun" value={selectedPlanet.distance} tone="emerald" />
        </div>
        <Metric
          label="Kepler period"
          value={`${calculateOrbitalPeriod(selectedPlanet.distanceAu).toFixed(1)} yr`}
          detail="Scaled from orbital distance"
        />
      </aside>
    </div>
  );
}

export const SolarSystemCanvas = memo(SolarSystemCanvasComponent);
