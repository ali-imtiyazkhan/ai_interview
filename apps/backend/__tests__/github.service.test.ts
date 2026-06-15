import { describe, expect, test } from "bun:test";
import type { GitHubRepo } from "../src/types";
import {
  buildRepoSummaryChunks,
  buildRepoSummaryLine,
  selectReposForDeepEmbed,
  truncateReadme,
} from "../src/services/github.service";

const sampleRepos: GitHubRepo[] = [
  { name: "big-project", fullName: "user/big-project", description: "Main app", starCount: 120, language: "TypeScript", topics: ["react"], readme: null },
  { name: "small-lib", fullName: "user/small-lib", description: "Utils", starCount: 5, language: "JavaScript", topics: [], readme: null },
  { name: "archived", fullName: "user/archived", description: null, starCount: 50, language: "Python", topics: ["ml"], readme: null },
];

describe("selectReposForDeepEmbed", () => {
  test("returns top repos by star count", () => {
    const selected = selectReposForDeepEmbed(sampleRepos, 2);
    expect(selected.map((r) => r.name)).toEqual(["big-project", "archived"]);
  });
});

describe("buildRepoSummaryChunks", () => {
  test("creates a compact overview chunk for all repos", () => {
    const chunks = buildRepoSummaryChunks(sampleRepos, 10_000);
    expect(chunks.length).toBe(1);
    expect(chunks[0]).toContain("3 repositories");
    expect(chunks[0]).toContain("big-project");
    expect(chunks[0]).toContain("small-lib");
  });

  test("splits very large profiles into multiple chunks", () => {
    const manyRepos = Array.from({ length: 200 }, (_, i) => ({
      ...sampleRepos[0],
      name: `repo-${i}`,
      description: "A".repeat(200),
    }));
    const chunks = buildRepoSummaryChunks(manyRepos, 2000);
    expect(chunks.length).toBeGreaterThan(1);
  });
});

describe("buildRepoSummaryLine", () => {
  test("includes key repo metadata on one line", () => {
    const line = buildRepoSummaryLine(sampleRepos[0]);
    expect(line).toContain("big-project");
    expect(line).toContain("TypeScript");
    expect(line).toContain("120 stars");
  });
});

describe("truncateReadme", () => {
  test("leaves short readmes unchanged", () => {
    expect(truncateReadme("hello", 100)).toBe("hello");
  });

  test("truncates long readmes", () => {
    const long = "x".repeat(5000);
    const result = truncateReadme(long, 1000);
    expect(result.length).toBeLessThan(1100);
    expect(result).toContain("[README truncated");
  });
});
