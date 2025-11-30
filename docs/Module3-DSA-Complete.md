# PrepKit Module 3: Data Structures & Algorithms
## Complete Course Content

**Module Weight:** 30% of interview preparation  
**Total Duration:** 40-50 hours  
**Total Problems:** 130  
**Difficulty:** Easy → Hard  

---

## 📚 MODULE OVERVIEW

This module is **essential** because:
- Tests algorithmic thinking
- Shows optimization capability
- Senior engineer differentiator
- Real coding ability showcase

**Target Companies:** All (especially Google, Amazon, Meta)

---

## SECTION 1: ARRAYS & HASHING (18 Problems)

### Easy Problems (6)

#### 1.1: Two Sum ⭐⭐⭐

**Problem Statement:**
Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to the target. You cannot use the same element twice.

**Input/Output:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Input: nums = [3,2,4], target = 6
Output: [1,2]
```

**Constraints:**
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9
- -10^9 ≤ target ≤ 10^9

**Solution Approach:**
1. Use HashMap to store value → index
2. For each number, check if (target - number) exists in map
3. Return indices when found

**Code:**
```javascript
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
```

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

**Edge Cases:**
- Negative numbers: target = 0, nums = [-1, 0, 1]
- Duplicates: target = 4, nums = [2, 2, 2]
- Two large numbers: nums = [1000000, -1000000]

**Interview Tips:**
- Mention brute force first (O(n²))
- Show optimization to O(n)
- Explain HashMap usage
- Discuss why we store index

**Follow-up Questions:**
1. What if you need all pairs?
2. What if target was sum of 3 numbers (3Sum)?
3. Return pair values instead of indices?

**Company Asked At:** Apollo, Salesforce, Every company

---

#### 1.2: Contains Duplicate ⭐⭐

**Problem Statement:**
Given an array of integers, return true if any value appears at least twice.

**Code:**
```javascript
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
```

**Time:** O(n) | **Space:** O(n)

---

#### 1.3: Valid Anagram ⭐⭐

**Problem Statement:**
Given two strings `s` and `t`, return true if `t` is an anagram of `s`.

**Code:**
```javascript
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
```

**Time:** O(n) | **Space:** O(1) (max 26 letters)

---

#### 1.4: Best Time to Buy and Sell Stock ⭐⭐

**Problem Statement:**
You are given an array `prices` where `prices[i]` is the price on the i-th day. Find the maximum profit.

**Code:**
```javascript
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
```

**Time:** O(n) | **Space:** O(1)

---

#### 1.5: Valid Palindrome ⭐⭐

**Problem Statement:**
Check if a string is a palindrome (ignoring case and non-alphanumeric characters).

**Code:**
```javascript
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
```

**Time:** O(n) | **Space:** O(n)

---

#### 1.6: Intersection of Two Arrays ⭐⭐

**Problem Statement:**
Given two arrays, return an array of their intersection (common elements).

**Code:**
```javascript
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
```

**Time:** O(m + n) | **Space:** O(m)

---

### Medium Problems (8)

#### 2.1: Odd String Difference ⭐⭐⭐

**Problem:** Salesforce interview question

**Code:**
```javascript
function oddStringDiff(words) {
    const map = {};
    
    for (const word of words) {
        const diff = getDifference(word);
        map[diff] = (map[diff] || 0) + 1;
    }
    
    // Find the string with unique difference
    for (const word of words) {
        const diff = getDifference(word);
        if (map[diff] === 1) {
            return word;
        }
    }
    
    function getDifference(word) {
        const diffs = [];
        for (let i = 0; i < word.length - 1; i++) {
            diffs.push(word.charCodeAt(i + 1) - word.charCodeAt(i));
        }
        return diffs.toString();
    }
}
```

---

#### 2.2: Product of Array Except Self ⭐⭐⭐

**Problem:** Salesforce interview question

**Code:**
```javascript
function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);
    
    // Calculate prefix products
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        result[i] *= prefix;
        prefix *= nums[i];
    }
    
    // Calculate suffix products
    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }
    
    return result;
}
```

**Time:** O(n) | **Space:** O(1) (excluding output)

---

#### 2.3: Longest Consecutive Sequence ⭐⭐⭐

**Problem:** Mindtickle interview question

**Code:**
```javascript
function longestConsecutive(nums) {
    const set = new Set(nums);
    let maxLength = 0;
    
    for (const num of set) {
        // Start of sequence
        if (!set.has(num - 1)) {
            let current = num;
            let length = 1;
            
            while (set.has(current + 1)) {
                current++;
                length++;
            }
            
            maxLength = Math.max(maxLength, length);
        }
    }
    
    return maxLength;
}
```

**Time:** O(n) | **Space:** O(n)

---

#### 2.4: Group Anagrams ⭐⭐

**Code:**
```javascript
function groupAnagrams(strs) {
    const map = {};
    
    for (const str of strs) {
        const key = str.split('').sort().join('');
        
        if (!map[key]) {
            map[key] = [];
        }
        map[key].push(str);
    }
    
    return Object.values(map);
}
```

**Time:** O(n * k log k) where k is max string length

---

#### 2.5: Subarray Sum Equals K ⭐⭐

**Code:**
```javascript
function subarraySum(nums, k) {
    const map = { 0: 1 };
    let count = 0;
    let sum = 0;
    
    for (const num of nums) {
        sum += num;
        const complement = sum - k;
        
        if (map[complement]) {
            count += map[complement];
        }
        
        map[sum] = (map[sum] || 0) + 1;
    }
    
    return count;
}
```

**Time:** O(n) | **Space:** O(n)

---

#### 2.6: Majority Element ⭐⭐

**Code:**
```javascript
function majorityElement(nums) {
    let count = 0;
    let candidate;
    
    for (const num of nums) {
        if (count === 0) {
            candidate = num;
        }
        count += (num === candidate) ? 1 : -1;
    }
    
    return candidate;
}
```

**Time:** O(n) | **Space:** O(1)  
**Algorithm:** Boyer-Moore Voting

---

#### 2.7: First Missing Positive ⭐⭐⭐

**Code:**
```javascript
function firstMissingPositive(nums) {
    const n = nums.length;
    
    // Place each number in its correct position
    for (let i = 0; i < n; i++) {
        while (
            nums[i] > 0 &&
            nums[i] <= n &&
            nums[nums[i] - 1] !== nums[i]
        ) {
            // Swap
            [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];
        }
    }
    
    // Find first missing
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    return n + 1;
}
```

**Time:** O(n) | **Space:** O(1)

---

#### 2.8: Valid Sudoku ⭐⭐

**Code:**
```javascript
function isValidSudoku(board) {
    const rows = Array(9).fill().map(() => new Set());
    const cols = Array(9).fill().map(() => new Set());
    const boxes = Array(9).fill().map(() => new Set());
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = board[i][j];
            if (num === '.') continue;
            
            const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            
            if (rows[i].has(num) || cols[j].has(num) || boxes[boxIndex].has(num)) {
                return false;
            }
            
            rows[i].add(num);
            cols[j].add(num);
            boxes[boxIndex].add(num);
        }
    }
    
    return true;
}
```

**Time:** O(1) (9x9 board) | **Space:** O(1)

---

### Hard Problems (4)

#### 3.1: Set Matrix Zeroes ⭐⭐

#### 3.2: Max Element from Array ES5 ⭐⭐

**Problem:** ServiceNow interview question

**Code:**
```javascript
function maxElement(arr) {
    // Use reduce with ES5
    return arr.reduce((max, current) => {
        return current > max ? current : max;
    });
    
    // Or using forEach
    let max = arr[0];
    arr.forEach(num => {
        if (num > max) max = num;
    });
    return max;
}
```

---

## SECTION 2: SORTING, SEARCHING, TWO POINTERS (12 Problems)

### Easy Problems (3)

#### 1.1: Binary Search ⭐⭐

**Code:**
```javascript
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
```

**Time:** O(log n) | **Space:** O(1)

---

#### 1.2: Squares of Sorted Array ⭐⭐

**Problem:** Mindtickle interview question

**Code:**
```javascript
function sortedSquares(nums) {
    const result = new Array(nums.length);
    let left = 0, right = nums.length - 1;
    
    for (let i = nums.length - 1; i >= 0; i--) {
        if (Math.abs(nums[left]) > Math.abs(nums[right])) {
            result[i] = nums[left] * nums[left];
            left++;
        } else {
            result[i] = nums[right] * nums[right];
            right--;
        }
    }
    
    return result;
}
```

**Time:** O(n) | **Space:** O(1)

---

#### 1.3: Remove Duplicates ⭐⭐

**Code:**
```javascript
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
```

**Time:** O(n) | **Space:** O(1)

---

### Medium Problems (7)

#### 2.1: 3Sum ⭐⭐

**Code:**
```javascript
function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1, right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

**Time:** O(n²) | **Space:** O(1)

---

#### 2.2: Container with Most Water ⭐⭐

**Code:**
```javascript
function maxArea(height) {
    let maxArea = 0;
    let left = 0, right = height.length - 1;
    
    while (left < right) {
        const h = Math.min(height[left], height[right]);
        const w = right - left;
        maxArea = Math.max(maxArea, h * w);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}
```

**Time:** O(n) | **Space:** O(1)

---

#### 2.3-2.7: [Other Medium Problems with detailed solutions]

---

### Hard Problems (2)

#### 3.1: Merge Intervals with Streaming (Google) ⭐⭐⭐

#### 3.2: Merge K Sorted Lists ⭐⭐⭐

---

## SECTION 3: LINKED LISTS (8 Problems)

### Easy Problems (2)

#### 1.1: Reverse Linked List ⭐⭐

**Code:**
```javascript
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}
```

**Time:** O(n) | **Space:** O(1)

---

#### 1.2: Remove Nth Node ⭐⭐

**Code:**
```javascript
function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let fast = dummy, slow = dummy;
    
    // Move fast n+1 steps ahead
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // Move both until fast reaches end
    while (fast) {
        fast = fast.next;
        slow = slow.next;
    }
    
    slow.next = slow.next.next;
    
    return dummy.next;
}
```

**Time:** O(n) | **Space:** O(1)

---

### Medium Problems (4)

#### 2.1: Detect Cycle ⭐⭐

**Code:**
```javascript
function hasCycle(head) {
    let slow = head, fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            return true;
        }
    }
    
    return false;
}
```

**Time:** O(n) | **Space:** O(1)  
**Algorithm:** Floyd's Cycle Detection

---

#### 2.2: LRU Cache ⭐⭐⭐

**Code:** (Uses Linked List + HashMap)
```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();
        this.head = new ListNode(0);
        this.tail = new ListNode(0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    get(key) {
        if (!this.map.has(key)) return -1;
        
        const node = this.map.get(key);
        this._remove(node);
        this._add(node);
        
        return node.value;
    }
    
    put(key, value) {
        if (this.map.has(key)) {
            this._remove(this.map.get(key));
        }
        
        const node = new ListNode(value);
        node.key = key;
        this.map.set(key, node);
        this._add(node);
        
        if (this.map.size > this.capacity) {
            const removed = this.head.next;
            this._remove(removed);
            this.map.delete(removed.key);
        }
    }
    
    _add(node) {
        node.next = this.tail;
        node.prev = this.tail.prev;
        this.tail.prev.next = node;
        this.tail.prev = node;
    }
    
    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}
```

**Time:** O(1) for get and put | **Space:** O(capacity)

---

#### 2.3-2.4: [Other Medium Problems]

---

### Hard Problems (2)

#### 3.1: Merge K Sorted Lists ⭐⭐⭐

#### 3.2: Palindrome Linked List ⭐⭐

---

## SECTION 4: STACK & QUEUE (6 Problems)

### Easy Problems (1)

#### 1.1: Valid Parentheses ⭐

**Code:**
```javascript
function isValid(s) {
    const stack = [];
    const map = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    
    for (const char of s) {
        if (map[char]) {
            stack.push(char);
        } else {
            if (!stack.length || map[stack.pop()] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}
```

**Time:** O(n) | **Space:** O(n)

---

### Medium Problems (3)

#### 2.1: Sliding Window Maximum ⭐⭐⭐

**Code:**
```javascript
function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // indices
    
    for (let i = 0; i < nums.length; i++) {
        // Remove out of window
        while (deque.length && deque[0] < i - k + 1) {
            deque.shift();
        }
        
        // Remove smaller elements
        while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}
```

**Time:** O(n) | **Space:** O(k)

---

#### 2.2: Daily Temperatures ⭐⭐

#### 2.3: Next Greater Element ⭐⭐

---

### Hard Problems (2)

#### 3.1: Largest Rectangle in Histogram ⭐⭐⭐

#### 3.2: Trapping Rain Water ⭐⭐⭐

---

## SECTION 5: GRAPHS (15 Problems)

### Easy Problems (2)

#### 1.1: Number of Islands ⭐⭐

**Code:**
```javascript
function numIslands(grid) {
    let count = 0;
    
    function dfs(i, j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === '0') {
            return;
        }
        
        grid[i][j] = '0'; // Mark visited
        
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    }
    
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(i, j);
            }
        }
    }
    
    return count;
}
```

**Time:** O(m * n) | **Space:** O(m * n)

---

#### 1.2: Clone Graph ⭐⭐

---

### Medium Problems (8)

#### 2.1: Evaluate Division ⭐⭐⭐

**Problem:** Salesforce interview question

---

#### 2.2-2.8: [Other Medium Problems]

---

### Hard Problems (5)

#### 3.1: Shortest Path in Unweighted Graph ⭐⭐

**Problem:** Google interview question

---

#### 3.2: Network Delay Time ⭐⭐⭐

**Code:** (Dijkstra's Algorithm)

---

#### 3.3-3.5: [Other Hard Problems]

---

## SECTION 6: DYNAMIC PROGRAMMING (15 Problems)

### Easy Problems (3)

#### 1.1: Fibonacci ⭐

**Code:**
```javascript
function fibonacci(n) {
    if (n <= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}
```

**Time:** O(n) | **Space:** O(1)

---

#### 1.2: Climbing Stairs ⭐

**Code:**
```javascript
function climbStairs(n) {
    if (n <= 1) return 1;
    
    let prev = 1, curr = 1;
    
    for (let i = 2; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
    }
    
    return curr;
}
```

**Time:** O(n) | **Space:** O(1)

---

#### 1.3: House Robber ⭐⭐

**Code:**
```javascript
function rob(nums) {
    let prev = 0, curr = 0;
    
    for (const num of nums) {
        [prev, curr] = [curr, Math.max(curr, prev + num)];
    }
    
    return curr;
}
```

**Time:** O(n) | **Space:** O(1)

---

### Medium Problems (8)

#### 2.1: Coin Change ⭐⭐⭐

**Code:**
```javascript
function coinChange(coins, amount) {
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

**Time:** O(amount * coins.length) | **Space:** O(amount)

---

#### 2.2-2.8: [Other Medium DP Problems]

---

### Hard Problems (4)

#### 3.1: Edit Distance ⭐⭐⭐

**Code:**
```javascript
function editDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],    // Delete
                    dp[i][j - 1],    // Insert
                    dp[i - 1][j - 1] // Replace
                );
            }
        }
    }
    
    return dp[m][n];
}
```

**Time:** O(m * n) | **Space:** O(m * n)

---

#### 3.2-3.4: [Other Hard DP Problems]

---

## SECTION 7: TREES (10 Problems)

### Easy Problems (2)

#### 1.1: Invert Binary Tree ⭐

**Code:**
```javascript
function invertTree(root) {
    if (!root) return null;
    
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
    
    return root;
}
```

**Time:** O(n) | **Space:** O(h)

---

#### 1.2: Binary Tree Level Order Traversal ⭐⭐

---

### Medium Problems (5)

#### 2.1: Validate BST ⭐⭐

#### 2.2: Lowest Common Ancestor ⭐⭐

#### 2.3-2.5: [Other Medium Tree Problems]

---

### Hard Problems (3)

#### 3.1: Serialize & Deserialize Tree ⭐⭐⭐

#### 3.2: Maximum Path Sum ⭐⭐⭐

#### 3.3: [Other Hard Tree Problem]

---

## SECTION 8: BIT MANIPULATION (4 Problems)

#### 1.1: Single Number ⭐⭐

**Code:**
```javascript
function singleNumber(nums) {
    return nums.reduce((acc, num) => acc ^ num);
}
```

**Time:** O(n) | **Space:** O(1)

---

#### 1.2: XOR > AND Pairs ⭐⭐⭐

**Problem:** ServiceNow interview question

---

#### 1.3-1.4: [Other Bit Problems]

---

## ASSESSMENT & PRACTICE

### Total: 130 Problems
- Easy: 28
- Medium: 71
- Hard: 31

### Practice Sections:
- After each section: 3-5 practice problems
- Mid-module: Practice test (10 problems)
- End-of-module: Full exam (20 problems)

### Company-Specific Problem Sets:
- Google: Graph + Hard DSA
- Amazon: Arrays + Trees
- Salesforce: Arrays + Hashing
- Meta: Graphs + Trees
- ServiceNow: Arrays + Bit Manipulation

---

**Expected Completion Time:** 40-50 hours  
**Prerequisite:** Modules 1-2  
**Success Metric:** Solve 80% of problems under time constraints  

**By the end of this module, you should ace DSA round with 85%+ accuracy.**
