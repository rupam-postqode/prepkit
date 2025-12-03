import { prisma } from "@/lib/db";
import { generateInterviewQuestions, InterviewSetup, InterviewQuestion } from "./gemini/questionGenerator";
import { generateInterviewReport } from "./gemini/reportGenerator";
import { initializeVapiCall, getCallTranscript, parseTranscriptSegments } from "./vapi/callManager";
import { calculateInterviewCost, getEstimatedDuration } from "./pricingCalculator";

export interface CreateInterviewSessionInput {
  userId: string;
  type: string;
  difficulty: string;
  focusAreas: string[];
  specificRequirements?: string;
}

export interface InterviewSessionResponse {
  sessionId: string;
  questions: InterviewQuestion[];
  pricing: {
    userPrice: number;
    costPrice: number;
    margin: number;
    currency: string;
  };
  estimatedDuration: number;
}

export class InterviewService {
  /**
   * Create a new interview session and generate questions
   */
  async createInterviewSession(input: CreateInterviewSessionInput): Promise<InterviewSessionResponse> {
    try {
      // Estimate duration based on difficulty
      const estimatedDuration = getEstimatedDuration(input.difficulty);
      
      // Calculate pricing
      const pricing = calculateInterviewCost(input.difficulty, estimatedDuration);
      
      // Generate questions using Gemini
      const interviewSetup: InterviewSetup = {
        type: input.type,
        difficulty: input.difficulty,
        focusAreas: input.focusAreas,
        specificRequirements: input.specificRequirements,
        duration: estimatedDuration
      };
      
      const questions = await generateInterviewQuestions(interviewSetup);
      
      // Create session in database
      const session = await prisma.interviewSession.create({
        data: {
          userId: input.userId,
          type: input.type.toUpperCase().replace('-', '_') as any,
          difficulty: input.difficulty.toUpperCase() as any,
          status: 'SETUP',
          configuration: {
            focusAreas: input.focusAreas,
            specificRequirements: input.specificRequirements,
            duration: estimatedDuration
          },
          questionsGenerated: questions,
          costCalculated: pricing.userPrice,
          paymentStatus: 'CREATED'
        }
      });
      
      return {
        sessionId: session.id,
        questions,
        pricing,
        estimatedDuration
      };
    } catch (error) {
      console.error('Error creating interview session:', error);
      throw new Error('Failed to create interview session');
    }
  }

  /**
   * Start the voice interview with Vapi
   */
  async startInterview(sessionId: string, userId: string): Promise<{ callId: string; status: string }> {
    try {
      // Get session from database
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId }
      });
      
      if (!session) {
        throw new Error('Interview session not found');
      }
      
      if (session.userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      // Check payment status
      if (session.paymentStatus !== 'CAPTURED') {
        throw new Error('Payment required before starting interview');
      }
      
      const questions = session.questionsGenerated as any as InterviewQuestion[];
      
      // Initialize Vapi call
      const vapiResponse = await initializeVapiCall(
        sessionId,
        questions,
        userId,
        session.type
      );
      
      // Update session with Vapi call ID
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          vapiCallId: vapiResponse.id,
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      });
      
      return {
        callId: vapiResponse.id,
        status: vapiResponse.status
      };
    } catch (error) {
      console.error('Error starting interview:', error);
      throw error;
    }
  }

  /**
   * Complete the interview and generate report
   */
  async completeInterview(sessionId: string): Promise<void> {
    try {
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId }
      });
      
      if (!session || !session.vapiCallId) {
        throw new Error('Interview session not found or not started');
      }
      
      // Get transcript from Vapi
      const transcript = await getCallTranscript(session.vapiCallId);
      
      // Parse transcript segments
      const segments = parseTranscriptSegments(transcript);
      
      // Save transcript
      await prisma.interviewTranscript.create({
        data: {
          sessionId: session.id,
          rawTranscript: transcript,
          transcriptSegments: segments,
          confidenceScore: 0.95
        }
      });
      
      // Generate report using Gemini
      const questions = session.questionsGenerated as any as InterviewQuestion[];
      const report = await generateInterviewReport(
        sessionId,
        transcript,
        questions,
        session.type,
        session.difficulty
      );
      
      // Save report
      await prisma.interviewReport.create({
        data: {
          sessionId: session.id,
          overallScore: report.overallScore,
          scoreBreakdown: report.scoreBreakdown,
          strengths: report.strengths,
          weaknesses: report.weaknesses,
          recommendations: report.recommendations,
          detailedAnalysis: report.summary,
          reportJson: report
        }
      });
      
      // Update session
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          endedAt: new Date(),
          reportGenerated: true
        }
      });
      
      // Update user statistics
      await this.updateUserStatistics(session.userId, report.overallScore, session.type);
    } catch (error) {
      console.error('Error completing interview:', error);
      throw error;
    }
  }

  /**
   * Get interview report
   */
  async getInterviewReport(sessionId: string, userId: string) {
    try {
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
        include: {
          report: true
        }
      });
      
      if (!session) {
        throw new Error('Interview session not found');
      }
      
      if (session.userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      if (!session.report) {
        throw new Error('Report not yet generated');
      }
      
      return session.report;
    } catch (error) {
      console.error('Error getting interview report:', error);
      throw error;
    }
  }

  /**
   * Get interview history for a user
   */
  async getInterviewHistory(userId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [interviews, total] = await Promise.all([
        prisma.interviewSession.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          select: {
            id: true,
            type: true,
            difficulty: true,
            status: true,
            createdAt: true,
            durationSeconds: true,
            report: {
              select: {
                overallScore: true
              }
            }
          }
        }),
        prisma.interviewSession.count({ where: { userId } })
      ]);
      
      return {
        interviews: interviews.map(interview => ({
          sessionId: interview.id,
          type: interview.type,
          difficulty: interview.difficulty,
          status: interview.status,
          date: interview.createdAt,
          duration: interview.durationSeconds,
          score: interview.report?.overallScore || null
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting interview history:', error);
      throw error;
    }
  }

  /**
   * Update user statistics after interview completion
   */
  private async updateUserStatistics(userId: string, score: number, interviewType: string) {
    try {
      const stats = await prisma.interviewStatistics.findUnique({
        where: { userId }
      });
      
      if (stats) {
        // Update existing statistics
        const typeField = `${interviewType.toLowerCase().replace('_', '')}Interviews` as any;
        const totalInterviews = stats.totalInterviews + 1;
        const averageScore = Math.round(((stats.averageScore || 0) * stats.totalInterviews + score) / totalInterviews);
        
        await prisma.interviewStatistics.update({
          where: { userId },
          data: {
            totalInterviews,
            averageScore,
            [typeField]: (stats as any)[typeField] + 1,
            lastInterviewAt: new Date(),
            bestScoreAchieved: Math.max(stats.bestScoreAchieved || 0, score)
          }
        });
      } else {
        // Create new statistics
        const typeField = `${interviewType.toLowerCase().replace('_', '')}Interviews` as any;
        
        await prisma.interviewStatistics.create({
          data: {
            userId,
            totalInterviews: 1,
            averageScore: score,
            [typeField]: 1,
            lastInterviewAt: new Date(),
            bestScoreAchieved: score
          }
        });
      }
    } catch (error) {
      console.error('Error updating user statistics:', error);
      // Don't throw - statistics update shouldn't fail the interview completion
    }
  }
}

export const interviewService = new InterviewService();
