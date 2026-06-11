import { env } from "../config/env";
import type { QuestionCategory } from "../../generated/prisma/enums";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface GenerateQuestionsParams {
  context: string;
  count: number;
  categories: QuestionCategory[];
}

async function geminiGenerate(prompt: string): Promise<string> {
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
  const { context, count } = params;

  const prompt = `
You are an interview assistant. Based on the following candidate profile, generate ${count} personalized interview questions.
Cover technical skills, project experience, and behavioral aspects.

Candidate Profile:
${context}

Return ONLY a JSON array of objects with "question" and "category" fields.
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
