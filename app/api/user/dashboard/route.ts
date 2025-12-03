import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user with learning path
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        learningPath: true,
        learningPathProgress: true,
      },
    });

    // Get lesson progress count
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: { userId },
      select: {
        completedAt: true,
        timeSpentSeconds: true,
      },
    });

    const completedLessons = lessonProgress.filter(p => p.completedAt).length;
    const totalTimeSpent = lessonProgress.reduce((sum, p) => sum + p.timeSpentSeconds, 0);

    // Get mock interview stats
    const interviews = await prisma.interviewSession.findMany({
      where: { userId },
      select: {
        status: true,
        createdAt: true,
        report: {
          select: {
            overallScore: true,
          },
        },
      },
    });

    const completedInterviews = interviews.filter(i => i.status === 'COMPLETED');
    const scores = completedInterviews
      .map(i => i.report?.overallScore)
      .filter((score): score is number => score !== null && score !== undefined);
    
    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    const lastInterview = completedInterviews.length > 0
      ? completedInterviews[completedInterviews.length - 1].createdAt
      : null;

    // Calculate learning path progress
    let pathProgress = 0;
    let totalLessons = 0;
    if (user?.learningPathProgress) {
      try {
        const progress = JSON.parse(user.learningPathProgress as string);
        if (user.learningPath && progress[user.learningPath]) {
          pathProgress = progress[user.learningPath];
        }
      } catch (error) {
        console.error('Failed to parse learning path progress:', error);
      }
    }

    // Get total lessons (simplified - you'd calculate based on the actual path)
    totalLessons = completedLessons > 0 ? Math.ceil(completedLessons / (pathProgress / 100 || 0.01)) : 100;

    // Recent activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentProgress = lessonProgress.filter(p => {
      const startedAt = new Date(p.completedAt || 0);
      return startedAt >= oneWeekAgo;
    });

    const recentCompletedLessons = recentProgress.filter(p => p.completedAt).length;
    const recentTimeSpent = recentProgress.reduce((sum, p) => sum + p.timeSpentSeconds, 0);

    // Get last activity
    const lastActivity = lessonProgress.length > 0
      ? lessonProgress.sort((a, b) => {
          const dateA = new Date(a.completedAt || 0);
          const dateB = new Date(b.completedAt || 0);
          return dateB.getTime() - dateA.getTime();
        })[0].completedAt
      : null;

    // Generate recommendations
    const recommendations = [];

    if (completedLessons === 0) {
      recommendations.push({
        type: 'lesson',
        title: 'Start Your First Lesson',
        description: 'Begin your interview prep journey with our curated content',
        action: 'Start Learning',
        url: '/lessons',
      });
    }

    if (interviews.length === 0) {
      recommendations.push({
        type: 'interview',
        title: 'Try a Mock Interview',
        description: 'Practice with AI to build confidence before real interviews',
        action: 'Start Interview',
        url: '/mock-interview/setup',
      });
    }

    if (!user?.learningPath) {
      recommendations.push({
        type: 'path',
        title: 'Choose a Learning Path',
        description: 'Get a structured roadmap tailored to your goals',
        action: 'View Paths',
        url: '/paths',
      });
    }

    if (completedLessons >= 10 && interviews.length === 0) {
      recommendations.push({
        type: 'interview',
        title: 'Test Your Knowledge',
        description: "You've completed 10+ lessons. Try a mock interview!",
        action: 'Practice Now',
        url: '/mock-interview/setup',
      });
    }

    // Generate goals
    const upcomingGoals = [];

    if (user?.learningPath) {
      upcomingGoals.push({
        title: 'Complete Current Module',
        description: 'Finish all lessons in your current learning module',
        progress: pathProgress,
        dueDate: null,
      });
    }

    if (completedLessons < 50) {
      upcomingGoals.push({
        title: 'Complete 50 Lessons',
        description: 'Build a strong foundation across all topics',
        progress: Math.min(100, (completedLessons / 50) * 100),
        dueDate: null,
      });
    }

    if (interviews.length < 5) {
      upcomingGoals.push({
        title: 'Complete 5 Mock Interviews',
        description: 'Get comfortable with interview formats',
        progress: Math.min(100, (interviews.length / 5) * 100),
        dueDate: null,
      });
    }

    const dashboardData = {
      learningPath: {
        current: user?.learningPath || null,
        progress: Math.round(pathProgress),
        totalLessons,
        completedLessons,
      },
      recentActivity: {
        lessonsCompleted: recentCompletedLessons,
        timeSpent: recentTimeSpent,
        lastActive: lastActivity,
      },
      mockInterviews: {
        total: interviews.length,
        averageScore,
        lastInterview,
      },
      upcomingGoals,
      recommendations,
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
