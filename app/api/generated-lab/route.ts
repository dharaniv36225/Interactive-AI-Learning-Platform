import {
  errorResponse,
  generateAiText,
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

  const prompt = getStringField(body, "prompt");
  const subject = getStringField(body, "subject", "B.Tech");

  if (!prompt) {
    return errorResponse("Send a lab prompt.");
  }

  try {
    const lab = await generateAiText(
      `Create an educational interactive lab plan for ${subject}. User request: ${prompt}. Include concept, controls, calculations, static preview, Run/Pause/Reset animation steps, safety limits, quiz link, and AI tutor explanation prompt.`,
    );
    return Response.json({ lab });
  } catch (error) {
    const normalized = normalizeAiError(error);
    return errorResponse(normalized.message, normalized.status, normalized.retryAfter);
  }
}
