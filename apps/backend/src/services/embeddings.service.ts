import { env } from "../config/env";

export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${env.ollamaUrl}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.ollamaEmbeddingModel,
      prompt: text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama embedding failed: ${res.statusText}`);
  }

  const data = (await res.json()) as { embedding: number[] };
  return data.embedding;
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
