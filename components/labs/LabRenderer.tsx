"use client";

import { LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { memo, type ComponentType } from "react";

import type { LabRendererProps } from "@/components/labs/types";

function RendererFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-[520px] place-items-center rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
    >
      <div className="text-center">
        <LoaderCircle
          className="mx-auto size-6 animate-spin text-cyan-500"
          aria-hidden="true"
        />
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Loading interactive lab...
        </p>
      </div>
    </div>
  );
}

const SolarSystemCanvas = dynamic(
  () =>
    import("@/components/labs/SolarSystemCanvas").then(
      (module) => module.SolarSystemCanvas,
    ),
  { loading: RendererFallback },
);
const ProjectileMotionLab = dynamic(
  () =>
    import("@/components/labs/ProjectileMotionLab").then(
      (module) => module.ProjectileMotionLab,
    ),
  { loading: RendererFallback },
);
const ElectricCircuitLab = dynamic(
  () =>
    import("@/components/labs/ElectricCircuitLab").then(
      (module) => module.ElectricCircuitLab,
    ),
  { loading: RendererFallback },
);
const PhysicsLabs = dynamic(
  () =>
    import("@/components/labs/physics-labs").then(
      (module) => module.PhysicsLabs,
    ),
  { loading: RendererFallback },
);
const ChemistryLabs = dynamic(
  () =>
    import("@/components/labs/chemistry-labs").then(
      (module) => module.ChemistryLabs,
    ),
  { loading: RendererFallback },
);
const BiologyLabs = dynamic(
  () =>
    import("@/components/labs/biology-labs").then(
      (module) => module.BiologyLabs,
    ),
  { loading: RendererFallback },
);
const MathematicsLabs = dynamic(
  () =>
    import("@/components/labs/mathematics-labs").then(
      (module) => module.MathematicsLabs,
    ),
  { loading: RendererFallback },
);
const ComputerScienceLabs = dynamic(
  () =>
    import("@/components/labs/computer-science-labs").then(
      (module) => module.ComputerScienceLabs,
    ),
  { loading: RendererFallback },
);
const AiMlLabs = dynamic(
  () =>
    import("@/components/labs/ai-ml-labs").then(
      (module) => module.AiMlLabs,
    ),
  { loading: RendererFallback },
);
const RoboticsLabs = dynamic(
  () =>
    import("@/components/labs/robotics-labs").then(
      (module) => module.RoboticsLabs,
    ),
  { loading: RendererFallback },
);
const ElectronicsLabs = dynamic(
  () =>
    import("@/components/labs/electronics-labs").then(
      (module) => module.ElectronicsLabs,
    ),
  { loading: RendererFallback },
);
const EnvironmentalLabs = dynamic(
  () =>
    import("@/components/labs/environmental-labs").then(
      (module) => module.EnvironmentalLabs,
    ),
  { loading: RendererFallback },
);
const FinanceLabs = dynamic(
  () =>
    import("@/components/labs/finance-labs").then(
      (module) => module.FinanceLabs,
    ),
  { loading: RendererFallback },
);
const AgricultureLabs = dynamic(
  () =>
    import("@/components/labs/agriculture-labs").then(
      (module) => module.AgricultureLabs,
    ),
  { loading: RendererFallback },
);
const CategoryFallbackLab = dynamic(
  () =>
    import("@/components/labs/CategoryFallbackLab").then(
      (module) => module.CategoryFallbackLab,
    ),
  { loading: RendererFallback },
);

type LabComponent = ComponentType<LabRendererProps>;

const labComponentById: Record<string, LabComponent> = {
  "solar-system-explorer": SolarSystemCanvas,
  "projectile-motion": ProjectileMotionLab,
  "electric-circuit": ElectricCircuitLab,
  "wave-simulator": PhysicsLabs,
  "optics-lab": PhysicsLabs,
  "periodic-table": ChemistryLabs,
  "atom-builder": ChemistryLabs,
  "molecule-builder": ChemistryLabs,
  "reaction-simulator": ChemistryLabs,
  "ph-simulator": ChemistryLabs,
  "cell-explorer": BiologyLabs,
  "human-body-explorer": BiologyLabs,
  "photosynthesis-simulator": BiologyLabs,
  "plant-growth": BiologyLabs,
  "food-chain-builder": BiologyLabs,
  "dna-explorer": BiologyLabs,
  "graph-plotter": MathematicsLabs,
  "geometry-explorer": MathematicsLabs,
  "probability-simulator": MathematicsLabs,
  "trigonometry-visualizer": MathematicsLabs,
  "statistics-lab": MathematicsLabs,
  "data-structures-visualizer": ComputerScienceLabs,
  "sorting-visualizer": ComputerScienceLabs,
  "searching-visualizer": ComputerScienceLabs,
  "network-simulator": ComputerScienceLabs,
  "database-explorer": ComputerScienceLabs,
  "neural-network-visualizer": AiMlLabs,
  "ai-training-simulator": AiMlLabs,
  "computer-vision-demo": AiMlLabs,
  "nlp-explorer": AiMlLabs,
  "ml-playground": AiMlLabs,
  "robot-movement": RoboticsLabs,
  "sensor-simulator": RoboticsLabs,
  "line-following-robot": RoboticsLabs,
  "obstacle-avoidance": RoboticsLabs,
  "logic-gate-simulator": ElectronicsLabs,
  "led-circuit": ElectronicsLabs,
  "resistor-tool": ElectronicsLabs,
  "digital-circuit-builder": ElectronicsLabs,
  "water-cycle": EnvironmentalLabs,
  "climate-change": EnvironmentalLabs,
  "carbon-footprint": EnvironmentalLabs,
  "renewable-energy": EnvironmentalLabs,
  "compound-interest": FinanceLabs,
  "investment-simulator": FinanceLabs,
  "budget-planner": FinanceLabs,
  "risk-return": FinanceLabs,
  "smart-farming": AgricultureLabs,
  "irrigation-simulator": AgricultureLabs,
  "crop-rotation": AgricultureLabs,
  "soil-health": AgricultureLabs,
};

function LabRendererComponent(props: LabRendererProps) {
  const LabComponentForId =
    labComponentById[props.lab.id] ?? CategoryFallbackLab;

  const state = props.isPaused
    ? "Paused"
    : props.isRunning
      ? "Running"
      : "Ready";

  return (
    <div
      className="lab-simulation space-y-3"
      data-paused={props.isPaused}
      data-running={props.isRunning}
    >
      <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        <span
          className={`size-2 rounded-full ${
            props.isRunning && !props.isPaused
              ? "animate-pulse bg-emerald-400"
              : props.isPaused
                ? "bg-amber-400"
                : "bg-slate-300 dark:bg-slate-600"
          }`}
        />
        <span aria-live="polite">{state}</span>
      </div>
      <div className="lab-stage relative">
        <LabComponentForId key={props.lab.id} {...props} />
      </div>
    </div>
  );
}

export const LabRenderer = memo(LabRendererComponent);
