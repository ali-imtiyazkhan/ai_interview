-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('GENERAL', 'DSA');

-- AlterEnum
ALTER TYPE "QuestionCategory" ADD VALUE 'DSA';

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mode" "InterviewMode" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[];
