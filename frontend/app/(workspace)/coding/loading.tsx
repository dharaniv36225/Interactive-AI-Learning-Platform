export default function CodingLoading() {
  return (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
      <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="h-[520px] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
        <div className="h-[620px] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
      </div>
    </div>
  );
}
