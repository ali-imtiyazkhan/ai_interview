import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { scrapeLinkedInProfile } from "../services/linkedin.service";
import { generateEmbedding, chunkText } from "../services/embeddings.service";

export async function embedLinkedinData(req: Request, res: Response) {
  const { interviewId, linkedinUrl } = req.body as { interviewId: string; linkedinUrl: string };

  const interview = await prisma.interview.findUnique({ where: { id: interviewId } });
  if (!interview) {
    res.status(404).json({ message: "Interview not found" });
    return;
  }

  const profile = await scrapeLinkedInProfile(linkedinUrl);

  // Embed profile overview
  const profileText = `Name: ${profile.name}\nHeadline: ${profile.headline ?? ""}\nSkills: ${profile.skills.join(", ")}`;
  const embedding = await generateEmbedding(profileText);
  await prisma.$executeRaw`
    INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata)
    VALUES (gen_random_uuid(), ${interviewId}, 'LINKEDIN_PROFILE', ${profileText}, ${`[${embedding.join(",")}]`}::vector, ${JSON.stringify({ source: "linkedin" })})
  `;

  // Embed experience
  for (const exp of profile.experience) {
    const text = `Role: ${exp.title} at ${exp.company}\nDuration: ${exp.duration}\n${exp.description ?? ""}`;
    const chunks = chunkText(text);
    for (const chunk of chunks) {
      const emb = await generateEmbedding(chunk);
      await prisma.$executeRaw`
        INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata)
        VALUES (gen_random_uuid(), ${interviewId}, 'LINKEDIN_EXPERIENCE', ${chunk}, ${`[${emb.join(",")}]`}::vector, ${JSON.stringify({ company: exp.company, title: exp.title })})
      `;
    }
  }

  // Embed education
  for (const edu of profile.education) {
    const text = `School: ${edu.school}\nDegree: ${edu.degree ?? ""}\nField: ${edu.field ?? ""}\nDuration: ${edu.duration}`;
    const emb = await generateEmbedding(text);
    await prisma.$executeRaw`
      INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata)
      VALUES (gen_random_uuid(), ${interviewId}, 'LINKEDIN_EDUCATION', ${text}, ${`[${emb.join(",")}]`}::vector, ${JSON.stringify({ school: edu.school })})`;
  }

  res.json({ message: "LinkedIn profile embedded successfully" });
}
