"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Flame, Sparkles } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { workspaceNavigation } from "@/lib/navigation";
import { useUserStore } from "@/stores/userStore";

export function Sidebar() {
  const pathname = usePathname();
  const user = useUserStore(
    useShallow((state) => ({
      weeklyStudyMinutes: state.user.weeklyStudyMinutes,
      weeklyGoalMinutes: state.user.weeklyGoalMinutes,
    })),
  );
  const goalProgress = Math.min(100, Math.round((user.weeklyStudyMinutes / user.weeklyGoalMinutes) * 100));

  return (
    <aside className="sticky top-[68px] hidden h-[calc(100vh-68px)] w-[252px] shrink-0 border-r border-slate-200/80 bg-white/60 px-4 py-5 lg:flex lg:flex-col dark:border-white/[0.08] dark:bg-[#080b10]">
      <div className="px-2 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
        Learning space
      </div>
      <nav className="grid gap-1" aria-label="Workspace navigation">
        {workspaceNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm dark:bg-white/[0.09] dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-slate-100"
              }`}
            >
              <Icon
                className={`size-[18px] ${
                  isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-slate-700 dark:text-slate-600"
                }`}
                aria-hidden="true"
              />
              {item.label}
              {item.href === "/tutor" && (
                <span className="ml-auto rounded-md bg-cyan-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 surface-shadow dark:border-white/[0.08] dark:bg-white/[0.035]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <Flame className="size-4 text-orange-500" aria-hidden="true" />
              Weekly goal
            </span>
            <span className="text-[11px] font-semibold text-slate-500">{goalProgress}%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-500">
            {user.weeklyStudyMinutes} of {user.weeklyGoalMinutes} minutes
          </p>
        </div>

        <Link
          href="/quiz"
          className="group relative block overflow-hidden rounded-2xl bg-slate-950 p-4 text-white dark:bg-gradient-to-br dark:from-[#121a25] dark:to-[#0b1119]"
        >
          <div className="absolute -right-6 -top-8 size-24 rounded-full bg-cyan-400/15 blur-2xl" />
          <Sparkles className="size-4 text-cyan-300" aria-hidden="true" />
          <p className="mt-3 text-xs font-semibold">Daily challenge</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-400">Build a custom quiz and earn XP.</p>
          <ArrowUpRight
            className="absolute bottom-4 right-4 size-4 text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
            aria-hidden="true"
          />
        </Link>
      </div>
    </aside>
  );
}
