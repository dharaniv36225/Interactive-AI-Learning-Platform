export type BtechQuizDifficulty = "easy" | "medium" | "hard";

export type BtechQuizQuestion = {
  id: string;
  lessonId: string;
  subject: string;
  difficulty: BtechQuizDifficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type BtechQuizContext = {
  lessonId: string;
  lessonTitle: string;
  subject: string;
  keyPoints: string[];
  branch?: string;
  unit?: string;
  formulas?: string[];
  examples?: string[];
};

const difficulties: BtechQuizDifficulty[] = ["easy", "medium", "hard"];

export function getBtechQuizCacheKey(lessonId: string) {
  return `btech-quiz-bank:${lessonId}:v2`;
}

export function generateBtechQuestionBank(
  context: BtechQuizContext,
  count = 120,
): BtechQuizQuestion[] {
  const keyPoints =
    context.keyPoints.length > 0
      ? context.keyPoints
      : [context.lessonTitle, context.subject, "engineering application"];
  const formulas =
    context.formulas && context.formulas.length > 0
      ? context.formulas
      : ["output = model(inputs, constraints)"];
  const examples =
    context.examples && context.examples.length > 0
      ? context.examples
      : [`A ${context.subject} engineering case study`];
  const templates = [
    {
      stem: (point: string) => `Which statement best explains ${point} in ${context.lessonTitle}?`,
      correct: (point: string) => `${point} connects the concept, constraints, and expected system behavior.`,
      distractors: (point: string) => [
        `${point} should be memorized without testing assumptions.`,
        `${point} only matters after the final exam.`,
        `${point} can be ignored when a lab visualization exists.`,
      ],
    },
    {
      stem: (point: string) => `A team changes one input while studying ${point}. What should they check first?`,
      correct: (point: string) => `They should predict how ${point} changes, then validate it with calculation or simulation.`,
      distractors: (point: string) => [
        `They should keep ${point} fixed and change the answer manually.`,
        "They should skip assumptions and only record the final number.",
        "They should use the hardest formula even if variables do not match.",
      ],
    },
    {
      stem: (point: string) => `Why is ${point} useful in a branch-level B.Tech problem?`,
      correct: (point: string) => `${point} helps convert a real system into inputs, outputs, constraints, and tradeoffs.`,
      distractors: (point: string) => [
        `${point} removes the need for examples.`,
        `${point} guarantees the same answer for every branch.`,
        `${point} is useful only when no data is available.`,
      ],
    },
    {
      stem: (point: string) => `Which formula or model habit best supports ${point}?`,
      correct: (point: string) => `Choose a formula for ${point} that matches the variables, units, and assumptions in the problem.`,
      distractors: (point: string) => [
        `Always use ${formulas[0]} even when units do not match.`,
        `Treat ${point} as a label without checking the model.`,
        "Use the longest derivation regardless of the question.",
      ],
    },
    {
      stem: (point: string) => `In a practical example, what makes an answer about ${point} strong?`,
      correct: (point: string) => `It explains ${point} with reasoning, a worked example, and why alternatives fail.`,
      distractors: (point: string) => [
        `It copies the example "${examples[0]}" without adapting it.`,
        `It names ${point} but avoids constraints.`,
        "It reports only the option letter.",
      ],
    },
  ];

  return Array.from({ length: count }, (_, index) => {
    const point = keyPoints[index % keyPoints.length];
    const difficulty = difficulties[index % difficulties.length];
    const template = templates[index % templates.length];
    const correctAnswer = template.correct(point);
    const options = [
      correctAnswer,
      ...template.distractors(point),
    ];

    return {
      id: `${context.lessonId}-generated-${index + 1}`,
      lessonId: context.lessonId,
      subject: context.subject,
      difficulty,
      question: `(${difficulty}) ${template.stem(point)}`,
      options,
      correctAnswer,
      explanation: `${correctAnswer} This is linked to ${context.subject}${context.unit ? ` / ${context.unit}` : ""}${context.branch ? ` for ${context.branch.toUpperCase()}` : ""}, where strong answers combine theory, formulas, examples, and real engineering constraints.`,
    };
  });
}
