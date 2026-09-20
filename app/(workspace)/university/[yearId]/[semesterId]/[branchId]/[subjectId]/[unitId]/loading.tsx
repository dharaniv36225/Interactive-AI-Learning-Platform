export default function UniversityUnitLoading() {
  return (
    <div className="space-y-5">
      <div className="h-56 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
          />
        ))}
      </div>
    </div>
  );
}
