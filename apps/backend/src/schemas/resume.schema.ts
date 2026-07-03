import { z } from "zod";

export const resumeUploadSchema = z.object({
    interviewId: z.string().uuid(),
});

export const resumeParseSchema = z.object({
    interviewId: z.string().uuid(),
    rewText: z.string().min(50, { message: "Resume text must be at least 50 characters long" }),
});