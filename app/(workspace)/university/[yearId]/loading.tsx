export default function UniversityYearLoading() {
  return (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={index}
          className="h-96 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
        />
      ))}
    </div>
  );
}
