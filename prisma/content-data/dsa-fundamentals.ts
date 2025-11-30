// prisma/content-data/dsa-fundamentals.ts

export const dsaFundamentalsLessons = [
  // Section 1: Complexity Analysis & Problem Solving (6 lessons)
  {
    title: "Big O Notation Fundamentals",
    slug: "big-o-notation-fundamentals",
    description: "Master time and space complexity analysis for algorithms",
    markdownContent: `# Big O Notation Fundamentals

## What is Big O?

Big O notation describes **how algorithm performance scales** with input size. It measures the worst-case scenario.

### Time Complexity - How runtime grows
### Space Complexity - How memory usage grows

\`\`\`javascript
// O(1) - Constant time
function getFirst(arr) {
    return arr[0]; // Always one operation
}

// O(n) - Linear time
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i]; // n operations
    }
    return max;
}

// O(n²) - Quadratic time
function findAllPairs(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            console.log(arr[i], arr[j]); // n² operations
        }
    }
}
\`\`\`

## Common Time Complexities

**O(1) - Constant:**
- Array access: \`arr[i]\`
- Hash table lookup: \`map.get(key)\`
- Stack push/pop

**O(log n) - Logarithmic:**
- Binary search
- Balanced tree operations
- Heap operations

**O(n) - Linear:**
- Linear search
- Array traversal
- String operations

**O(n log n) - Linearithmic:**
- Efficient sorting (merge sort, quick sort average)
- Tree traversals

**O(n²) - Quadratic:**
- Nested loops
- Bubble sort, selection sort
- Brute force comparisons

**O(2ⁿ) - Exponential:**
- All subsets/subsets
- Recursive Fibonacci
- Brute force permutations

## Space Complexity

\`\`\`javascript
// O(1) space
function sum(a, b) {
    return a + b; // Fixed space
}

// O(n) space
function reverseArray(arr) {
    const result = []; // n elements
    for (let i = arr.length - 1; i >= 0; i--) {
        result.push(arr[i]);
    }
    return result;
}

// O(n) space (recursive)
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1); // n stack frames
}
\`\`\`

## Practice Problems

### Problem 1: Analyze Complexity
\`\`\`javascript
function findDuplicates(arr) {
    const seen = new Set();
    for (let i = 0; i < arr.length; i++) {
        if (seen.has(arr[i])) return true;
        seen.add(arr[i]);
    }
    return false;
}
// Time: O(n), Space: O(n)
\`\`\`

### Problem 2: Nested Loops
\`\`\`javascript
function printPairs(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            console.log(arr[i], arr[j]);
        }
    }
}
// Time: O(n²), Space: O(1)
\`\`\`

## Interview Tips

- Always consider both time AND space
- Focus on dominant term (drop constants)
- Consider best, average, and worst cases
- Explain trade-offs between time and space

## Company Focus
- **All companies** - Fundamental concept
- **Google, Meta** - Deep analysis required`,
    keyTakeaways: [
      "Big O describes how algorithm scales with input size",
      "Time complexity measures runtime growth, space complexity measures memory growth",
      "Focus on dominant term and drop constants in analysis",
      "Consider best, average, and worst case scenarios"
    ],
    commonMistakes: [
      "Confusing best case with worst case analysis",
      "Forgetting space complexity when focusing on time",
      "Not considering input size in complexity analysis",
      "Optimizing prematurely without measuring bottlenecks"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 15
  },

  {
    title: "Problem Solving Patterns",
    slug: "problem-solving-patterns",
    description: "Master common problem-solving approaches and patterns",
    markdownContent: `# Problem Solving Patterns

## Core Problem-Solving Strategies

### 1. Understand the Problem
Before coding, ensure you:
- **Read carefully**: Don't miss constraints
- **Clarify assumptions**: Ask about edge cases
- **Identify inputs/outputs**: What goes in, what comes out?
- **Note constraints**: Time/space limits, data ranges

### 2. Example Generation
\`\`\`javascript
// Problem: Find max sum of subarray
Input: [1, -2, 3, 4, -1, 2, 1, -5, 4]
Expected: 6 (subarray [4, -1, 2, 1])

// Edge cases to test:
// Empty array: []
// Single element: [5]
// All negative: [-1, -2, -3]
// All positive: [1, 2, 3]
\`\`\`

### 3. Pattern Recognition

#### Two Pointers
\`\`\`javascript
// Two sorted arrays - find common elements
function intersection(arr1, arr2) {
    let i = 0, j = 0;
    const result = [];
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            i++;
        } else if (arr1[i] > arr2[j]) {
            j++;
        } else {
            result.push(arr1[i]);
            i++;
            j++;
        }
    }
    return result;
}
\`\`\`

#### Sliding Window
\`\`\`javascript
// Maximum sum subarray of size k
function maxSumSubarray(arr, k) {
    let maxSum = 0;
    let windowSum = 0;
    
    // Initialize first window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // Slide window
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
\`\`\`

#### Frequency Counter
\`\`\`javascript
// Most frequent character
function mostFrequentChar(s) {
    const freq = {};
    
    // Count frequencies
    for (const char of s) {
        freq[char] = (freq[char] || 0) + 1;
    }
    
    // Find most frequent
    let maxCount = 0;
    let result = '';
    
    for (const char in freq) {
        if (freq[char] > maxCount) {
            maxCount = freq[char];
            result = char;
        }
    }
    
    return result;
}
\`\`\`

## Problem-Solving Framework

### Step 1: Clarify
\`\`\`
// Questions to ask:
1. What are the input constraints?
2. What should happen with empty/null input?
3. Should I modify in place or return new?
4. Are there specific time/space requirements?
5. What data types should I expect?
\`\`\`

### Step 2: Examples
\`\`\`
// Work through small examples manually
// Example: "reverse words in string"
Input: "hello world"
Step 1: "hello world" → ["hello", "world"]
Step 2: "hello" → "olleh", "world" → "dlrow"
Step 3: ["olleh", "dlrow"] → "olleh dlrow"
\`\`\`

### Step 3: Brute Force
Start with simplest approach, even if inefficient.

### Step 4: Optimize
Identify bottlenecks and apply patterns.

### Step 5: Test
Verify with edge cases and examples.

## Practice Problems

### Problem 1: Two Sum Pattern
\`\`\`javascript
// Find two numbers that sum to target
function twoSum(nums, target) {
    const seen = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    
    return [];
}

// Pattern: Use hash table for O(n) solution
\`\`\`

### Problem 2: Palindrome Pattern
\`\`\`javascript
// Check if string is palindrome (ignoring non-alphanumeric)
function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        // Skip non-alphanumeric
        while (left < right && !isAlphaNum(s[left])) left++;
        while (left < right && !isAlphaNum(s[right])) right--;
        
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    
    return true;
}

function isAlphaNum(c) {
    return /[a-z0-9]/i.test(c);
}

// Pattern: Two pointers from both ends
\`\`\`

## Interview Tips

- **Start with examples**: Work through small cases manually
- **Explain your approach**: Before coding, explain your strategy
- **Consider edge cases**: Empty, single element, duplicates
- **Trade-offs**: Time vs space, readability vs performance
- **Optimize iteratively**: Start simple, then improve

## Company Focus
- **All companies** - Problem-solving is universal
- **Amazon, Google** - Emphasis on structured thinking`,
    keyTakeaways: [
      "Problem-solving follows: clarify → examples → brute force → optimize → test",
      "Common patterns: two pointers, sliding window, frequency counter, recursion",
      "Always consider edge cases and constraints before coding",
      "Start with simple solution, then optimize based on bottlenecks"
    ],
    commonMistakes: [
      "Jumping into coding without understanding the problem",
      "Not considering edge cases and constraints",
      "Choosing complex solutions when simple ones work",
      "Not explaining approach before implementing"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 18
  },

  {
    title: "Data Structure Selection",
    slug: "data-structure-selection",
    description: "Choose the right data structure for optimal solutions",
    markdownContent: `# Data Structure Selection

## Choosing the Right Tool

The **data structure** you choose dramatically impacts algorithm efficiency.

### Quick Reference Guide

| Problem Type | Best Data Structure | Why |
|-------------|------------------|-----|
| Fast lookups | HashMap/Set | O(1) access |
| Ordered data | TreeMap/Tree | O(log n) sorted |
| LIFO operations | Stack | O(1) push/pop |
| FIFO operations | Queue | O(1) enqueue/dequeue |
| Relationships | Graph | General relationships |
| Hierarchy | Tree | Parent-child relationships |
| Intervals | Interval Tree | Range queries |

### Arrays - The Foundation

**When to use:**
- Random access needed: \`O(1)\`
- Sequential traversal: \`O(n)\`
- Size is known/bounded

**When to avoid:**
- Frequent insertions/deletions at beginning: \`O(n)\`
- Frequent searches: \`O(n)\`

\`\`\`javascript
// Good for random access
const arr = [1, 2, 3, 4, 5];
console.log(arr[2]); // O(1)

// Bad for frequent insertions at front
arr.unshift(0); // O(n) - shifts all elements
\`\`\`

### HashMap/HashSet - Fast Lookups

**When to use:**
- O(1) average insert/delete/lookup
- Key-value pairs
- Caching/memoization
- Frequency counting

\`\`\`javascript
// Perfect for frequency counting
function mostFrequent(nums) {
    const freq = new Map();
    
    for (const num of nums) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    let maxCount = 0, result = null;
    for (const [num, count] of freq) {
        if (count > maxCount) {
            maxCount = count;
            result = num;
        }
    }
    
    return result;
}

// Time: O(n), Space: O(n)
\`\`\`

### Stack - LIFO Operations

**When to use:**
- Function call simulation
- Expression evaluation
- Undo/redo operations
- Depth-first traversal

\`\`\`javascript
// Perfect for balanced parentheses checking
function isValidParentheses(s) {
    const stack = [];
    
    for (const char of s) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else {
            if (stack.length === 0) return false;
            const top = stack.pop();
            if (!isMatching(char, top)) return false;
        }
    }
    
    return stack.length === 0;
}

function isMatching(close, open) {
    return (close === ')' && open === '(') ||
           (close === ']' && open === '[') ||
           (close === '}' && open === '{');
}
\`\`\`

### Queue - FIFO Operations

**When to use:**
- Breadth-first traversal
- Task scheduling
- Level-order processing
- Producer-consumer scenarios

\`\`\`javascript
// Perfect for level order traversal
function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift(); // O(1) dequeue
        result.push(node.val);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    
    return result;
}
\`\`\`

### Linked Lists - Dynamic Insertions

**When to use:**
- Frequent insertions/deletions
- Unknown size
- Memory efficiency important
- Implementing stacks/queues

\`\`\`javascript
class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

// O(1) insertion at head
function insertAtHead(head, val) {
    const newNode = new ListNode(val);
    newNode.next = head;
    return newNode; // New head
}

// O(1) deletion at head
function deleteAtHead(head) {
    if (!head) return null;
    return head.next;
}
\`\`\`

## Decision Framework

### Step 1: Analyze Operations
What operations do you need?
- **Lookup**: HashMap > Array > LinkedList
- **Insertion**: LinkedList > Array (at front)
- **Deletion**: HashMap > Array > LinkedList
- **Traversal**: All similar
- **Sorting**: Array (built-in) > LinkedList

### Step 2: Consider Constraints
- **Size**: Large → HashMap, Small → Array
- **Memory**: Limited → Consider space complexity
- **Access pattern**: Random → Array, Sequential → LinkedList

### Step 3: Trade-offs
| Data Structure | Time | Space | When to Choose |
|--------------|------|-------|---------------|
| Array | O(n) search | O(n) | Small, fixed size |
| HashMap | O(1) avg | O(n) | Large, need lookups |
| LinkedList | O(n) search | O(n) | Dynamic insertions |
| Stack | O(1) ops | O(n) | LIFO needed |
| Queue | O(1) ops | O(n) | FIFO needed |

## Practice Problems

### Problem 1: LRU Cache Implementation
\`\`\`javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    get(key) {
        if (!this.cache.has(key)) return -1;
        
        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}

// O(1) get and put operations
\`\`\`

### Problem 2: Valid Parentheses
\`\`\`javascript
function isValid(s) {
    const stack = [];
    const map = { '(': ')', '[': ']', '{': '}' };
    
    for (const char of s) {
        if (map[char]) {
            stack.push(char);
        } else {
            if (stack.length === 0 || map[stack.pop()] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}
\`\`\`

## Interview Tips

- **Know trade-offs**: When to choose array vs hashmap vs linked list
- **Consider operations**: What operations matter most for your problem?
- **Think about scale**: How does performance change with input size?
- **Practice patterns**: Recognize common problem patterns quickly

## Company Focus
- **All companies** - Data structure selection is fundamental
- **Amazon, Microsoft** - Emphasis on choosing optimal structures`,
    keyTakeaways: [
      "Choose data structures based on required operations and constraints",
      "Arrays offer O(1) random access but O(n) insertions/deletions",
      "HashMaps provide O(1) average lookups but use more memory",
      "Stacks/Queues are ideal for LIFO/FIFO operations respectively"
    ],
    commonMistakes: [
      "Using arrays when hashmaps would be more efficient",
      "Not considering space complexity when choosing data structures",
      "Overcomplicating solutions when simple structures suffice",
      "Not understanding trade-offs between different data structures"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 20
  }
];
