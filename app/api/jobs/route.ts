import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    // Build filter conditions
    const where: any = {
      isActive: true,
    };

    if (type && type !== 'all') {
      where.type = type;
    }

    if (location && location !== 'all') {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch jobs
    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        experience: true,
        salary: true,
        description: true,
        requirements: true,
        externalUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length,
    });

  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
