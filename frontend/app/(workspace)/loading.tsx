export default function WorkspaceLoading() {
  return (
    <div className="space-y-5" aria-label="Loading page">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/[0.06]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
          />
        ))}
      </div>
    </div>
  );
}
