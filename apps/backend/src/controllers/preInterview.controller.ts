import type { Request, Response } from "express";
import { prisma } from "../config/db";
import type { Prisma } from "../../generated/prisma/client";
import { extractUsername } from "../utils/username";
import { fetchUserRepos } from "../services/github.service";
import { scrapeLinkedInProfile } from "../services/linkedin.service";

export async function createPreInterview(req: Request, res: Response) {
  try {
    const { github, linkedin, candidateName, jobRole, experienceLevel } = req.body as {
      github: string;
      linkedin: string;
      candidateName?: string;
      jobRole?: string;
      experienceLevel?: string;
    };

    if (!github.includes("github.com")) {
      res.status(400).json({ message: "GitHub URL must contain github.com" });
      return;
    }
    if (!linkedin.includes("linkedin.com")) {
      res.status(400).json({ message: "LinkedIn URL must contain linkedin.com" });
      return;
    }

    const githubUsername = extractUsername(github);

    const repos = await fetchUserRepos(githubUsername);
    const linkedinProfile = await scrapeLinkedInProfile(linkedin);

    const interview = await prisma.interview.create({
      data: {
        candidateName: candidateName ?? null,
        jobRole: jobRole ?? null,
        experienceLevel: experienceLevel ?? null,
        githubMetaData: repos as unknown as Prisma.InputJsonValue,
        linkedinMetaData: linkedinProfile as unknown as Prisma.InputJsonValue,
        status: "Pre",
        score: 0,
      },
    });

    res.status(201).json({
      id: interview.id,
      message: "Pre-interview data collected",
    });
  } catch (error) {
    console.error("Pre-interview error:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    const message = error instanceof Error ? error.message : "Failed to create pre-interview";
    res.status(500).json({ message });
  }
}
