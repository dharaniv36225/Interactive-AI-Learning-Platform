import { GoogleGenerativeAI } from "@google/generative-ai";

import { GEMINI_MODEL, generateTutorResponse, isGeminiConfigured } from "@/lib/gemini";

export const MAX_TEXT_LENGTH = 6_000;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getStringField(
  body: Record<string, unknown>,
  key: string,
  fallback = "",
) {
  const value = body[key];
  return typeof value === "string" ? value.trim().slice(0, MAX_TEXT_LENGTH) : fallback;
}

export function getStringArrayField(body: Record<string, unknown>, key: string) {
  const value = body[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function getNumberField(
  body: Record<string, unknown>,
  key: string,
  fallback: number,
  min: number,
  max: number,
) {
  const value = body[key];
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export function errorResponse(error: string, status = 400, retryAfter?: number) {
  return Response.json(
    { error },
    {
      status,
      headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
    },
  );
}

export async function readJsonBody(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    return isRecord(body) ? body : null;
  } catch {
    return null;
  }
}

export function normalizeAiError(error: unknown) {
  const message = error instanceof Error ? error.message : "AI request failed.";
  const normalized = message.toLowerCase();

  if (
    normalized.includes("quota") ||
    normalized.includes("rate") ||
    normalized.includes("429") ||
    normalized.includes("resource_exhausted")
  ) {
    return {
      message: "Gemini has reached a quota or rate limit. Wait a moment and try again.",
      status: 429,
      retryAfter: 30,
    };
  }

  if (
    normalized.includes("temporarily") ||
    normalized.includes("busy") ||
    normalized.includes("503")
  ) {
    return {
      message: "Gemini is temporarily busy. Try again in a few seconds.",
      status: 503,
      retryAfter: 10,
    };
  }

  if (
    normalized.includes("api key") ||
    normalized.includes("permission") ||
    normalized.includes("401") ||
    normalized.includes("403")
  ) {
    return {
      message: "Gemini API access is not available. Check GEMINI_API_KEY on the server.",
      status: 502,
    };
  }

  return {
    message,
    status: 502,
  };
}

export async function generateAiText(prompt: string) {
  return generateTutorResponse(prompt);
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    data: match[2],
  };
}

export async function generateAiVision(prompt: string, imageDataUrl: string) {
  const image = parseDataUrl(imageDataUrl);

  if (!image) {
    throw new Error("Upload a valid base64 data URL image.");
  }

  if (!isGeminiConfigured()) {
    return [
      "Gemini Vision is not configured on this server.",
      "The UI can accept the image, but solving requires GEMINI_API_KEY.",
      `Prompt received: ${prompt}`,
    ].join("\n\n");
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent([
    { text: prompt },
    { inlineData: image },
  ]);
  const text = result.response.text().trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}
