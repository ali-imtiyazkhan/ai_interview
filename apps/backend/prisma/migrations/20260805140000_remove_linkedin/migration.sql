-- DeleteEmbeddings
DELETE FROM "Embedding" WHERE "sourceType" IN ('LINKEDIN_PROFILE', 'LINKEDIN_EXPERIENCE', 'LINKEDIN_EDUCATION', 'LINKEDIN_SKILLS');

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "linkedinMetaData";

-- CreateEnum
CREATE TYPE "EmbeddingSourceType_new" AS ENUM ('GITHUB_REPO', 'GITHUB_README', 'GITHUB_CODE', 'GITHUB_LANGUAGES', 'RESUME', 'RESUME_REPO');

-- AlterTable
ALTER TABLE "Embedding" ALTER COLUMN "sourceType" TYPE "EmbeddingSourceType_new" USING ("sourceType"::text::"EmbeddingSourceType_new");

-- DropEnum
DROP TYPE "EmbeddingSourceType";

-- RenameEnum
ALTER TYPE "EmbeddingSourceType_new" RENAME TO "EmbeddingSourceType";
