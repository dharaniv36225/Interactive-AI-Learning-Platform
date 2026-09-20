import type { LabDefinition } from "@/types";

export type LabRendererProps = {
  lab: LabDefinition;
  isRunning: boolean;
  isPaused: boolean;
  onRunComplete: () => void;
  resetSignal: number;
  runSignal: number;
};
