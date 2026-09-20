import {
  GEMINI_MODEL,
  generateTutorResponse,
  isGeminiConfigured,
} from "@/lib/gemini";
import type {
  GeminiStatusResponse,
  TutorApiError,
  TutorApiResponse,
  TutorRequestMessage,
} from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 4_000;
const MAX_HISTORY_MESSAGES = 24;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTutorRequestMessage(value: unknown): value is TutorRequestMessage {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string" &&
    value.content.trim().length > 0 &&
    value.content.length <= MAX_MESSAGE_LENGTH
  );
}

function getRequestMessages(value: unknown): TutorRequestMessage[] | null {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    return null;
  }

  const messages = value.messages.slice(-MAX_HISTORY_MESSAGES);

  if (messages.length === 0 || !messages.every(isTutorRequestMessage)) {
    return null;
  }

  return messages.at(-1)?.role === "user" ? messages : null;
}

function errorResponse(error: string, status: number, retryAfter?: number) {
  const body: TutorApiError = { error };
  return Response.json(body, {
    status,
    headers: retryAfter
      ? {
          "Retry-After": String(retryAfter),
        }
      : undefined,
  });
}

export function GET() {
  const body: GeminiStatusResponse = {
    configured: isGeminiConfigured(),
    model: GEMINI_MODEL,
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return errorResponse("The request body must be valid JSON.", 400);
  }

  const messages = getRequestMessages(requestBody);

  if (!messages) {
    return errorResponse(
      "Send at least one valid user message. Each message must be 4,000 characters or fewer.",
      400,
    );
  }

  const conversation = messages
    .map(
      (message) =>
        `${message.role === "user" ? "Learner" : "Tutor"}: ${message.content.trim()}`,
    )
    .join("\n\n");

  try {
    const message = await generateTutorResponse(conversation);
    const body: TutorApiResponse = {
      message,
      model: isGeminiConfigured() ? GEMINI_MODEL : "local-demo",
      mode: isGeminiConfigured() ? "gemini" : "demo",
    };
    return Response.json(body);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Gemini could not complete the request.";
    const normalizedMessage = message.toLowerCase();

    if (
      normalizedMessage.includes("quota") ||
      normalizedMessage.includes("request limit") ||
      normalizedMessage.includes("rate limit")
    ) {
      return errorResponse(message, 429, 30);
    }

    if (
      normalizedMessage.includes("temporarily busy") ||
      normalizedMessage.includes("could not reach gemini")
    ) {
      return errorResponse(message, 503, 10);
    }

    return errorResponse(message, 502);
  }
}
