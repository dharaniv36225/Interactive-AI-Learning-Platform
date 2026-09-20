"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SubjectProgressChartProps = {
  data: Array<{
    subject: string;
    progress: number;
  }>;
};

export function SubjectProgressChart({ data }: SubjectProgressChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateDimensions = (width: number, height: number) => {
      const nextWidth = Math.floor(width);
      const nextHeight = Math.floor(height);

      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }

      setDimensions((current) =>
        current?.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    };

    const initialBounds = container.getBoundingClientRect();
    updateDimensions(initialBounds.width, initialBounds.height);

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        updateDimensions(entry.contentRect.width, entry.contentRect.height);
      }
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-72 min-w-0 w-full">
      {dimensions ? (
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
          margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="rgba(148,163,184,0.16)"
          />
          <XAxis
            dataKey="subject"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(34,211,238,0.05)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "#0f172a",
              color: "#f8fafc",
              fontSize: 12,
            }}
            formatter={(value) => [`${value ?? 0}%`, "Progress"]}
          />
          <Bar
            dataKey="progress"
            fill="#22d3ee"
            radius={[7, 7, 2, 2]}
            maxBarSize={34}
          />
        </BarChart>
      ) : (
        <div
          className="h-full w-full animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.03]"
          aria-label="Loading subject progress chart"
        />
      )}
    </div>
  );
}

export default SubjectProgressChart;
