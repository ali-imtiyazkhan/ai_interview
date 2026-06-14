import { describe, expect, test } from "bun:test";
import { generateEmbedding } from "../src/services/embeddings.service";

describe("generateEmbedding", () => {
  test("returns an embedding vector for a single text", async () => {
    const embedding = await generateEmbedding("What is the meaning of life?");
    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBeGreaterThan(0);
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
    const [first, ...rest] = embeddings;
    for (const emb of rest) {
      expect(emb.length).toBe(first.length);
    }
    expect(embeddings.some((emb) => emb.length > 0)).toBe(true);
  });
});
