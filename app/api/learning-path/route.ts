import {
  errorResponse,
  generateAiText,
  getNumberField,
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

  const year = getStringField(body, "year");
  const branch = getStringField(body, "branch");
  const goal = getStringField(body, "goal");
  const weeklyHours = getNumberField(body, "weeklyHours", 8, 1, 80);

  if (!year || !branch || !goal) {
    return errorResponse("Send year, branch, and goal.");
  }

  try {
    const plan = await generateAiText(
      [
        "Generate a professional B.Tech learning path as clean study notes.",
        "Do not use Markdown symbols such as #, ##, ###, *, **, >, or backticks.",
        "Use plain section titles and numbered sections.",
        `Year: ${year}.`,
        `Branch: ${branch}.`,
        `Career goal: ${goal}.`,
        `Weekly study hours: ${weeklyHours}.`,
        "Include Introduction, Semester Roadmap, Weekly Plan, Daily Plan, Lessons, Labs, Quizzes, Coding Practice, Revision Schedule, Interview Tips, and Summary.",
        "Use beginner-friendly language, practical examples, and specific next actions.",
      ].join("\n"),
    );
    return Response.json({ plan });
  } catch (error) {
    const normalized = normalizeAiError(error);
    return errorResponse(normalized.message, normalized.status, normalized.retryAfter);
  }
}
