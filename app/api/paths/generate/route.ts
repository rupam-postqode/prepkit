import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { DynamicPathGenerator, PathGenerationRule } from '@/lib/dynamic-path-generator';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { templateId, customRules, previewOnly = false } = body;

    if (!templateId && !customRules) {
      return NextResponse.json(
        { error: 'Either templateId or customRules is required' },
        { status: 400 }
      );
    }

    const generator = new DynamicPathGenerator();
    let rules: PathGenerationRule;

    if (templateId) {
      // Use template rules
      const template = await prisma.pathTemplate.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      // Extract rules from template
      rules = {
        includeModules: template.includeModules ? template.includeModules.split(',').map(m => m.trim()) : [],
        excludeModules: template.excludeModules ? template.excludeModules.split(',').map(m => m.trim()) : [],
        minDifficulty: template.minDifficulty || undefined,
        maxDifficulty: template.maxDifficulty || undefined,
        lessonsPerDay: template.lessonsPerDay,
        daysPerWeek: template.daysPerWeek,
        estimatedHoursPerDay: template.estimatedHoursPerDay,
        targetDurationWeeks: template.durationWeeks,
        balanceTheoryPractice: true, // Default for templates
        companyFocus: [], // Can be extracted from template rules if needed
        ...(template.rules as Record<string, unknown>), // Merge custom rules from template
      };
    } else {
      // Use custom rules
      rules = customRules;
    }

    // Validate rules
    if (!rules.lessonsPerDay || !rules.daysPerWeek || !rules.estimatedHoursPerDay || !rules.targetDurationWeeks) {
      return NextResponse.json(
        { error: 'Missing required rule properties: lessonsPerDay, daysPerWeek, estimatedHoursPerDay, targetDurationWeeks' },
        { status: 400 }
      );
    }

    // Generate the path
    const result = await generator.generatePath(rules);

    if (previewOnly) {
      return NextResponse.json({
        success: true,
        preview: result,
        rules,
      });
    }

    // If not preview, create the actual path
    if (!templateId) {
      return NextResponse.json(
        { error: 'TemplateId is required when creating actual paths' },
        { status: 400 }
      );
    }

    // Generate a unique title
    const template = await prisma.pathTemplate.findUnique({
      where: { id: templateId },
    });

    const pathTitle = `${template?.name || 'Custom Path'} - Generated ${new Date().toLocaleDateString()}`;
    const pathDescription = `Dynamically generated learning path based on ${template?.name || 'custom rules'}. Duration: ${result.actualDurationWeeks} weeks, ${result.totalLessons} lessons.`;

    const learningPathId = await generator.createPathFromSchedule(
      templateId,
      result.schedule,
      pathTitle,
      pathDescription,
      template?.emoji || '🎯'
    );

    return NextResponse.json({
      success: true,
      learningPathId,
      pathDetails: {
        id: learningPathId,
        title: pathTitle,
        description: pathDescription,
        emoji: template?.emoji || '🎯',
        ...result,
      },
      rules,
    });

  } catch (error) {
    console.error('Error generating dynamic path:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get available templates
    const templates = await prisma.pathTemplate.findMany({
      where: { isActive: true },
      orderBy: { durationWeeks: 'asc' },
    });

    // Get content statistics for preview
    const generator = new DynamicPathGenerator();
    const allContent = await generator.fetchAvailableContent();

    const contentStats = {
      totalLessons: allContent.length,
      byModule: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      byType: {} as Record<string, number>,
    };

    allContent.forEach(lesson => {
      contentStats.byModule[lesson.moduleName] = 
        (contentStats.byModule[lesson.moduleName] || 0) + 1;
      contentStats.byDifficulty[lesson.difficulty] = 
        (contentStats.byDifficulty[lesson.difficulty] || 0) + 1;
      contentStats.byType[lesson.contentType] = 
        (contentStats.byType[lesson.contentType] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      templates,
      contentStats,
    });

  } catch (error) {
    console.error('Error fetching path generation data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
