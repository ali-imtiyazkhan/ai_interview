import { describe, expect, test } from "bun:test";
import { chunkText } from "../src/services/embeddings.service";

describe("chunkText", () => {
  test("returns empty array for empty input", () => {
    expect(chunkText("")).toEqual([]);
  });

  test("returns single chunk for short text", () => {
    const result = chunkText("Hello world.");
    expect(result).toHaveLength(1);
    expect(result[0]).toBe("Hello world.");
  });

  test("splits text into multiple chunks at sentence boundaries", () => {
    const longText = "A".repeat(500) + ". " + "B".repeat(600) + ". " + "C".repeat(500) + ".";
    const result = chunkText(longText, 600);
    expect(result.length).toBeGreaterThan(1);
  });

  test("handles text without punctuation by falling back to single chunk", () => {
    const text = "no punctuation here just spaces ";
    const result = chunkText(text.repeat(50), 200);
    expect(result.length).toBe(1);
  });
});
