import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Interactive Labs",
  description:
    "Run interactive science, mathematics, computing, finance, and agriculture experiments.",
};

const LabCatalog = dynamic(
  () =>
    import("@/components/lab-catalog").then((module) => module.LabCatalog),
  {
    loading: () => (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
          />
        ))}
      </div>
    ),
  },
);

export default function LabPage() {
  return <LabCatalog />;
}
