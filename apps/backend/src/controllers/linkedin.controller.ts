import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { scrapeLinkedInProfile } from "../services/linkedin.service";
import { generateEmbedding, chunkText } from "../services/embeddings.service";

export async function embedLinkedinData(req: Request, res: Response) {
  try {
    const { interviewId, linkedinUrl, profileText } = req.body as {
      interviewId: string;
      linkedinUrl?: string;
      profileText?: string;
    };

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } });
    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    // Try scraping first, fall back to manual text or stored profile data
    let sourceText = profileText?.trim() ?? "";

    if (!sourceText && interview.linkedinMetaData) {
      const meta = interview.linkedinMetaData as { manualProfileText?: string };
      sourceText = meta.manualProfileText?.trim() ?? "";
    }

    if (linkedinUrl && !sourceText) {
      const profile = await scrapeLinkedInProfile(linkedinUrl);
      if (profile.skills.length > 0 || profile.experience.length > 0) {
        sourceText = [
          `Name: ${profile.name}`,
          `Headline: ${profile.headline ?? ""}`,
          `Skills: ${profile.skills.join(", ")}`,
          ...profile.experience.map(
            (e) => `Experience: ${e.title} at ${e.company} (${e.duration}) - ${e.description ?? ""}`,
          ),
          ...profile.education.map(
            (e) => `Education: ${e.degree ?? ""} in ${e.field ?? ""} at ${e.school} (${e.duration})`,
          ),
        ].join("\n\n");
      }
    }

    if (!sourceText) {
      res.status(400).json({ message: "No LinkedIn profile data provided. Either provide a valid URL or paste your profile text." });
      return;
    }

    const chunks = chunkText(sourceText);
    for (const chunk of chunks) {
      const emb = await generateEmbedding(chunk);
      await prisma.$executeRaw`
        INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata)
        VALUES (gen_random_uuid(), ${interviewId}, 'LINKEDIN_PROFILE', ${chunk}, ${`[${emb.join(",")}]`}::vector, ${JSON.stringify({ source: "manual-linkedin" })})
      `;
    }

    res.json({ message: `LinkedIn profile embedded (${chunks.length} chunks)` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to embed LinkedIn data";
    res.status(500).json({ message });
  }
}
