-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "generatedFromJson" TEXT,
ADD COLUMN     "isDynamic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "templateId" TEXT;

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "razorpayRefundId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "RefundStatus" NOT NULL DEFAULT 'PROCESSED',
    "reason" TEXT,
    "processedBy" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '🎯',
    "durationWeeks" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "targetAudience" TEXT NOT NULL,
    "rules" JSONB NOT NULL,
    "includeModules" TEXT[],
    "excludeModules" TEXT[],
    "minDifficulty" "Difficulty",
    "maxDifficulty" "Difficulty",
    "lessonsPerDay" INTEGER NOT NULL DEFAULT 2,
    "daysPerWeek" INTEGER NOT NULL DEFAULT 5,
    "estimatedHoursPerDay" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PathTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentMetadata" (
    "lessonId" TEXT NOT NULL,
    "difficultyScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "complexityScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 60,
    "readingMinutes" INTEGER NOT NULL DEFAULT 30,
    "practiceMinutes" INTEGER NOT NULL DEFAULT 30,
    "topics" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "prerequisites" JSONB NOT NULL,
    "companyRelevance" JSONB NOT NULL,
    "objectives" JSONB NOT NULL,
    "contentType" TEXT NOT NULL,
    "interactiveLevel" TEXT NOT NULL,
    "lastAnalyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysisVersion" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentMetadata_pkey" PRIMARY KEY ("lessonId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Refund_razorpayRefundId_key" ON "Refund"("razorpayRefundId");

-- CreateIndex
CREATE INDEX "Refund_paymentId_idx" ON "Refund"("paymentId");

-- CreateIndex
CREATE INDEX "Refund_status_idx" ON "Refund"("status");

-- CreateIndex
CREATE INDEX "PathTemplate_isActive_idx" ON "PathTemplate"("isActive");

-- CreateIndex
CREATE INDEX "PathTemplate_durationWeeks_idx" ON "PathTemplate"("durationWeeks");

-- CreateIndex
CREATE INDEX "ContentMetadata_difficultyScore_idx" ON "ContentMetadata"("difficultyScore");

-- CreateIndex
CREATE INDEX "ContentMetadata_complexityScore_idx" ON "ContentMetadata"("complexityScore");

-- CreateIndex
CREATE INDEX "ContentMetadata_contentType_idx" ON "ContentMetadata"("contentType");

-- CreateIndex
CREATE INDEX "LearningPath_isDynamic_idx" ON "LearningPath"("isDynamic");

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PathTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
