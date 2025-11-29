-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '🎯',
    "durationWeeks" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "targetCompanies" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathLesson" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "estimatedHours" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPathProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "completedLessons" INTEGER NOT NULL DEFAULT 0,
    "totalLessons" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPathProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE INDEX "LearningPath_isActive_idx" ON "LearningPath"("isActive");

-- CreateIndex
CREATE INDEX "LearningPath_durationWeeks_idx" ON "LearningPath"("durationWeeks");

-- CreateIndex
CREATE INDEX "PathLesson_learningPathId_idx" ON "PathLesson"("learningPathId");

-- CreateIndex
CREATE INDEX "PathLesson_lessonId_idx" ON "PathLesson"("lessonId");

-- CreateIndex
CREATE INDEX "PathLesson_weekNumber_dayNumber_idx" ON "PathLesson"("weekNumber", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PathLesson_learningPathId_lessonId_key" ON "PathLesson"("learningPathId", "lessonId");

-- CreateIndex
CREATE INDEX "UserPathProgress_userId_idx" ON "UserPathProgress"("userId");

-- CreateIndex
CREATE INDEX "UserPathProgress_learningPathId_idx" ON "UserPathProgress"("learningPathId");

-- CreateIndex
CREATE INDEX "UserPathProgress_isActive_idx" ON "UserPathProgress"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UserPathProgress_userId_learningPathId_key" ON "UserPathProgress"("userId", "learningPathId");

-- AddForeignKey
ALTER TABLE "PathLesson" ADD CONSTRAINT "PathLesson_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathLesson" ADD CONSTRAINT "PathLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPathProgress" ADD CONSTRAINT "UserPathProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPathProgress" ADD CONSTRAINT "UserPathProgress_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;
