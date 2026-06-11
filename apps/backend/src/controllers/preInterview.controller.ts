import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { extractUsername } from "../utils/username";
import { fetchUserRepos } from "../services/github.service";
import { scrapeLinkedInProfile } from "../services/linkedin.service";

export async function createPreInterview(req: Request, res: Response) {
  const { github, linkedin } = req.body as { github: string; linkedin: string };

  const githubUsername = extractUsername(github);
  const linkedinUsername = extractUsername(linkedin);

  const repos = await fetchUserRepos(githubUsername);
  const linkedinProfile = await scrapeLinkedInProfile(linkedin);

  const interview = await prisma.interview.create({
    data: {
      githubMetaData: repos,
      linkedinMetaData: linkedinProfile,
      status: "Pre",
      score: 0,
    },
  });

  res.status(201).json({
    id: interview.id,
    message: "Pre-interview data collected",
  });
}
