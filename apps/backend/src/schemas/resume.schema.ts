import { z } from "zod";

export const resumeUploadSchema = z.object({
    interviewId: z.string().uuid(),
});

export const resumeParseSchema = z.object({
    interviewId: z.string().uuid(),
    rewText: z.string().min(50, { message: "Resume text must be at least 50 characters long" }),
});

export const resumeEmbedReposSchema = z.object({
    interviewId: z.string().uuid(),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
    })),
});