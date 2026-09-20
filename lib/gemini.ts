import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { QuizDifficulty, QuizQuestion } from "@/types";

export const GEMINI_MODEL = "gemini-2.5-flash";

const FALLBACK_RESPONSES = [
  {
    keywords: ["momentum"],
    response:
      "Momentum is the quantity of motion possessed by an object. It is calculated using the formula p = m × v, where m is mass and v is velocity. A heavier or faster object has more momentum. For example, a moving truck is harder to stop than a bicycle because the truck usually has much greater momentum.",
  },
  {
    keywords: ["gravity", "gravitational"],
    response:
      "Gravity is the attractive force between objects that have mass. Near Earth, it pulls objects toward the ground with an acceleration of about 9.8 m/s². Gravity keeps people on Earth, gives objects weight, and keeps planets and moons in orbit.",
  },
  {
    keywords: ["newton's law", "newtons law", "newton law"],
    response:
      "Newton's laws explain how forces change motion. First law: an object keeps its state of motion unless a net force acts on it. Second law: force equals mass times acceleration, F = m × a. Third law: every force has an equal and opposite reaction force. Seat belts, pushing carts, and rocket launches are everyday examples.",
  },
  {
    keywords: ["electricity", "electric", "current", "voltage"],
    response:
      "Electricity involves electric charge. Electric current is the rate at which charge flows, voltage is the energy difference that pushes charge, and resistance opposes the flow. In a simple circuit, a battery supplies voltage and a closed path allows current to move through components such as a lamp.",
  },
  {
    keywords: ["rocket", "rockets"],
    response:
      "Rockets move using Newton's third law. The engine pushes hot gas backward at high speed, and the gas pushes the rocket forward with an equal and opposite force called thrust. A rocket does not need air to push against, so it can work in space.",
  },
  {
    keywords: ["energy", "kinetic", "potential"],
    response:
      "Energy is the ability to cause change or do work. Kinetic energy is energy of motion, while potential energy is stored because of position or condition. Energy can change form, such as gravitational potential energy becoming kinetic energy when an object falls, but total energy is conserved in an isolated system.",
  },
  {
    keywords: ["motion", "velocity", "acceleration", "speed"],
    response:
      "Motion is a change in position over time. Speed tells how fast an object moves, velocity includes both speed and direction, and acceleration describes how quickly velocity changes. A car turning at constant speed is still accelerating because its direction is changing.",
  },
  {
    keywords: ["light", "optic", "reflection", "refraction"],
    response:
      "Light is electromagnetic energy that travels as waves and can also behave like particles called photons. Reflection occurs when light bounces from a surface, while refraction occurs when light changes speed and direction as it enters a different material. Refraction is why a straw can look bent in water.",
  },
  {
    keywords: ["wave", "waves", "sound", "frequency", "wavelength"],
    response:
      "A wave transfers energy without permanently transporting the material it travels through. Wavelength is the distance between matching points on successive waves, frequency is the number of cycles per second, and amplitude describes the size of the disturbance. They are related by wave speed = frequency × wavelength.",
  },
] as const;

function getLatestLearnerMessage(message: string) {
  const learnerMessages = [...message.matchAll(/Learner:\s*([\s\S]*?)(?=\n\n(?:Learner|Tutor):|$)/gi)];
  const latest = learnerMessages.at(-1)?.[1]?.trim();
  return latest || message.trim();
}

function generateFallbackResponse(message: string, subject?: string, lesson?: string) {
  const learnerMessage = getLatestLearnerMessage(message);
  const searchText = `${subject ?? ""} ${lesson ?? ""} ${learnerMessage}`.toLowerCase();
  const match = FALLBACK_RESPONSES.find((entry) =>
    entry.keywords.some((keyword) => searchText.includes(keyword)),
  );

  if (match) {
    return `${match.response}\n\nDemo mode is active because a Gemini API key is not configured.`;
  }

  return [
    `You asked: "${learnerMessage}"`,
    "Demo mode currently provides built-in lessons for gravity, momentum, Newton's laws, electricity, rockets, energy, motion, light, and waves.",
    "Choose one of those topics, or set up a Gemini API key for a custom explanation.",
  ].join("\n\n");
}

function getFriendlyGeminiError(error: unknown) {
  const rawMessage =
    error instanceof Error ? error.message : "An unknown Gemini error occurred.";
  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes("api key not valid") ||
    normalized.includes("api_key_invalid") ||
    normalized.includes("permission_denied") ||
    normalized.includes("403") ||
    normalized.includes("401")
  ) {
    return "The Gemini API key is invalid, blocked, or does not have access. Create a new key in Google AI Studio and restart the app.";
  }

  if (
    normalized.includes("429") ||
    normalized.includes("resource_exhausted") ||
    normalized.includes("quota") ||
    normalized.includes("rate limit")
  ) {
    return "Gemini has reached its request or quota limit. Wait a moment, check your Google AI Studio quota, and try again.";
  }

  if (
    normalized.includes("503") ||
    normalized.includes("service unavailable") ||
    normalized.includes("high demand") ||
    normalized.includes("overloaded")
  ) {
    return "Gemini is temporarily busy. Wait a moment and use Retry to send the same question again.";
  }

  if (
    normalized.includes("fetch failed") ||
    normalized.includes("network") ||
    normalized.includes("enotfound") ||
    normalized.includes("econnreset") ||
    normalized.includes("timeout")
  ) {
    return "The tutor could not reach Gemini. Check your internet connection and try again.";
  }

  return "Gemini could not complete this request. Please try again or use one of the built-in demo topics.";
}

export async function generateTutorResponse(
  message: string,
  subject?: string,
  lesson?: string,
): Promise<string> {
  const normalizedMessage = message.trim();

  if (!normalizedMessage) {
    throw new Error("Enter a question before asking the tutor.");
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return generateFallbackResponse(normalizedMessage, subject, lesson);
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: [
        "You are the Interactive AI Learning Universe tutor, a friendly and patient teacher across science, mathematics, computing, AI, finance, and agriculture.",
        "Explain the learner's latest question simply and accurately in beginner-friendly language.",
        "Return professional study notes as plain text sections that will be rendered by React.",
        "Do not use Markdown symbols such as #, ##, ###, *, **, >, or backticks.",
        "Use clear section titles such as Introduction, Key Concepts, Step by step explanation, Formula explanation, Real-world example, Practical applications, Interview tips, and Summary.",
        "Use numbered lines for ordered steps or concepts.",
        "Build intuition before equations, define technical terms, explain formulas, and include practical applications.",
        "Add interview tips when the topic relates to programming, AI, engineering, or career preparation.",
        "Ask at most one follow-up question. Never invent facts, citations, or experimental results.",
      ].join(" "),
    });
    const context = [
      subject ? `Current subject: ${subject}` : null,
      lesson ? `Current lesson: ${lesson}` : null,
      `Conversation:\n${normalizedMessage}`,
    ]
      .filter((value): value is string => value !== null)
      .join("\n\n");
    const result = await model.generateContent(context);
    const response = result.response.text().trim();

    if (!response) {
      throw new Error("Gemini returned an empty response.");
    }

    return response;
  } catch (error) {
    throw new Error(getFriendlyGeminiError(error), { cause: error });
  }
}

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function isGeneratedQuestion(
  value: unknown,
): value is Omit<QuizQuestion, "id" | "lessonId"> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const question = value as Partial<QuizQuestion>;

  return (
    typeof question.subject === "string" &&
    typeof question.lesson === "string" &&
    (question.difficulty === "easy" ||
      question.difficulty === "medium" ||
      question.difficulty === "hard") &&
    typeof question.question === "string" &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every((option) => typeof option === "string") &&
    typeof question.correctAnswer === "string" &&
    question.options.includes(question.correctAnswer) &&
    typeof question.explanation === "string"
  );
}

export async function generatePracticeQuestions(
  subject: string,
  lesson: string,
  difficulty: QuizDifficulty,
  lessonId = "all",
  count = 5,
): Promise<QuizQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Gemini is not configured. Add GEMINI_API_KEY to .env.local and restart the app.",
    );
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.45,
      },
    });
    const result = await model.generateContent([
      `Create ${Math.min(Math.max(count, 1), 8)} high-quality multiple-choice practice questions.`,
      `Subject: ${subject}`,
      `Lesson: ${lesson === "all" ? "mixed lessons" : lesson}`,
      `Difficulty: ${difficulty}`,
      "Return only a JSON array. Each item must contain subject, lesson, difficulty, question, exactly four options, correctAnswer matching one option, and a concise explanation.",
      "Questions must be factual, unambiguous, educational, and distinct.",
    ].join("\n"));
    const raw = result.response
      .text()
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("Gemini returned an invalid question set.");
    }

    const questions = parsed.filter(isGeneratedQuestion).map((question, index) => ({
      ...question,
      id: `ai-practice-${Date.now()}-${index}`,
      subject,
      lessonId,
      lesson: lesson === "all" ? question.lesson : lesson,
      difficulty,
    }));

    if (questions.length === 0) {
      throw new Error("Gemini returned no usable practice questions.");
    }

    return questions;
  } catch (error) {
    throw new Error(getFriendlyGeminiError(error), { cause: error });
  }
}
