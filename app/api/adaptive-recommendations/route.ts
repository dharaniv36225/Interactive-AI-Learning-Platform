import {
  errorResponse,
  generateAiText,
  getStringArrayField,
  getStringField,
  normalizeAiError,
  readJsonBody,
} from "@/app/api/_utils/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (!body) {
    return errorResponse("The request body must be valid JSON.");
  }

  const learner = getStringField(body, "learner", "B.Tech learner");
  const weakTopics = getStringArrayField(body, "weakTopics");
  const quizMistakes = getStringArrayField(body, "quizMistakes");
  const labProgress = getStringField(body, "labProgress", "not provided");
  const codingPerformance = getStringField(body, "codingPerformance", "not provided");

  try {
    const recommendations = await generateAiText(
      [
        "Create adaptive B.Tech recommendations as clean professional study notes.",
        "Do not use Markdown symbols such as #, ##, ###, *, **, >, or backticks.",
        "Use plain section titles and numbered sections.",
        `Learner: ${learner}.`,
        `Weak topics: ${weakTopics.join(", ") || "unknown"}.`,
        `Quiz mistakes: ${quizMistakes.join(", ") || "unknown"}.`,
        `Lab progress: ${labProgress}.`,
        `Coding performance: ${codingPerformance}.`,
        "Include Diagnosis, Priority Topics, Next Lessons, Recommended Labs, Quiz Practice, Coding Tasks, Revision Plan, Motivation, and Summary.",
        "Explain why each recommendation matters and keep the language supportive and beginner-friendly.",
      ].join("\n"),
    );
    return Response.json({ recommendations });
  } catch (error) {
    const normalized = normalizeAiError(error);
    return errorResponse(normalized.message, normalized.status, normalized.retryAfter);
  }
}
