"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

type ThreeConceptSceneProps = {
  category: string;
  progress: number;
  title: string;
};

function DataStructureScene({ progress }: { progress: number }) {
  return (
    <group>
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x, index) => (
        <group key={x} position={[x, Math.sin(index + progress * 5) * 0.35, 0]}>
          <mesh>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color={index / 5 <= progress ? "#22d3ee" : "#475569"} roughness={0.32} />
          </mesh>
          {index < 4 ? (
            <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.72, 16]} />
              <meshStandardMaterial color="#a78bfa" />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}

function NeuralScene({ progress }: { progress: number }) {
  const layers = [
    [-0.75, 0.75],
    [-1.15, 0, 1.15],
    [-0.75, 0.75],
  ];

  return (
    <group>
      {layers.map((nodes, layerIndex) => (
        <group key={layerIndex} position={[-2 + layerIndex * 2, 0, 0]}>
          {nodes.map((y, nodeIndex) => (
            <mesh key={`${layerIndex}-${nodeIndex}`} position={[0, y, Math.sin(progress * Math.PI + nodeIndex) * 0.45]}>
              <sphereGeometry args={[0.24, 32, 32]} />
              <meshStandardMaterial color={progress > layerIndex / 3 ? "#a78bfa" : "#334155"} emissive="#111827" />
            </mesh>
          ))}
        </group>
      ))}
      {[-1, 0, 1].map((offset) => (
        <mesh key={offset} position={[0, offset * 0.35, -0.25]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 3.6, 12]} />
          <meshStandardMaterial color="#22d3ee" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function RoboticsScene({ progress }: { progress: number }) {
  return (
    <group position={[progress * 2.8 - 1.4, Math.sin(progress * Math.PI) * 0.65, 0]}>
      <mesh>
        <boxGeometry args={[1.1, 0.55, 0.8]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.35} />
      </mesh>
      <mesh position={[-0.38, -0.42, 0.42]}>
        <cylinderGeometry args={[0.18, 0.18, 0.16, 24]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[0.38, -0.42, 0.42]}>
        <cylinderGeometry args={[0.18, 0.18, 0.16, 24]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[1.5, 0.35, 0]}>
        <boxGeometry args={[0.42, 1.2, 0.42]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function GenericScene({ progress }: { progress: number }) {
  return (
    <group rotation={[0.3, progress * Math.PI * 2, 0]}>
      <mesh>
        <torusGeometry args={[1.25, 0.035, 16, 96]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.36, 40, 40]} />
        <meshStandardMaterial color="#f59e0b" emissive="#7c2d12" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[1.25, 0, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#22d3ee" />
      </mesh>
    </group>
  );
}

function SceneContent({
  category,
  progress,
}: Pick<ThreeConceptSceneProps, "category" | "progress">) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("data-structures")) {
    return <DataStructureScene progress={progress} />;
  }

  if (
    normalizedCategory.includes("ai-ml") ||
    normalizedCategory.includes("nlp") ||
    normalizedCategory.includes("computer-vision")
  ) {
    return <NeuralScene progress={progress} />;
  }

  if (normalizedCategory.includes("robotics")) {
    return <RoboticsScene progress={progress} />;
  }

  return <GenericScene progress={progress} />;
}

export function ThreeConceptScene({
  category,
  progress,
  title,
}: ThreeConceptSceneProps) {
  return (
    <div className="relative min-h-[360px] overflow-hidden bg-slate-950">
      <Canvas camera={{ position: [0, 0, 6], fov: 48 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.75} />
        <pointLight position={[3, 4, 5]} intensity={20} color="#22d3ee" />
        <pointLight position={[-4, -2, 4]} intensity={10} color="#a78bfa" />
        <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.35}>
          <SceneContent category={category} progress={progress} />
        </Float>
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-cyan-100 backdrop-blur">
        {title} - React Three Fiber + Drei
      </div>
    </div>
  );
}

export default ThreeConceptScene;
