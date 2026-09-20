"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { BtechLabDefinition } from "@/lib/btech-labs";

type BtechLabRendererProps = {
  lab: BtechLabDefinition;
};

function getPath(conceptType: BtechLabDefinition["conceptType"], progress: number) {
  if (conceptType === "algorithms") {
    return `M40 300 C180 ${80 + progress * 90}, 320 ${260 - progress * 160}, 580 90`;
  }

  if (conceptType === "mechanical") {
    return `M80 180 C180 ${80 + progress * 120}, 420 ${280 - progress * 120}, 560 180`;
  }

  if (conceptType === "civil") {
    return "M70 260 L180 130 L310 260 L440 130 L570 260";
  }

  return `M40 ${280 - progress * 120} C200 ${90 + progress * 120}, 400 ${280 - progress * 180}, 590 ${120 + progress * 80}`;
}

type SceneProps = {
  lab: BtechLabDefinition;
  progress: number;
  blocks: Array<{ id: number; x: number; height: number }>;
};

function AgricultureScene({ progress }: SceneProps) {
  const moisture = Math.round(30 + progress * 58);

  return (
    <>
      <rect x="60" y="250" width="520" height="70" rx="18" fill="#14532d" />
      {[0, 1, 2, 3].map((index) => (
        <g key={index} transform={`translate(${120 + index * 115} 0)`}>
          <path d={`M0 250 C10 ${225 - progress * 70}, 28 ${220 - progress * 85}, 36 250`} fill="#22c55e" opacity={0.35 + progress * 0.65} />
          <line x1="18" y1="250" x2="18" y2={250 - progress * (55 + index * 8)} stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
          <circle cx="18" cy={242 - progress * (55 + index * 8)} r={6 + progress * 10} fill="#bbf7d0" />
          <path d={`M18 250 Q${10 - progress * 22} 278 0 303`} stroke="#7c2d12" strokeWidth="4" fill="none" />
          <path d={`M18 250 Q${32 + progress * 22} 278 44 303`} stroke="#7c2d12" strokeWidth="4" fill="none" />
        </g>
      ))}
      <path d={`M70 ${130 - progress * 26} H570`} stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" strokeDasharray="18 14" />
      {[0, 1, 2, 3, 4].map((drop) => (
        <circle key={drop} cx={110 + drop * 95} cy={145 + progress * 105} r="7" fill="#7dd3fc" opacity={progress > drop * 0.12 ? 1 : 0.25} />
      ))}
      <rect x="410" y="45" width="145" height="82" rx="16" fill="#0f172a" stroke="#22c55e" />
      <text x="430" y="76" fill="#bbf7d0" fontSize="13" fontWeight="800">Soil score</text>
      <text x="430" y="110" fill="#f8fafc" fontSize="28" fontWeight="900">{moisture}%</text>
    </>
  );
}

function FinanceScene({ progress }: SceneProps) {
  const portfolio = Math.round(10000 * (1 + progress * 1.8));

  return (
    <>
      <line x1="75" y1="300" x2="570" y2="300" stroke="#64748b" strokeWidth="3" />
      <line x1="75" y1="70" x2="75" y2="300" stroke="#64748b" strokeWidth="3" />
      {[0, 1, 2, 3].map((index) => (
        <circle
          key={index}
          cx={145 + index * 110}
          cy={255 - progress * (35 + index * 42)}
          r={22 + index * 3}
          fill={index % 2 === 0 ? "#22d3ee" : "#a78bfa"}
          opacity={0.35 + progress * 0.65}
        />
      ))}
      <path d={`M90 275 C190 ${260 - progress * 120}, 315 ${250 - progress * 155}, 540 ${95 + progress * 18}`} fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
      <rect x="390" y="52" width="160" height="78" rx="16" fill="#111827" stroke="#f59e0b" />
      <text x="410" y="82" fill="#fde68a" fontSize="13" fontWeight="800">Portfolio</text>
      <text x="410" y="113" fill="#f8fafc" fontSize="24" fontWeight="900">${portfolio.toLocaleString()}</text>
      <text x="250" y="334" fill="#94a3b8" fontSize="12">Risk</text>
      <text x="22" y="80" fill="#94a3b8" fontSize="12">Return</text>
    </>
  );
}

function EnvironmentalScene({ progress }: SceneProps) {
  return (
    <>
      <circle cx="110" cy="80" r="34" fill="#facc15" opacity={0.75 + progress * 0.25} />
      <path d="M230 92 C255 54 318 58 338 102 C385 95 420 122 420 160 H215 C194 132 202 104 230 92Z" fill="#e0f2fe" opacity="0.9" />
      <path d={`M315 175 C255 ${210 + progress * 30}, 220 ${250 + progress * 18}, 165 290`} fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${progress * 24 + 6} 16`} />
      <path d={`M445 275 C390 ${230 - progress * 30}, 430 ${190 - progress * 35}, 500 145`} fill="none" stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
      <rect x="80" y="292" width="480" height="28" rx="14" fill="#166534" />
      {[0, 1, 2].map((index) => (
        <g key={index} transform={`translate(${455 + index * 34} ${230 - index * 18}) rotate(${progress * 180 + index * 35})`}>
          <line x1="0" y1="0" x2="0" y2="-32" stroke="#f8fafc" strokeWidth="3" />
          <line x1="0" y1="0" x2="28" y2="18" stroke="#f8fafc" strokeWidth="3" />
          <line x1="0" y1="0" x2="-28" y2="18" stroke="#f8fafc" strokeWidth="3" />
        </g>
      ))}
      <text x="70" y="342" fill="#94a3b8" fontSize="13">CO2e drops as renewables and water cycling improve</text>
    </>
  );
}

function AiScene({ lab, progress }: SceneProps) {
  const tokenMode = lab.conceptType === "nlp";

  return (
    <>
      {[110, 300, 500].map((x, layer) =>
        [105, 180, 255].slice(0, layer === 1 ? 3 : 2).map((y, index) => (
          <g key={`${x}-${y}`}>
            {x < 500 ? (
              <path
                d={`M${x + 23} ${y} C${x + 82} ${80 + index * 55}, ${x + 120} ${210 - index * 34}, ${x + 176} 180`}
                stroke={progress > layer * 0.3 ? "#22d3ee" : "#334155"}
                strokeWidth="3"
                fill="none"
              />
            ) : null}
            <circle cx={x} cy={y} r="23" fill={progress > layer * 0.25 ? "#a78bfa" : "#334155"} />
            <text x={x} y={y + 5} textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="800">
              {tokenMode ? ["Q", "K", "V"][index] ?? "T" : (layer + 1).toString()}
            </text>
          </g>
        )),
      )}
      <path d={`M92 320 C190 ${245 - progress * 80}, 300 ${270 - progress * 145}, 550 ${95 + progress * 30}`} fill="none" stroke="#f59e0b" strokeWidth="6" />
      <text x="420" y="322" fill="#e2e8f0" fontSize="13" fontWeight="800">
        confidence {Math.round(45 + progress * 48)}%
      </text>
    </>
  );
}

function ComputerScienceScene({ lab, progress, blocks }: SceneProps) {
  const isNetwork = lab.conceptType === "networks";
  const isDb = lab.conceptType === "dbms";

  return (
    <>
      {isNetwork || isDb ? (
        [95, 220, 360, 500].map((x, index) => (
          <g key={x}>
            <rect x={x - 42} y={120 + (index % 2) * 80} width="84" height="54" rx="14" fill={index / 4 <= progress ? "#22d3ee" : "#334155"} />
            <text x={x} y={152 + (index % 2) * 80} textAnchor="middle" fill="#020617" fontSize="12" fontWeight="900">
              {isDb ? ["SCAN", "JOIN", "SORT", "SUM"][index] : ["Client", "Router", "Server", "ACK"][index]}
            </text>
            {index < 3 ? <path d={`M${x + 46} ${147 + (index % 2) * 80} H${x + 78}`} stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" /> : null}
          </g>
        ))
      ) : (
        blocks.map((block, index) => (
          <rect
            key={block.id}
            x={block.x}
            y={300 - block.height}
            width="44"
            height={block.height}
            rx="10"
            fill={index / blocks.length <= progress ? "#a78bfa" : "#475569"}
          />
        ))
      )}
      <path d={getPath(lab.conceptType, progress)} fill="none" stroke="#22d3ee" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${Math.max(1, progress * 820)} 820`} />
      <circle cx={60 + progress * 520} cy={250 - Math.sin(progress * Math.PI) * 150} r="18" fill="#f59e0b" stroke="#fef3c7" strokeWidth="5" />
    </>
  );
}

function RoboticsScene({ progress }: SceneProps) {
  return (
    <>
      <path d="M70 285 C180 85 340 315 570 88" fill="none" stroke="#475569" strokeWidth="20" strokeLinecap="round" />
      <path d="M70 285 C180 85 340 315 570 88" fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${progress * 760} 760`} />
      {[210, 405].map((x, index) => (
        <rect key={x} x={x} y={index === 0 ? 205 : 105} width="62" height="70" rx="14" fill="#ef4444" opacity="0.82" />
      ))}
      <g transform={`translate(${82 + progress * 470} ${270 - Math.sin(progress * Math.PI) * 145})`}>
        <circle r="28" fill="#a78bfa" />
        <path d="M0 0 L95 -34 A102 102 0 0 1 95 34 Z" fill="#f59e0b" opacity="0.28" />
        <circle r="8" fill="#f8fafc" />
      </g>
      <text x="70" y="48" fill="#e2e8f0" fontSize="14" fontWeight="800">
        obstacle clearance {Math.round(20 + progress * 78)}%
      </text>
    </>
  );
}

function ElectronicsScene({ lab, progress }: SceneProps) {
  const gateOutput = progress > 0.48 ? 1 : 0;

  return (
    <>
      <path d="M70 180 H170 M70 240 H170 M330 210 H560" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
      <path d={`M70 180 H${170 + progress * 118}`} stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
      <path d={`M70 240 H${170 + Math.max(0, progress - 0.18) * 118}`} stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
      <path d="M175 145 H255 C315 145 315 275 255 275 H175 Z" fill="#1e293b" stroke="#e2e8f0" strokeWidth="3" />
      <text x="225" y="214" textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="900">{lab.id.includes("motor") ? "PWM" : "AND"}</text>
      <circle cx={390 + progress * 120} cy="210" r="13" fill={gateOutput ? "#22c55e" : "#475569"} />
      <circle cx="560" cy="210" r={lab.id.includes("motor") ? 42 : 28} fill={gateOutput ? "#facc15" : "#334155"} opacity={0.55 + progress * 0.45} />
      <text x="492" y="92" fill="#e2e8f0" fontSize="14" fontWeight="800">output {gateOutput}</text>
      {lab.id.includes("motor") ? (
        <g transform={`translate(560 210) rotate(${progress * 720})`}>
          <line x1="-48" y1="0" x2="48" y2="0" stroke="#fde68a" strokeWidth="5" />
          <line x1="0" y1="-48" x2="0" y2="48" stroke="#fde68a" strokeWidth="5" />
        </g>
      ) : null}
    </>
  );
}

function ChemistryScene({ progress }: SceneProps) {
  return (
    <>
      {[150, 300, 455].map((x, index) => (
        <circle key={x} cx={x + (index - 1) * progress * 45} cy={180 + Math.sin(progress * Math.PI + index) * 24} r="36" fill={["#22d3ee", "#f472b6", "#a78bfa"][index]} />
      ))}
      <line x1="190" y1="180" x2="265" y2="180" stroke="#e2e8f0" strokeWidth={progress > 0.35 ? 7 : 2} strokeLinecap="round" opacity={progress > 0.2 ? 1 : 0.3} />
      <line x1="338" y1="180" x2="420" y2="180" stroke="#e2e8f0" strokeWidth={progress > 0.58 ? 7 : 2} strokeLinecap="round" opacity={progress > 0.35 ? 1 : 0.3} />
      <rect x="135" y="280" width="370" height="24" rx="12" fill="url(#phGradient)" />
      <defs>
        <linearGradient id="phGradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx={135 + progress * 370} cy="292" r="13" fill="#f8fafc" />
      <text x="230" y="78" fill="#e2e8f0" fontSize="15" fontWeight="800">bonds form after Run Lab</text>
    </>
  );
}

function BiologyScene({ progress }: SceneProps) {
  return (
    <>
      <ellipse cx="315" cy="180" rx="185" ry="112" fill="#164e63" stroke="#67e8f9" strokeWidth="5" />
      <circle cx="300" cy="175" r="42" fill="#a78bfa" opacity={0.85} />
      {[0, 1, 2, 3].map((index) => (
        <ellipse key={index} cx={190 + index * 78} cy={220 - index * 18} rx="28" ry="14" fill="#22c55e" opacity={0.45 + progress * 0.45} />
      ))}
      <path d={`M150 86 C230 ${130 + progress * 80}, 400 ${70 - progress * 25}, 500 150`} fill="none" stroke="#f8fafc" strokeWidth="5" />
      <path d={`M150 150 C230 ${90 - progress * 40}, 400 ${210 + progress * 55}, 500 86`} fill="none" stroke="#f8fafc" strokeWidth="5" />
      {[0, 1, 2, 3, 4].map((index) => (
        <line key={index} x1={185 + index * 65} y1={110 + Math.sin(index) * 28} x2={185 + index * 65} y2={126 + Math.cos(index) * 34} stroke="#f472b6" strokeWidth="5" />
      ))}
      <text x="95" y="322" fill="#e2e8f0" fontSize="13">cell energy and DNA pairing update with progress</text>
    </>
  );
}

function MathematicsScene({ progress, blocks }: SceneProps) {
  const angle = progress * Math.PI * 2;
  const x = 315 + Math.cos(angle) * 92;
  const y = 178 - Math.sin(angle) * 92;

  return (
    <>
      <circle cx="315" cy="178" r="92" fill="none" stroke="#475569" strokeWidth="5" />
      <line x1="315" y1="178" x2={x} y2={y} stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" />
      <circle cx={x} cy={y} r="14" fill="#f59e0b" />
      {blocks.map((block, index) => (
        <rect key={block.id} x={70 + index * 42} y={315 - block.height * progress} width="26" height={block.height * progress} rx="7" fill="#a78bfa" />
      ))}
      <text x="420" y="120" fill="#e2e8f0" fontSize="14" fontWeight="800">sin {Math.sin(angle).toFixed(2)}</text>
      <text x="420" y="150" fill="#e2e8f0" fontSize="14" fontWeight="800">cos {Math.cos(angle).toFixed(2)}</text>
    </>
  );
}

function ProgrammingScene({ lab, progress }: SceneProps) {
  const isStack = lab.id.includes("recursion");
  const isPointer = lab.id.includes("memory");

  return (
    <>
      <rect x="70" y="72" width="160" height="230" rx="18" fill="#0f172a" stroke="#22d3ee" />
      <text x="92" y="104" fill="#67e8f9" fontSize="14" fontWeight="900">
        {isStack ? "Call stack" : "Stack"}
      </text>
      {[0, 1, 2, 3, 4].map((index) => (
        <rect
          key={index}
          x="92"
          y={250 - index * 34}
          width="116"
          height="26"
          rx="7"
          fill={progress * 5 > index ? "#22d3ee" : "#334155"}
        />
      ))}
      <rect x="390" y="80" width="170" height="210" rx="18" fill="#111827" stroke="#a78bfa" />
      <text x="414" y="112" fill="#c4b5fd" fontSize="14" fontWeight="900">
        {isPointer ? "Heap blocks" : "Variables"}
      </text>
      {[0, 1, 2].map((index) => (
        <circle key={index} cx={432 + index * 48} cy={180 + Math.sin(progress * Math.PI + index) * 44} r="18" fill={progress > index * 0.22 ? "#a78bfa" : "#475569"} />
      ))}
      <path d={`M212 ${250 - Math.floor(progress * 4) * 34} C290 ${120 + progress * 90}, 330 ${210 - progress * 70}, 408 ${180 + Math.sin(progress * Math.PI) * 44}`} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeDasharray="12 10" />
      <text x="76" y="336" fill="#e2e8f0" fontSize="13">
        {isStack ? "push call frames, return, then unwind" : "allocate variable, point to heap, update value"}
      </text>
    </>
  );
}

function DataStructureScene({ lab, progress }: SceneProps) {
  if (lab.id.includes("queue")) {
    return (
      <>
        <path d="M80 190 H560" stroke="#475569" strokeWidth="72" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((index) => (
          <rect key={index} x={105 + index * 78 - progress * 44} y="157" width="54" height="66" rx="13" fill={index / 5 < progress ? "#22d3ee" : "#334155"} />
        ))}
        <text x="90" y="118" fill="#67e8f9" fontSize="14" fontWeight="900">Front moves on dequeue</text>
        <text x="408" y="118" fill="#c4b5fd" fontSize="14" fontWeight="900">Rear moves on enqueue</text>
        <circle cx={120 + progress * 400} cy="260" r="12" fill="#f59e0b" />
      </>
    );
  }

  if (lab.id.includes("linked-list")) {
    return (
      <>
        {[0, 1, 2, 3, 4].map((index) => (
          <g key={index} transform={`translate(${70 + index * 110} ${170 + Math.sin(progress * Math.PI + index) * 18})`}>
            <rect width="70" height="50" rx="14" fill={progress > index * 0.16 ? "#22d3ee" : "#334155"} />
            <text x="35" y="31" textAnchor="middle" fill="#020617" fontSize="14" fontWeight="900">N{index + 1}</text>
            {index < 4 ? <path d="M74 25 H106" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" markerEnd="url(#arrow)" /> : null}
          </g>
        ))}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6Z" fill="#f59e0b" />
          </marker>
        </defs>
        <text x="72" y="306" fill="#e2e8f0" fontSize="13">create node, move pointer, insert, delete, reverse links</text>
      </>
    );
  }

  if (lab.id.includes("tree")) {
    return (
      <>
        {[
          [320, 75, "8"],
          [210, 155, "4"],
          [430, 155, "12"],
          [150, 245, "2"],
          [270, 245, "6"],
          [390, 245, "10"],
          [510, 245, "14"],
        ].map(([x, y, label], index) => (
          <g key={label}>
            {index > 0 ? <line x1="320" y1="95" x2={Number(x)} y2={Number(y) - 20} stroke="#475569" strokeWidth="4" /> : null}
            <circle cx={x} cy={y} r="24" fill={progress * 7 > index ? "#a78bfa" : "#334155"} />
            <text x={x} y={Number(y) + 5} textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="900">{label}</text>
          </g>
        ))}
        <path d={`M320 75 L${210 + progress * 300} ${155 + Math.sin(progress * Math.PI) * 90}`} stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" />
        <text x="82" y="325" fill="#e2e8f0" fontSize="13">insert, traverse, rotate, and rebalance tree nodes</text>
      </>
    );
  }

  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const x = 120 + (index % 3) * 190;
        const y = 105 + Math.floor(index / 3) * 140;
        return (
          <g key={index}>
            {index < 5 ? <line x1={x} y1={y} x2={120 + ((index + 1) % 3) * 190} y2={105 + Math.floor((index + 1) / 3) * 140} stroke="#475569" strokeWidth="4" /> : null}
            <circle cx={x} cy={y} r="30" fill={progress * 6 > index ? "#22d3ee" : "#334155"} />
            <text x={x} y={y + 5} textAnchor="middle" fill="#020617" fontSize="14" fontWeight="900">{index}</text>
          </g>
        );
      })}
      <text x="80" y="325" fill="#e2e8f0" fontSize="13">BFS queue / DFS stack / shortest path frontier</text>
    </>
  );
}

function AlgorithmScene({ lab, progress, blocks }: SceneProps) {
  if (lab.id.includes("binary")) {
    const active = Math.floor(progress * 8);
    return (
      <>
        {Array.from({ length: 9 }, (_, index) => (
          <rect key={index} x={65 + index * 58} y="160" width="46" height="54" rx="10" fill={index === active ? "#f59e0b" : index < active ? "#334155" : "#22d3ee"} />
        ))}
        <path d={`M88 ${115 + Math.sin(progress * Math.PI) * 20} L${88 + active * 58} 150`} stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
        <text x="76" y="92" fill="#e2e8f0" fontSize="14">compare middle, discard half, repeat</text>
      </>
    );
  }

  if (lab.id.includes("dijkstra") || lab.id.includes("graph")) {
    return <DataStructureScene lab={lab} progress={progress} blocks={blocks} />;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const compare = Math.floor(progress * blocks.length) === index;
        const x = block.x + (compare ? Math.sin(progress * Math.PI * 8) * 12 : 0);
        return (
          <rect key={block.id} x={x} y={300 - block.height} width="44" height={block.height} rx="10" fill={compare ? "#f59e0b" : index / blocks.length <= progress ? "#22d3ee" : "#475569"} />
        );
      })}
      <path d={`M80 ${95 + progress * 60} H560`} stroke="#a78bfa" strokeWidth="5" strokeDasharray="14 12" />
      <text x="76" y="54" fill="#e2e8f0" fontSize="14">comparison, swap, merge, partition, movement</text>
    </>
  );
}

function OperatingSystemScene({ lab, progress }: SceneProps) {
  if (lab.id.includes("paging")) {
    return (
      <>
        {[0, 1, 2, 3].map((index) => (
          <g key={index}>
            <rect x="90" y={75 + index * 58} width="120" height="40" rx="9" fill={progress * 4 > index ? "#22d3ee" : "#334155"} />
            <rect x="430" y={75 + ((index + 1) % 4) * 58} width="120" height="40" rx="9" fill={progress * 4 > index ? "#a78bfa" : "#334155"} />
            <path d={`M215 ${95 + index * 58} C300 ${65 + progress * 90}, 345 ${250 - progress * 80}, 425 ${95 + ((index + 1) % 4) * 58}`} stroke="#f59e0b" strokeWidth="4" fill="none" />
          </g>
        ))}
        <text x="80" y="335" fill="#e2e8f0" fontSize="13">virtual pages translate into physical frames</text>
      </>
    );
  }

  if (lab.id.includes("deadlock")) {
    return (
      <>
        {["P1", "R1", "P2", "R2"].map((label, index) => (
          <g key={label} transform={`translate(${180 + (index % 2) * 250} ${105 + Math.floor(index / 2) * 140})`}>
            <circle r="38" fill={index % 2 === 0 ? "#22d3ee" : "#a78bfa"} />
            <text y="5" textAnchor="middle" fill="#020617" fontSize="14" fontWeight="900">{label}</text>
          </g>
        ))}
        <path d="M218 105 H392 M430 143 V207 M392 245 H218 M180 207 V143" stroke={progress > 0.45 ? "#ef4444" : "#475569"} strokeWidth="6" fill="none" strokeDasharray={`${progress * 360} 360`} />
        <text x="78" y="330" fill="#e2e8f0" fontSize="13">request, hold, circular wait, deadlock detection</text>
      </>
    );
  }

  return (
    <>
      {[0, 1, 2, 3].map((index) => (
        <rect key={index} x={75 + index * 82} y="115" width="58" height="48" rx="12" fill={progress * 4 > index ? "#22d3ee" : "#334155"} />
      ))}
      <rect x="455" y="102" width="92" height="72" rx="16" fill="#a78bfa" />
      <text x="501" y="144" textAnchor="middle" fill="#020617" fontSize="16" fontWeight="900">CPU</text>
      <path d={`M120 210 H${120 + progress * 410}`} stroke="#f59e0b" strokeWidth="22" strokeLinecap="round" />
      <text x="82" y="262" fill="#e2e8f0" fontSize="13">ready queue, dispatch, execute, Gantt chart</text>
    </>
  );
}

function NetworkScene({ lab, progress }: SceneProps) {
  const labels = lab.id.includes("tcp") ? ["SYN", "SYN ACK", "ACK"] : ["Client", "Router", "Server"];

  return (
    <>
      {[100, 320, 540].map((x, index) => (
        <g key={x}>
          <rect x={x - 48} y="145" width="96" height="70" rx="18" fill={progress > index * 0.25 ? "#22d3ee" : "#334155"} />
          <text x={x} y="185" textAnchor="middle" fill="#020617" fontSize="13" fontWeight="900">{labels[index]}</text>
        </g>
      ))}
      <path d="M150 180 H270 M370 180 H490" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
      <circle cx={100 + progress * 440} cy={180 + Math.sin(progress * Math.PI * 3) * 38} r="16" fill="#f59e0b" />
      <text x="82" y="92" fill="#e2e8f0" fontSize="14">packet transmission, routing, handshake, congestion signal</text>
    </>
  );
}

function DbScene({ lab, progress }: SceneProps) {
  const isIndex = lab.id.includes("index");

  return (
    <>
      {[0, 1].map((table) => (
        <g key={table} transform={`translate(${80 + table * 300} 82)`}>
          <rect width="190" height="190" rx="16" fill="#111827" stroke={table === 0 ? "#22d3ee" : "#a78bfa"} />
          {Array.from({ length: 5 }, (_, row) => (
            <rect key={row} x="18" y={38 + row * 26} width="154" height="18" rx="5" fill={progress * 5 > row ? (table === 0 ? "#22d3ee" : "#a78bfa") : "#334155"} />
          ))}
          <text x="18" y="25" fill="#e2e8f0" fontSize="12" fontWeight="900">{isIndex ? (table === 0 ? "B+ tree" : "Records") : (table === 0 ? "Orders" : "Customers")}</text>
        </g>
      ))}
      <path d={`M270 175 C330 ${95 + progress * 140}, 360 ${245 - progress * 120}, 380 175`} stroke="#f59e0b" strokeWidth="6" fill="none" strokeDasharray={`${progress * 250} 250`} />
      <text x="82" y="330" fill="#e2e8f0" fontSize="13">scan, filter, join, index seek, aggregate</text>
    </>
  );
}

function PhysicsScene({ lab, progress }: SceneProps) {
  if (lab.id.includes("projectile")) {
    const x = 80 + progress * 470;
    const y = 286 - Math.sin(progress * Math.PI) * 175;
    return (
      <>
        <path d="M70 286 C190 80 420 80 560 286" stroke="#475569" strokeWidth="5" fill="none" />
        <path d={`M70 286 C190 80 420 80 ${x} ${y}`} stroke="#22d3ee" strokeWidth="7" fill="none" />
        <circle cx={x} cy={y} r="18" fill="#f59e0b" />
        <text x="78" y="54" fill="#e2e8f0" fontSize="14">angle, velocity, gravity, range, height, time</text>
      </>
    );
  }

  if (lab.id.includes("wave")) {
    const path = Array.from({ length: 80 }, (_, index) => {
      const x = 70 + index * 6;
      const y = 180 - Math.sin(index * 0.35 + progress * Math.PI * 4) * 58;
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    }).join(" ");
    return (
      <>
        <path d={path} stroke="#a78bfa" strokeWidth="6" fill="none" />
        <line x1="420" y1="65" x2="420" y2="295" stroke="#67e8f9" strokeWidth="5" />
        <path d={`M95 112 C235 ${115 + progress * 80}, 350 ${120 - progress * 50}, 515 86`} stroke="#f59e0b" strokeWidth="4" fill="none" />
        <text x="78" y="330" fill="#e2e8f0" fontSize="13">wave propagation, lens refraction, ray tracing</text>
      </>
    );
  }

  return (
    <>
      <circle cx="320" cy="180" r="42" fill="#facc15" />
      {[75, 125, 175].map((radius, index) => {
        const angle = progress * Math.PI * 2 * (index + 1) + index;
        return (
          <g key={radius}>
            <ellipse cx="320" cy="180" rx={radius * 1.35} ry={radius} fill="none" stroke="#475569" />
            <circle cx={320 + Math.cos(angle) * radius * 1.35} cy={180 + Math.sin(angle) * radius} r={10 + index * 4} fill={["#22d3ee", "#a78bfa", "#f59e0b"][index]} />
          </g>
        );
      })}
      <text x="78" y="330" fill="#e2e8f0" fontSize="13">orbits start only after Run Lab</text>
    </>
  );
}

function MechanicalScene({ lab, progress }: SceneProps) {
  if (lab.id.includes("piston")) {
    return (
      <>
        <rect x="240" y="80" width="160" height="220" rx="22" fill="#111827" stroke="#94a3b8" />
        <rect x="265" y={95 + progress * 120} width="110" height="46" rx="12" fill="#22d3ee" />
        <line x1="320" y1={141 + progress * 120} x2="480" y2="252" stroke="#f59e0b" strokeWidth="9" strokeLinecap="round" />
        <circle cx="500" cy="260" r="44" fill="none" stroke="#a78bfa" strokeWidth="9" />
        <text x="76" y="330" fill="#e2e8f0" fontSize="13">intake, compression, power, exhaust strokes</text>
      </>
    );
  }

  if (lab.id.includes("thermo")) {
    return (
      <>
        <path d="M170 260 C125 150 230 75 330 112 C470 164 470 280 330 294 C250 304 195 295 170 260Z" fill="none" stroke="#475569" strokeWidth="8" />
        <path d={`M170 260 C125 150 230 75 330 112 C470 164 470 280 ${170 + progress * 160} ${260 + Math.sin(progress * Math.PI) * 34}`} fill="none" stroke="#22d3ee" strokeWidth="6" />
        <text x="420" y="95" fill="#f59e0b" fontSize="14" fontWeight="900">P V cycle</text>
        <text x="78" y="330" fill="#e2e8f0" fontSize="13">heat, work, pressure, volume, efficiency</text>
      </>
    );
  }

  return (
    <>
      {[230, 390].map((x, index) => (
        <g key={x} transform={`translate(${x} 180) rotate(${(index ? -1 : 1) * progress * 360})`}>
          <circle r={index ? 62 : 46} fill="none" stroke={index ? "#a78bfa" : "#22d3ee"} strokeWidth="12" />
          {Array.from({ length: 8 }, (_, tooth) => (
            <line key={tooth} x1="0" y1="0" x2={Math.cos(tooth * Math.PI / 4) * 68} y2={Math.sin(tooth * Math.PI / 4) * 68} stroke="#e2e8f0" strokeWidth="3" />
          ))}
        </g>
      ))}
      <text x="78" y="330" fill="#e2e8f0" fontSize="13">gear ratio, torque transfer, angular velocity</text>
    </>
  );
}

function CivilScene({ lab, progress }: SceneProps) {
  if (lab.id.includes("surveying")) {
    return (
      <>
        <line x1="90" y1="285" x2="560" y2="285" stroke="#475569" strokeWidth="6" />
        <circle cx="190" cy="245" r="28" fill="#22d3ee" />
        <path d={`M190 245 L${190 + Math.cos(progress * 1.2) * 310} ${245 - Math.sin(progress * 1.2) * 170}`} stroke="#f59e0b" strokeWidth="5" />
        <path d="M190 245 A80 80 0 0 1 252 194" stroke="#a78bfa" strokeWidth="5" fill="none" />
        <text x="78" y="330" fill="#e2e8f0" fontSize="13">distance, angle, leveling, mapping</text>
      </>
    );
  }

  return (
    <>
      <path d="M70 270 L180 125 L310 270 L440 125 L570 270" fill="none" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
      <path d={`M80 270 H${80 + progress * 485}`} stroke="#22d3ee" strokeWidth="7" strokeLinecap="round" />
      <rect x={120 + progress * 360} y="82" width="64" height="58" rx="13" fill="#f59e0b" />
      <path d={`M150 140 C250 ${190 + progress * 70}, 390 ${190 + progress * 70}, 510 140`} stroke="#ef4444" strokeWidth="5" fill="none" opacity="0.8" />
      <text x="78" y="330" fill="#e2e8f0" fontSize="13">load path, stress, strain, deflection</text>
    </>
  );
}

function renderScene(props: SceneProps) {
  const { lab } = props;

  if (lab.conceptType === "programming") {
    return <ProgrammingScene {...props} />;
  }

  if (lab.conceptType === "data-structures") {
    return <DataStructureScene {...props} />;
  }

  if (lab.conceptType === "algorithms") {
    return <AlgorithmScene {...props} />;
  }

  if (lab.conceptType === "operating-systems") {
    return <OperatingSystemScene {...props} />;
  }

  if (lab.conceptType === "networks") {
    return <NetworkScene {...props} />;
  }

  if (lab.conceptType === "dbms") {
    return <DbScene {...props} />;
  }

  if (lab.conceptType === "agriculture") {
    return <AgricultureScene {...props} />;
  }

  if (lab.conceptType === "finance") {
    return <FinanceScene {...props} />;
  }

  if (lab.conceptType === "environmental") {
    return <EnvironmentalScene {...props} />;
  }

  if (lab.conceptType === "ai-ml" || lab.conceptType === "nlp" || lab.conceptType === "computer-vision") {
    return <AiScene {...props} />;
  }

  if (lab.conceptType === "robotics") {
    return <RoboticsScene {...props} />;
  }

  if (lab.conceptType === "electronics" || lab.conceptType === "electrical") {
    return <ElectronicsScene {...props} />;
  }

  if (lab.conceptType === "chemistry") {
    return <ChemistryScene {...props} />;
  }

  if (lab.conceptType === "biology") {
    return <BiologyScene {...props} />;
  }

  if (lab.conceptType === "mathematics") {
    return <MathematicsScene {...props} />;
  }

  if (lab.conceptType === "physics") {
    return <PhysicsScene {...props} />;
  }

  if (lab.conceptType === "mechanical") {
    return <MechanicalScene {...props} />;
  }

  if (lab.conceptType === "civil") {
    return <CivilScene {...props} />;
  }

  return <ComputerScienceScene {...props} />;
}

export function BtechLabRenderer({ lab }: BtechLabRendererProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  const blocks = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        id: index,
        x: 80 + index * 86,
        height: 40 + ((index * 37) % 130),
      })),
    [],
  );

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!isRunning || isPaused) {
      return;
    }

    startRef.current = performance.now() - progressRef.current * 4200;

    const animate = (time: number) => {
      const start = startRef.current ?? time;
      const nextProgress = Math.min(1, (time - start) / 4200);
      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (nextProgress < 1) {
        frameRef.current = window.requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setIsPaused(false);
      }
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPaused, isRunning]);

  function runLab() {
    if (isRunning && !isPaused) {
      return;
    }

    if (progress >= 1) {
      setProgress(0);
      progressRef.current = 0;
    }

    setIsRunning(true);
    setIsPaused(false);
  }

  function resetLab() {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    setIsRunning(false);
    setIsPaused(false);
    setProgress(0);
    progressRef.current = 0;
    startRef.current = null;
  }

  return (
    <section
      id={lab.id}
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]"
    >
      <header className="flex flex-col gap-4 border-b border-slate-200/80 p-5 dark:border-white/[0.08] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
            3D / animated lab
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">
            {lab.title}
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {lab.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetLab}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600 transition hover:border-slate-300 dark:border-white/[0.08] dark:text-slate-300"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset
          </button>
          {isRunning ? (
            <button
              type="button"
              onClick={() => setIsPaused((value) => !value)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600 transition hover:border-slate-300 dark:border-white/[0.08] dark:text-slate-300"
            >
              <Pause className="size-3.5" aria-hidden="true" />
              {isPaused ? "Resume" : "Pause"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={runLab}
            disabled={isRunning && !isPaused}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Play className="size-3.5 fill-current" aria-hidden="true" />
            {isRunning && !isPaused ? "Running..." : "Run Lab"}
          </button>
        </div>
      </header>

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <svg viewBox="0 0 640 360" className="relative h-full min-h-[360px] w-full" role="img" aria-label={`${lab.title} animation`}>
            {renderScene({ lab, progress, blocks })}
            <text x="40" y="42" fill="#e2e8f0" fontSize="16" fontWeight="800">
              {progress === 0 ? "Static preview" : isPaused ? "Paused" : progress >= 1 ? "Complete" : "Animating"}
            </text>
          </svg>
        </div>

        <aside className="space-y-3">
          {lab.controls.map((control, index) => (
            <div
              key={control}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.025]"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {control}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white">
                {Math.round((progress * 100 + index * 17) % 101)}
              </p>
            </div>
          ))}
          {lab.formula ? (
            <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs leading-5 text-cyan-100">
              {lab.formula}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

export default BtechLabRenderer;
