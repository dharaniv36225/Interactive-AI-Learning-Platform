export type GravityPresetId = "earth" | "moon" | "mars";

export type GravityPreset = {
  id: GravityPresetId;
  label: string;
  gravity: number;
};

export const gravityPresets: GravityPreset[] = [
  { id: "earth", label: "Earth", gravity: 9.81 },
  { id: "moon", label: "Moon", gravity: 1.62 },
  { id: "mars", label: "Mars", gravity: 3.71 },
];

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function atLeast(value: number, minimum: number, fallback: number) {
  return Math.max(minimum, finiteOr(value, fallback));
}

export function getGravityPreset(id: GravityPresetId) {
  return gravityPresets.find((preset) => preset.id === id) ?? gravityPresets[0];
}

export function calculateProjectileMotion({
  velocity,
  angleDegrees,
  gravity,
}: {
  velocity: number;
  angleDegrees: number;
  gravity: number;
}) {
  const safeVelocity = atLeast(velocity, 0, 0);
  const safeAngle = Math.min(89.9, Math.max(0.1, finiteOr(angleDegrees, 45)));
  const safeGravity = atLeast(gravity, 0.001, 9.81);
  const angleRadians = (safeAngle * Math.PI) / 180;
  const horizontalVelocity = safeVelocity * Math.cos(angleRadians);
  const verticalVelocity = safeVelocity * Math.sin(angleRadians);
  const flightTime = (2 * verticalVelocity) / safeGravity;
  const range = horizontalVelocity * flightTime;
  const maxHeight = verticalVelocity ** 2 / (2 * safeGravity);

  return {
    angleRadians,
    horizontalVelocity,
    verticalVelocity,
    flightTime,
    range,
    maxHeight,
  };
}

export function getProjectilePoint({
  velocity,
  angleRadians,
  gravity,
  time,
}: {
  velocity: number;
  angleRadians: number;
  gravity: number;
  time: number;
}) {
  const safeTime = atLeast(time, 0, 0);
  const safeVelocity = atLeast(velocity, 0, 0);
  const safeGravity = atLeast(gravity, 0.001, 9.81);
  const x = safeVelocity * Math.cos(angleRadians) * safeTime;
  const y =
    safeVelocity * Math.sin(angleRadians) * safeTime -
    (safeGravity * safeTime ** 2) / 2;

  return { x, y: Math.max(0, y) };
}

export function calculateCircuit({
  voltage,
  resistance,
  closed = true,
}: {
  voltage: number;
  resistance: number;
  closed?: boolean;
}) {
  const safeVoltage = atLeast(voltage, 0, 0);
  const safeResistance = atLeast(resistance, 0.001, 1);
  const current = closed ? safeVoltage / safeResistance : 0;
  const power = safeVoltage * current;

  return {
    current,
    power,
    powerFromResistance: current ** 2 * safeResistance,
    conductance: closed ? 1 / safeResistance : 0,
    voltageDrop: closed ? current * safeResistance : 0,
  };
}

export function calculateOrbitalPeriod(distanceAu: number) {
  return Math.sqrt(Math.max(0.01, finiteOr(distanceAu, 1)) ** 3);
}
