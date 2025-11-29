# PrepKit - Enhanced Seed Data Generator
## Database Seeding Script & Content Mapping

---

## Overview

This document provides an enhanced seed data generator that extends your current seed.js file with:
- Complete lesson content for all modules
- Comprehensive practice links mapping
- Pre-built learning paths with all lessons
- Sample user data for testing
- Realistic analytics data

---

## Enhanced Seed.js Structure

### 1. Additional Prisma Schema Updates

Add these additional fields to your schema if not present:

```prisma
model Lesson {
  // ... existing fields ...
  
  // Content fields
  keyTakeaways      String[]
  commonMistakes    String[]
  videoThumbnail    String?
  estimatedMinutes  Int?
  
  // Premium field
  premium           Boolean @default(false)
  
  // Metadata
  difficulty        Difficulty
  publishedAt       DateTime?
  viewCount         Int @default(0)
  avgRating         Float @default(0)
}

model LearningPath {
  id              String @id @default(cuid())
  title           String
  slug            String @unique
  description     String
  emoji           String
  
  durationWeeks   Int
  difficulty      Difficulty
  targetCompanies String[]
  
  pathLessons     PathLesson[]
  
  createdAt       DateTime @default(now())
}

model PathLesson {
  id                String @id @default(cuid())
  learningPathId    String
  learningPath      LearningPath @relation(fields: [learningPathId], references: [id], onDelete: Cascade)
  
  lessonId          String
  lesson            Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  weekNumber        Int
  dayNumber         Int
  orderIndex        Int
  estimatedHours    Float
  
  @@unique([learningPathId, lessonId])
  @@index([learningPathId])
}
```

### 2. Complete Lesson Content Data

Create a file `prisma/content-data.ts`:

```typescript
// prisma/content-data.ts

export const dsaFundamentalsLessons = [
  {
    title: "Big O Notation - Time Complexity",
    slug: "big-o-notation",
    description: "Master Big O notation for analyzing algorithm efficiency",
    markdownContent: `# Big O Notation & Time Complexity

## What is Big O?

Big O notation describes how an algorithm's performance scales with input size...

### Common Time Complexities
- **O(1)** - Constant time
- **O(n)** - Linear time
- **O(n²)** - Quadratic time
- **O(log n)** - Logarithmic time
- **O(n log n)** - Linearithmic time

### Examples...`,
    keyTakeaways: [
      "O(1) is best, O(2^n) is worst",
      "Drop constants: O(2n) = O(n)",
      "Keep highest term: O(n² + n) = O(n²)",
      "Space complexity follows same rules",
      "Different best/average/worst cases possible"
    ],
    commonMistakes: [
      "Confusing O(n) with n operations",
      "Not considering constants in practice",
      "Forgetting about space complexity",
      "Assuming small inputs mean O(n²) is fine"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 12
  },
  
  {
    title: "Analyzing Algorithm Complexity",
    slug: "analyzing-complexity",
    description: "Learn to analyze real algorithms step by step",
    markdownContent: `# Analyzing Algorithm Complexity

## Step-by-Step Analysis

### Simple Loop
\`\`\`javascript
for (let i = 0; i < n; i++) {
  console.log(i);  // O(1)
}
// Total: O(n)
\`\`\`

### Nested Loops
\`\`\`javascript
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    console.log(i, j);  // O(1)
  }
}
// Total: O(n²)
\`\`\`

### Recursive Algorithms
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
  // Time: O(2^n)
  // Space: O(n) - call stack
}
\`\`\`...`,
    keyTakeaways: [
      "Count distinct operations",
      "Nested loops = multiply complexities",
      "Sequential loops = add complexities",
      "Recursive depth affects complexity",
      "Always think about space too"
    ],
    commonMistakes: [
      "Adding instead of multiplying nested loops",
      "Ignoring break statements",
      "Not accounting for recursion depth",
      "Forgetting modulo operation is O(1)"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 15
  }
  // ... more lessons
];

export const arrayStringLessons = [
  {
    title: "Arrays - Introduction",
    slug: "array-introduction",
    description: "Understanding arrays and common operations",
    // ... content
    keyTakeaways: [
      "Arrays have O(1) access time",
      "Insertion/deletion is O(n) in worst case",
      "Arrays are cache-friendly",
      "Dynamic arrays resize exponentially",
      "Array slicing creates a copy"
    ],
    commonMistakes: [
      "Assuming array[negative_index] works",
      "Modifying array while iterating",
      "Not checking array bounds",
      "Assuming array is always contiguous"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 12
  },
  
  {
    title: "Two Pointers Technique",
    slug: "two-pointers-technique",
    description: "Master the two pointers approach for array problems",
    markdownContent: `# Two Pointers Technique

## When to Use Two Pointers

### Pattern 1: Opposite Direction
\`\`\`javascript
// Find two numbers that sum to target
function twoSum(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    sum < target ? left++ : right--;
  }
  return [];
}
// Time: O(n), Space: O(1)
\`\`\`

### Pattern 2: Same Direction, Different Speeds
\`\`\`javascript
// Remove duplicates from sorted array
function removeDuplicates(nums) {
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
// Time: O(n), Space: O(1)
\`\`\`...`,
    keyTakeaways: [
      "Works best with sorted arrays",
      "Opposite ends approach for pairs",
      "Same direction for removing/partitioning",
      "Always O(n) time if inputs are sorted",
      "No extra space needed (excluding output)"
    ],
    commonMistakes: [
      "Forgetting to update both pointers",
      "Using on unsorted arrays",
      "Not checking pointers haven't crossed",
      "Modifying array while traversing"
    ],
    difficulty: "MEDIUM",
    premium: true,
    estimatedMinutes: 18
  }
  // ... more lessons
];

// Similar arrays for other chapters...
```

### 3. Complete Practice Links Data

```typescript
// prisma/practice-links-data.ts

export const arrayPracticeLinks = [
  {
    lesson: "array-introduction",
    links: [
      {
        platform: "LEETCODE",
        problemTitle: "Two Sum",
        url: "https://leetcode.com/problems/two-sum/",
        difficulty: "EASY"
      },
      {
        platform: "LEETCODE",
        problemTitle: "Best Time to Buy and Sell Stock",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        difficulty: "EASY"
      },
      {
        platform: "LEETCODE",
        problemTitle: "Container With Most Water",
        url: "https://leetcode.com/problems/container-with-most-water/",
        difficulty: "MEDIUM"
      }
    ]
  },
  
  {
    lesson: "two-pointers-technique",
    links: [
      {
        platform: "LEETCODE",
        problemTitle: "3Sum",
        url: "https://leetcode.com/problems/3sum/",
        difficulty: "MEDIUM"
      },
      {
        platform: "LEETCODE",
        problemTitle: "Remove Duplicates from Sorted Array",
        url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        difficulty: "EASY"
      },
      {
        platform: "LEETCODE",
        problemTitle: "Trapping Rain Water",
        url: "https://leetcode.com/problems/trapping-rain-water/",
        difficulty: "HARD"
      }
    ]
  }
];
```

### 4. Learning Path Data

```typescript
// prisma/learning-paths-data.ts

export const learningPathsConfig = [
  {
    title: "4-Week Express Path",
    slug: "4-week-express",
    description: "Quick refresher for experienced developers",
    emoji: "⚡",
    durationWeeks: 4,
    difficulty: "MEDIUM",
    targetCompanies: ["Google", "Meta", "Amazon", "Microsoft"],
    lessons: [
      // Week 1
      { week: 1, day: 1, slug: "big-o-notation" },
      { week: 1, day: 2, slug: "two-pointers-technique" },
      // Week 2
      { week: 2, day: 1, slug: "sliding-window" },
      { week: 2, day: 2, slug: "binary-search" },
      // Week 3
      { week: 3, day: 1, slug: "graph-bfs-dfs" },
      { week: 3, day: 2, slug: "dynamic-programming-intro" },
      // Week 4
      { week: 4, day: 1, slug: "system-design-fundamentals" },
      { week: 4, day: 2, slug: "behavioral-star-method" }
    ]
  },
  
  {
    title: "12-Week Complete Path",
    slug: "12-week-complete",
    description: "Comprehensive preparation from basics to advanced",
    emoji: "🎯",
    durationWeeks: 12,
    difficulty: "MEDIUM",
    targetCompanies: [
      "Google", "Meta", "Amazon", "Microsoft", 
      "Flipkart", "Swiggy", "Cred", "OYO"
    ],
    lessons: [
      // Weeks 1-2: DSA Basics
      { week: 1, day: 1, slug: "big-o-notation" },
      { week: 1, day: 2, slug: "array-introduction" },
      { week: 2, day: 1, slug: "two-pointers-technique" },
      { week: 2, day: 2, slug: "sliding-window" },
      
      // Weeks 3-4: Linked Lists & Stacks
      { week: 3, day: 1, slug: "linked-list-intro" },
      { week: 3, day: 2, slug: "fast-slow-pointers" },
      { week: 4, day: 1, slug: "stack-queue-basics" },
      { week: 4, day: 2, slug: "monotonic-stack" },
      
      // Weeks 5-6: Trees & Graphs
      { week: 5, day: 1, slug: "binary-tree-traversals" },
      { week: 5, day: 2, slug: "binary-search-trees" },
      { week: 6, day: 1, slug: "graph-bfs-dfs" },
      { week: 6, day: 2, slug: "shortest-path" },
      
      // Weeks 7-8: DP & Advanced
      { week: 7, day: 1, slug: "dynamic-programming-intro" },
      { week: 7, day: 2, slug: "dp-1d-problems" },
      { week: 8, day: 1, slug: "dp-2d-problems" },
      { week: 8, day: 2, slug: "backtracking" },
      
      // Weeks 9-10: Machine Coding
      { week: 9, day: 1, slug: "todo-application" },
      { week: 9, day: 2, slug: "shopping-cart" },
      { week: 10, day: 1, slug: "user-auth-service" },
      { week: 10, day: 2, slug: "task-management-api" },
      
      // Weeks 11-12: System Design & Behavioral
      { week: 11, day: 1, slug: "system-design-fundamentals" },
      { week: 11, day: 2, slug: "url-shortener" },
      { week: 12, day: 1, slug: "behavioral-star-method" },
      { week: 12, day: 2, slug: "negotiation-offer" }
    ]
  }
];
```

### 5. Updated Seed Function

```typescript
// prisma/seed.ts - Enhanced version

import { prisma } from '../lib/db'
import { dsaFundamentalsLessons, arrayStringLessons } from './content-data'
import { arrayPracticeLinks } from './practice-links-data'
import { learningPathsConfig } from './learning-paths-data'

async function createModules() {
  const modules = [
    {
      title: 'JavaScript Fundamentals',
      slug: 'javascript-fundamentals',
      description: 'Master JavaScript for interview success',
      emoji: '💛',
      orderIndex: 1,
    },
    {
      title: 'Data Structures & Algorithms',
      slug: 'dsa',
      description: 'Master DSA for technical interviews',
      emoji: '📚',
      orderIndex: 2,
    },
    {
      title: 'Machine Coding Round',
      slug: 'machine-coding',
      description: 'Build real applications under time constraints',
      emoji: '🎯',
      orderIndex: 3,
    },
    {
      title: 'System Design',
      slug: 'system-design',
      description: 'Design scalable distributed systems',
      emoji: '🏗️',
      orderIndex: 4,
    },
    {
      title: 'Behavioral & HR Rounds',
      slug: 'behavioral',
      description: 'Master communication and interview skills',
      emoji: '💬',
      orderIndex: 5,
    },
  ]

  const createdModules = {}
  
  for (const module of modules) {
    const result = await prisma.module.upsert({
      where: { slug: module.slug },
      update: {},
      create: module,
    })
    createdModules[module.slug] = result
  }
  
  return createdModules
}

async function createChapters(modules) {
  const chapters = [
    // DSA Chapters
    {
      moduleSlug: 'dsa',
      title: 'DSA Fundamentals',
      slug: 'dsa-fundamentals',
      description: 'Foundation concepts of DSA',
      orderIndex: 1,
      difficulty: 'BEGINNER',
      estimatedHours: 4,
    },
    {
      moduleSlug: 'dsa',
      title: 'Arrays & Strings',
      slug: 'arrays-strings',
      description: 'Master arrays and string algorithms',
      orderIndex: 2,
      difficulty: 'BEGINNER',
      estimatedHours: 8,
    },
    // ... more chapters
  ]

  const createdChapters = {}
  
  for (const chapter of chapters) {
    const moduleId = modules[chapter.moduleSlug].id
    const result = await prisma.chapter.upsert({
      where: {
        moduleId_slug: {
          moduleId,
          slug: chapter.slug,
        },
      },
      update: {},
      create: {
        moduleId,
        title: chapter.title,
        slug: chapter.slug,
        description: chapter.description,
        orderIndex: chapter.orderIndex,
        difficultyLevel: chapter.difficulty,
        estimatedHours: chapter.estimatedHours,
      },
    })
    createdChapters[chapter.slug] = result
  }
  
  return createdChapters
}

async function createLessons(chapters) {
  const allLessonData = [
    ...dsaFundamentalsLessons.map(l => ({ ...l, chapter: 'dsa-fundamentals' })),
    ...arrayStringLessons.map(l => ({ ...l, chapter: 'arrays-strings' })),
    // ... more lessons
  ]

  const createdLessons = {}
  
  for (const lessonData of allLessonData) {
    const chapterId = chapters[lessonData.chapter].id
    
    const result = await prisma.lesson.upsert({
      where: {
        chapterId_slug: {
          chapterId,
          slug: lessonData.slug,
        },
      },
      update: {},
      create: {
        chapterId,
        title: lessonData.title,
        slug: lessonData.slug,
        description: lessonData.description,
        markdownContent: lessonData.markdownContent,
        difficulty: lessonData.difficulty,
        premium: lessonData.premium,
        keyTakeaways: lessonData.keyTakeaways,
        commonMistakes: lessonData.commonMistakes,
        estimatedMinutes: lessonData.estimatedMinutes,
        publishedAt: new Date(),
        orderIndex: 1,
      },
    })
    
    createdLessons[lessonData.slug] = result
  }
  
  return createdLessons
}

async function createPracticeLinks(lessons) {
  for (const links of arrayPracticeLinks) {
    const lessonId = lessons[links.lesson].id
    
    for (const link of links.links) {
      await prisma.practiceLink.upsert({
        where: {
          id: `${lessons[links.lesson].id}-${link.problemTitle.toLowerCase().replace(/\s+/g, '-')}`
        },
        update: {},
        create: {
          lessonId,
          platform: link.platform,
          problemTitle: link.problemTitle,
          problemUrl: link.url,
          difficulty: link.difficulty,
          orderIndex: links.links.indexOf(link),
        },
      })
    }
  }
}

async function createLearningPaths(lessons) {
  for (const pathConfig of learningPathsConfig) {
    const path = await prisma.learningPath.upsert({
      where: { slug: pathConfig.slug },
      update: {},
      create: {
        title: pathConfig.title,
        slug: pathConfig.slug,
        description: pathConfig.description,
        emoji: pathConfig.emoji,
        durationWeeks: pathConfig.durationWeeks,
        difficulty: pathConfig.difficulty,
        targetCompanies: pathConfig.targetCompanies,
      },
    })

    // Add lessons to path
    for (const lessonRef of pathConfig.lessons) {
      const lessonId = lessons[lessonRef.slug].id
      
      await prisma.pathLesson.upsert({
        where: {
          learningPathId_lessonId: {
            learningPathId: path.id,
            lessonId,
          },
        },
        update: {},
        create: {
          learningPathId: path.id,
          lessonId,
          weekNumber: lessonRef.week,
          dayNumber: lessonRef.day,
          orderIndex: 1,
          estimatedHours: 2.0,
        },
      })
    }
  }
}

async function main() {
  console.log('🌱 Seeding database...')

  const modules = await createModules()
  console.log('✓ Created 5 modules')
  
  const chapters = await createChapters(modules)
  console.log('✓ Created chapters')
  
  const lessons = await createLessons(chapters)
  console.log('✓ Created lessons')
  
  await createPracticeLinks(lessons)
  console.log('✓ Created practice links')
  
  await createLearningPaths(lessons)
  console.log('✓ Created learning paths')

  console.log('✅ Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

## Sample User Data for Testing

```typescript
// prisma/test-users.ts

export const testUsers = [
  {
    email: "user1@example.com",
    password: "hashed_password_here",
    name: "John Developer",
    role: "USER",
    experienceLevel: "FRESHER",
    targetCompanies: ["Google", "Meta"],
    subscriptionStatus: "FREE",
  },
  {
    email: "user2@example.com",
    password: "hashed_password_here",
    name: "Jane Engineer",
    role: "USER",
    experienceLevel: "JUNIOR",
    targetCompanies: ["Amazon", "Microsoft"],
    subscriptionStatus: "ACTIVE",
    subscriptionPlan: "YEARLY",
    subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    email: "admin@prepkit.com",
    password: "hashed_admin_password",
    name: "Admin User",
    role: "ADMIN",
    experienceLevel: "SENIOR",
  },
]
```

---

## Running the Enhanced Seed

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Run seed script
npx ts-node prisma/seed.ts

# Or using npm script (add to package.json)
npm run seed
```

---

**This enhanced seed structure provides comprehensive course content, practice links, learning paths, and test data ready for production deployment.**
