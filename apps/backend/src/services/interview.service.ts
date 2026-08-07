import { env } from "../config/env";
import type { QuestionCategory } from "../../generated/prisma/enums";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface GenerateQuestionsParams {
  context: string;
  count: number;
  categories: QuestionCategory[];
  mode?: "GENERAL" | "DSA";
  languages?: string[];
  difficulty?: string;
  topics?: string[];
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
  const mode = params.mode ?? "GENERAL";
  const languages = params.languages ?? [];
  const difficulty = params.difficulty ?? "Medium";
  const topics = params.topics ?? [];

  const categoriesList = categories.length > 0
    ? categories.join(", ")
    : "TECHNICAL, BEHAVIORAL, PROJECT_DEEP_DIVE";

  let prompt: string;

  if (mode === "DSA") {
    const topicList = topics.length > 0 ? topics.join(", ") : "fundamental data structures and algorithms";
    prompt = `
You are a DSA interview coach. Generate ${count} coding problems at ${difficulty} difficulty covering these topics: ${topicList}.

For each problem include:
- A clear problem statement with realistic constraints.
- Example input/output test cases inline in the statement.

Return ONLY a JSON array of objects with "question" and "category" fields.
The "category" must be exactly: DSA.
`.trim();
  } else if (languages.length > 0) {
    prompt = `
You are a technical interview assistant. Generate ${count} personalized interview questions for a candidate preparing for a ${context.trim() || "software engineering"} role.

The candidate's stack: ${languages.join(", ")}.
Experience level: ${context.trim() || "not specified"}.

REQUIREMENTS:
- For TECHNICAL: test language-specific and framework-specific knowledge for the stack above.
- For SKILL_ASSESSMENT: probe depth of skill in the candidate's languages.
- For BEHAVIORAL: tie to the candidate's experience level.
- For SYSTEM_DESIGN: scope appropriately for the candidate's experience.

Categories to distribute evenly: ${categoriesList}.

Return ONLY a JSON array of objects with "question" and "category" fields.
The "category" must be one of: ${categoriesList}.
`.trim();
  } else {
    prompt = `
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
  }

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

export async function transcribeAudio(audioUrl: string): Promise<string> {
  if (!env.geminiApiKey) return "";
  const match = audioUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match?.[1] || !match[2]) return "";

  const mimeType = match[1];
  const data = match[2];

  const res = await fetch(
    `${GEMINI_BASE}/${env.geminiLlmModel}:generateContent?key=${env.geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inlineData: { mimeType, data } },
              {
                text: "Transcribe the speech in this audio verbatim, preserving the speaker's wording. Return ONLY the plain text transcript with no commentary or labels.",
              },
            ],
          },
        ],
        generationConfig: { temperature: 0, maxOutputTokens: 4096 },
      }),
    },
  );

  if (!res.ok) return "";

  const dataJson = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return dataJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
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
