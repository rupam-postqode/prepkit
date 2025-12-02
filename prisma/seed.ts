import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString })),
})

async function main() {
  console.log('🌱 Seeding database...')

  // Create modules
  const jsModule = await prisma.module.upsert({
    where: { slug: 'javascript-fundamentals' },
    update: {},
    create: {
      title: 'JavaScript Fundamentals',
      slug: 'javascript-fundamentals',
      description: 'Master JavaScript programming fundamentals, ES6+ features, and modern development practices',
      emoji: '💛',
      orderIndex: 1,
    },
  })

  const dsaModule = await prisma.module.upsert({
    where: { slug: 'dsa' },
    update: {},
    create: {
      title: 'Data Structures & Algorithms',
      slug: 'dsa',
      description: 'Master fundamentals of data structures and algorithms for technical interviews',
      emoji: '📚',
      orderIndex: 2,
    },
  })

  const machineCodingModule = await prisma.module.upsert({
    where: { slug: 'machine-coding' },
    update: {},
    create: {
      title: 'Machine Coding Round',
      slug: 'machine-coding',
      description: 'Practice building real-world applications under time constraints',
      emoji: '🎯',
      orderIndex: 3,
    },
  })

  const systemDesignModule = await prisma.module.upsert({
    where: { slug: 'system-design' },
    update: {},
    create: {
      title: 'System Design',
      slug: 'system-design',
      description: 'Learn to design scalable, distributed systems',
      emoji: '🏗️',
      orderIndex: 4,
    },
  })

  const behavioralModule = await prisma.module.upsert({
    where: { slug: 'behavioral' },
    update: {},
    create: {
      title: 'Behavioral & HR Rounds',
      slug: 'behavioral',
      description: 'Master communication and behavioral interview skills',
      emoji: '💬',
      orderIndex: 5,
    },
  })

  // Create comprehensive DSA chapters
  const arraysChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'arrays-strings'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Arrays & Strings',
      slug: 'arrays-strings',
      description: 'Master array manipulation, string algorithms, and two-pointer techniques',
      orderIndex: 1,
      difficultyLevel: 'BEGINNER',
      estimatedHours: 12,
    },
  })

  const linkedListsChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'linked-lists'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Linked Lists',
      slug: 'linked-lists',
      description: 'Master singly and doubly linked list operations and algorithms',
      orderIndex: 2,
      difficultyLevel: 'BEGINNER',
      estimatedHours: 10,
    },
  })

  const stacksQueuesChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'stacks-queues'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Stacks & Queues',
      slug: 'stacks-queues',
      description: 'Master stack and queue data structures and their applications',
      orderIndex: 3,
      difficultyLevel: 'BEGINNER',
      estimatedHours: 8,
    },
  })

  const hashTablesChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'hash-tables'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Hash Tables & Sets',
      slug: 'hash-tables',
      description: 'Master hash tables, sets, and collision resolution techniques',
      orderIndex: 4,
      difficultyLevel: 'BEGINNER',
      estimatedHours: 6,
    },
  })

  const treesChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'trees'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Trees & Binary Trees',
      slug: 'trees',
      description: 'Master tree traversals, binary trees, and tree algorithms',
      orderIndex: 5,
      difficultyLevel: 'MEDIUM',
      estimatedHours: 15,
    },
  })

  const graphsChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'graphs'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Graphs',
      slug: 'graphs',
      description: 'Master graph representations, traversals, and algorithms',
      orderIndex: 6,
      difficultyLevel: 'MEDIUM',
      estimatedHours: 18,
    },
  })

  const sortingChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'sorting-searching'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Sorting & Searching',
      slug: 'sorting-searching',
      description: 'Master sorting algorithms and search techniques',
      orderIndex: 7,
      difficultyLevel: 'MEDIUM',
      estimatedHours: 10,
    },
  })

  const dynamicProgrammingChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'dynamic-programming'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Dynamic Programming',
      slug: 'dynamic-programming',
      description: 'Master DP patterns, memoization, and optimization techniques',
      orderIndex: 8,
      difficultyLevel: 'HARD',
      estimatedHours: 20,
    },
  })

  const greedyChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'greedy-algorithms'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Greedy Algorithms',
      slug: 'greedy-algorithms',
      description: 'Master greedy algorithms and optimization problems',
      orderIndex: 9,
      difficultyLevel: 'MEDIUM',
      estimatedHours: 8,
    },
  })

  const backtrackingChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'backtracking'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Backtracking',
      slug: 'backtracking',
      description: 'Master backtracking techniques for combinatorial problems',
      orderIndex: 10,
      difficultyLevel: 'HARD',
      estimatedHours: 12,
    },
  })

  // Create JavaScript Fundamentals chapters
  const jsBasicsChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: jsModule.id,
        slug: 'basics-fundamentals'
      }
    },
    update: {},
    create: {
      moduleId: jsModule.id,
      title: 'Basics & Fundamentals',
      slug: 'basics-fundamentals',
      description: 'Core JavaScript concepts and language fundamentals',
      orderIndex: 1,
      difficultyLevel: 'BEGINNER',
      estimatedHours: 8,
    },
  })

  const jsES6Chapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: jsModule.id,
        slug: 'es6-features'
      }
    },
    update: {},
    create: {
      moduleId: jsModule.id,
      title: 'ES6+ Features',
      slug: 'es6-features',
      description: 'Modern JavaScript features and syntax improvements',
      orderIndex: 2,
      difficultyLevel: 'BEGINNER',
      estimatedHours: 10,
    },
  })

  const jsClosuresChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: jsModule.id,
        slug: 'closures-scope'
      }
    },
    update: {},
    create: {
      moduleId: jsModule.id,
      title: 'Closures & Scope',
      slug: 'closures-scope',
      description: 'Understanding scope, closures, and lexical environment',
      orderIndex: 3,
      difficultyLevel: 'MEDIUM',
      estimatedHours: 8,
    },
  })

  const jsAsyncChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: jsModule.id,
        slug: 'asynchronous-javascript'
      }
    },
    update: {},
    create: {
      moduleId: jsModule.id,
      title: 'Asynchronous JavaScript',
      slug: 'asynchronous-javascript',
      description: 'Callbacks, promises, and async/await patterns',
      orderIndex: 4,
      difficultyLevel: 'MEDIUM',
      estimatedHours: 10,
    },
  })

  // Create Machine Coding chapters and lessons
  const frontendMCChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: machineCodingModule.id,
        slug: 'frontend-machine-coding'
      }
    },
    update: {},
    create: {
      moduleId: machineCodingModule.id,
      title: 'Frontend Machine Coding',
      slug: 'frontend-machine-coding',
      description: 'Build interactive UI components and applications',
      orderIndex: 1,
      difficultyLevel: 'MEDIUM',
      estimatedHours: 12,
    },
  })

  // Create System Design chapters
  const fundamentalsSDChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: systemDesignModule.id,
        slug: 'system-design-fundamentals'
      }
    },
    update: {},
    create: {
      moduleId: systemDesignModule.id,
      title: 'System Design Fundamentals',
      slug: 'system-design-fundamentals',
      description: 'Learn the building blocks of scalable systems',
      orderIndex: 1,
      difficultyLevel: 'MEDIUM',
      estimatedHours: 10,
    },
  })

  // Create Behavioral chapters
  const starMethodChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: behavioralModule.id,
        slug: 'star-method'
      }
    },
    update: {},
    create: {
      moduleId: behavioralModule.id,
      title: 'STAR Method & Storytelling',
      slug: 'star-method',
      description: 'Master the art of behavioral interview storytelling',
      orderIndex: 1,
      difficultyLevel: 'BEGINNER',
      estimatedHours: 4,
    },
  })

  // Create learning paths
  const expressPath = await prisma.learningPath.upsert({
    where: { slug: "4-week-express" },
    update: {},
    create: {
      title: "4-Week Express Path",
      slug: "4-week-express",
      description: "Quick refresher for experienced developers preparing for interviews",
      emoji: "⚡",
      durationWeeks: 4,
      difficulty: "MEDIUM",
      targetCompanies: "Google,Meta,Amazon,Microsoft", // Use string as required by schema
    },
  });

  const completePath = await prisma.learningPath.upsert({
    where: { slug: "12-week-complete" },
    update: {},
    create: {
      title: "12-Week Complete Path",
      slug: "12-week-complete",
      description: "Comprehensive preparation from basics to advanced interview topics",
      emoji: "🎯",
      durationWeeks: 12,
      difficulty: "MEDIUM",
      targetCompanies: "Google,Meta,Amazon,Microsoft,Flipkart,Swiggy", // Use string as required by schema
    },
  });

  console.log('✅ Database seeded with basic structure!')
  console.log('📊 Created:')
  console.log('   • 5 modules (JavaScript, DSA, Machine Coding, System Design, Behavioral)')
  console.log('   • 15 chapters across modules')
  console.log('   • 2 learning paths (4-week and 12-week)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
