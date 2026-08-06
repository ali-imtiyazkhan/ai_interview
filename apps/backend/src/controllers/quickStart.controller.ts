import type { Request, Response } from "express";
import { prisma } from "../config/db";

export async function createQuickStartInterview(req: Request, res: Response) {
  try {
    const { mode, candidateName, jobRole, experienceLevel, languages, difficulty, topics } =
      req.body as {
        mode: "GENERAL" | "DSA";
        candidateName?: string;
        jobRole?: string;
        experienceLevel?: string;
        languages?: string[];
        difficulty?: string;
        topics?: string[];
      };

    if (mode === "DSA" && !difficulty) {
      res.status(400).json({ message: "Difficulty is required for DSA mode" });
      return;
    }

    if (mode === "GENERAL" && (!languages || languages.length === 0)) {
      res.status(400).json({ message: "Pick at least one language" });
      return;
    }

    const interview = await prisma.interview.create({
      data: {
        mode,
        candidateName: candidateName ?? null,
        jobRole: jobRole ?? null,
        experienceLevel: experienceLevel ?? null,
        languages: languages ?? [],
        topics: topics ?? [],
        difficulty: difficulty ?? null,
        status: "Pre",
        score: 0,
      },
    });

    res.status(201).json({
      id: interview.id,
      message: "Quick-start interview created",
    });
  } catch (error) {
    console.error("Quick-start error:", error instanceof Error ? error.stack : error);
    const message = error instanceof Error ? error.message : "Failed to create quick-start interview";
    res.status(500).json({ message });
  }
}
