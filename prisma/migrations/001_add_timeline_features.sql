-- Add timeline-based learning path features
-- Migration: 001_add_timeline_features.sql

-- Add new enums
CREATE TYPE "PathType" AS ENUM ('STANDARD', 'TIMELINE_1_MONTH', 'TIMELINE_3_MONTHS', 'TIMELINE_6_MONTHS', 'CUSTOM');
CREATE TYPE "MasteryLevel" AS ENUM ('BASIC', 'STANDARD', 'ADVANCED');

-- Add timeline-specific fields to LearningPath
ALTER TABLE "LearningPath" 
ADD COLUMN "pathType" "PathType" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN "intensityLevel" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN "estimatedHoursPerDay" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
ADD COLUMN "priorityTopics" JSONB,
ADD COLUMN "optionalContent" JSONB;

-- Add indexes for LearningPath
CREATE INDEX "LearningPath_pathType_idx" ON "LearningPath"("pathType");

-- Add timeline-specific fields to UserPathProgress
ALTER TABLE "UserPathProgress" 
ADD COLUMN "targetInterviewDate" TIMESTAMP(3),
ADD COLUMN "originalTargetDate" TIMESTAMP(3),
ADD COLUMN "paceAdjustments" JSONB,
ADD COLUMN "timeSpentVsPlanned" DOUBLE PRECISION,
ADD COLUMN "deadlineAlerts" JSONB,
ADD COLUMN "completedMilestones" TEXT[],
ADD COLUMN "studyStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "longestStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "weeklyGoals" JSONB;

-- Add indexes for UserPathProgress
CREATE INDEX "UserPathProgress_targetInterviewDate_idx" ON "UserPathProgress"("targetInterviewDate");

-- Add timeline-specific fields to PathLesson
ALTER TABLE "PathLesson" 
ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN "isSkippable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "dependencies" TEXT[],
ADD COLUMN "masteryLevel" "MasteryLevel" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN "adaptiveContent" JSONB;

-- Add indexes for PathLesson
CREATE INDEX "PathLesson_priority_idx" ON "PathLesson"("priority", "weekNumber", "dayNumber");

-- Create TimelineMilestones table
CREATE TABLE "TimelineMilestone" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '🎉',
    "targetDate" TIMESTAMP(3) NOT NULL,
    "bufferDays" INTEGER NOT NULL DEFAULT 0,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "type" "MilestoneType" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineMilestone_pkey" PRIMARY KEY ("id")
);

-- Add indexes for TimelineMilestone
CREATE INDEX "TimelineMilestone_learningPathId_targetDate_idx" ON "TimelineMilestone"("learningPathId", "targetDate");
CREATE INDEX "TimelineMilestone_isCritical_targetDate_idx" ON "TimelineMilestone"("isCritical", "targetDate");

-- Create StudySession table
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userPathProgressId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "lessonsStudied" TEXT[],
    "topicsCovered" TEXT[],
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "focusScore" INTEGER NOT NULL DEFAULT 0,
    "comprehensionScore" INTEGER NOT NULL DEFAULT 0,
    "interruptions" INTEGER NOT NULL DEFAULT 0,
    "effectiveness" INTEGER NOT NULL DEFAULT 0,
    "deviceType" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- Add indexes for StudySession
CREATE INDEX "StudySession_userId_startTime_idx" ON "StudySession"("userId", "startTime" DESC);
CREATE INDEX "StudySession_userPathProgressId_startTime_idx" ON "StudySession"("userPathProgressId", "startTime" DESC);
CREATE INDEX "StudySession_effectiveness_idx" ON "StudySession"("effectiveness" DESC);

-- Create ContentAdaptation table
CREATE TABLE "ContentAdaptation" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "pathType" "PathType" NOT NULL,
    "masteryLevel" "MasteryLevel" NOT NULL,
    "adaptedContent" JSONB NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 2,
    "isSkippable" BOOLEAN NOT NULL DEFAULT false,
    "learningObjectives" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentAdaptation_pkey" PRIMARY KEY ("id")
);

-- Add indexes for ContentAdaptation
CREATE INDEX "ContentAdaptation_lessonId_pathType_idx" ON "ContentAdaptation"("lessonId", "pathType");
CREATE INDEX "ContentAdaptation_masteryLevel_priority_idx" ON "ContentAdaptation"("masteryLevel", "priority");

-- Create PaceAdjustment table
CREATE TABLE "PaceAdjustment" (
    "id" TEXT NOT NULL,
    "userPathProgressId" TEXT NOT NULL,
    "adjustmentType" TEXT,
    "oldPace" DOUBLE PRECISION,
    "newPace" DOUBLE PRECISION,
    "reason" TEXT,
    "impact" TEXT,
    "automatic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaceAdjustment_pkey" PRIMARY KEY ("id")
);

-- Add indexes for PaceAdjustment
CREATE INDEX "PaceAdjustment_userPathProgressId_idx" ON "PaceAdjustment"("userPathProgressId");
CREATE INDEX "PaceAdjustment_createdAt_idx" ON "PaceAdjustment"("createdAt");

-- Create TimelineAlert table
CREATE TABLE "TimelineAlert" (
    "id" TEXT NOT NULL,
    "userPathProgressId" TEXT NOT NULL,
    "alertType" TEXT,
    "severity" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "actionRequired" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineAlert_pkey" PRIMARY KEY ("id")
);

-- Add indexes for TimelineAlert
CREATE INDEX "TimelineAlert_userPathProgressId_isRead_idx" ON "TimelineAlert"("userPathProgressId", "isRead");
CREATE INDEX "TimelineAlert_scheduledFor_idx" ON "TimelineAlert"("scheduledFor") WHERE "sentAt" IS NULL;

-- Add foreign key constraints
ALTER TABLE "TimelineMilestone" 
ADD CONSTRAINT "TimelineMilestone_learningPathId_fkey" 
FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE;

ALTER TABLE "StudySession" 
ADD CONSTRAINT "StudySession_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
ADD CONSTRAINT "StudySession_userPathProgressId_fkey" 
FOREIGN KEY ("userPathProgressId") REFERENCES "UserPathProgress"("id") ON DELETE CASCADE;

ALTER TABLE "ContentAdaptation" 
ADD CONSTRAINT "ContentAdaptation_lessonId_fkey" 
FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE;

ALTER TABLE "PaceAdjustment" 
ADD CONSTRAINT "PaceAdjustment_userPathProgressId_fkey" 
FOREIGN KEY ("userPathProgressId") REFERENCES "UserPathProgress"("id") ON DELETE CASCADE;

ALTER TABLE "TimelineAlert" 
ADD CONSTRAINT "TimelineAlert_userPathProgressId_fkey" 
FOREIGN KEY ("userPathProgressId") REFERENCES "UserPathProgress"("id") ON DELETE CASCADE;