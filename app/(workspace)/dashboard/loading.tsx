export default function DashboardLoading() {
  return (
    <div className="space-y-7" aria-label="Loading dashboard">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/[0.06]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
    </div>
  );
}
