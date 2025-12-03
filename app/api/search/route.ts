import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        message: 'Query too short',
      });
    }

    const searchTerm = query.trim().toLowerCase();

    // Search lessons
    const lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
      },
      take: 20,
    });

    // Search jobs
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { company: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        type: true,
        location: true,
      },
      take: 10,
    });

    // Build results array
    const results: any[] = [
      // Lessons
      ...lessons.map(lesson => ({
        id: lesson.id,
        type: 'lesson',
        title: lesson.title,
        description: lesson.description || '',
        url: `/lessons/${lesson.id}`,
        metadata: {
          difficulty: lesson.difficulty,
        },
      })),

      // Jobs
      ...jobs.map(job => ({
        id: job.id,
        type: 'job',
        title: job.title,
        description: job.description,
        url: `/jobs?highlight=${job.id}`,
        metadata: {
          company: job.company,
          duration: job.type,
        },
      })),
    ];

    // Add learning path results (hardcoded for now)
    const pathKeywords = ['path', 'roadmap', 'learning', 'course', 'track'];
    if (pathKeywords.some(keyword => searchTerm.includes(keyword))) {
      results.push({
        id: 'paths',
        type: 'path',
        title: 'Learning Paths',
        description: 'Explore structured learning paths for interview preparation',
        url: '/paths',
        metadata: {
          company: 'All Companies',
          duration: 'Various',
        },
      });
    }

    // Company-specific searches
    if (searchTerm.includes('google')) {
      results.push({
        id: 'google-path',
        type: 'path',
        title: 'Google Interview Preparation',
        description: '12-week structured path for Google interviews',
        url: '/paths',
        metadata: {
          company: 'Google',
          duration: '12 weeks',
        },
      });
    }

    if (searchTerm.includes('amazon')) {
      results.push({
        id: 'amazon-path',
        type: 'path',
        title: 'Amazon Interview Preparation',
        description: '10-week path covering Amazon Leadership Principles',
        url: '/paths',
        metadata: {
          company: 'Amazon',
          duration: '10 weeks',
        },
      });
    }

    // Topic-specific searches
    const topicMappings: Record<string, string[]> = {
      'javascript': ['JavaScript Fundamentals', 'Advanced JavaScript'],
      'react': ['React Basics', 'React Advanced Patterns'],
      'dsa': ['Data Structures', 'Algorithms'],
      'system design': ['System Design Fundamentals', 'Scalable Systems'],
    };

    for (const [keyword, topics] of Object.entries(topicMappings)) {
      if (searchTerm.includes(keyword)) {
        topics.forEach((topic, idx) => {
          results.push({
            id: `topic-${keyword}-${idx}`,
            type: 'lesson',
            title: topic,
            description: `Learn ${topic} for interview preparation`,
            url: '/lessons',
            metadata: {
              module: keyword.toUpperCase(),
            },
          });
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
      query,
    });

  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
