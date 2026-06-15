import { env } from "../config/env";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const res = await fetch(
    `${GEMINI_BASE}/${env.geminiEmbeddingModel}:embedContent?key=${env.geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        // Must match pgvector column size in schema.prisma (vector(1536))
        outputDimensionality: 1536,
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Gemini embedding failed (${res.status}): ${err}`);
  }

  const data = (await res.json()) as { embedding?: { values?: number[] } };
  return data.embedding?.values ?? [];
}

export function chunkText(text: string, maxChunkSize = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) ?? [text];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxChunkSize && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}
