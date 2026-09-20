export default function SubjectsLoading() {
  return (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
          />
        ))}
      </div>
    </div>
  );
}
