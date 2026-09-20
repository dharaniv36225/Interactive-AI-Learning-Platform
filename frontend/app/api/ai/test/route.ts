import {
  GEMINI_MODEL,
  generateTutorResponse,
  isGeminiConfigured,
} from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isGeminiConfigured()) {
    return Response.json(
      {
        success: false,
        error: "GEMINI_API_KEY is missing",
      },
      { status: 503 },
    );
  }

  try {
    const message = await generateTutorResponse(
      "Reply with exactly: Gemini API is working",
    );

    return Response.json({
      success: true,
      message: "Gemini API is working",
      model: GEMINI_MODEL,
      responseReceived: Boolean(message.trim()),
    });
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Unknown Gemini API failure.";
    const normalizedDetails = details.toLowerCase();

    if (
      normalizedDetails.includes("quota") ||
      normalizedDetails.includes("rate limit") ||
      normalizedDetails.includes("429")
    ) {
      return Response.json(
        { success: false, error: "Gemini API quota or rate limit reached" },
        { status: 429, headers: { "Retry-After": "30" } },
      );
    }

    if (
      normalizedDetails.includes("invalid") ||
      normalizedDetails.includes("permission") ||
      normalizedDetails.includes("401") ||
      normalizedDetails.includes("403")
    ) {
      return Response.json(
        { success: false, error: "Gemini API key is invalid or unauthorized" },
        { status: 502 },
      );
    }

    return Response.json(
      {
        success: false,
        error: "Gemini API request failed",
        details,
      },
      { status: 502 },
    );
  }
}
