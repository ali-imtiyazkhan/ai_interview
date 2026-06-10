-- CreateEnum
CREATE TYPE "MessagesType" AS ENUM ('User', 'Assistant');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('Pre', 'Inprogress', 'Done');

-- CreateTable
CREATE TABLE "InterView" (
    "id" TEXT NOT NULL,
    "githunMetaData" JSONB NOT NULL,
    "linkdinMataData" JSONB NOT NULL,
    "status" "InterviewStatus" NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "InterView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "MessagesType" NOT NULL,
    "interViewId" TEXT,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_interViewId_fkey" FOREIGN KEY ("interViewId") REFERENCES "InterView"("id") ON DELETE SET NULL ON UPDATE CASCADE;
