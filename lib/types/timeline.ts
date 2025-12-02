export enum PathType {
  STANDARD = 'STANDARD',
  TIMELINE_1_MONTH = 'TIMELINE_1_MONTH',
  TIMELINE_3_MONTHS = 'TIMELINE_3_MONTHS',
  TIMELINE_6_MONTHS = 'TIMELINE_6_MONTHS',
  CUSTOM = 'CUSTOM'
}

export enum MasteryLevel {
  BASIC = 'BASIC',          // For 1-month timeline - just enough to pass
  STANDARD = 'STANDARD',       // For 3-month timeline - good understanding
  ADVANCED = 'ADVANCED'       // For 6-month timeline - deep mastery
}

export interface TimelinePath {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  durationWeeks: number;
  difficulty: string;
  targetCompanies: string[];
  pathType: PathType;
  intensityLevel: number;
  estimatedHoursPerDay: number;
  priorityTopics?: string[];
  optionalContent?: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineProgress {
  // Basic progress
  currentWeek: number;
  currentDay: number;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  
  // Timeline-specific metrics
  daysUntilInterview: number;
  weeksCompleted: number;
  weeksRemaining: number;
  isOnTrack: boolean;
  paceStatus: 'AHEAD' | 'ON_TRACK' | 'BEHIND' | 'CRITICAL';
  
  // Time-based metrics
  plannedHoursPerDay: number;
  actualHoursPerDay: number;
  totalPlannedHours: number;
  totalActualHours: number;
  efficiency: number; // actual/planned ratio
  
  // Predictive metrics
  estimatedCompletionDate: Date;
  bufferDaysRemaining: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Milestone progress
  milestonesCompleted: number;
  totalMilestones: number;
  nextMilestoneDeadline: Date;
  milestoneProgressPercentage: number;
}

export interface TimelineMilestone {
  id: string;
  learningPathId: string;
  title: string;
  description: string;
  emoji: string;
  targetDate: Date;
  bufferDays: number;
  isCritical: boolean;
  type: string;
  threshold: number;
  isActive: boolean;
  createdAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  userPathProgressId: string;
  startTime: Date;
  endTime?: Date;
  lessonsStudied: string[];
  topicsCovered: string[];
  timeSpent: number;
  focusScore: number;
  comprehensionScore: number;
  interruptions: number;
  effectiveness: number;
  deviceType?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentAdaptation {
  id: string;
  lessonId: string;
  pathType: PathType;
  masteryLevel: MasteryLevel;
  adaptedContent: Record<string, unknown>;
  estimatedTime: number;
  priority: number;
  isSkippable: boolean;
  learningObjectives: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaceAdjustment {
  id: string;
  userPathProgressId: string;
  adjustmentType: string;
  oldPace?: number;
  newPace?: number;
  reason?: string;
  impact?: string;
  automatic: boolean;
  createdAt: Date;
}

export interface TimelineAlert {
  id: string;
  userPathProgressId: string;
  alertType: string;
  severity: string;
  message: string;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt: Date;
}

export interface TimelineRecommendation {
  pathType: PathType;
  title: string;
  description: string;
  intensity: string;
  hoursPerDay: number;
  totalHours: number;
  topics: string[];
  pros: string[];
  cons: string[];
  recommendedFor: string;
  interviewDate?: Date;
}

export interface PathComparison {
  oneMonth: TimelineRecommendation;
  threeMonths: TimelineRecommendation;
  sixMonths: TimelineRecommendation;
  userInterviewDate?: Date;
  recommendedPath: PathType;
  reasoning: string;
}

export interface UserPathProgressWithTimeline {
  id: string;
  userId: string;
  learningPathId: string;
  currentWeek: number;
  currentDay: number;
  completedLessons: number;
  totalLessons: number;
  startedAt: Date;
  lastActivityAt: Date;
  completedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Timeline-specific fields
  targetInterviewDate?: Date;
  originalTargetDate?: Date;
  paceAdjustments?: any;
  timeSpentVsPlanned?: number;
  deadlineAlerts?: any;
  completedMilestones: string[];
  studyStreak: number;
  longestStreak: number;
  weeklyGoals?: any;
  
  learningPath?: TimelinePath;
}