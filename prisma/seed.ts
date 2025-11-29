import { prisma } from '../lib/db'

async function main() {
  console.log('🌱 Seeding database...')

  // Create modules
  const dsaModule = await prisma.module.upsert({
    where: { slug: 'dsa' },
    update: {},
    create: {
      title: 'Data Structures & Algorithms',
      slug: 'dsa',
      description: 'Master the fundamentals of data structures and algorithms for technical interviews',
      emoji: '📚',
      orderIndex: 1,
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
      orderIndex: 2,
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
      orderIndex: 3,
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
      orderIndex: 4,
    },
  })

  // Create sample chapters for DSA
  const arraysChapter = await prisma.chapter.upsert({
    where: {
      moduleId_slug: {
        moduleId: dsaModule.id,
        slug: 'arrays'
      }
    },
    update: {},
    create: {
      moduleId: dsaModule.id,
      title: 'Arrays & Strings',
      slug: 'arrays',
      description: 'Master array manipulation and string algorithms',
      orderIndex: 1,
      difficultyLevel: 'BEGINNER',
      estimatedHours: 8,
    },
  })

  // Create sample lesson
  const arrayIntroLesson = await prisma.lesson.upsert({
    where: {
      chapterId_slug: {
        chapterId: arraysChapter.id,
        slug: 'array-introduction'
      }
    },
    update: {},
    create: {
      chapterId: arraysChapter.id,
      title: 'Array Introduction',
      slug: 'array-introduction',
      description: 'Learn the basics of arrays and common operations',
      orderIndex: 1,
      markdownContent: `# Arrays - Introduction

## What is an Array?

An array is a **contiguous memory location** that stores a collection of elements of the **same data type**. Arrays provide **O(1) access time** to any element using its index.

### Key Characteristics:
- **Fixed Size**: Once created, the size cannot be changed
- **Homogeneous**: All elements must be of the same type
- **Contiguous Memory**: Elements are stored in adjacent memory locations
- **Zero-based Indexing**: First element is at index 0

### Basic Operations:
- **Access**: \`arr[index]\` - O(1) time
- **Update**: \`arr[index] = value\` - O(1) time
- **Insert/Delete**: Can be O(n) in worst case

### Common Array Patterns:
1. **Two Pointers**: Use two indices to traverse from both ends
2. **Sliding Window**: Maintain a window of elements for subarray problems
3. **Prefix Sum**: Precompute sums for range queries

### Time Complexities:
- Access: O(1)
- Search (unsorted): O(n)
- Search (sorted): O(log n)
- Insert/Delete: O(n)

Practice these concepts with the LeetCode problems linked below.`,
      difficulty: 'BEGINNER',
      publishedAt: new Date(),
    },
  })

  // Add practice links
  await prisma.practiceLink.upsert({
    where: { id: 'array-two-sum' },
    update: {},
    create: {
      lessonId: arrayIntroLesson.id,
      platform: 'LEETCODE',
      problemTitle: 'Two Sum',
      problemUrl: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'EASY',
      orderIndex: 1,
    },
  })

  await prisma.practiceLink.upsert({
    where: { id: 'array-max-subarray' },
    update: {},
    create: {
      lessonId: arrayIntroLesson.id,
      platform: 'LEETCODE',
      problemTitle: 'Maximum Subarray',
      problemUrl: 'https://leetcode.com/problems/maximum-subarray/',
      difficulty: 'MEDIUM',
      orderIndex: 2,
    },
  })

  console.log('✅ Database seeded successfully!')
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
