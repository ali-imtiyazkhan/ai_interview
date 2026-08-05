import { describe, expect, test } from "bun:test";
import { extractUsername } from "../src/utils/username";

describe("extractUsername", () => {
  test("extracts username from standard GitHub URL", () => {
    expect(extractUsername("https://github.com/octocat")).toBe("octocat");
  });

  test("extracts username with trailing slash", () => {
    expect(extractUsername("https://github.com/octocat/")).toBe("octocat");
  });

  test("handles empty URL", () => {
    expect(extractUsername("")).toBe("");
  });

  test("handles URL with no path (returns empty)", () => {
    expect(extractUsername("https://github.com")).toBe("");
  });
});
