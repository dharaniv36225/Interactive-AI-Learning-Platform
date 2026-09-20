import type { BtechBranchId } from "@/lib/btech-branches";

export type BtechLesson = {
  id: string;
  title: string;
  year: string;
  semester: string;
  branch: BtechBranchId;
  subject: string;
  subjectId: string;
  unit: string;
  unitId: string;
  detailedExplanation: string;
  keyPoints: string[];
  formulas: string[];
  examples: string[];
  realWorldApplications: string[];
  visualizationDescription: string;
  related3dLabId: string;
  relatedQuizId: string;
  codingPracticeId?: string;
  aiTutorShortcut: string;
};

export type BtechUnit = {
  id: string;
  title: string;
  description: string;
  lessons: BtechLesson[];
};

export type BtechLessonSeed = {
  title: string;
  keyPoints?: string[];
  formulas?: string[];
};

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createBtechUnits(input: {
  year: string;
  semester: string;
  branch: BtechBranchId;
  subject: string;
  subjectId: string;
  labId: string;
  codingPracticeIds: string[];
  lessonSeeds: BtechLessonSeed[];
}): BtechUnit[] {
  const lessonSeeds =
    input.lessonSeeds.length > 0
      ? input.lessonSeeds
      : [
          { title: "Foundations" },
          { title: "Core Models" },
          { title: "Engineering Applications" },
          { title: "Practice and Revision" },
        ];
  const middle = Math.ceil(lessonSeeds.length / 2);
  const unitDefinitions = [
    {
      id: `${input.subjectId}-unit-1`,
      title: "Unit 1: Foundations",
      description: `Build the vocabulary, models, diagrams, and formulas behind ${input.subject}.`,
      seeds: lessonSeeds.slice(0, middle),
    },
    {
      id: `${input.subjectId}-unit-2`,
      title: "Unit 2: Applications and Practice",
      description: `Apply ${input.subject} through labs, quizzes, coding, and AI-assisted revision.`,
      seeds: lessonSeeds.slice(middle),
    },
  ];

  return unitDefinitions.map((unit) => ({
    id: unit.id,
    title: unit.title,
    description: unit.description,
    lessons: (unit.seeds.length > 0 ? unit.seeds : lessonSeeds.slice(0, 1)).map(
      (seed, index) => {
        const lessonId = `${input.subjectId}-${slug(seed.title)}`;
        const keyPoints = seed.keyPoints ?? [
          `${seed.title} vocabulary`,
          `${input.subject} engineering model`,
          "Inputs, constraints, and outputs",
          "Validation with examples",
        ];

        return {
          id: lessonId,
          title: seed.title,
          year: input.year,
          semester: input.semester,
          branch: input.branch,
          subject: input.subject,
          subjectId: input.subjectId,
          unit: unit.title,
          unitId: unit.id,
          detailedExplanation: `${seed.title} explains how ${input.subject} works from first principles, then turns the idea into an engineering model. Students identify inputs, constraints, state changes, formulas, diagrams, edge cases, and real system behavior before moving into the lab and quiz.`,
          keyPoints,
          formulas: seed.formulas ?? [
            "output = model(inputs, constraints)",
            "efficiency = useful output / total resource cost",
          ],
          examples: [
            `Solve a small ${input.subject} example by listing known values, unknowns, and assumptions.`,
            `Change one input and predict how ${seed.title.toLowerCase()} changes before calculating.`,
          ],
          realWorldApplications: [
            `${seed.title} appears in engineering design, debugging, operations, testing, and technical interviews.`,
            `Industry teams use this concept to balance performance, safety, cost, and reliability.`,
          ],
          visualizationDescription: `Use the animated lab to observe ${seed.title.toLowerCase()} as a step-by-step system with labels, state changes, and a resettable timeline.`,
          related3dLabId: input.labId,
          relatedQuizId: `${lessonId}-quiz-bank`,
          codingPracticeId:
            input.codingPracticeIds.length > 0
              ? input.codingPracticeIds[index % input.codingPracticeIds.length]
              : undefined,
          aiTutorShortcut: `/tutor?subject=${encodeURIComponent(input.subject)}&lesson=${encodeURIComponent(seed.title)}`,
        };
      },
    ),
  }));
}
