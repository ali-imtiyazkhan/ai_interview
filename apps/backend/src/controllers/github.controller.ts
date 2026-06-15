import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { env } from "../config/env";
import { extractUsername } from "../utils/username";
import {
  fetchUserRepos,
  fetchRepoReadme,
  fetchRepoLanguages,
  selectReposForDeepEmbed,
  buildRepoSummaryChunks,
  truncateReadme,
} from "../services/github.service";
import { generateEmbedding, chunkText } from "../services/embeddings.service";

async function insertEmbedding(
  interviewId: string,
  sourceType: string,
  chunkTextValue: string,
  embedding: number[],
  metadata: Record<string, unknown>,
) {
  await prisma.$executeRaw`
    INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata)
    VALUES (
      gen_random_uuid(),
      ${interviewId},
      ${sourceType}::"EmbeddingSourceType",
      ${chunkTextValue},
      ${`[${embedding.join(",")}]`}::vector,
      ${JSON.stringify(metadata)}::jsonb
    )
  `;
}

export async function embedGithubData(req: Request, res: Response) {
  try {
    const { interviewId, githubUrl } = req.body as { interviewId: string; githubUrl: string };

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } });
    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    const username = extractUsername(githubUrl);
    const repos = await fetchUserRepos(username);
    const deepRepos = selectReposForDeepEmbed(repos);
    let embeddingCount = 0;

    // 1) Lightweight summary for ALL repos (typically 1–3 embedding calls)
    for (const summaryChunk of buildRepoSummaryChunks(repos)) {
      const embedding = await generateEmbedding(summaryChunk);
      await insertEmbedding(interviewId, "GITHUB_REPO", summaryChunk, embedding, {
        scope: "profile-summary",
        totalRepos: repos.length,
      });
      embeddingCount++;
    }

    // 2) Deep README embed only for top N repos (free-tier friendly)
    for (const repo of deepRepos) {
      const readme = await fetchRepoReadme(username, repo.name);
      if (readme) {
        const truncated = truncateReadme(readme);
        const chunks = chunkText(truncated).slice(0, env.githubMaxReadmeChunks);

        for (const chunk of chunks) {
          const text = `Repo: ${repo.name}\nREADME excerpt:\n${chunk}`;
          const emb = await generateEmbedding(text);
          await insertEmbedding(interviewId, "GITHUB_README", text, emb, { repo: repo.name });
          embeddingCount++;
        }
      }

      // Languages folded into one small chunk (skip separate GITHUB_LANGUAGES rows)
      const languages = await fetchRepoLanguages(username, repo.name);
      const langEntries = Object.entries(languages);
      if (langEntries.length > 0) {
        const langText = `Repo: ${repo.name}\nLanguages: ${langEntries.map(([l, b]) => `${l}: ${b} bytes`).join(", ")}`;
        const langEmbedding = await generateEmbedding(langText);
        await insertEmbedding(interviewId, "GITHUB_LANGUAGES", langText, langEmbedding, { repo: repo.name });
        embeddingCount++;
      }
    }

    res.json({
      message: `Embedded GitHub profile (${repos.length} repos): ${embeddingCount} vectors total`,
      totalRepos: repos.length,
      deepEmbeddedRepos: deepRepos.map((r) => r.name),
      embeddingCount,
      limits: {
        maxDeepRepos: env.githubMaxDeepRepos,
        maxReadmeChars: env.githubMaxReadmeChars,
        maxReadmeChunks: env.githubMaxReadmeChunks,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to embed GitHub data";
    res.status(500).json({ message });
  }
}
