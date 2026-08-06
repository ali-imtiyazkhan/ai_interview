import { z } from "zod";

export const preInterviewSchema = z.object({
  github: z.string().url("GitHub URL is required"),
  candidateName: z.string().max(200).optional(),
  jobRole: z.string().max(200).optional(),
  experienceLevel: z.string().max(100).optional(),
});

export const interviewIdSchema = z.object({
  id: z.string().uuid("Invalid interview ID"),
});

export const answerSchema = z
  .object({
    questionId: z.string().uuid(),
    transcript: z.string().optional(),
    audioUrl: z.string().optional(),
  })
  .refine(
    (data) => Boolean(data.transcript?.trim()) || Boolean(data.audioUrl),
    { message: "Either transcript or audioUrl is required", path: ["transcript"] },
  );

export const questionRequestSchema = z.object({
  interviewId: z.string().uuid(),
  count: z.number().int().min(1).max(20).default(5),
});

export const embedGithubSchema = z.object({
  interviewId: z.string().uuid("Invalid interview ID"),
  githubUrl: z.string().url("Valid GitHub URL is required"),
});

export const quickStartSchema = z
  .object({
    mode: z.enum(["GENERAL", "DSA"]).default("GENERAL"),
    candidateName: z.string().max(200).optional(),
    jobRole: z.string().max(200).optional(),
    experienceLevel: z.string().max(100).optional(),
    languages: z.array(z.string().max(50)).optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    topics: z.array(z.string().max(50)).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "GENERAL" && (!data.languages || data.languages.length === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["languages"],
        message: "Pick at least one language",
      });
    }
    if (data.mode === "DSA" && !data.difficulty) {
      ctx.addIssue({
        code: "custom",
        path: ["difficulty"],
        message: "Difficulty is required for DSA mode",
      });
    }
  });
