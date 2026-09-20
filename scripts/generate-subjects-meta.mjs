import fs from "fs";

const { subjects } = await import("../lib/subjects.ts");

const meta = subjects.map((subject) => ({
  id: subject.id,
  name: subject.name,
  accent: subject.accent,
  lessonCount: subject.lessons.length,
  lessonIds: subject.lessons.map((lesson) => lesson.id),
  lessons: subject.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
  })),
}));

const content = `import type { Subject } from "@/types";

export type SubjectLessonMeta = {
  id: string;
  title: string;
};

export type SubjectMeta = {
  id: string;
  name: string;
  accent: Subject["accent"];
  lessonIds: string[];
  lessonCount: number;
  lessons: SubjectLessonMeta[];
};

export const subjectsMeta: SubjectMeta[] = ${JSON.stringify(meta, null, 2)};

export const subjectNames = subjectsMeta.map((item) => item.name);
`;

fs.writeFileSync("lib/subjects-meta.ts", content);
console.log(`Generated metadata for ${meta.length} subjects`);
