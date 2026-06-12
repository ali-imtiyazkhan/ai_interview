import { z } from "zod";

export const preInterviewSchema = z.object({
  linkedin: z.string().url("LinkedIn URL is required"),
  github: z.string().url("GitHub URL is required"),
  linkedinProfileText: z.string().optional(),
});

export const interviewIdSchema = z.object({
  id: z.string().uuid("Invalid interview ID"),
});

export const answerSchema = z.object({
  questionId: z.string().uuid(),
  transcript: z.string().optional(),
  audioUrl: z.string().optional(),
});

export const questionRequestSchema = z.object({
  interviewId: z.string().uuid(),
  count: z.number().int().min(1).max(20).default(5),
});

export const embedGithubSchema = z.object({
  interviewId: z.string().uuid("Invalid interview ID"),
  githubUrl: z.string().url("Valid GitHub URL is required"),
});

export const embedLinkedinSchema = z.object({
  interviewId: z.string().uuid("Invalid interview ID"),
  linkedinUrl: z.string().url("Valid LinkedIn URL is required"),
  profileText: z.string().optional(),
});
