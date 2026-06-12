-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('Pre', 'InProgress', 'Done');

-- CreateEnum
CREATE TYPE "EmbeddingSourceType" AS ENUM ('GITHUB_REPO', 'GITHUB_README', 'GITHUB_CODE', 'GITHUB_LANGUAGES', 'LINKEDIN_PROFILE', 'LINKEDIN_EXPERIENCE', 'LINKEDIN_EDUCATION', 'LINKEDIN_SKILLS', 'RESUME');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('TECHNICAL', 'BEHAVIORAL', 'PROJECT_DEEP_DIVE', 'SKILL_ASSESSMENT', 'SYSTEM_DESIGN', 'CODING');

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "candidateName" TEXT,
    "jobRole" TEXT,
    "experienceLevel" TEXT,
    "githubMetaData" JSONB,
    "linkedinMetaData" JSONB,
    "status" "InterviewStatus" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embedding" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "sourceType" "EmbeddingSourceType" NOT NULL,
    "chunkText" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "question" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "transcript" TEXT,
    "audioUrl" TEXT,
    "score" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Embedding_interviewId_idx" ON "Embedding"("interviewId");

-- CreateIndex
CREATE INDEX "Embedding_sourceType_idx" ON "Embedding"("sourceType");

-- CreateIndex
CREATE INDEX "Question_interviewId_idx" ON "Question"("interviewId");

-- CreateIndex
CREATE INDEX "Question_interviewId_order_idx" ON "Question"("interviewId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Question_interviewId_order_key" ON "Question"("interviewId", "order");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE INDEX "Answer_interviewId_idx" ON "Answer"("interviewId");

-- AddForeignKey
ALTER TABLE "Embedding" ADD CONSTRAINT "Embedding_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
