import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { javascriptFundamentalsLessons } from './content-data/javascript-fundamentals'

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
      description: 'Master the fundamentals of data structures and algorithms for technical interviews',
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

  // Create JavaScript Fundamentals lessons from data
  const createdJSLessons = [];
  let lessonIndex = 0;

  // Basics chapter (first 4 lessons)
  for (let i = 0; i < 4 && lessonIndex < javascriptFundamentalsLessons.length; i++) {
    const lessonData = javascriptFundamentalsLessons[lessonIndex];
    const lesson = await prisma.lesson.upsert({
      where: {
        chapterId_slug: {
          chapterId: jsBasicsChapter.id,
          slug: lessonData.slug,
        },
      },
      update: {},
      create: {
        chapterId: jsBasicsChapter.id,
        title: lessonData.title,
        slug: lessonData.slug,
        description: lessonData.description,
        markdownContent: lessonData.markdownContent,
        difficulty: lessonData.difficulty === 'BEGINNER' ? 'BEGINNER' :
                   lessonData.difficulty === 'INTERMEDIATE' ? 'MEDIUM' :
                   lessonData.difficulty as 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD',
        premium: lessonData.premium,
        importantPoints: JSON.stringify(lessonData.keyTakeaways),
        commonMistakes: JSON.stringify(lessonData.commonMistakes),
        orderIndex: i + 1,
        publishedAt: new Date(),
      },
    });
    createdJSLessons.push(lesson);
    lessonIndex++;
  }

  // ES6 chapter (next 5 lessons)
  for (let i = 0; i < 5 && lessonIndex < javascriptFundamentalsLessons.length; i++) {
    const lessonData = javascriptFundamentalsLessons[lessonIndex];
    const lesson = await prisma.lesson.upsert({
      where: {
        chapterId_slug: {
          chapterId: jsES6Chapter.id,
          slug: lessonData.slug,
        },
      },
      update: {},
      create: {
        chapterId: jsES6Chapter.id,
        title: lessonData.title,
        slug: lessonData.slug,
        description: lessonData.description,
        markdownContent: lessonData.markdownContent,
        difficulty: (lessonData.difficulty === 'BEGINNER' ? 'BEGINNER' :
                     lessonData.difficulty === 'INTERMEDIATE' ? 'MEDIUM' :
                     lessonData.difficulty as 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD'),
        premium: lessonData.premium,
        importantPoints: JSON.stringify(lessonData.keyTakeaways),
        commonMistakes: JSON.stringify(lessonData.commonMistakes),
        orderIndex: i + 1,
        publishedAt: new Date(),
      },
    });
    createdJSLessons.push(lesson);
    lessonIndex++;
  }

  // Closures chapter (next 4 lessons)
  for (let i = 0; i < 4 && lessonIndex < javascriptFundamentalsLessons.length; i++) {
    const lessonData = javascriptFundamentalsLessons[lessonIndex];
    const lesson = await prisma.lesson.upsert({
      where: {
        chapterId_slug: {
          chapterId: jsClosuresChapter.id,
          slug: lessonData.slug,
        },
      },
      update: {},
      create: {
        chapterId: jsClosuresChapter.id,
        title: lessonData.title,
        slug: lessonData.slug,
        description: lessonData.description,
        markdownContent: lessonData.markdownContent,
        difficulty: (lessonData.difficulty === 'BEGINNER' ? 'BEGINNER' :
                     lessonData.difficulty === 'INTERMEDIATE' ? 'MEDIUM' :
                     lessonData.difficulty as 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD'),
        premium: lessonData.premium,
        importantPoints: JSON.stringify(lessonData.keyTakeaways),
        commonMistakes: JSON.stringify(lessonData.commonMistakes),
        orderIndex: i + 1,
        publishedAt: new Date(),
      },
    });
    createdJSLessons.push(lesson);
    lessonIndex++;
  }

  // Async chapter (remaining lessons)
  for (let i = 0; lessonIndex < javascriptFundamentalsLessons.length; i++) {
    const lessonData = javascriptFundamentalsLessons[lessonIndex];
    const lesson = await prisma.lesson.upsert({
      where: {
        chapterId_slug: {
          chapterId: jsAsyncChapter.id,
          slug: lessonData.slug,
        },
      },
      update: {},
      create: {
        chapterId: jsAsyncChapter.id,
        title: lessonData.title,
        slug: lessonData.slug,
        description: lessonData.description,
        markdownContent: lessonData.markdownContent,
        difficulty: (lessonData.difficulty === 'BEGINNER' ? 'BEGINNER' :
                     lessonData.difficulty === 'INTERMEDIATE' ? 'MEDIUM' :
                     lessonData.difficulty as 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD'),
        premium: lessonData.premium,
        importantPoints: JSON.stringify(lessonData.keyTakeaways),
        commonMistakes: JSON.stringify(lessonData.commonMistakes),
        orderIndex: i + 1,
        publishedAt: new Date(),
      },
    });
    createdJSLessons.push(lesson);
    lessonIndex++;
  }

  // Create sample DSA lessons (keeping existing for now)
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

  // Add practice links for JS lessons
  for (const lesson of createdJSLessons) {
    // Add sample practice links for key lessons
    if (lesson.slug === 'variables-types-operators') {
      await prisma.practiceLink.upsert({
        where: { id: `js-${lesson.id}-1` },
        update: {},
        create: {
          lessonId: lesson.id,
          platform: 'LEETCODE',
          problemTitle: 'Two Sum',
          problemUrl: 'https://leetcode.com/problems/two-sum/',
          difficulty: 'EASY',
          orderIndex: 1,
        },
      });
    }
  }

  // Add practice links for DSA lessons
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

  // Todo App (FREE)
  const todoAppLesson = await prisma.lesson.upsert({
    where: {
      chapterId_slug: {
        chapterId: frontendMCChapter.id,
        slug: 'todo-application'
      }
    },
    update: {},
    create: {
      chapterId: frontendMCChapter.id,
      title: 'Todo Application',
      slug: 'todo-application',
      description: 'Build a complete todo app with CRUD operations',
      orderIndex: 1,
      markdownContent: `# Todo Application - Machine Coding

## Requirements

Build a **Todo Application** with the following features:

### Core Features:
- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Edit todo text
- ✅ Filter todos (All, Active, Completed)
- ✅ Clear completed todos

### Technical Requirements:
- Use React with TypeScript
- Implement proper state management
- Add local storage persistence
- Responsive design
- Clean, modern UI

### Bonus Features:
- Todo categories/tags
- Due dates
- Search functionality
- Drag & drop reordering

## Implementation Approach

### 1. Component Structure
\`\`\`jsx
// App.jsx
function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // Component logic here
}

// TodoItem.jsx
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  // Individual todo item
}

// TodoForm.jsx
function TodoForm({ onAdd }) {
  // Add new todo form
}
\`\`\`

### 2. State Management
\`\`\`javascript
const [todos, setTodos] = useState([
  {
    id: 1,
    text: 'Learn React',
    completed: false,
    createdAt: new Date()
  }
]);
\`\`\`

### 3. Local Storage
\`\`\`javascript
useEffect(() => {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    setTodos(JSON.parse(savedTodos));
  }
}, []);

useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos));
}, [todos]);
\`\`\`

## Common Mistakes to Avoid

1. **Mutating State Directly**: Always use setState
2. **No Keys in Lists**: React needs unique keys
3. **Inefficient Re-renders**: Use useCallback for functions
4. **No Error Handling**: Handle edge cases
5. **Poor UX**: Add loading states and feedback

## Evaluation Criteria

- **Functionality**: All features working
- **Code Quality**: Clean, readable code
- **UI/UX**: Intuitive and responsive
- **Performance**: No unnecessary re-renders
- **Edge Cases**: Handles empty states, errors

Practice building this app - it's a common interview question!`,
      difficulty: 'MEDIUM',
      publishedAt: new Date(),
    },
  })

  // Shopping Cart (PREMIUM)
  const shoppingCartLesson = await prisma.lesson.upsert({
    where: {
      chapterId_slug: {
        chapterId: frontendMCChapter.id,
        slug: 'shopping-cart'
      }
    },
    update: {},
    create: {
      chapterId: frontendMCChapter.id,
      title: 'Shopping Cart',
      slug: 'shopping-cart',
      description: 'Build a complete e-commerce shopping cart',
      orderIndex: 2,
      premium: true,
      markdownContent: `# Shopping Cart - Advanced Machine Coding

## Requirements

Build a **Shopping Cart** application with advanced features:

### Core Features:
- ✅ Product catalog with search/filter
- ✅ Add/remove items from cart
- ✅ Quantity management
- ✅ Price calculations with discounts
- ✅ Checkout process
- ✅ Order summary

### Advanced Features:
- ✅ Wishlist functionality
- ✅ Product reviews and ratings
- ✅ Inventory management
- ✅ Coupon codes and discounts
- ✅ Shipping calculator

### Technical Stack:
- React with TypeScript
- Context API for state management
- Local storage for persistence
- Responsive design with Tailwind CSS

## Implementation Strategy

### 1. Data Structure
\`\`\`javascript
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 199.99,
    image: "/headphones.jpg",
    category: "Electronics",
    stock: 15,
    rating: 4.5
  }
];

const cart = [
  {
    productId: 1,
    quantity: 2,
    addedAt: new Date()
  }
];
\`\`\`

### 2. State Management
\`\`\`javascript
const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Cart operations
  const addToCart = (product, quantity = 1) => { ... }
  const removeFromCart = (productId) => { ... }
  const updateQuantity = (productId, quantity) => { ... }

  return (
    <CartContext.Provider value={{ cart, wishlist, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
\`\`\`

### 3. Key Components
- **ProductGrid**: Display products with add to cart
- **CartSidebar**: Slide-out cart with item management
- **CheckoutForm**: Multi-step checkout process
- **OrderConfirmation**: Success page with order details

## Performance Considerations

1. **Image Optimization**: Lazy loading, WebP format
2. **Bundle Splitting**: Code splitting for routes
3. **Memoization**: React.memo for expensive components
4. **Debounced Search**: Prevent excessive API calls

## Real Interview Insights

Companies like **Flipkart, Amazon, Swiggy** ask similar problems:
- Focus on state management
- Handle complex user interactions
- Implement proper error boundaries
- Consider accessibility (a11y)
- Write clean, maintainable code

## Time Management (45-60 minutes)

1. **Planning (10 min)**: Component structure, data flow
2. **Core Features (25 min)**: Cart functionality, product display
3. **Polish (15 min)**: UI improvements, edge cases
4. **Testing (10 min)**: Verify all features work

Master this pattern - it's essential for e-commerce interviews!`,
      difficulty: 'HARD',
      publishedAt: new Date(),
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

  // CAP Theorem (FREE)
  const capTheoremLesson = await prisma.lesson.upsert({
    where: {
      chapterId_slug: {
        chapterId: fundamentalsSDChapter.id,
        slug: 'cap-theorem'
      }
    },
    update: {},
    create: {
      chapterId: fundamentalsSDChapter.id,
      title: 'CAP Theorem',
      slug: 'cap-theorem',
      description: 'Understanding the fundamental trade-offs in distributed systems',
      orderIndex: 1,
      markdownContent: `# CAP Theorem - System Design Fundamentals

## What is CAP Theorem?

**CAP Theorem** states that in a distributed system, you can only guarantee **2 out of 3** properties:

- **Consistency**: All nodes see the same data at the same time
- **Availability**: System remains operational despite node failures
- **Partition Tolerance**: System continues to function during network partitions

### The Three Properties

#### 1. Consistency (C)
- All nodes have the same data at any given time
- Strong consistency requires synchronous replication
- Trade-off: May reduce availability during partitions

#### 2. Availability (A)
- Every request receives a response (success or failure)
- System stays operational even if some nodes fail
- Trade-off: May sacrifice consistency

#### 3. Partition Tolerance (P)
- System continues to operate despite network failures
- Network partitions are inevitable in distributed systems
- Must be maintained in real-world systems

## Real-World Examples

### CP Systems (Consistency + Partition Tolerance)
- **Banking Systems**: Account balances must be consistent
- **Financial Transactions**: Double-spending prevention
- **Examples**: MongoDB, Redis, ZooKeeper

### AP Systems (Availability + Partition Tolerance)
- **Social Media**: Timeline inconsistencies are acceptable
- **E-commerce**: Shopping cart inconsistencies can be resolved
- **Examples**: Cassandra, DynamoDB, CouchDB

### CA Systems (Consistency + Availability)
- **Single Location**: No network partitions possible
- **Monolithic Applications**: Traditional databases
- **Examples**: PostgreSQL, MySQL (single instance)

## Choosing CAP Properties

### For Your System, Ask:

1. **How critical is consistency?**
   - Financial data → Must be consistent
   - Social posts → Can be eventually consistent

2. **What's the cost of downtime?**
   - E-commerce → High availability needed
   - Internal tools → Some downtime acceptable

3. **Network reliability requirements?**
   - Global system → Must handle partitions
   - LAN system → Partitions less likely

### Common Choices:
- **Banking**: CP (consistency over availability)
- **Social Media**: AP (availability over consistency)
- **E-commerce**: AP with eventual consistency
- **Real-time Chat**: AP (availability critical)

## Implementation Strategies

### Achieving Consistency:
- **Two-Phase Commit**: Strong consistency, slow
- **Paxos/Raft**: Consensus algorithms
- **Quorum-based**: Read/write quorums

### Achieving Availability:
- **Load Balancers**: Distribute requests
- **Replication**: Multiple copies of data
- **Circuit Breakers**: Graceful degradation

### Achieving Partition Tolerance:
- **Asynchronous Replication**: Eventual consistency
- **Conflict Resolution**: Last-write-wins, CRDTs
- **Service Meshes**: Istio, Linkerd

## Interview Questions

**"Design a URL Shortener"**
- AP system: Availability and partition tolerance
- Eventual consistency acceptable
- High availability critical

**"Design a Banking System"**
- CP system: Consistency critical
- Some downtime acceptable during partitions
- Strong consistency requirements

Master CAP theorem - it's fundamental to system design interviews!`,
      difficulty: 'MEDIUM',
      publishedAt: new Date(),
    },
  })

  // URL Shortener Design (PREMIUM)
  const urlShortenerLesson = await prisma.lesson.upsert({
    where: {
      chapterId_slug: {
        chapterId: fundamentalsSDChapter.id,
        slug: 'url-shortener-design'
      }
    },
    update: {},
    create: {
      chapterId: fundamentalsSDChapter.id,
      title: 'URL Shortener Design',
      slug: 'url-shortener-design',
      description: 'Design a scalable URL shortening service like bit.ly',
      orderIndex: 2,
      premium: true,
      markdownContent: `# URL Shortener Design - System Design Interview

## Problem Statement

Design a **URL Shortener** service (like bit.ly) that can handle millions of requests.

### Requirements:
- Shorten long URLs to short aliases
- Redirect short URLs to original URLs
- Handle high read/write throughput
- Ensure uniqueness and availability
- Provide analytics (optional)

### Scale Expectations:
- **1M+ URLs** created daily
- **100M+ redirects** daily
- **99.99% uptime** required
- **Global user base**

## High-Level Architecture

\`\`\`
[Client] → [Load Balancer] → [API Gateway] → [Application Servers]
                                      ↓
[Database Layer] ← [Cache Layer] ← [Analytics] (optional)
\`\`\`

## Component Design

### 1. URL Encoding Strategy

#### Base62 Encoding (Most Common)
- **Characters**: A-Z, a-z, 0-9 (62 total)
- **Length**: 6-8 characters for uniqueness
- **Formula**: 62^n possible combinations

\`\`\`javascript
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function encode(num) {
  let result = '';
  while (num > 0) {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result.padStart(6, '0');
}
\`\`\`

#### Hash-based Approach
- **MD5/SHA256**: Generate hash, take first 6-8 chars
- **Collision Handling**: Check database, regenerate if exists
- **Pros**: No sequential ID needed
- **Cons**: Potential collisions

### 2. Database Design

#### URLs Table
\`\`\`sql
CREATE TABLE urls (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  user_id BIGINT NULL,
  click_count INT DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_user_id ON urls(user_id);
\`\`\`

#### Analytics Table (Optional)
\`\`\`sql
CREATE TABLE url_clicks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  url_id BIGINT NOT NULL,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer TEXT
);
\`\`\`

### 3. API Design

#### Core Endpoints
\`\`\`
POST /api/shorten
- Body: { "url": "https://example.com/very/long/url" }
- Response: { "shortUrl": "https://short.ly/AbCdEf" }

GET /:shortCode
- Redirects to original URL
- Increments click counter
\`\`\`

#### Additional Endpoints
\`\`\`
GET /api/urls/:id/stats    # Click analytics
DELETE /api/urls/:id       # Delete URL
PUT /api/urls/:id          # Update URL
\`\`\`

### 4. Scaling Strategies

#### Database Scaling
- **Read Replicas**: Multiple read instances
- **Sharding**: Split data across multiple databases
- **Caching**: Redis for frequently accessed URLs

#### Application Scaling
- **Load Balancers**: Distribute traffic
- **Microservices**: Separate shortening and redirect services
- **CDN**: Cache redirects globally

#### Cache Strategy
\`\`\`javascript
// Redis cache for redirects
const CACHE_TTL = 3600; // 1 hour

async function getOriginalUrl(shortCode) {
  // Check cache first
  const cached = await redis.get(\`url:\${shortCode}\`);
  if (cached) return cached;

  // Check database
  const url = await db.query('SELECT original_url FROM urls WHERE short_code = ?', [shortCode]);
  if (url) {
    await redis.setex(\`url:\${shortCode}\`, CACHE_TTL, url);
    return url;
  }

  return null;
}
\`\`\`

## Performance Optimizations

### 1. Database Optimizations
- **Indexing**: Short codes and frequently queried fields
- **Connection Pooling**: Reuse database connections
- **Query Optimization**: Avoid N+1 queries

### 2. Caching Strategy
- **Hot URLs**: Cache frequently accessed URLs
- **CDN**: Global content delivery
- **In-memory Cache**: Redis for fast lookups

### 3. Rate Limiting
- **User Limits**: Prevent abuse (100 URLs/day)
- **IP Limits**: Block malicious IPs
- **Geographic Limits**: Region-based restrictions

## Failure Scenarios

### 1. Database Failure
- **Fallback**: Serve cached URLs only
- **Queue**: Store new URLs for later processing
- **Monitoring**: Alert when DB is down

### 2. Cache Failure
- **Direct DB**: Fall back to database queries
- **Degraded Performance**: Slower but still functional
- **Auto-recovery**: Rebuild cache from DB

### 3. High Traffic
- **Auto-scaling**: Add more servers automatically
- **Circuit Breakers**: Prevent cascade failures
- **Queue System**: Handle traffic spikes

## Security Considerations

1. **Input Validation**: Sanitize URLs, prevent XSS
2. **Rate Limiting**: Prevent abuse and DoS attacks
3. **HTTPS Only**: Secure all communications
4. **Access Logs**: Monitor for malicious activity
5. **URL Validation**: Check for malicious destinations

## Interview Follow-ups

**Q: How would you handle custom short codes?**
- Allow users to specify preferred codes
- Check availability before assignment
- Fallback to auto-generated if taken

**Q: How to prevent spam/abuse?**
- CAPTCHA for anonymous users
- Rate limiting per IP/user
- Content filtering for malicious URLs

**Q: Analytics and tracking?**
- Click tracking with timestamps
- Geographic data from IP
- Referrer analysis
- Device/browser statistics

This is a classic system design problem - master it! 🚀`,
      difficulty: 'HARD',
      publishedAt: new Date(),
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

  // STAR Method (FREE)
  const starMethodLesson = await prisma.lesson.upsert({
    where: {
      chapterId_slug: {
        chapterId: starMethodChapter.id,
        slug: 'star-method-basics'
      }
    },
    update: {},
    create: {
      chapterId: starMethodChapter.id,
      title: 'STAR Method Basics',
      slug: 'star-method-basics',
      description: 'Learn to structure your behavioral interview answers',
      orderIndex: 1,
      markdownContent: `# STAR Method - Behavioral Interview Success

## What is the STAR Method?

**STAR** is a structured approach to answering behavioral interview questions:

- **S**ituation: Set the context
- **T**ask: Explain your responsibility
- **A**ction: Describe what you did
- **R**esult: Share the outcome

## Why STAR Works

Behavioral questions like "Tell me about a time when..." require stories. STAR ensures your stories are:

- **Structured**: Clear beginning, middle, end
- **Concise**: No rambling or irrelevant details
- **Impactful**: Focus on results and learnings
- **Memorable**: Easy for interviewer to follow

## STAR Framework Breakdown

### Situation (10-20% of answer)
**Purpose**: Provide context and background
**What to include**:
- When and where it happened
- Your role in the situation
- Relevant background information

**Example**:
*"At my previous company, we were launching a new mobile app with a tight deadline of 3 months. As the lead developer, I was responsible for the entire frontend architecture."*

### Task (10-20% of answer)
**Purpose**: Explain your specific responsibility
**What to include**:
- What you were specifically asked to do
- Any constraints or challenges
- Your goals and objectives

**Example**:
*"My task was to design and implement a scalable React architecture that could handle 10,000+ daily active users while maintaining 99% uptime."*

### Action (50-70% of answer)
**Purpose**: Demonstrate your skills and approach
**What to include**:
- Specific steps you took
- Technologies/tools you used
- Problems you solved
- Decisions you made

**Example**:
*"I started by conducting a thorough requirements analysis and created detailed component specifications. I implemented a modular architecture using React with Redux for state management, and integrated performance monitoring tools. When we encountered memory leaks, I optimized our bundle size by 40% through code splitting and lazy loading."*

### Result (10-20% of answer)
**Purpose**: Show impact and learning
**What to include**:
- Quantifiable outcomes
- What you learned
- How it benefited the team/company
- Future applications

**Example**:
*"The app launched successfully with 95% uptime in the first month, serving 15,000 daily users. I received recognition from leadership for improving our deployment process, and these optimizations became our standard approach for future projects."*

## Common Behavioral Questions

### Leadership & Teamwork
- "Tell me about a time you led a team"
- "Describe a conflict you resolved"
- "How do you handle team disagreements?"

### Problem Solving
- "Describe a challenging problem you solved"
- "Tell me about a time you failed"
- "How do you approach debugging complex issues?"

### Growth & Learning
- "Tell me about a time you learned something new"
- "Describe a project that taught you a lot"
- "How do you stay current with technology?"

## STAR in Action - Full Example

**Question**: "Tell me about a time when you had to learn a new technology quickly."

**STAR Answer**:
*"**Situation**: At my previous role, our team decided to migrate from vanilla JavaScript to React for better maintainability, and I was assigned to lead the transition.

**Task**: I needed to learn React fundamentals, migrate 5 existing components, and train 3 junior developers within 2 weeks.

**Action**: I dedicated the first 3 days to intensive learning through official documentation, Udemy courses, and building small projects. I created a migration plan breaking down each component into smaller tasks. For training, I prepared hands-on workshops and code review sessions. When we encountered state management challenges, I implemented Redux and created reusable patterns.

**Result**: We completed the migration ahead of schedule with zero production bugs. The junior developers became confident in React, and our development velocity increased by 35%. This experience taught me the importance of structured learning and knowledge sharing."*

## Tips for STAR Success

### 1. Prepare Stories in Advance
- Review job description for required skills
- Prepare 5-7 stories covering different competencies
- Practice telling them concisely (1-2 minutes each)

### 2. Use Metrics When Possible
- "Improved performance by 40%"
- "Reduced bug rate by 60%"
- "Increased user satisfaction scores by 25%"

### 3. Show, Don't Tell
- Instead of "I'm a good leader": "I mentored 3 junior developers..."
- Instead of "I'm detail-oriented": "I created a 15-point checklist..."

### 4. Be Honest and Specific
- Don't exaggerate achievements
- Include real challenges and failures
- Focus on learnings and growth

### 5. Practice Delivery
- Time your answers (aim for 1-2 minutes)
- Use confident body language
- Maintain eye contact
- Smile and show enthusiasm

## Common Mistakes to Avoid

1. **Too Long**: Rambling stories lose interviewer attention
2. **Too Short**: Missing context makes story hard to follow
3. **No Result**: Stories without outcomes seem incomplete
4. **Generic**: "I worked hard" vs. "I optimized queries reducing load time by 50%"
5. **Negative Focus**: Don't dwell on failures without learning

Master STAR method - it's the foundation of behavioral interview success! 🎯`,
      difficulty: 'EASY',
      publishedAt: new Date(),
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
      targetCompanies: ["Google", "Meta", "Amazon", "Microsoft"],
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
      targetCompanies: ["Google", "Meta", "Amazon", "Microsoft", "Flipkart", "Swiggy"],
    },
  });

  // Add lessons to express path (Week 1-4, 2 lessons per week)
  const expressLessons = [
    { lesson: arrayIntroLesson, week: 1, day: 1 },
    { lesson: capTheoremLesson, week: 1, day: 2 },
    { lesson: todoAppLesson, week: 2, day: 1 },
    { lesson: starMethodLesson, week: 2, day: 2 },
    { lesson: shoppingCartLesson, week: 3, day: 1 },
    { lesson: urlShortenerLesson, week: 3, day: 2 },
    { lesson: arrayIntroLesson, week: 4, day: 1 }, // Reusing for demo
    { lesson: capTheoremLesson, week: 4, day: 2 }, // Reusing for demo
  ];

  for (let i = 0; i < expressLessons.length; i++) {
    const { lesson, week, day } = expressLessons[i];
    await prisma.pathLesson.upsert({
      where: {
        learningPathId_lessonId: {
          learningPathId: expressPath.id,
          lessonId: lesson.id,
        },
      },
      update: {
        weekNumber: week,
        dayNumber: day,
        orderIndex: 1,
        estimatedHours: week <= 2 ? 2.0 : 3.0,
      },
      create: {
        learningPathId: expressPath.id,
        lessonId: lesson.id,
        weekNumber: week,
        dayNumber: day,
        orderIndex: 1,
        estimatedHours: week <= 2 ? 2.0 : 3.0,
      },
    });
  }

  // Add lessons to complete path (more comprehensive) - using available lessons
  const completeLessons = [
    // Week 1-2: DSA Fundamentals
    { lesson: arrayIntroLesson, week: 1, day: 1 },
    { lesson: capTheoremLesson, week: 1, day: 2 },
    { lesson: todoAppLesson, week: 2, day: 1 },

    // Week 3-4: System Design Basics
    { lesson: starMethodLesson, week: 3, day: 1 },
    { lesson: urlShortenerLesson, week: 4, day: 1 },

    // Week 5-6: Machine Coding
    { lesson: shoppingCartLesson, week: 5, day: 1 },
    { lesson: arrayIntroLesson, week: 6, day: 1 },

    // Week 7-8: More DSA
    { lesson: capTheoremLesson, week: 7, day: 1 },
    { lesson: todoAppLesson, week: 8, day: 1 },

    // Week 9-10: More System Design
    { lesson: starMethodLesson, week: 9, day: 1 },
    { lesson: urlShortenerLesson, week: 10, day: 1 },

    // Week 11-12: Behavioral & Final Prep
    { lesson: shoppingCartLesson, week: 11, day: 1 },
    { lesson: arrayIntroLesson, week: 12, day: 1 },
  ];

  for (let i = 0; i < completeLessons.length; i++) {
    const { lesson, week, day } = completeLessons[i];
    await prisma.pathLesson.upsert({
      where: {
        learningPathId_lessonId: {
          learningPathId: completePath.id,
          lessonId: lesson.id,
        },
      },
      update: {
        weekNumber: week,
        dayNumber: day,
        orderIndex: 1,
        estimatedHours: week <= 4 ? 2.0 : week <= 8 ? 3.0 : 1.5,
      },
      create: {
        learningPathId: completePath.id,
        lessonId: lesson.id,
        weekNumber: week,
        dayNumber: day,
        orderIndex: 1,
        estimatedHours: week <= 4 ? 2.0 : week <= 8 ? 3.0 : 1.5,
      },
    });
  }

  console.log('✅ Database seeded with comprehensive content!')
  console.log('📊 Created:')
  console.log('   • 4 modules (DSA, Machine Coding, System Design, Behavioral)')
  console.log('   • 6 chapters across modules')
  console.log('   • 8 lessons (mix of free and premium)')
  console.log('   • Practice problems and examples')
  console.log('   • 2 learning paths (4-week and 12-week)')
  console.log('   • Path lesson assignments and sequencing')
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
