export default function LabDetailLoading() {
  return (
    <div className="space-y-6" aria-label="Loading lab">
      <div className="h-5 w-24 animate-pulse rounded bg-slate-200/70 dark:bg-white/[0.06]" />
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]">
        <div className="h-28 animate-pulse border-b border-slate-200/80 dark:border-white/[0.08]" />
        <div className="h-[560px] animate-pulse" />
      </div>
    </div>
  );
}
