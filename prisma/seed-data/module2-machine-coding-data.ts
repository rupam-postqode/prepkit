export const machineCodingModuleData = {
  chapters: [
    {
      title: "Easy Patterns",
      slug: "easy-patterns",
      description: "Fundamental implementation patterns for machine coding rounds",
      orderIndex: 1,
      difficultyLevel: "BEGINNER",
      estimatedHours: 12,
      lessons: [
        {
          title: "Array Polyfills (map, filter, reduce, every)",
          slug: "array-polyfills",
          description: "Implement native array methods from scratch",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/mc-1-1-video",
          videoDurationSec: 900,
          markdownContent: `# Array Polyfills (map, filter, reduce, every)

## Learning Objectives
- Understand native array methods
- Implement from scratch
- Know iteration patterns
- Handle edge cases

## Content

### Part 1: Array.map Polyfill

\`\`\`javascript
Array.prototype.myMap = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(\`\${callback} is not a function\`);
    }
    
    const result = [];
    
    for (let i = 0; i < this.length; i++) {
        if (i in this) { // skip holes
            result[i] = callback.call(thisArg, this[i], i, this);
        }
    }
    
    return result;
};
\`\`\`

### Part 2: Array.filter Polyfill

\`\`\`javascript
Array.prototype.myFilter = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(\`\${callback} is not a function\`);
    }
    
    const result = [];
    
    for (let i = 0; i < this.length; i++) {
        if (i in this && callback.call(thisArg, this[i], i, this)) {
            result.push(this[i]);
        }
    }
    
    return result;
};
\`\`\`

### Part 3: Array.reduce Polyfill

\`\`\`javascript
Array.prototype.myReduce = function(callback, initialValue) {
    if (typeof callback !== 'function') {
        throw new TypeError(\`\${callback} is not a function\`);
    }
    
    let accumulator = initialValue;
    let startIndex = 0;
    
    if (arguments.length < 2) {
        if (this.length === 0) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        accumulator = this[0];
        startIndex = 1;
    }
    
    for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
            accumulator = callback.call(undefined, accumulator, this[i], i, this);
        }
    }
    
    return accumulator;
};
\`\`\`

### Part 4: Array.every Polyfill

\`\`\`javascript
Array.prototype.myEvery = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(\`\${callback} is not a function\`);
    }
    
    for (let i = 0; i < this.length; i++) {
        if (i in this && !callback.call(thisArg, this[i], i, this)) {
            return false;
        }
    }
    
    return true;
};
\`\`\`

### Part 5: Testing Polyfills

\`\`\`javascript
const arr = [1, 2, 3, undefined, 4];
const doubled = arr.myMap(x => x * 2);
const evens = arr.myFilter(x => x % 2 === 0);
const sum = arr.myReduce((acc, curr) => acc + curr, 0);
const allPositive = arr.myEvery(x => x > 0);

console.log(doubled); // [2, 4, 6, 8]
console.log(evens);    // [2, 4]
console.log(sum);      // 10
console.log(allPositive); // false
\`\`\`

## Interview Tips
- Mention handling sparse arrays (holes)
- Show understanding of thisArg parameter
- Explain callback signature (value, index, array)
- Test edge cases (empty array, undefined values)
- Discuss time/space complexity

## Follow-up Questions
1. What's the difference between map and forEach?
2. How would you optimize reduce for large arrays?
3. Why do we check 'i in this' in polyfills?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Implement Array Map",
              problemUrl: "https://leetcode.com/problems/implement-array-map",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "Array Polyfills Practice",
              problemUrl: "https://codesandbox.io/s/array-polyfills-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Method Chaining",
          slug: "method-chaining",
          description: "Build a Calculator class supporting method chaining",
          orderIndex: 2,
          difficulty: "EASY",
          videoUrl: "https://example.com/mc-1-2-video",
          videoDurationSec: 600,
          markdownContent: `# Method Chaining

## Learning Objectives
- Understand fluent interface pattern
- Master 'this' context in chaining
- Know when to return 'this' vs new object
- Build practical chainable APIs

## Content

### Part 1: Calculator Class with Chaining

\`\`\`javascript
class Calculator {
    constructor(initialValue = 0) {
        this.value = initialValue;
    }
    
    add(num) {
        this.value += num;
        return this; // Return instance for chaining
    }
    
    subtract(num) {
        this.value -= num;
        return this;
    }
    
    multiply(num) {
        this.value *= num;
        return this;
    }
    
    divide(num) {
        if (num === 0) throw new Error('Division by zero');
        this.value /= num;
        return this;
    }
    
    getValue() {
        return this.value;
    }
    
    reset() {
        this.value = 0;
        return this;
    }
}

// Test
const result = new Calculator(2)
    .add(3)
    .multiply(4)
    .subtract(5)
    .getValue();

console.log(result); // 15
// (2 + 3) * 4 - 5 = 15
\`\`\`

### Part 2: Advanced Chaining Features

\`\`\`javascript
class AdvancedCalculator {
    constructor(initialValue = 0) {
        this.value = initialValue;
        this.history = [];
    }
    
    add(num) {
        this.value += num;
        this.history.push({ operation: 'add', value: num, result: this.value });
        return this;
    }
    
    subtract(num) {
        this.value -= num;
        this.history.push({ operation: 'subtract', value: num, result: this.value });
        return this;
    }
    
    multiply(num) {
        this.value *= num;
        this.history.push({ operation: 'multiply', value: num, result: this.value });
        return this;
    }
    
    divide(num) {
        if (num === 0) throw new Error('Division by zero');
        this.value /= num;
        this.history.push({ operation: 'divide', value: num, result: this.value });
        return this;
    }
    
    getValue() {
        return this.value;
    }
    
    getHistory() {
        return this.history;
    }
    
    reset() {
        this.value = 0;
        this.history = [];
        return this;
    }
}
\`\`\`

### Part 3: Real-world Applications

\`\`\`javascript
// Query Builder with chaining
class QueryBuilder {
    constructor() {
        this.query = {
            select: [],
            from: null,
            where: [],
            orderBy: []
        };
    }
    
    select(fields) {
        this.query.select = Array.isArray(fields) ? fields : [fields];
        return this;
    }
    
    from(table) {
        this.query.from = table;
        return this;
    }
    
    where(conditions) {
        this.query.where.push(conditions);
        return this;
    }
    
    orderBy(field, direction = 'ASC') {
        this.query.orderBy.push({ field, direction });
        return this;
    }
    
    build() {
        let sql = 'SELECT ';
        sql += this.query.select.join(', ');
        sql += ' FROM ' + this.query.from;
        
        if (this.query.where.length > 0) {
            sql += ' WHERE ' + this.query.where.join(' AND ');
        }
        
        if (this.query.orderBy.length > 0) {
            sql += ' ORDER BY ' + this.query.orderBy
                .map(item => \`\${item.field} \${item.direction}\`)
                .join(', ');
        }
        
        return sql;
    }
}

// Usage
const query = new QueryBuilder()
    .select(['name', 'email'])
    .from('users')
    .where({ active: true })
    .orderBy('created_at', 'DESC')
    .build();

console.log(query);
// SELECT name, email FROM users WHERE active = true ORDER BY created_at DESC
\`\`\`

## Interview Tips
- Explain "fluent interface" pattern
- Show how 'this' is preserved in chain
- Demonstrate practical use cases
- Discuss when to break chain (return value vs this)
- Mention performance considerations

## Follow-up Questions
1. What's the difference between returning 'this' and a new object?
2. How would you add error handling in chains?
3. Can you implement async method chaining?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Method Chaining Pattern",
              problemUrl: "https://leetcode.com/problems/method-chaining-pattern",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "Chaining Practice",
              problemUrl: "https://codesandbox.io/s/chaining-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Debouncing",
          slug: "debouncing",
          description: "Implement debounce to delay execution until after waiting period",
          orderIndex: 3,
          difficulty: "EASY",
          videoUrl: "https://example.com/mc-1-3-video",
          videoDurationSec: 600,
          markdownContent: `# Debouncing

## Learning Objectives
- Understand debouncing concept
- Implement debounce function
- Know use cases for debouncing
- Differentiate from throttling

## Content

### Part 1: Basic Debounce Implementation

\`\`\`javascript
function debounce(fn, delay) {
    let timeoutId;
    
    return function(...args) {
        // Clear previous timeout
        clearTimeout(timeoutId);
        
        // Set new timeout
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
\`\`\`

### Part 2: Use Cases

\`\`\`javascript
// Search input debouncing
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
    console.log('Searching for:', query);
    // Make API call here
}, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// Button click debouncing
const saveButton = document.getElementById('save');
const debouncedSave = debounce(() => {
    console.log('Saving data...');
    // Save logic here
}, 1000);

saveButton.addEventListener('click', debouncedSave);
\`\`\`

### Part 3: Advanced Debounce Features

\`\`\`javascript
function advancedDebounce(fn, delay, options = {}) {
    let timeoutId;
    let lastCallTime = 0;
    
    return function(...args) {
        const now = Date.now();
        
        // If leading edge is disabled and this is first call
        if (!options.leading && now - lastCallTime < delay) {
            return;
        }
        
        // Clear previous timeout
        clearTimeout(timeoutId);
        
        // Set new timeout
        timeoutId = setTimeout(() => {
            lastCallTime = Date.now();
            fn.apply(this, args);
        }, delay);
        
        lastCallTime = now;
    };
}

// Usage with options
const debouncedFn = advancedDebounce(apiCall, 500, {
    leading: false,    // Don't execute on first call
    trailing: true     // Execute on last call if within delay
});

\`\`\`

## Interview Tips
- Explain debouncing vs throttling
- Show practical examples (search, button clicks)
- Discuss leading/trailing edge options
- Mention performance benefits
- Explain why this matters in production

## Follow-up Questions
1. What's the difference between debounce and throttle?
2. When would you use leading: false?
3. How would you implement a debounce that can be cancelled?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Debounce Implementation",
              problemUrl: "https://leetcode.com/problems/debounce-implementation",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "Debounce Practice",
              problemUrl: "https://codesandbox.io/s/debounce-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Throttling",
          slug: "throttling",
          description: "Implement throttle to limit execution frequency",
          orderIndex: 4,
          difficulty: "EASY",
          videoUrl: "https://example.com/mc-1-4-video",
          videoDurationSec: 600,
          markdownContent: `# Throttling

## Learning Objectives
- Understand throttling concept
- Implement throttle function
- Know use cases for throttling
- Differentiate from debouncing

## Content

### Part 1: Time-based Throttling

\`\`\`javascript
function throttle(fn, delay) {
    let lastExecuted = 0;
    
    return function(...args) {
        const now = Date.now();
        
        if (now - lastExecuted >= delay) {
            fn.apply(this, args);
            lastExecuted = now;
        }
    };
}
\`\`\`

### Part 2: Alternative Implementation

\`\`\`javascript
function throttleWithTimer(fn, delay) {
    let timeoutId = null;
    let lastExecuted = 0;
    
    return function(...args) {
        const now = Date.now();
        
        if (now - lastExecuted >= delay) {
            fn.apply(this, args);
            lastExecuted = now;
        } else {
            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            // Set new timeout
            timeoutId = setTimeout(() => {
                fn.apply(this, args);
                lastExecuted = Date.now();
            }, delay - (now - lastExecuted));
        }
    };
}
\`\`\`

### Part 3: Use Cases

\`\`\`javascript
// Scroll event throttling
const throttledScroll = throttle((e) => {
    console.log('Scroll position:', e.scrollY);
    // Process scroll event
}, 100);

window.addEventListener('scroll', throttledScroll);

// API rate limiting
const throttledAPI = throttle((data) => {
    console.log('API call:', data);
    // Make API request here
}, 1000);

// Multiple rapid calls
for (let i = 0; i < 10; i++) {
    throttledAPI(\`Request \${i}\`);
}
\`\`\`

## Interview Tips
- Explain time-based throttling
- Show difference between simple and timer-based approaches
- Discuss use cases (scroll, API calls, animations)
- Mention performance benefits
- Explain when to use throttle vs debounce

## Follow-up Questions
1. What's the difference between debounce and throttle?
2. When would you prefer throttle over debounce?
3. How would you implement a throttle that preserves the last call?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Throttle Implementation",
              problemUrl: "https://leetcode.com/problems/throttle-implementation",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "Throttle Practice",
              problemUrl: "https://codesandbox.io/s/throttle-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Array Flattening",
          slug: "array-flattening",
          description: "Flatten nested arrays (recursive + iterative + with depth)",
          orderIndex: 5,
          difficulty: "EASY",
          videoUrl: "https://example.com/mc-1-5-video",
          videoDurationSec: 720,
          markdownContent: `# Array Flattening

## Learning Objectives
- Master array flattening techniques
- Understand recursive vs iterative approaches
- Handle depth limits
- Know performance considerations

## Content

### Part 1: Recursive Approach

\`\`\`javascript
function flattenRecursive(arr) {
    const result = [];
    
    for (const item of arr) {
        if (Array.isArray(item)) {
            result.push(...flattenRecursive(item));
        } else {
            result.push(item);
        }
    }
    
    return result;
}
\`\`\`

### Part 2: Iterative Approach

\`\`\`javascript
function flattenIterative(arr) {
    const stack = [...arr];
    const result = [];
    
    while (stack.length) {
        const item = stack.pop();
        
        if (Array.isArray(item)) {
            stack.push(...item);
        } else {
            result.push(item);
        }
    }
    
    return result.reverse();
}
\`\`\`

### Part 3: With Depth Limit

\`\`\`javascript
function flattenWithDepth(arr, depth = 1) {
    const result = [];
    
    for (const item of arr) {
        if (Array.isArray(item) && depth > 0) {
            result.push(...flattenWithDepth(item, depth - 1));
        } else {
            result.push(item);
        }
    }
    
    return result;
}
\`\`\`

### Part 4: Testing Functions

\`\`\`javascript
const nested = [[1, 2], [3, [4, 5]], 6];
console.log(flattenRecursive(nested)); // [1, 2, 3, 4, 5, 6]
console.log(flattenIterative(nested)); // [1, 2, 3, 4, 5, 6]
console.log(flattenWithDepth(nested, 2)); // [1, 2, [3, [4, 5], 6]
console.log(flattenWithDepth(nested, 1)); // [1, 2, 3, [4, 5, 6]
\`\`\`

## Interview Tips
- Explain recursive vs iterative trade-offs
- Discuss stack overflow risks with deep nesting
- Show memory usage differences
- Mention tail recursion optimization
- Explain when to use depth limiting

## Follow-up Questions
1. What's the time complexity of recursive flattening?
2. How would you optimize flattening for very large arrays?
3. Can you implement tail-recursive flattening?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Array Flattening",
              problemUrl: "https://leetcode.com/problems/array-flattening",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "Flattening Practice",
              problemUrl: "https://codesandbox.io/s/flattening-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Pipe & Compose",
          slug: "pipe-compose",
          description: "Create pipe and compose for function composition",
          orderIndex: 6,
          difficulty: "EASY",
          videoUrl: "https://example.com/mc-1-6-video",
          videoDurationSec: 600,
          markdownContent: `# Pipe & Compose

## Learning Objectives
- Understand function composition
- Master pipe (left to right) vs compose (right to left)
- Know practical use cases
- Build reusable utility functions

## Content

### Part 1: Pipe Implementation

\`\`\`javascript
// PIPE: left to right
const pipe = (...fns) => {
    return (x) => fns.reduce((acc, fn) => fn(acc), x);
};

// Usage
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const subtract3 = x => x - 3;

const result = pipe(add5, multiply2, subtract3)(10);
console.log(result); // ((10 + 5) * 2) - 3 = 27
\`\`\`

### Part 2: Compose Implementation

\`\`\`javascript
// COMPOSE: right to left
const compose = (...fns) => {
    return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
};

// Usage
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const subtract3 = x => x - 3;

const result = compose(subtract3, multiply2, add5)(10);
console.log(result); // (10 - 3) * 2 + 5 = 19
\`\`\`

### Part 3: Real-world Usage

\`\`\`javascript
// Data processing pipeline
const getUser = id => ({ id, name: \`User \${id}\` });
const getAge = user => user.age;
const getFormattedUser = user => \`\${user.name} (Age: \${user.age})\`;

const userPipeline = pipe(getUser, getAge, getFormattedUser);
const user = userPipeline(1);
console.log(user); // "User 1 (Age: undefined)"

// Function composition for validation
const isEmail = email => /^[^\\s@]+\\.[^\\s@]+$/.test(email);
const isNotEmpty = str => str.length > 0;
const isValidUser = pipe(isEmail, isNotEmpty);

console.log(isValidUser('test@example.com')); // true
console.log(isValidUser('')); // false
\`\`\`

## Interview Tips
- Explain reduce vs reduceRight for pipe vs compose
- Show practical use cases (data pipelines, validation)
- Discuss functional programming benefits
- Mention composability and reusability

## Follow-up Questions
1. What's the difference between pipe and compose?
2. When would you use pipe over compose?
3. How would you implement async pipe/compose?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Function Composition",
              problemUrl: "https://leetcode.com/problems/function-composition",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "Composition Practice",
              problemUrl: "https://codesandbox.io/s/composition-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Event Emitter (Basic)",
          slug: "event-emitter-basic",
          description: "Implement event subscription and emission",
          orderIndex: 7,
          difficulty: "EASY",
          videoUrl: "https://example.com/mc-1-7-video",
          videoDurationSec: 720,
          markdownContent: `# Event Emitter (Basic)

## Learning Objectives
- Understand observer pattern
- Master event subscription/emission
- Know on, once, and off methods
- Build reusable event system

## Content

### Part 1: Basic Event Emitter

\`\`\`javascript
class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        
        this.events.get(event).push(callback);
    }
    
    emit(event, ...args) {
        if (!this.events.has(event)) {
            return;
        }
        
        this.events.get(event).forEach(callback => {
            callback(...args);
        });
    }
    
    off(event, callback) {
        if (!this.events.has(event)) {
            return;
        }
        
        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }
    
    once(event, callback) {
        const onceWrapper = (...args) => {
            callback(...args);
            this.off(event, onceWrapper);
        };
        
        this.on(event, onceWrapper);
    }
}
\`\`\`

### Part 2: Usage Examples

\`\`\`javascript
// Basic usage
const emitter = new EventEmitter();

emitter.on('message', (msg) => {
    console.log('Received:', msg);
});

emitter.emit('message', 'Hello World');
// Output: Received: Hello World

// Multiple listeners
emitter.on('click', () => console.log('Button 1 clicked'));
emitter.on('click', () => console.log('Button 2 clicked'));

emitter.emit('click');
// Output: Button 1 clicked
// Button 2 clicked

// Once listener
emitter.once('init', () => console.log('Initialized'));
emitter.emit('init'); // Executes
emitter.emit('init'); // No output (once listener already removed)
\`\`\`

## Interview Tips
- Explain observer pattern
- Master event subscription/emission
- Know on, once, and off methods
- Build reusable event system

## Follow-up Questions
1. How would you implement event delegation?
2. Can you implement async event emitter?
3. What's the difference between on and once?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Event Emitter Pattern",
              problemUrl: "https://leetcode.com/problems/event-emitter-pattern",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "Event Emitter Practice",
              problemUrl: "https://codesandbox.io/s/event-emitter-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        }
      ]
    }
  ]
};