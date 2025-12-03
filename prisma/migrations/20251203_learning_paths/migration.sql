-- Add learning path fields to User table
ALTER TABLE "User" ADD COLUMN "learningPath" TEXT;
ALTER TABLE "User" ADD COLUMN "learningPathProgress" TEXT;
