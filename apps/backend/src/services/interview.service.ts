import { env } from "../config/env";
import type { QuestionCategory } from "../../generated/prisma/enums";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface GenerateQuestionsParams {
  context: string;
  count: number;
  categories: QuestionCategory[];
}

async function geminiGenerate(prompt: string): Promise<string> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const res = await fetch(
    `${GEMINI_BASE}/${env.geminiLlmModel}:generateContent?key=${env.geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function generateQuestions(params: GenerateQuestionsParams) {
  const { context, count, categories } = params;

  const categoriesList = categories.length > 0
    ? categories.join(", ")
    : "TECHNICAL, BEHAVIORAL, PROJECT_DEEP_DIVE";

  const prompt = `
You are a technical interview assistant. Generate ${count} highly personalized interview questions based on the candidate's actual profile data below.

The data comes from their GitHub and/or Resume. Extract key SKILLS, PROJECTS, and EXPERIENCE from it first, then create questions that genuinely test those specific areas.

REQUIREMENTS:
- For PROJECT_DEEP_DIVE: reference specific projects from the profile (e.g., "In your project X, why did you choose Y?").
- For SKILL_ASSESSMENT: test the specific technologies/languages the candidate has actually used.
- For TECHNICAL: relate to their listed tech stack.
- For BEHAVIORAL: tie to their experience level and past roles.
- For SYSTEM_DESIGN: scope appropriately for their experience level.

Categories to distribute evenly: ${categoriesList}.

Candidate Profile:
${context}

Return ONLY a JSON array of objects with "question" and "category" fields.
The "category" must be one of: ${categoriesList}.
`.trim();

  const text = await geminiGenerate(prompt);
  return parseQuestionsResponse(text);
}

export async function evaluateAnswer(question: string, context: string, answer: string) {
  const prompt = `
You are an interview evaluator. Evaluate the candidate's answer to the question below.
Consider: correctness, relevance, depth, and communication.

Question: ${question}
Candidate Context: ${context}
Answer: ${answer}

Return a JSON object with: { "score": number (0-100), "feedback": string, "strengths": string[], "weaknesses": string[] }
`.trim();

  const text = await geminiGenerate(prompt);
  return parseEvaluationResponse(text);
}

function parseQuestionsResponse(raw: string): { question: string; category: string }[] {
  try {
    const cleaned = raw.replace(/```(?:json)?\s*/gi, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [{ question: raw, category: "TECHNICAL" }];
  }
}

function parseEvaluationResponse(raw: string): { score: number; feedback: string; strengths: string[]; weaknesses: string[] } {
  try {
    const cleaned = raw.replace(/```(?:json)?\s*/gi, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { score: 50, feedback: raw, strengths: [], weaknesses: [] };
  }
}
