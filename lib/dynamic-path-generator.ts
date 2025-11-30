import { prisma } from './db';
import { Difficulty } from '@prisma/client';

export interface PathGenerationRule {
  includeModules?: string[];
  excludeModules?: string[];
  minDifficulty?: Difficulty;
  maxDifficulty?: Difficulty;
  lessonsPerDay: number;
  daysPerWeek: number;
  estimatedHoursPerDay: number;
  targetDurationWeeks: number;
  balanceTheoryPractice?: boolean;
  companyFocus?: string[];
}

export interface LessonWithMetadata {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  moduleId: string;
  moduleName: string;
  chapterId: string;
  chapterTitle: string;
  estimatedMinutes: number;
  contentType: 'theory' | 'practice' | 'mixed';
  prerequisites: string[];
  topics: string[];
  skills: string[];
  companyRelevance: Record<string, number>;
  orderIndex: number;
}

export interface GeneratedSchedule {
  weekNumber: number;
  dayNumber: number;
  lessons: {
    lessonId: string;
    orderIndex: number;
    estimatedHours: number;
    isRequired: boolean;
  }[];
  totalEstimatedHours: number;
}

export class DynamicPathGenerator {
  /**
   * Fetch all available content with metadata
   */
  async fetchAvailableContent(): Promise<LessonWithMetadata[]> {
    const lessons = await prisma.lesson.findMany({
      where: {
        publishedAt: { not: null },
      },
      include: {
        chapter: {
          include: {
            module: true,
          },
        },
      },
      orderBy: [
        { chapter: { module: { orderIndex: 'asc' } } },
        { chapter: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    // Fetch content metadata
    const metadataRecords = await prisma.contentMetadata.findMany({
      where: {
        lessonId: { in: lessons.map(l => l.id) },
      },
    });

    const metadataMap = new Map(
      metadataRecords.map(m => [m.lessonId, m])
    );

    return lessons.map(lesson => {
      const metadata = metadataMap.get(lesson.id);
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        difficulty: lesson.difficulty,
        moduleId: lesson.chapter.module.id,
        moduleName: lesson.chapter.module.title,
        chapterId: lesson.chapter.id,
        chapterTitle: lesson.chapter.title,
        estimatedMinutes: metadata?.estimatedMinutes || 60,
        contentType: (metadata?.contentType as 'theory' | 'practice' | 'mixed') || 'mixed',
        prerequisites: (metadata?.prerequisites as string[]) || [],
        topics: (metadata?.topics as string[]) || [],
        skills: (metadata?.skills as string[]) || [],
        companyRelevance: (metadata?.companyRelevance as Record<string, number>) || {},
        orderIndex: lesson.orderIndex,
      };
    });
  }

  /**
   * Filter content based on generation rules
   */
  filterContent(content: LessonWithMetadata[], rules: PathGenerationRule): LessonWithMetadata[] {
    let filtered = [...content];

    // Module filters
    if (rules.includeModules && rules.includeModules.length > 0) {
      filtered = filtered.filter(lesson => 
        rules.includeModules!.includes(lesson.moduleName) ||
        rules.includeModules!.includes(lesson.moduleId)
      );
    }

    if (rules.excludeModules && rules.excludeModules.length > 0) {
      filtered = filtered.filter(lesson => 
        !rules.excludeModules!.includes(lesson.moduleName) &&
        !rules.excludeModules!.includes(lesson.moduleId)
      );
    }

    // Difficulty filters
    if (rules.minDifficulty) {
      const difficultyOrder = [Difficulty.BEGINNER, Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];
      const minIndex = difficultyOrder.indexOf(rules.minDifficulty);
      filtered = filtered.filter(lesson => 
        difficultyOrder.indexOf(lesson.difficulty) >= minIndex
      );
    }

    if (rules.maxDifficulty) {
      const difficultyOrder = [Difficulty.BEGINNER, Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];
      const maxIndex = difficultyOrder.indexOf(rules.maxDifficulty);
      filtered = filtered.filter(lesson => 
        difficultyOrder.indexOf(lesson.difficulty) <= maxIndex
      );
    }

    // Company focus
    if (rules.companyFocus && rules.companyFocus.length > 0) {
      filtered = filtered.filter(lesson => {
        const relevance = rules.companyFocus!.some(company => 
          (lesson.companyRelevance[company] || 0) > 0.5
        );
        return relevance;
      });
    }

    return filtered;
  }

  /**
   * Sort content by prerequisites and logical order
   */
  sortContentByPrerequisites(content: LessonWithMetadata[]): LessonWithMetadata[] {
    const sorted: LessonWithMetadata[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (lesson: LessonWithMetadata) => {
      if (visited.has(lesson.id)) return;
      if (visiting.has(lesson.id)) {
        // Circular dependency detected, skip prerequisites for this lesson
        console.warn(`Circular dependency detected for lesson: ${lesson.title}`);
        return;
      }

      visiting.add(lesson.id);

      // Visit prerequisites first
      for (const prereqId of lesson.prerequisites) {
        const prereq = content.find(l => l.id === prereqId);
        if (prereq) {
          visit(prereq);
        }
      }

      visiting.delete(lesson.id);
      visited.add(lesson.id);
      sorted.push(lesson);
    };

    // Sort by module order first, then by prerequisites
    const modulesOrdered = Array.from(new Set(content.map(l => l.moduleId)));
    
    for (const moduleId of modulesOrdered) {
      const moduleLessons = content.filter(l => l.moduleId === moduleId);
      for (const lesson of moduleLessons) {
        visit(lesson);
      }
    }

    // Add any remaining lessons that weren't visited
    for (const lesson of content) {
      if (!visited.has(lesson.id)) {
        sorted.push(lesson);
      }
    }

    return sorted;
  }

  /**
   * Generate schedule based on filtered and sorted content
   */
  generateSchedule(
    content: LessonWithMetadata[], 
    rules: PathGenerationRule
  ): GeneratedSchedule[] {
    const schedule: GeneratedSchedule[] = [];
    const totalDays = rules.targetDurationWeeks * rules.daysPerWeek;
    const maxLessonsPerDay = rules.lessonsPerDay;
    const maxHoursPerDay = rules.estimatedHoursPerDay;

    let currentDay = 0;
    let currentWeek = 1;
    let dayInWeek = 1;

    // Balance theory and practice if requested
    let contentToSchedule = [...content];
    if (rules.balanceTheoryPractice) {
      contentToSchedule = this.balanceTheoryAndPractice(contentToSchedule);
    }

    for (let i = 0; i < contentToSchedule.length; i++) {
      const lesson = contentToSchedule[i];
      
      // Check if we need to start a new day
      if (schedule.length === 0 || 
          schedule[schedule.length - 1].lessons.length >= maxLessonsPerDay ||
          schedule[schedule.length - 1].totalEstimatedHours >= maxHoursPerDay) {
        
        currentDay++;
        dayInWeek = ((currentDay - 1) % rules.daysPerWeek) + 1;
        currentWeek = Math.ceil(currentDay / rules.daysPerWeek);

        if (currentDay > totalDays) {
          console.warn('Not enough days to schedule all lessons. Some lessons will be omitted.');
          break;
        }

        schedule.push({
          weekNumber: currentWeek,
          dayNumber: dayInWeek,
          lessons: [],
          totalEstimatedHours: 0,
        });
      }

      const estimatedHours = lesson.estimatedMinutes / 60;
      const daySchedule = schedule[schedule.length - 1];
      
      daySchedule.lessons.push({
        lessonId: lesson.id,
        orderIndex: daySchedule.lessons.length + 1,
        estimatedHours,
        isRequired: true, // All generated lessons are required by default
      });

      daySchedule.totalEstimatedHours += estimatedHours;
    }

    return schedule;
  }

  /**
   * Balance theory and practice content
   */
  private balanceTheoryAndPractice(content: LessonWithMetadata[]): LessonWithMetadata[] {
    const theory = content.filter(l => l.contentType === 'theory');
    const practice = content.filter(l => l.contentType === 'practice');
    const mixed = content.filter(l => l.contentType === 'mixed');

    const balanced: LessonWithMetadata[] = [];
    const maxLength = Math.max(theory.length, practice.length);

    for (let i = 0; i < maxLength; i++) {
      if (theory[i]) balanced.push(theory[i]);
      if (practice[i]) balanced.push(practice[i]);
    }

    // Add mixed content at the end
    balanced.push(...mixed);

    return balanced;
  }

  /**
   * Generate a complete dynamic learning path
   */
  async generatePath(rules: PathGenerationRule): Promise<{
    schedule: GeneratedSchedule[];
    totalLessons: number;
    totalEstimatedHours: number;
    actualDurationWeeks: number;
    contentSummary: {
      byModule: Record<string, number>;
      byDifficulty: Record<string, number>;
      byType: Record<string, number>;
    };
  }> {
    // Fetch all available content
    const allContent = await this.fetchAvailableContent();
    
    // Filter based on rules
    const filteredContent = this.filterContent(allContent, rules);
    
    // Sort by prerequisites
    const sortedContent = this.sortContentByPrerequisites(filteredContent);
    
    // Generate schedule
    const schedule = this.generateSchedule(sortedContent, rules);
    
    // Calculate statistics
    const totalLessons = schedule.reduce((sum, day) => sum + day.lessons.length, 0);
    const totalEstimatedHours = schedule.reduce((sum, day) => sum + day.totalEstimatedHours, 0);
    const actualDurationWeeks = Math.ceil(schedule.length / rules.daysPerWeek);
    
    // Content summary
    const contentSummary = {
      byModule: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      byType: {} as Record<string, number>,
    };

    sortedContent.forEach(lesson => {
      contentSummary.byModule[lesson.moduleName] = 
        (contentSummary.byModule[lesson.moduleName] || 0) + 1;
      contentSummary.byDifficulty[lesson.difficulty] = 
        (contentSummary.byDifficulty[lesson.difficulty] || 0) + 1;
      contentSummary.byType[lesson.contentType] = 
        (contentSummary.byType[lesson.contentType] || 0) + 1;
    });

    return {
      schedule,
      totalLessons,
      totalEstimatedHours,
      actualDurationWeeks,
      contentSummary,
    };
  }

  /**
   * Create a learning path from generated schedule
   */
  async createPathFromSchedule(
    templateId: string,
    schedule: GeneratedSchedule[],
    title: string,
    description: string,
    emoji: string = "🎯"
  ): Promise<string> {
    const template = await prisma.pathTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    // Create the learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        description,
        emoji,
        durationWeeks: template.durationWeeks,
        difficulty: template.difficulty,
        targetCompanies: [], // Can be customized based on template
        isDynamic: true,
        templateId: template.id,
        generatedFromJson: JSON.stringify(schedule),
        lastGeneratedAt: new Date(),
        isActive: true,
      },
    });

    // Create path lessons
    const pathLessons = [];
    for (const day of schedule) {
      for (const lesson of day.lessons) {
        pathLessons.push({
          learningPathId: learningPath.id,
          lessonId: lesson.lessonId,
          weekNumber: day.weekNumber,
          dayNumber: day.dayNumber,
          orderIndex: lesson.orderIndex,
          isRequired: lesson.isRequired,
          estimatedHours: lesson.estimatedHours,
        });
      }
    }

    if (pathLessons.length > 0) {
      await prisma.pathLesson.createMany({
        data: pathLessons,
      });
    }

    return learningPath.id;
  }
}
