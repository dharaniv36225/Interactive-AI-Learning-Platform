export default function TutorLoading() {
  return (
    <div className="space-y-7" aria-label="Loading AI tutor">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/[0.06]" />
      <div className="h-[70vh] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
    </div>
  );
}
