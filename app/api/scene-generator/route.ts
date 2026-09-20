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

  const concept = getStringField(body, "concept");

  if (!concept) {
    return errorResponse("Send a concept.");
  }

  try {
    const scene = await generateAiText(
      `Generate a JSON-like 3D educational scene config for this concept: ${concept}. Include objects, labels, camera, lights, animation steps, Run/Pause/Reset behavior, and learning notes. Do not include executable code.`,
    );
    return Response.json({ scene });
  } catch (error) {
    const normalized = normalizeAiError(error);
    return errorResponse(normalized.message, normalized.status, normalized.retryAfter);
  }
}
