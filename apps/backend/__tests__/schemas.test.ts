import { describe, expect, test } from "bun:test";
import {
  preInterviewSchema,
  answerSchema,
  embedGithubSchema,
  embedLinkedinSchema,
} from "../src/schemas/interview.schema";

describe("preInterviewSchema", () => {
  test("validates with github and linkedin URLs", () => {
    const result = preInterviewSchema.safeParse({
      github: "https://github.com/octocat",
      linkedin: "https://linkedin.com/in/johndoe",
    });
    expect(result.success).toBe(true);
  });

  test("validates with optional fields", () => {
    const result = preInterviewSchema.safeParse({
      github: "https://github.com/octocat",
      linkedin: "https://linkedin.com/in/johndoe",
      candidateName: "Jane Doe",
      jobRole: "Senior Engineer",
      experienceLevel: "5 years",
    });
    expect(result.success).toBe(true);
  });

  test("rejects missing fields", () => {
    const result = preInterviewSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  test("rejects invalid URLs", () => {
    const result = preInterviewSchema.safeParse({
      github: "not-a-url",
      linkedin: "https://linkedin.com/in/johndoe",
    });
    expect(result.success).toBe(false);
  });
});

describe("embedGithubSchema", () => {
  test("validates with interviewId and githubUrl", () => {
    const result = embedGithubSchema.safeParse({
      interviewId: "550e8400-e29b-41d4-a716-446655440000",
      githubUrl: "https://github.com/octocat",
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid UUID", () => {
    const result = embedGithubSchema.safeParse({
      interviewId: "not-a-uuid",
      githubUrl: "https://github.com/octocat",
    });
    expect(result.success).toBe(false);
  });
});

describe("embedLinkedinSchema", () => {
  test("validates with linkedinUrl and optional profileText", () => {
    const result = embedLinkedinSchema.safeParse({
      interviewId: "550e8400-e29b-41d4-a716-446655440000",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      profileText: "Senior dev with 5 years experience",
    });
    expect(result.success).toBe(true);
  });

  test("validates without profileText", () => {
    const result = embedLinkedinSchema.safeParse({
      interviewId: "550e8400-e29b-41d4-a716-446655440000",
      linkedinUrl: "https://linkedin.com/in/johndoe",
    });
    expect(result.success).toBe(true);
  });
});

describe("answerSchema", () => {
  test("validates with questionId", () => {
    const result = answerSchema.safeParse({
      questionId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  test("validates with optional transcript and audioUrl", () => {
    const result = answerSchema.safeParse({
      questionId: "550e8400-e29b-41d4-a716-446655440000",
      transcript: "My answer is...",
      audioUrl: "data:audio/webm;base64,SGVsbG8=",
    });
    expect(result.success).toBe(true);
  });
});
