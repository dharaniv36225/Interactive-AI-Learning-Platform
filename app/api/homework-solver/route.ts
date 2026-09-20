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
  const subject = getStringField(body, "subject", "B.Tech");

  if (!imageDataUrl) {
    return errorResponse("Upload imageDataUrl as a base64 data URL.");
  }

  try {
    const solution = await generateAiVision(
      `Solve this ${subject} homework image. Extract the question, solve step by step, explain assumptions, and include a final answer.`,
      imageDataUrl,
    );
    return Response.json({ solution });
  } catch (error) {
    const normalized = normalizeAiError(error);
    return errorResponse(normalized.message, normalized.status, normalized.retryAfter);
  }
}
