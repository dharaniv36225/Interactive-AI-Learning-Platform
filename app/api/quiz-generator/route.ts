import {
  errorResponse,
  generateAiText,
  getNumberField,
  getStringArrayField,
  getStringField,
  normalizeAiError,
  readJsonBody,
} from "@/app/api/_utils/ai";
import {
  generateBtechQuestionBank,
  type BtechQuizQuestion,
} from "@/lib/btech-quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractJsonArray(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as unknown;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isQuestion(value: unknown): value is Omit<BtechQuizQuestion, "id" | "lessonId"> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const question = value as Partial<BtechQuizQuestion>;
  return (
    typeof question.question === "string" &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every((option) => typeof option === "string") &&
    typeof question.correctAnswer === "string" &&
    question.options.includes(question.correctAnswer) &&
    typeof question.explanation === "string" &&
    (question.difficulty === "easy" ||
      question.difficulty === "medium" ||
      question.difficulty === "hard")
  );
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (!body) {
    return errorResponse("The request body must be valid JSON.");
  }

  const lessonId = getStringField(body, "lessonId");
  const lessonTitle = getStringField(body, "lessonTitle");
  const subject = getStringField(body, "subject");
  const keyPoints = getStringArrayField(body, "keyPoints");
  const count = getNumberField(body, "count", 20, 5, 40);

  if (!lessonId || !lessonTitle || !subject) {
    return errorResponse("Send lessonId, lessonTitle, and subject.");
  }

  try {
    const prompt = [
      `Generate ${count} B.Tech quiz questions as JSON array only.`,
      `Subject: ${subject}`,
      `Lesson: ${lessonTitle}`,
      `Key points: ${keyPoints.join(", ")}`,
      "Each item must include question, four options, correctAnswer, explanation, difficulty (easy/medium/hard), and subject.",
    ].join("\n");
    const text = await generateAiText(prompt);
    const parsed = extractJsonArray(text);
    const aiQuestions =
      parsed
        ?.filter(isQuestion)
        .map((question, index) => ({
          ...question,
          id: `${lessonId}-gemini-${Date.now()}-${index}`,
          lessonId,
          subject,
        })) ?? [];

    const fallback = generateBtechQuestionBank({
      lessonId,
      lessonTitle,
      subject,
      keyPoints,
    }).slice(0, count);

    return Response.json({
      questions: aiQuestions.length > 0 ? aiQuestions : fallback,
      mode: aiQuestions.length > 0 ? "gemini" : "seed-generator",
    });
  } catch (error) {
    const normalized = normalizeAiError(error);

    if (normalized.status === 429 || normalized.status === 503) {
      return errorResponse(normalized.message, normalized.status, normalized.retryAfter);
    }

    return Response.json({
      questions: generateBtechQuestionBank({
        lessonId,
        lessonTitle,
        subject,
        keyPoints,
      }).slice(0, count),
      mode: "seed-generator",
    });
  }
}
