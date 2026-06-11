import { env } from "../config/env";
import type { QuestionCategory } from "../../generated/prisma/enums";

interface GenerateQuestionsParams {
  context: string;        // aggregated candidate context from embeddings
  count: number;
  categories: QuestionCategory[];
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

  const res = await fetch(`${env.ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.ollamaLlmModel,
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) throw new Error(`LLM generate failed: ${res.statusText}`);

  const data = (await res.json()) as { response: string };
  return parseQuestionsResponse(data.response);
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

  const res = await fetch(`${env.ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.ollamaLlmModel,
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) throw new Error(`LLM evaluate failed: ${res.statusText}`);

  const data = (await res.json()) as { response: string };
  return parseEvaluationResponse(data.response);
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
