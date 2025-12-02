export const dsaModuleData = {
  chapters: [
    {
      title: "Arrays & Hashing",
      slug: "arrays-hashing",
      description: "Master array manipulation, string algorithms, and two-pointer techniques",
      orderIndex: 1,
      difficultyLevel: "BEGINNER",
      estimatedHours: 12,
      lessons: [
        {
          title: "Two Sum",
          slug: "two-sum",
          description: "Find two numbers that add up to target",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-1-1-video",
          videoDurationSec: 600,
          markdownContent: `# Two Sum

## Problem Statement
Given an array of integers \`nums\` and an integer \`target\`, return indices of two numbers that add up to target. You cannot use the same element twice.

## Input/Output
\`\`\`javascript
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

## Constraints
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9
- -10^9 ≤ target ≤ 10^9

## Solution Approach
1. Use HashMap to store value → index
2. For each number, check if (target - number) exists in map
3. Return indices when found

## Code
\`\`\`javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(n)

## Edge Cases
- Negative numbers: target = 0, nums = [-1, 0, 1]
- Duplicates: target = 4, nums = [2, 2, 2]
- Two large numbers: nums = [1000000, -1000000]

## Interview Tips
- Mention brute force first (O(n²))
- Show optimization to O(n)
- Explain HashMap usage
- Discuss why we store index
- Show alternative using Set for just checking existence

## Follow-up Questions
1. What if you need all pairs?
2. What if target was sum of 3 numbers (3Sum)?
3. Return pair values instead of indices?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Two Sum",
              problemUrl: "https://leetcode.com/problems/two-sum",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "Two Sum Practice",
              problemUrl: "https://codesandbox.io/s/two-sum-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Contains Duplicate",
          slug: "contains-duplicate",
          description: "Check if array contains any duplicate values",
          orderIndex: 2,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-1-2-video",
          videoDurationSec: 480,
          markdownContent: `# Contains Duplicate

## Problem Statement
Given an array of integers, return true if any value appears at least twice.

## Input/Output
\`\`\`javascript
Input: [1,2,3,1]
Output: true

Input: [1,2,3,4]
Output: false
\`\`\`

## Solution Approach
Use a Set to track seen values. If value already in Set, return false.

## Code
\`\`\`javascript
function containsDuplicate(nums) {
    const seen = new Set();
    
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(n)

## Interview Tips
- Explain Set vs Array.includes() performance
- Discuss early termination
- Show alternative using sort first
- Mention space-time trade-off`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Contains Duplicate",
              problemUrl: "https://leetcode.com/problems/contains-duplicate",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Valid Anagram",
          slug: "valid-anagram",
          description: "Check if two strings are anagrams of each other",
          orderIndex: 3,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-1-3-video",
          videoDurationSec: 540,
          markdownContent: `# Valid Anagram

## Problem Statement
Given two strings \`s\` and \`t\`, return true if \`t\` is an anagram of \`s\`.

## Input/Output
\`\`\`javascript
Input: s = "anagram", t = "nagaram"
Output: true

Input: s = "rat", t = "car"
Output: false
\`\`\`

## Solution Approach
Count character frequencies in both strings and compare.

## Code
\`\`\`javascript
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    const count = {};
    
    for (const char of s) {
        count[char] = (count[char] || 0) + 1;
    }
    
    for (const char of t) {
        if (!count[char]) return false;
        count[char]--;
    }
    
    return true;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(1) - assuming fixed alphabet size

## Interview Tips
- Discuss alternative using sort
- Explain character encoding considerations
- Show optimization using fixed-size array for ASCII
- Mention Unicode handling`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Valid Anagram",
              problemUrl: "https://leetcode.com/problems/valid-anagram",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Best Time to Buy and Sell Stock",
          slug: "best-time-to-buy-sell-stock",
          description: "Find maximum profit from stock prices",
          orderIndex: 4,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-1-4-video",
          videoDurationSec: 600,
          markdownContent: `# Best Time to Buy and Sell Stock

## Problem Statement
Given an array \`prices\` where \`prices[i]\` is the price on day i, find the maximum profit.

## Input/Output
\`\`\`javascript
Input: [7,1,5,3,6,4]
Output: 5 (Buy at 1, sell at 6)

Input: [7,6,4,3,1]
Output: 0 (No profit possible)
\`\`\`

## Solution Approach
Track minimum price seen so far and maximum profit.

## Code
\`\`\`javascript
function maxProfit(prices) {
    let maxProfit = 0;
    let minPrice = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
        const profit = prices[i] - minPrice;
        maxProfit = Math.max(maxProfit, profit);
        minPrice = Math.min(minPrice, prices[i]);
    }
    
    return maxProfit;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(1)

## Interview Tips
- Explain why we track min price
- Discuss alternative with nested loops (O(n²))
- Show extension to multiple transactions
- Mention real-world trading considerations`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Best Time to Buy and Sell Stock",
              problemUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Valid Palindrome",
          slug: "valid-palindrome",
          description: "Check if string is palindrome (ignoring case and non-alphanumeric)",
          orderIndex: 5,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-1-5-video",
          videoDurationSec: 540,
          markdownContent: `# Valid Palindrome

## Problem Statement
Check if a string is a palindrome, ignoring case and non-alphanumeric characters.

## Input/Output
\`\`\`javascript
Input: "A man, a plan, a canal: Panama"
Output: true

Input: "race a car"
Output: false
\`\`\`

## Solution Approach
Clean string and use two-pointer approach.

## Code
\`\`\`javascript
function isPalindrome(s) {
    const cleaned = s
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    
    let left = 0, right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(n)

## Interview Tips
- Explain two-pointer technique
- Show alternative using reverse string
- Discuss Unicode considerations
- Mention optimization with early exit`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Valid Palindrome",
              problemUrl: "https://leetcode.com/problems/valid-palindrome",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Intersection of Two Arrays",
          slug: "intersection-of-two-arrays",
          description: "Find common elements between two arrays",
          orderIndex: 6,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-1-6-video",
          videoDurationSec: 480,
          markdownContent: `# Intersection of Two Arrays

## Problem Statement
Given two arrays, return an array of their intersection (common elements).

## Input/Output
\`\`\`javascript
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2]

Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [4,9]
\`\`\`

## Solution Approach
Use Set for O(1) lookups.

## Code
\`\`\`javascript
function intersection(nums1, nums2) {
    const set1 = new Set(nums1);
    const result = new Set();
    
    for (const num of nums2) {
        if (set1.has(num)) {
            result.add(num);
        }
    }
    
    return Array.from(result);
}
\`\`\`

## Time Complexity
**Time:** O(m + n)  
**Space:** O(min(m, n))

## Interview Tips
- Discuss using two Sets for different sized arrays
- Show alternative with sorting approach
- Explain handling duplicates
- Mention follow-up with intersection of three arrays`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Intersection of Two Arrays",
              problemUrl: "https://leetcode.com/problems/intersection-of-two-arrays",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Sorting & Two Pointers",
      slug: "sorting-two-pointers",
      description: "Master sorting algorithms and two-pointer techniques",
      orderIndex: 2,
      difficultyLevel: "BEGINNER",
      estimatedHours: 10,
      lessons: [
        {
          title: "Binary Search",
          slug: "binary-search",
          description: "Search in sorted array using divide and conquer",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-2-1-video",
          videoDurationSec: 600,
          markdownContent: `# Binary Search

## Problem Statement
Search for a target value in a sorted array.

## Input/Output
\`\`\`javascript
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4 (index)

Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1 (not found)
\`\`\`

## Solution Approach
Use divide and conquer with left and right pointers.

## Code
\`\`\`javascript
function search(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}
\`\`\`

## Time Complexity
**Time:** O(log n)  
**Space:** O(1)

## Interview Tips
- Explain why array must be sorted
- Show iterative vs recursive approaches
- Discuss handling duplicates
- Mention floor vs ceil for mid calculation`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Binary Search",
              problemUrl: "https://leetcode.com/problems/binary-search",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Squares of Sorted Array",
          slug: "squares-of-sorted-array",
          description: "Return squares of sorted array while maintaining order",
          orderIndex: 2,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-2-2-video",
          videoDurationSec: 540,
          markdownContent: `# Squares of Sorted Array

## Problem Statement
Given a sorted array, return squares of each number while maintaining sorted order.

## Input/Output
\`\`\`javascript
Input: [-4, -1, 0, 3, 10]
Output: [0, 1, 9, 16, 100]

Input: [-7, -3, 2, 3, 11]
Output: [4, 9, 9, 49, 121]
\`\`\`

## Solution Approach
Use two-pointer technique from both ends.

## Code
\`\`\`javascript
function sortedSquares(nums) {
    const result = new Array(nums.length);
    let left = 0, right = nums.length - 1;
    
    for (let i = nums.length - 1; i >= 0; i--) {
        const leftSquare = nums[left] * nums[left];
        const rightSquare = nums[right] * nums[right];
        
        if (leftSquare > rightSquare) {
            result[i] = leftSquare;
            left++;
        } else {
            result[i] = rightSquare;
            right--;
        }
    }
    
    return result;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(n)

## Interview Tips
- Explain two-pointer technique
- Show why we start from the end
- Discuss handling negative numbers
- Mention alternative using map and sort`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Squares of Sorted Array",
              problemUrl: "https://leetcode.com/problems/squares-of-a-sorted-array",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Remove Duplicates",
          slug: "remove-duplicates",
          description: "Remove duplicates from sorted array in-place",
          orderIndex: 3,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-2-3-video",
          videoDurationSec: 480,
          markdownContent: `# Remove Duplicates

## Problem Statement
Remove duplicates from sorted array in-place and return new length.

## Input/Output
\`\`\`javascript
Input: [1,1,2]
Output: [1,2], length = 2

Input: [0,0,1,1,1,2,2,3,3]
Output: [0,1,2,3], length = 4
\`\`\`

## Solution Approach
Use slow and fast pointers.

## Code
\`\`\`javascript
function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    
    let slow = 1;
    
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow - 1]) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    
    return slow;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(1)

## Interview Tips
- Explain two-pointer technique
- Show why we compare with nums[slow-1]
- Discuss in-place modification
- Mention follow-up with unsorted array`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Remove Duplicates from Sorted Array",
              problemUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Linked Lists",
      slug: "linked-lists",
      description: "Master singly and doubly linked list operations and algorithms",
      orderIndex: 3,
      difficultyLevel: "BEGINNER",
      estimatedHours: 8,
      lessons: [
        {
          title: "Reverse Linked List",
          slug: "reverse-linked-list",
          description: "Reverse a singly linked list",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-3-1-video",
          videoDurationSec: 540,
          markdownContent: `# Reverse Linked List

## Problem Statement
Reverse a singly linked list.

## Input/Output
\`\`\`javascript
Input: 1 -> 2 -> 3 -> null
Output: 3 -> 2 -> 1 -> null
\`\`\`

## Solution Approach
Iterative approach with previous pointer.

## Code
\`\`\`javascript
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(1)

## Interview Tips
- Show iterative vs recursive approaches
- Explain pointer manipulation
- Discuss handling empty list
- Mention space complexity difference`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Reverse Linked List",
              problemUrl: "https://leetcode.com/problems/reverse-linked-list",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Remove Nth Node",
          slug: "remove-nth-node",
          description: "Remove nth node from end of linked list",
          orderIndex: 2,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-3-2-video",
          videoDurationSec: 600,
          markdownContent: `# Remove Nth Node

## Problem Statement
Remove nth node from the end of linked list.

## Input/Output
\`\`\`javascript
Input: 1 -> 2 -> 3 -> 4 -> 5, n = 2
Output: 1 -> 2 -> 4 -> 5 (remove 3rd from end)

Input: 1 -> 2 -> 3 -> 4 -> 5, n = 1
Output: 2 -> 3 -> 4 -> 5 (remove head)
\`\`\`

## Solution Approach
Use dummy node and fast/slow pointers.

## Code
\`\`\`javascript
function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let slow = dummy;
    let fast = dummy;
    
    // Move fast n steps ahead
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // Move both until fast reaches end
    while (fast.next !== null) {
        slow = slow.next;
        fast = fast.next;
    }
    
    // Remove nth node
    slow.next = slow.next.next;
    
    return dummy.next;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(1)

## Interview Tips
- Explain dummy node technique
- Show two-pointer advantage
- Discuss edge cases (n = 0, n = length)
- Mention single pass solution`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Remove Nth Node From End",
              problemUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Stack & Queue",
      slug: "stacks-queues",
      description: "Master stack and queue data structures and their applications",
      orderIndex: 4,
      difficultyLevel: "BEGINNER",
      estimatedHours: 6,
      lessons: [
        {
          title: "Valid Parentheses",
          slug: "valid-parentheses",
          description: "Check if parentheses string is valid",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-4-1-video",
          videoDurationSec: 480,
          markdownContent: `# Valid Parentheses

## Problem Statement
Check if parentheses string is valid.

## Input/Output
\`\`\`javascript
Input: "()"
Output: true

Input: "()[]{}"
Output: true

Input: "(]"
Output: false
\`\`\`

## Solution Approach
Use stack to track opening brackets.

## Code
\`\`\`javascript
function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    
    for (const char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.length === 0 || stack.pop() !== map[char]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(n)

## Interview Tips
- Explain stack usage
- Show different bracket types
- Discuss early exit optimization
- Mention extension to other symbols`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Valid Parentheses",
              problemUrl: "https://leetcode.com/problems/valid-parentheses",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Graphs",
      slug: "graphs",
      description: "Master graph representations, traversals, and algorithms",
      orderIndex: 5,
      difficultyLevel: "MEDIUM",
      estimatedHours: 15,
      lessons: [
        {
          title: "Number of Islands",
          slug: "number-of-islands",
          description: "Count islands in 2D grid using DFS/BFS",
          orderIndex: 1,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/dsa-5-1-video",
          videoDurationSec: 720,
          markdownContent: `# Number of Islands

## Problem Statement
Count number of islands in 2D grid.

## Input/Output
\`\`\`javascript
Input: [
  ["1","1","0","0","0"],
  ["1","0","0","1","0"],
  ["1","1","0","0","0"]
]
Output: 3
\`\`\`

## Solution Approach
Use DFS to explore connected land.

## Code
\`\`\`javascript
function numIslands(grid) {
    let count = 0;
    
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '1') {
                dfs(i, j);
                count++;
            }
        }
    }
    }
    
    function dfs(i, j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] !== '1') {
            return;
        }
        
        grid[i][j] = '0'; // Mark visited
        
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    }
    
    return count;
}
\`\`\`

## Time Complexity
**Time:** O(m × n)  
**Space:** O(m × n) for recursion stack

## Interview Tips
- Explain DFS vs BFS trade-offs
- Show iterative stack-based DFS
- Discuss boundary checking
- Mention union-find alternative`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Number of Islands",
              problemUrl: "https://leetcode.com/problems/number-of-islands",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Dynamic Programming",
      slug: "dynamic-programming",
      description: "Master DP patterns, memoization, and optimization techniques",
      orderIndex: 6,
      difficultyLevel: "HARD",
      estimatedHours: 15,
      lessons: [
        {
          title: "Climbing Stairs",
          slug: "climbing-stairs",
          description: "Count ways to climb stairs with 1 or 2 steps",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-6-1-video",
          videoDurationSec: 540,
          markdownContent: `# Climbing Stairs

## Problem Statement
Count ways to climb n stairs taking 1 or 2 steps at a time.

## Input/Output
\`\`\`javascript
Input: n = 2
Output: 2 (1+1, 2)

Input: n = 3
Output: 3 (1+1+1, 1+2, 2+1)
\`\`\`

## Solution Approach
DP with fibonacci pattern.

## Code
\`\`\`javascript
function climbStairs(n) {
    if (n <= 1) return 1;
    
    let dp = new Array(n + 1);
    dp[0] = 1;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(n) - can be optimized to O(1)

## Interview Tips
- Explain fibonacci relationship
- Show space optimization
- Discuss matrix exponentiation for O(log n)
- Mention modulo arithmetic for large numbers`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Climbing Stairs",
              problemUrl: "https://leetcode.com/problems/climbing-stairs",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "House Robber",
          slug: "house-robber",
          description: "Maximum money from non-adjacent houses",
          orderIndex: 2,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/dsa-6-2-video",
          videoDurationSec: 600,
          markdownContent: `# House Robber

## Problem Statement
Given array of house values, rob maximum money without robbing adjacent houses.

## Input/Output
\`\`\`javascript
Input: [1,2,3,1]
Output: 4 (rob houses 1 and 3)

Input: [2,7,9,3,1]
Output: 12 (rob houses 2, 4, and 6)
\`\`\`

## Solution Approach
DP with include/exclude pattern.

## Code
\`\`\`javascript
function rob(nums) {
    let prev = 0, curr = 0;
    
    for (const num of nums) {
        const newCurr = Math.max(curr, prev + num);
        prev = curr;
        curr = newCurr;
    }
    
    return curr;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(1)

## Interview Tips
- Explain DP state transition
- Show include/exclude pattern
- Discuss circular house variation
- Mention space optimization`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "House Robber",
              problemUrl: "https://leetcode.com/problems/house-robber",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Trees",
      slug: "trees",
      description: "Master tree traversals, binary trees, and tree algorithms",
      orderIndex: 7,
      difficultyLevel: "MEDIUM",
      estimatedHours: 10,
      lessons: [
        {
          title: "Invert Binary Tree",
          slug: "invert-binary-tree",
          description: "Invert a binary tree (mirror it)",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-7-1-video",
          videoDurationSec: 480,
          markdownContent: `# Invert Binary Tree

## Problem Statement
Invert a binary tree (mirror left and right subtrees).

## Input/Output
\`\`\`javascript
Input:     4
         / \\
        2     7
       / \\   / \\
      1   3 6   9

Output:     4
         / \\
        7     2
       / \\   / \\
      9   6 3   1
\`\`\`

## Solution Approach
Recursive approach swapping left and right children.

## Code
\`\`\`javascript
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function invertTree(root) {
    if (root === null) return null;
    
    const newLeft = invertTree(root.right);
    const newRight = invertTree(root.left);
    
    root.left = newLeft;
    root.right = newRight;
    
    return root;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(h) for recursion stack

## Interview Tips
- Explain recursive tree traversal
- Show iterative approach with stack
- Discuss handling null nodes
- Mention in-place modification`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Invert Binary Tree",
              problemUrl: "https://leetcode.com/problems/invert-binary-tree",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Binary Tree Level Order Traversal",
          slug: "binary-tree-level-order-traversal",
          description: "Return nodes level by level using BFS",
          orderIndex: 2,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/dsa-7-2-video",
          videoDurationSec: 600,
          markdownContent: `# Binary Tree Level Order Traversal

## Problem Statement
Return nodes of binary tree level by level from top to bottom.

## Input/Output
\`\`\`javascript
Input:     3
         / \\
        9     20
       / \\   / \\
      15   7

Output: [[3], [9, 20], [15, 7]]
\`\`\`

## Solution Approach
BFS using queue.

## Code
\`\`\`javascript
function levelOrder(root) {
    if (root === null) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(n)

## Interview Tips
- Explain BFS vs DFS for level order
- Show queue implementation
- Discuss space complexity
- Mention zigzag variation`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Binary Tree Level Order Traversal",
              problemUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Bit Manipulation",
      slug: "bit-manipulation",
      description: "Master bit manipulation techniques and tricks",
      orderIndex: 8,
      difficultyLevel: "MEDIUM",
      estimatedHours: 4,
      lessons: [
        {
          title: "Single Number",
          slug: "single-number",
          description: "Find number that appears once while others appear twice",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/dsa-8-1-video",
          videoDurationSec: 480,
          markdownContent: `# Single Number

## Problem Statement
Given array where every element appears twice except one, find the single one.

## Input/Output
\`\`\`javascript
Input: [2,2,1]
Output: 1

Input: [4,1,2,1,2]
Output: 4
\`\`\`

## Solution Approach
Use XOR property.

## Code
\`\`\`javascript
function singleNumber(nums) {
    return nums.reduce((acc, num) => acc ^ num, 0);
}
\`\`\`

## Time Complexity
**Time:** O(n)  
**Space:** O(1)

## Interview Tips
- Explain XOR properties
- Show why XOR works for this problem
- Discuss alternative using hash map
- Mention bit manipulation benefits`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Single Number",
              problemUrl: "https://leetcode.com/problems/single-number",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        }
      ]
    }
  ]
};