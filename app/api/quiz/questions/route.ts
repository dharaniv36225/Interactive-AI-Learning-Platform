import { getQuizQuestions } from "@/lib/quiz-data";
import { subjectsMeta } from "@/lib/subjects-meta";
import type { QuizDifficulty } from "@/types";

export const runtime = "nodejs";

const validDifficulties = new Set<QuizDifficulty | "all">([
  "all",
  "easy",
  "medium",
  "hard",
]);

export function GET(request: Request) {
  const url = new URL(request.url);
  const subject = url.searchParams.get("subject")?.trim() ?? "";
  const lesson = url.searchParams.get("lesson")?.trim() || "all";
  const requestedDifficulty =
    url.searchParams.get("difficulty")?.trim() || "all";
  const subjectMeta = subjectsMeta.find((item) => item.name === subject);

  if (!subjectMeta) {
    return Response.json({ error: "Choose a valid quiz subject." }, { status: 400 });
  }

  if (
    lesson !== "all" &&
    !subjectMeta.lessons.some((item) => item.id === lesson)
  ) {
    return Response.json({ error: "Choose a valid lesson." }, { status: 400 });
  }

  if (
    !validDifficulties.has(
      requestedDifficulty as QuizDifficulty | "all",
    )
  ) {
    return Response.json(
      { error: "Choose a valid quiz difficulty." },
      { status: 400 },
    );
  }

  const questions = getQuizQuestions(
    subject,
    lesson,
    requestedDifficulty as QuizDifficulty | "all",
  );

  return Response.json(
    { questions },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      },
    },
  );
}
