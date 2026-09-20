import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { getLabById, labs } from "@/lib/labs";
import { getSubjectById, subjects } from "@/lib/subjects";

const LabWorkspace = dynamic(
  () =>
    import("@/components/lab-workspace").then((module) => module.LabWorkspace),
  {
    loading: () => (
      <div className="h-[620px] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]" />
    ),
  },
);

type LabPageProps = {
  params: Promise<{ labId: string }>;
};

export function generateStaticParams() {
  return labs.map((lab) => ({ labId: lab.id }));
}

export async function generateMetadata({
  params,
}: LabPageProps): Promise<Metadata> {
  const { labId } = await params;
  const lab = getLabById(labId);

  return lab
    ? {
        title: lab.title,
        description: lab.description,
      }
    : {};
}

export default async function LabDetailPage({ params }: LabPageProps) {
  const { labId } = await params;
  const lab = getLabById(labId);

  if (!lab) {
    notFound();
  }

  const subject = getSubjectById(lab.subjectId);
  const relatedLesson = subjects
    .flatMap((item) => item.lessons)
    .find((lesson) => lesson.relatedLabIds.includes(lab.id));

  return (
    <LabWorkspace
      lab={lab}
      subjectName={subject?.name ?? "Interactive Learning"}
      relatedLessonId={relatedLesson?.id}
    />
  );
}
