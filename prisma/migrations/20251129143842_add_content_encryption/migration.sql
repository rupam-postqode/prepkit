-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('LESSONS_COMPLETED', 'CONSECUTIVE_DAYS', 'WEEK_COMPLETED', 'PATH_COMPLETED', 'STREAK_MAINTAINED', 'FIRST_LESSON', 'SPEED_LEARNER');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "contentHash" TEXT,
ADD COLUMN     "encryptedContent" TEXT,
ADD COLUMN     "encryptionIv" TEXT,
ADD COLUMN     "encryptionKey" TEXT,
ADD COLUMN     "encryptionTag" TEXT,
ADD COLUMN     "keyVersion" TEXT;

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '🎉',
    "type" "MilestoneType" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "pathSpecific" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pathId" TEXT,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LearningPathToMilestone" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LearningPathToMilestone_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Milestone_type_idx" ON "Milestone"("type");

-- CreateIndex
CREATE INDEX "Milestone_isActive_idx" ON "Milestone"("isActive");

-- CreateIndex
CREATE INDEX "Achievement_userId_idx" ON "Achievement"("userId");

-- CreateIndex
CREATE INDEX "Achievement_milestoneId_idx" ON "Achievement"("milestoneId");

-- CreateIndex
CREATE INDEX "Achievement_pathId_idx" ON "Achievement"("pathId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_userId_milestoneId_key" ON "Achievement"("userId", "milestoneId");

-- CreateIndex
CREATE INDEX "_LearningPathToMilestone_B_index" ON "_LearningPathToMilestone"("B");

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningPathToMilestone" ADD CONSTRAINT "_LearningPathToMilestone_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningPathToMilestone" ADD CONSTRAINT "_LearningPathToMilestone_B_fkey" FOREIGN KEY ("B") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
