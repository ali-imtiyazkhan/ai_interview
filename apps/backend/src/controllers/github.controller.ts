import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { extractUsername } from "../utils/username";
import { fetchUserRepos, fetchRepoReadme, fetchRepoLanguages } from "../services/github.service";
import { generateEmbedding, chunkText } from "../services/embeddings.service";

export async function embedGithubData(req: Request, res: Response) {
  const { interviewId, githubUrl } = req.body as { interviewId: string; githubUrl: string };

  const interview = await prisma.interview.findUnique({ where: { id: interviewId } });
  if (!interview) {
    res.status(404).json({ message: "Interview not found" });
    return;
  }

  const username = extractUsername(githubUrl);
  const repos = await fetchUserRepos(username);

  // Embed repo metadata
  for (const repo of repos) {
    const text = `Repo: ${repo.name}\nDescription: ${repo.description ?? ""}\nLanguage: ${repo.language ?? ""}\nTopics: ${repo.topics.join(", ")}\nStars: ${repo.starCount}`;
    const embedding = await generateEmbedding(text);

    await prisma.$executeRaw`
      INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata)
      VALUES (gen_random_uuid(), ${interviewId}, 'GITHUB_REPO', ${text}, ${`[${embedding.join(",")}]`}::vector, ${JSON.stringify({ repo: repo.name })})
    `;

    // Fetch and embed README
    const readme = await fetchRepoReadme(username, repo.name);
    if (readme) {
      const chunks = chunkText(readme);
      for (const chunk of chunks) {
        const emb = await generateEmbedding(chunk);
        await prisma.$executeRaw`
          INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata)
          VALUES (gen_random_uuid(), ${interviewId}, 'GITHUB_README', ${chunk}, ${`[${emb.join(",")}]`}::vector, ${JSON.stringify({ repo: repo.name })})
        `;
      }
    }

    // Fetch and embed languages
    const languages = await fetchRepoLanguages(username, repo.name);
    const langText = `Repo: ${repo.name}\nLanguages: ${Object.entries(languages).map(([l, b]) => `${l}: ${b} bytes`).join(", ")}`;
    const langEmbedding = await generateEmbedding(langText);
    await prisma.$executeRaw`
      INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata)
      VALUES (gen_random_uuid(), ${interviewId}, 'GITHUB_LANGUAGES', ${langText}, ${`[${langEmbedding.join(",")}]`}::vector, ${JSON.stringify({ repo: repo.name })})
    `;
  }

  res.json({ message: `Embedded ${repos.length} repos with READMEs and languages` });
}
