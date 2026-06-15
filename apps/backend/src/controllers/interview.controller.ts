import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { generateQuestions, evaluateAnswer } from "../services/interview.service";
import type { Interview, Embedding, Question, Answer } from "../../generated/prisma/client";

async function buildStartResponse(interviewId: string, questions: Question[]) {
  const answered = await prisma.answer.findMany({
    where: { interviewId },
    select: { questionId: true },
  });

  return {
    questions,
    answeredQuestionIds: answered.map((a) => a.questionId),
  };
}

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

    const existingQuestions = await prisma.question.findMany({
      where: { interviewId: id },
      orderBy: { order: "asc" },
    });

    if (existingQuestions.length > 0) {
      res.json(await buildStartResponse(id, existingQuestions));
      return;
    }

    const ctx = interview as Interview & { embeddings: Embedding[] };

    const metadataParts: string[] = [];
    if (ctx.candidateName) metadataParts.push(`Name: ${ctx.candidateName}`);
    if (ctx.jobRole) metadataParts.push(`Target Role: ${ctx.jobRole}`);
    if (ctx.experienceLevel) metadataParts.push(`Experience Level: ${ctx.experienceLevel}`);

    const context = [
      ...metadataParts,
      ...ctx.embeddings.map((e: Embedding) => `[${e.sourceType}] ${e.chunkText}`),
    ].join("\n\n");

    const generated = await generateQuestions({
      context: context || "No candidate data available yet",
      count: 5,
      categories: ["TECHNICAL", "BEHAVIORAL", "PROJECT_DEEP_DIVE", "SKILL_ASSESSMENT", "SYSTEM_DESIGN"],
    });

    const questions = await prisma.$transaction(async (tx) => {
      const count = await tx.question.count({ where: { interviewId: id } });
      if (count > 0) {
        return tx.question.findMany({
          where: { interviewId: id },
          orderBy: { order: "asc" },
        });
      }

      const created = await Promise.all(
        generated.map((q: { question: string; category: string }, i: number) =>
          tx.question.create({
            data: {
              interviewId: id,
              category: q.category as Question["category"],
              question: q.question,
              order: i + 1,
            },
          })
        )
      );

      await tx.interview.update({
        where: { id },
        data: { status: "InProgress" },
      });

      return created;
    });

    res.json(await buildStartResponse(id, questions));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start interview";
    res.status(500).json({ message });
  }
}

export async function submitAnswer(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { questionId, transcript, audioUrl } = req.body as {
      questionId: string;
      transcript?: string;
      audioUrl?: string;
    };

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { interview: true },
    });

    if (!question || question.interviewId !== id) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    // Check for duplicate answer
    const existingAnswer = await prisma.answer.findFirst({
      where: { questionId, interviewId: id },
    });
    if (existingAnswer) {
      res.status(409).json({ message: "This question has already been answered" });
      return;
    }

    const embeddings = await prisma.embedding.findMany({ where: { interviewId: id } });
    const context = embeddings.map((e: Embedding) => e.chunkText).join("\n\n");

    // Evaluate
    const evaluation = await evaluateAnswer(question.question, context, transcript ?? "");

    // Save answer (strengths/weaknesses embedded in feedback as structured JSON)
    const feedbackParts = [evaluation.feedback];
    if (evaluation.strengths?.length) {
      feedbackParts.push("\n\n---STRENGTHS---\n" + (evaluation.strengths as string[]).map((s) => `- ${s}`).join("\n"));
    }
    if (evaluation.weaknesses?.length) {
      feedbackParts.push("\n\n---WEAKNESSES---\n" + (evaluation.weaknesses as string[]).map((w) => `- ${w}`).join("\n"));
    }

    const answer = await prisma.answer.create({
      data: {
        questionId,
        interviewId: id,
        transcript: transcript ?? null,
        audioUrl: audioUrl ?? null,
        score: evaluation.score,
        feedback: feedbackParts.join(""),
      },
    });

    // Check if all questions answered → mark interview as Done
    const totalQuestions = await prisma.question.count({ where: { interviewId: id } });
    const answeredQuestions = await prisma.answer.groupBy({
      by: ["questionId"],
      where: { interviewId: id },
    });
    if (totalQuestions > 0 && answeredQuestions.length >= totalQuestions) {
      const answers = await prisma.answer.findMany({
        where: { interviewId: id },
        select: { score: true },
      });
      const averageScore =
        answers.length > 0
          ? Math.round(answers.reduce((sum, a) => sum + (a.score ?? 0), 0) / answers.length)
          : 0;

      await prisma.interview.update({
        where: { id },
        data: { status: "Done", score: averageScore },
      });
    }

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

    function parseStrengths(fb: string | null): string[] | null {
      if (!fb) return null;
      const m = fb.match(/---STRENGTHS---\n([\s\S]*?)(?:\n\n---WEAKNESSES---|$)/);
      if (!m?.[1]) return null;
      return m[1].split("\n").map((s: string) => s.replace(/^- /, "")).filter(Boolean);
    }

    function parseWeaknesses(fb: string | null): string[] | null {
      if (!fb) return null;
      const m = fb.match(/---WEAKNESSES---\n([\s\S]*)$/);
      if (!m?.[1]) return null;
      return m[1].split("\n").map((s: string) => s.replace(/^- /, "")).filter(Boolean);
    }

    res.json({
      id: iv.id,
      status: iv.status,
      candidateName: iv.candidateName,
      jobRole: iv.jobRole,
      experienceLevel: iv.experienceLevel,
      averageScore: avgScore,
      questions: iv.questions.map((q: Question & { answers: Answer[] }) => {
        const fb = q.answers[0]?.feedback ?? null;
        return {
          question: q.question,
          category: q.category,
          answer: q.answers[0]?.transcript ?? null,
          audioUrl: q.answers[0]?.audioUrl ?? null,
          score: q.answers[0]?.score ?? null,
          feedback: fb?.replace(/---STRENGTHS---[\s\S]*$/, "").trim() ?? null,
          strengths: parseStrengths(fb),
          weaknesses: parseWeaknesses(fb),
        };
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get results";
    res.status(500).json({ message });
  }
}
