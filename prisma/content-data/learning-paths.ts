// prisma/content-data/learning-paths.ts

export const learningPaths = [
  {
    name: "4-Week Express Path",
    slug: "4-week-express",
    description: "Quick refresher for experienced developers preparing for imminent interviews",
    duration: "4 weeks",
    difficulty: "INTERMEDIATE",
    targetAudience: "Experienced developers with upcoming interviews",
    modules: [
      {
        moduleId: "dsa-fundamentals",
        lessons: ["arrays-hashing", "sorting-searching", "linked-lists"],
        priority: "HIGH",
        estimatedHours: 15
      },
      {
        moduleId: "machine-coding",
        lessons: ["react-todo-app", "search-filter-component", "data-table-pagination"],
        priority: "HIGH",
        estimatedHours: 12
      },
      {
        moduleId: "system-design",
        lessons: ["scalability-performance-basics", "load-balancing-strategies"],
        priority: "MEDIUM",
        estimatedHours: 8
      },
      {
        moduleId: "behavioral",
        lessons: ["star-method-mastery", "common-behavioral-questions"],
        priority: "HIGH",
        estimatedHours: 5
      }
    ],
    totalEstimatedHours: 40,
    outcomes: [
      "Quick refresh of core DSA patterns",
      "Practice common machine coding problems",
      "Essential system design concepts",
      "Behavioral interview preparation"
    ],
    schedule: [
      {
        week: 1,
        title: "DSA Fundamentals & Machine Coding",
        modules: ["dsa-fundamentals", "machine-coding"],
        goals: ["Complete array and string problems", "Build 2 machine coding projects"]
      },
      {
        week: 2,
        title: "Advanced DSA & System Design",
        modules: ["dsa-fundamentals", "system-design"],
        goals: ["Master linked lists and trees", "Understand scaling basics"]
      },
      {
        week: 3,
        title: "System Design & Behavioral",
        modules: ["system-design", "behavioral"],
        goals: ["Learn load balancing", "Master STAR method"]
      },
      {
        week: 4,
        title: "Practice & Mock Interviews",
        modules: ["machine-coding", "behavioral"],
        goals: ["Complete all coding patterns", "Practice behavioral answers"]
      }
    ]
  },
  {
    name: "12-Week Complete Path",
    slug: "12-week-complete",
    description: "Comprehensive preparation covering all interview topics from fundamentals to advanced",
    duration: "12 weeks",
    difficulty: "BEGINNER",
    targetAudience: "Developers of all experience levels preparing thoroughly",
    modules: [
      {
        moduleId: "dsa-fundamentals",
        lessons: ["arrays-hashing", "sorting-searching", "linked-lists", "stack-queue", "graphs", "dynamic-programming", "trees"],
        priority: "HIGH",
        estimatedHours: 50
      },
      {
        moduleId: "machine-coding",
        lessons: ["react-todo-app", "search-filter-component", "data-table-pagination", "api-design-patterns", "advanced-react-patterns"],
        priority: "HIGH",
        estimatedHours: 35
      },
      {
        moduleId: "system-design",
        lessons: ["scalability-performance-basics", "load-balancing-strategies", "caching-strategies", "database-design", "distributed-systems"],
        priority: "HIGH",
        estimatedHours: 30
      },
      {
        moduleId: "behavioral",
        lessons: ["star-method-mastery", "common-behavioral-questions", "salary-negotiation", "company-culture-fit"],
        priority: "HIGH",
        estimatedHours: 15
      },
      {
        moduleId: "javascript-fundamentals",
        lessons: ["hoisting-scope", "this-binding", "async-javascript", "promises-async-await"],
        priority: "MEDIUM",
        estimatedHours: 20
      }
    ],
    totalEstimatedHours: 150,
    outcomes: [
      "Complete mastery of DSA concepts",
      "Full machine coding pattern library",
      "Comprehensive system design knowledge",
      "Confidence in behavioral interviews",
      "JavaScript fundamentals mastery"
    ],
    schedule: [
      {
        week: 1,
        title: "JavaScript Fundamentals & DSA Arrays",
        modules: ["javascript-fundamentals", "dsa-fundamentals"],
        goals: ["Master hoisting and closures", "Complete array and hashing problems"]
      },
      {
        week: 2,
        title: "DSA: Sorting & Linked Lists",
        modules: ["dsa-fundamentals"],
        goals: ["Implement sorting algorithms", "Master linked list patterns"]
      },
      {
        week: 3,
        title: "DSA: Stacks, Queues & Trees",
        modules: ["dsa-fundamentals"],
        goals: ["Understand stack/queue applications", "Learn tree traversal patterns"]
      },
      {
        week: 4,
        title: "DSA: Graphs & Dynamic Programming",
        modules: ["dsa-fundamentals"],
        goals: ["Master graph algorithms", "Understand DP patterns"]
      },
      {
        week: 5,
        title: "Machine Coding: React Fundamentals",
        modules: ["machine-coding"],
        goals: ["Build React todo app", "Master component patterns"]
      },
      {
        week: 6,
        title: "Machine Coding: Advanced React",
        modules: ["machine-coding"],
        goals: ["Implement complex filtering", "Build data table with pagination"]
      },
      {
        week: 7,
        title: "System Design: Fundamentals",
        modules: ["system-design"],
        goals: ["Understand scalability", "Learn load balancing basics"]
      },
      {
        week: 8,
        title: "System Design: Advanced Concepts",
        modules: ["system-design"],
        goals: ["Master caching strategies", "Design distributed systems"]
      },
      {
        week: 9,
        title: "Behavioral: STAR Method",
        modules: ["behavioral"],
        goals: ["Master STAR framework", "Prepare leadership stories"]
      },
      {
        week: 10,
        title: "Behavioral: Advanced Preparation",
        modules: ["behavioral"],
        goals: ["Practice negotiation skills", "Prepare company-specific answers"]
      },
      {
        week: 11,
        title: "JavaScript Advanced Topics",
        modules: ["javascript-fundamentals"],
        goals: ["Master async/await", "Understand event loop"]
      },
      {
        week: 12,
        title: "Mock Interviews & Review",
        modules: [],
        goals: ["Complete mock interviews", "Review weak areas"]
      }
    ]
  },
  {
    name: "16-Week Deep Dive Path",
    slug: "16-week-deep-dive",
    description: "Intensive preparation for those aiming for top-tier companies with comprehensive coverage",
    duration: "16 weeks",
    difficulty: "ADVANCED",
    targetAudience: "Developers targeting FAANG and top product companies",
    modules: [
      {
        moduleId: "dsa-fundamentals",
        lessons: ["arrays-hashing", "sorting-searching", "linked-lists", "stack-queue", "graphs", "dynamic-programming", "trees", "bit-manipulation", "advanced-algorithms"],
        priority: "HIGH",
        estimatedHours: 80
      },
      {
        moduleId: "machine-coding",
        lessons: ["react-todo-app", "search-filter-component", "data-table-pagination", "api-design-patterns", "advanced-react-patterns", "full-stack-projects", "performance-optimization", "testing-patterns"],
        priority: "HIGH",
        estimatedHours: 60
      },
      {
        moduleId: "system-design",
        lessons: ["scalability-performance-basics", "load-balancing-strategies", "caching-strategies", "database-design", "distributed-systems", "microservices", "security-patterns", "case-studies"],
        priority: "HIGH",
        estimatedHours: 50
      },
      {
        moduleId: "behavioral",
        lessons: ["star-method-mastery", "common-behavioral-questions", "salary-negotiation", "company-culture-fit", "advanced-communication", "leadership-stories", "conflict-resolution"],
        priority: "HIGH",
        estimatedHours: 25
      },
      {
        moduleId: "javascript-fundamentals",
        lessons: ["hoisting-scope", "this-binding", "async-javascript", "promises-async-await", "prototypes-inheritance", "advanced-patterns", "performance-optimization", "es6-features"],
        priority: "MEDIUM",
        estimatedHours: 35
      }
    ],
    totalEstimatedHours: 250,
    outcomes: [
      "Expert-level DSA knowledge",
      "Complete machine coding pattern mastery",
      "Advanced system design capabilities",
      "Behavioral interview excellence",
      "JavaScript deep expertise",
      "Ready for FAANG interviews"
    ],
    schedule: [
      {
        week: 1,
        title: "JavaScript Foundations & DSA Arrays",
        modules: ["javascript-fundamentals", "dsa-fundamentals"],
        goals: ["Master hoisting, closures, prototypes", "Complete comprehensive array problems"]
      },
      {
        week: 2,
        title: "DSA: Sorting & Algorithm Analysis",
        modules: ["dsa-fundamentals"],
        goals: ["Implement all sorting algorithms", "Master Big O analysis"]
      },
      {
        week: 3,
        title: "DSA: Linked Lists & Stacks",
        modules: ["dsa-fundamentals"],
        goals: ["Master linked list variations", "Understand stack applications"]
      },
      {
        week: 4,
        title: "DSA: Queues, Trees & Recursion",
        modules: ["dsa-fundamentals"],
        goals: ["Master queue implementations", "Learn recursive tree patterns"]
      },
      {
        week: 5,
        title: "DSA: Graphs & Advanced Algorithms",
        modules: ["dsa-fundamentals"],
        goals: ["Master graph traversal", "Learn advanced DP and bit manipulation"]
      },
      {
        week: 6,
        title: "JavaScript: Advanced Patterns & Performance",
        modules: ["javascript-fundamentals"],
        goals: ["Master advanced JS patterns", "Understand performance optimization"]
      },
      {
        week: 7,
        title: "Machine Coding: React Fundamentals",
        modules: ["machine-coding"],
        goals: ["Build complex React apps", "Master component architecture"]
      },
      {
        week: 8,
        title: "Machine Coding: Advanced React & State",
        modules: ["machine-coding"],
        goals: ["Master state management", "Implement performance patterns"]
      },
      {
        week: 9,
        title: "Machine Coding: Full Stack & APIs",
        modules: ["machine-coding"],
        goals: ["Build full-stack applications", "Master API design patterns"]
      },
      {
        week: 10,
        title: "System Design: Fundamentals",
        modules: ["system-design"],
        goals: ["Understand scalability basics", "Master load balancing"]
      },
      {
        week: 11,
        title: "System Design: Databases & Caching",
        modules: ["system-design"],
        goals: ["Master database design", "Learn caching strategies"]
      },
      {
        week: 12,
        title: "System Design: Distributed Systems",
        modules: ["system-design"],
        goals: ["Understand distributed concepts", "Learn microservices"]
      },
      {
        week: 13,
        title: "System Design: Security & Case Studies",
        modules: ["system-design"],
        goals: ["Master security patterns", "Analyze real-world systems"]
      },
      {
        week: 14,
        title: "Behavioral: STAR & Leadership Stories",
        modules: ["behavioral"],
        goals: ["Master STAR method", "Prepare leadership examples"]
      },
      {
        week: 15,
        title: "Behavioral: Advanced Communication",
        modules: ["behavioral"],
        goals: ["Master negotiation skills", "Prepare conflict resolution"]
      },
      {
        week: 16,
        title: "Mock Interviews & Final Preparation",
        modules: [],
        goals: ["Complete multiple mock interviews", "Finalize all weak areas"]
      }
    ]
  },
  {
    name: "Google Interview Path",
    slug: "google-interview-path",
    description: "Specialized path focusing on Google's interview format and question patterns",
    duration: "10 weeks",
    difficulty: "ADVANCED",
    targetAudience: "Developers specifically targeting Google interviews",
    modules: [
      {
        moduleId: "dsa-fundamentals",
        lessons: ["arrays-hashing", "sorting-searching", "graphs", "dynamic-programming", "advanced-algorithms"],
        priority: "HIGH",
        estimatedHours: 60
      },
      {
        moduleId: "system-design",
        lessons: ["scalability-performance-basics", "load-balancing-strategies", "distributed-systems", "case-studies"],
        priority: "HIGH",
        estimatedHours: 40
      },
      {
        moduleId: "machine-coding",
        lessons: ["data-table-pagination", "api-design-patterns", "performance-optimization"],
        priority: "MEDIUM",
        estimatedHours: 25
      },
      {
        moduleId: "behavioral",
        lessons: ["star-method-mastery", "common-behavioral-questions", "leadership-stories"],
        priority: "HIGH",
        estimatedHours: 15
      }
    ],
    totalEstimatedHours: 140,
    outcomes: [
      "Google-ready DSA problem solving",
      "System design for Google scale",
      "Machine coding patterns Google uses",
      "Google behavioral interview preparation",
      "Understanding of Google's interview process"
    ],
    schedule: [
      {
        week: 1,
        title: "Google DSA: Arrays & Hashing",
        modules: ["dsa-fundamentals"],
        goals: ["Master array problems Google asks", "Understand hash table applications"]
      },
      {
        week: 2,
        title: "Google DSA: Graph Algorithms",
        modules: ["dsa-fundamentals"],
        goals: ["Master graph traversal", "Learn advanced graph patterns"]
      },
      {
        week: 3,
        title: "Google DSA: Dynamic Programming",
        modules: ["dsa-fundamentals"],
        goals: ["Master common DP patterns", "Practice optimization techniques"]
      },
      {
        week: 4,
        title: "Google DSA: Advanced Topics",
        modules: ["dsa-fundamentals"],
        goals: ["Master bit manipulation", "Learn advanced algorithms"]
      },
      {
        week: 5,
        title: "Google System Design: Fundamentals",
        modules: ["system-design"],
        goals: ["Understand Google-scale systems", "Master load balancing"]
      },
      {
        week: 6,
        title: "Google System Design: Distributed Systems",
        modules: ["system-design"],
        goals: ["Master distributed concepts", "Learn Google's architecture"]
      },
      {
        week: 7,
        title: "Google System Design: Case Studies",
        modules: ["system-design"],
        goals: ["Analyze Google systems", "Design Google-scale solutions"]
      },
      {
        week: 8,
        title: "Google Machine Coding",
        modules: ["machine-coding"],
        goals: ["Master Google's coding patterns", "Practice performance optimization"]
      },
      {
        week: 9,
        title: "Google Behavioral: Leadership & Impact",
        modules: ["behavioral"],
        goals: ["Prepare leadership stories", "Understand Google's culture"]
      },
      {
        week: 10,
        title: "Google Mock Interviews",
        modules: [],
        goals: ["Complete Google-style mocks", "Finalize preparation"]
      }
    ]
  }
];
