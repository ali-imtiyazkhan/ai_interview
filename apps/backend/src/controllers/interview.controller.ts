import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { generateQuestions, evaluateAnswer } from "../services/interview.service";
import type { Interview, Embedding, Question, Answer } from "../../generated/prisma/client";

export async function startInterview(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: { embeddings: true },
    });

    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    const ctx = interview as Interview & { embeddings: Embedding[] };

    const context = ctx.embeddings
      .map((e: Embedding) => `[${e.sourceType}] ${e.chunkText}`)
      .join("\n\n");

    const generated = await generateQuestions({
      context: context || "No candidate data available yet",
      count: 5,
      categories: ["TECHNICAL", "BEHAVIORAL", "PROJECT_DEEP_DIVE", "SKILL_ASSESSMENT", "SYSTEM_DESIGN"],
    });

    const questions = await Promise.all(
      generated.map((q: { question: string; category: string }, i: number) =>
        prisma.question.create({
          data: {
            interviewId: id,
            category: q.category as any,
            question: q.question,
            order: i + 1,
          },
        })
      )
    );

    await prisma.interview.update({
      where: { id },
      data: { status: "InProgress" },
    });

    res.json({ questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start interview";
    res.status(500).json({ message });
  }
}

export async function submitAnswer(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { questionId, transcript } = req.body as { questionId: string; transcript: string };

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { interview: true },
    });

    if (!question || question.interviewId !== id) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const embeddings = await prisma.embedding.findMany({ where: { interviewId: id } });
    const context = embeddings.map((e: Embedding) => e.chunkText).join("\n\n");

    // Evaluate
    const evaluation = await evaluateAnswer(question.question, context, transcript);

    // Save answer
    const answer = await prisma.answer.create({
      data: {
        questionId,
        interviewId: id,
        transcript,
        score: evaluation.score,
        feedback: evaluation.feedback,
      },
    });

    res.json({ answer, evaluation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit answer";
    res.status(500).json({ message });
  }
}

export async function getResult(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        questions: {
          include: { answers: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    const iv = interview as Interview & { questions: (Question & { answers: Answer[] })[] };

    const totalScore = iv.questions.reduce(
      (sum: number, q: Question & { answers: Answer[] }) => sum + (q.answers[0]?.score ?? 0),
      0
    );
    const avgScore = iv.questions.length > 0
      ? Math.round(totalScore / iv.questions.length)
      : 0;

    res.json({
      id: iv.id,
      status: iv.status,
      averageScore: avgScore,
      questions: iv.questions.map((q: Question & { answers: Answer[] }) => ({
        question: q.question,
        category: q.category,
        answer: q.answers[0]?.transcript ?? null,
        score: q.answers[0]?.score ?? null,
        feedback: q.answers[0]?.feedback ?? null,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get results";
    res.status(500).json({ message });
  }
}
