import type { Request, Response, NextFunction } from "express";
import { parseResumeWithAI, buildResumeContext, embedResumeRepos } from "../services/resume.service";
import { generateEmbedding, chunkText } from "../services/embeddings.service";
import { prisma } from "../config/db";

export async function uploadResume(req: Request, res: Response, next: NextFunction) {
    try {
        const { interviewId } = req.body;
        const file = (req as any).file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const rawText = file.buffer.toString("utf-8");

        const parsed = await parseResumeWithAI(rawText);
        const contextText = buildResumeContext(parsed);
        const chunks = chunkText(contextText, 1000);

        for (const chunk of chunks) {
            const embedding = await generateEmbedding(chunk);
            await prisma.$executeRaw`
        INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, "createdAt")
        VALUES (gen_random_uuid(), ${interviewId}::uuid, 'RESUME'::"EmbeddingSourceType", ${chunk}, ${JSON.stringify(embedding)}::vector, NOW())
      `;
        }

        const repoResults = await embedResumeRepos(interviewId, parsed.projects);
        const reposEmbedded = repoResults.filter(r => r.embedded).length;

        return res.json({
            message: "Resume processed and embedded",
            skills: parsed.skills,
            projects: parsed.projects,
            experienceCount: parsed.experience.length,
            reposEmbedded,
            repoResults,
        });
    } catch (err) {
        next(err);
    }
}

export async function parseResumeText(req: Request, res: Response, next: NextFunction) {
    try {
        const { interviewId, rawText } = req.body;

        const parsed = await parseResumeWithAI(rawText);
        const contextText = buildResumeContext(parsed);
        const chunks = chunkText(contextText, 1000);

        for (const chunk of chunks) {
            const embedding = await generateEmbedding(chunk);
            await prisma.$executeRaw`
        INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, "createdAt")
        VALUES (gen_random_uuid(), ${interviewId}::uuid, 'RESUME'::"EmbeddingSourceType", ${chunk}, ${JSON.stringify(embedding)}::vector, NOW())
      `;
        }

        const repoResults = await embedResumeRepos(interviewId, parsed.projects);
        const reposEmbedded = repoResults.filter(r => r.embedded).length;

        return res.json({
            message: "Resume text processed and embedded",
            skills: parsed.skills,
            projects: parsed.projects,
            reposEmbedded,
            repoResults,
        });
    } catch (err) {
        next(err);
    }
}

export async function embedResumeReposController(req: Request, res: Response, next: NextFunction) {
    try {
        const { interviewId, projects } = req.body;
        const results = await embedResumeRepos(interviewId, projects);
        const reposEmbedded = results.filter(r => r.embedded).length;
        return res.json({
            message: `Embedded ${reposEmbedded} repos from resume`,
            reposEmbedded,
            results,
        });
    } catch (err) {
        next(err);
    }
}