import {
  generatePracticeQuestions,
  isGeminiConfigured,
} from "@/lib/gemini";
import type { QuizDifficulty } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenerateQuizBody = {
  subject?: string;
  lesson?: string;
  lessonId?: string;
  difficulty?: QuizDifficulty;
};

export async function POST(request: Request) {
  let body: GenerateQuizBody;

  try {
    body = (await request.json()) as GenerateQuizBody;
  } catch {
    return Response.json(
      { error: "The practice request must be valid JSON." },
      { status: 400 },
    );
  }

  const subject = body.subject?.trim();
  const lesson = body.lesson?.trim() || "all";
  const lessonId = body.lessonId?.trim() || "all";
  const difficulty = body.difficulty;

  if (
    !subject ||
    (difficulty !== "easy" &&
      difficulty !== "medium" &&
      difficulty !== "hard")
  ) {
    return Response.json(
      { error: "Choose a subject and difficulty before generating practice." },
      { status: 400 },
    );
  }

  if (!isGeminiConfigured()) {
    return Response.json(
      {
        error:
          "Gemini is not configured. Add GEMINI_API_KEY to .env.local and restart the app.",
      },
      { status: 503 },
    );
  }

  try {
    const questions = await generatePracticeQuestions(
      subject,
      lesson,
      difficulty,
      lessonId,
    );
    return Response.json({ questions });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gemini could not generate practice questions.",
      },
      { status: 502 },
    );
  }
}
