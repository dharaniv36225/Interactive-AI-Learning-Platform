import {
  errorResponse,
  generateAiVision,
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

  const imageDataUrl = getStringField(body, "imageDataUrl", "");
  const lesson = getStringField(body, "lesson", "engineering diagram");

  if (!imageDataUrl) {
    return errorResponse("Upload imageDataUrl as a base64 data URL.");
  }

  try {
    const explanation = await generateAiVision(
      `Explain this ${lesson} diagram. Identify labels, flow, meaning, equations, and likely exam questions.`,
      imageDataUrl,
    );
    return Response.json({ explanation });
  } catch (error) {
    const normalized = normalizeAiError(error);
    return errorResponse(normalized.message, normalized.status, normalized.retryAfter);
  }
}
