import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "cyan" | "emerald" | "violet" | "amber";
  trend?: string;
};

const toneClasses: Record<StatCardProps["tone"], { icon: string; glow: string }> = {
  cyan: {
    icon: "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
    glow: "bg-cyan-400",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    glow: "bg-emerald-400",
  },
  violet: {
    icon: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
    glow: "bg-violet-400",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    glow: "bg-amber-400",
  },
};

export function StatCard({ label, value, detail, icon: Icon, tone, trend }: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow transition duration-300 hover:-translate-y-0.5 dark:border-white/[0.08] dark:bg-[#0e131b]">
      <div className={`absolute -right-8 -top-8 size-24 rounded-full opacity-[0.08] blur-2xl ${toneClasses[tone].glow}`} />
      <div className="relative flex items-start justify-between gap-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-500">{label}</span>
        <span className={`grid size-9 place-items-center rounded-xl ${toneClasses[tone].icon}`}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </div>
      <p className="relative mt-4 text-[30px] font-bold tracking-[-0.04em] text-slate-950 dark:text-white">{value}</p>
      <div className="relative mt-2 flex items-center gap-2">
        {trend && (
          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="size-3" aria-hidden="true" />
            {trend}
          </span>
        )}
        <p className="truncate text-[11px] text-slate-500 dark:text-slate-500">{detail}</p>
      </div>
    </article>
  );
}
