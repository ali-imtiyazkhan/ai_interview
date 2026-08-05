import { describe, expect, test } from "bun:test";
import { generateEmbedding } from "../src/services/embeddings.service";

describe("generateEmbedding", () => {
  test("returns an embedding vector for a single text", async () => {
    const embedding = await generateEmbedding("What is the meaning of life?");
    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBe(1536);
    expect(embedding.every((v) => typeof v === "number")).toBe(true);
  });

  test("returns consistent dimensions for multiple texts", async () => {
    const texts = [
      "What is the meaning of life?",
      "How much wood would a woodchuck chuck?",
      "How does the brain work?",
    ];
    const embeddings = await Promise.all(texts.map(generateEmbedding));
    expect(embeddings).toHaveLength(3);
    const firstLength = embeddings[0]?.length ?? 0;
    for (const emb of embeddings) {
      expect(emb.length).toBe(firstLength);
    }
    expect(embeddings.some((emb) => emb.length > 0)).toBe(true);
  });
});
