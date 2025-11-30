# PrepKit Module 2: Machine Coding & Implementation Patterns
## Complete Course Content

**Module Weight:** 35% of interview preparation  
**Total Duration:** 35-45 hours  
**Total Lessons/Patterns:** 42  
**Practice Problems:** 60+  
**Difficulty:** Easy → Hard  

---

## 📚 MODULE OVERVIEW

This module is **crucial** because:
- Most companies ask this as 2nd round
- Separates mid-level from senior engineers
- Real-world patterns you'll use at work
- Technical ability showcase

**Target Companies:** All (emphasis on Salesforce, Google, Meta, Flipkart)

---

## SECTION 1: EASY PATTERNS (10 Patterns)

### Pattern 1.1: Array Polyfills (map, filter, reduce, every) ⭐⭐

**Learning Objectives:**
- Understand native array methods
- Implement from scratch
- Know iteration patterns
- Handle edge cases

**Content:**

#### Array.map Polyfill

```javascript
Array.prototype.myMap = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(`${callback} is not a function`);
    }
    
    const result = [];
    
    for (let i = 0; i < this.length; i++) {
        if (i in this) { // skip holes
            result[i] = callback.call(thisArg, this[i], i, this);
        }
    }
    
    return result;
};

// Test
const arr = [1, 2, 3];
const doubled = arr.myMap(x => x * 2);
console.log(doubled); // [2, 4, 6]
```

#### Array.filter Polyfill

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(`${callback} is not a function`);
    }
    
    const result = [];
    
    for (let i = 0; i < this.length; i++) {
        if (i in this && callback.call(thisArg, this[i], i, this)) {
            result.push(this[i]);
        }
    }
    
    return result;
};

// Test
const arr = [1, 2, 3, 4, 5];
const evens = arr.myFilter(x => x % 2 === 0);
console.log(evens); // [2, 4]
```

#### Array.reduce Polyfill

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
    if (typeof callback !== 'function') {
        throw new TypeError(`${callback} is not a function`);
    }
    
    let accumulator = initialValue;
    let startIndex = 0;
    
    if (initialValue === undefined) {
        if (this.length === 0) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        accumulator = this[0];
        startIndex = 1;
    }
    
    for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
            accumulator = callback(accumulator, this[i], i, this);
        }
    }
    
    return accumulator;
};

// Test
const arr = [1, 2, 3, 4];
const sum = arr.myReduce((acc, curr) => acc + curr, 0);
console.log(sum); // 10
```

#### Array.every Polyfill

```javascript
Array.prototype.myEvery = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(`${callback} is not a function`);
    }
    
    for (let i = 0; i < this.length; i++) {
        if (i in this && !callback.call(thisArg, this[i], i, this)) {
            return false;
        }
    }
    
    return true;
};

// Test
const arr = [2, 4, 6];
const allEven = arr.myEvery(x => x % 2 === 0);
console.log(allEven); // true
```

**Interview Tips:**
- Mention handling sparse arrays (holes)
- Show understanding of thisArg
- Explain callback signature (value, index, array)
- Test edge cases (empty array, etc.)

**Company Asked At:** Every company (foundational)

---

### Pattern 1.2: Method Chaining ⭐⭐

**Problem:** Build a Calculator class supporting method chaining

**Content:**

```javascript
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
const calc = new Calculator(2);
console.log(
    calc.add(3).multiply(4).subtract(5).getValue() // 15
);

// Output: 15
// (2 + 3) * 4 - 5 = 15
```

**Interview Tips:**
- Mention 'fluent interface' pattern
- Return 'this' for chaining
- Show usage example
- Discuss readability benefits

**Company Asked At:** Publicis Sapient, Meesho

---

### Pattern 1.3: Debouncing ⭐⭐

**Problem:** Implement debounce to delay execution until after waiting period

**Content:**

```javascript
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

// Test
const handleSearch = debounce((query) => {
    console.log(`Searching for: ${query}`);
}, 300);

handleSearch('r');       // cancelled
handleSearch('re');      // cancelled
handleSearch('react');   // will execute after 300ms
// Output: "Searching for: react"
```

**Use Cases:**
- Search input
- Window resize
- Auto-save
- API calls on input

**Interview Tips:**
- Explain use case clearly
- Show how to clear previous timer
- Mention common applications
- Discuss alternative: throttling

**Company Asked At:** Flipkart, Intuit, Sumo Logic

---

### Pattern 1.4: Throttling ⭐⭐

**Problem:** Implement throttle to limit execution frequency

**Content:**

```javascript
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

// Alternative: with timer
function throttleWithTimer(fn, delay) {
    let timerId = null;
    let lastRan;
    
    return function(...args) {
        if (!lastRan) {
            fn.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                if ((Date.now() - lastRan) >= delay) {
                    fn.apply(this, args);
                    lastRan = Date.now();
                }
            }, delay - (Date.now() - lastRan));
        }
    };
}

// Test
const handleScroll = throttle(() => {
    console.log('Scroll event');
}, 1000);

// Events fire, but fn executes max once per 1000ms
window.addEventListener('scroll', handleScroll);
```

**Difference from Debounce:**
- **Debounce:** Wait for silence, then execute
- **Throttle:** Execute at most every N milliseconds

**Interview Tips:**
- Show time-based throttling
- Explain use cases (scroll, resize)
- Compare with debounce
- Mention edge cases

**Company Asked At:** Sumo Logic, Hotstar

---

### Pattern 1.5: Array Flattening ⭐⭐

**Problem:** Flatten nested arrays (recursive + iterative + with depth)

**Content:**

```javascript
// Recursive approach
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

// Test
console.log(flattenRecursive([[1, 2], [3, [4, 5]]])); // [1, 2, 3, 4, 5]

// Iterative approach
function flattenIterative(arr) {
    const stack = [...arr];
    const result = [];
    
    while (stack.length) {
        const item = stack.pop();
        
        if (Array.isArray(item)) {
            stack.push(...item); // Add to stack if array
        } else {
            result.push(item);
        }
    }
    
    return result.reverse();
}

// With depth limit
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

// Test
console.log(flattenWithDepth([[1, [2]], [3, [4, [5]]]], 2)); 
// [1, 2, 3, 4, [5]]
```

**Interview Tips:**
- Show multiple approaches
- Explain stack-based iteration
- Mention depth handling
- Compare time/space complexity

---

### Pattern 1.6: Pipe & Compose ⭐⭐

**Problem:** Create pipe and compose for function composition

**Content:**

```javascript
// PIPE: left to right
const pipe = (...fns) => {
    return (x) => fns.reduce((acc, fn) => fn(acc), x);
};

// COMPOSE: right to left
const compose = (...fns) => {
    return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
};

// Test functions
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const subtract3 = x => x - 3;

// PIPE: (10 + 5) * 2 - 3 = 27
console.log(pipe(add5, multiply2, subtract3)(10)); // 27

// COMPOSE: (10 - 3) * 2 + 5 = 19
console.log(compose(add5, multiply2, subtract3)(10)); // 19
```

**Real-world Usage:**

```javascript
const getUser = id => ({ id, name: 'John', age: 30 });
const formatUser = user => `User: ${user.name}`;
const logResult = msg => console.log(msg);

const userPipeline = pipe(getUser, formatUser, logResult);
userPipeline(1); // Output: User: John
```

**Interview Tips:**
- Explain reduce and reduceRight
- Show practical use cases
- Compare pipe vs compose
- Mention functional programming patterns

**Company Asked At:** Tekion

---

### Pattern 1.7: Event Emitter (Basic) ⭐⭐

**Problem:** Implement event subscription and emission

**Content:**

```javascript
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
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }
    
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        
        this.on(event, wrapper);
    }
}

// Test
const emitter = new EventEmitter();

emitter.on('message', (msg) => {
    console.log('Received:', msg);
});

emitter.emit('message', 'Hello');
// Output: Received: Hello
```

**Interview Tips:**
- Use Map for event storage
- Show subscription/emission
- Implement off() for unsubscribe
- Show once() for single execution

**Company Asked At:** BookmyShow, DP World

---

### Pattern 1.8: Retry Mechanism ⭐⭐

**Problem:** Implement function retry with exponential backoff

**Content:**

```javascript
function retry(fn, maxRetries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        const attempt = (n) => {
            fn()
                .then(resolve)
                .catch((error) => {
                    if (n <= 1) {
                        reject(error);
                    } else {
                        setTimeout(() => {
                            attempt(n - 1);
                        }, delay);
                    }
                });
        };
        
        attempt(maxRetries);
    });
}

// With exponential backoff
function retryWithBackoff(fn, maxRetries = 3) {
    return new Promise((resolve, reject) => {
        const attempt = (n) => {
            fn()
                .then(resolve)
                .catch((error) => {
                    if (n <= 1) {
                        reject(error);
                    } else {
                        const delay = Math.pow(2, maxRetries - n) * 1000;
                        setTimeout(() => {
                            attempt(n - 1);
                        }, delay);
                    }
                });
        };
        
        attempt(maxRetries);
    });
}

// Test
const fetchData = () => {
    return Math.random() > 0.7
        ? Promise.resolve('Data')
        : Promise.reject('Network error');
};

retry(fetchData, 3, 1000)
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

**Interview Tips:**
- Show basic retry logic
- Demonstrate exponential backoff
- Explain async recursion
- Mention use cases (API calls, network requests)

**Company Asked At:** Agoda, Tekion

---

### Pattern 1.9: Promises in Sequence ⭐⭐

**Problem:** Execute async tasks sequentially

**Content:**

```javascript
// Async/await approach
async function sequentialAsync(tasks) {
    const results = [];
    const errors = [];
    
    for (const task of tasks) {
        try {
            const result = await task();
            results.push(result);
        } catch (error) {
            errors.push(error);
        }
    }
    
    return { results, errors };
}

// Promise recursion approach
function sequentialRecursive(tasks, callback) {
    const results = [];
    const errors = [];
    
    const helper = (index) => {
        if (index === tasks.length) {
            callback(results, errors);
            return;
        }
        
        tasks[index]()
            .then(result => {
                results.push(result);
            })
            .catch(error => {
                errors.push(error);
            })
            .finally(() => {
                helper(index + 1);
            });
    };
    
    helper(0);
}

// Test
const asyncTasks = [
    () => Promise.resolve('Task 1'),
    () => Promise.resolve('Task 2'),
    () => Promise.reject('Task 3 failed')
];

sequentialAsync(asyncTasks)
    .then(result => console.log(result));
```

**Interview Tips:**
- Show both async/await and Promise approaches
- Handle errors properly
- Explain sequential vs parallel
- Mention performance implications

**Company Asked At:** Sumologic, Forward Network

---

### Pattern 1.10: Flatten Objects ⭐⭐

**Problem:** Flatten nested objects with key paths

**Content:**

```javascript
function flattenObject(obj, prefix = '', result = {}) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}_${key}` : key;
            
            if (Array.isArray(obj[key])) {
                obj[key].forEach((item, index) => {
                    flattenObject(item, `${newKey}_${index}`, result);
                });
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                flattenObject(obj[key], newKey, result);
            } else {
                result[newKey] = obj[key];
            }
        }
    }
    
    return result;
}

// Test
const user = {
    name: "John",
    address: {
        street: "Main St",
        city: "NYC"
    },
    hobbies: ["reading", "gaming"]
};

const flattened = flattenObject(user);
console.log(flattened);
// {
//   name: "John",
//   address_street: "Main St",
//   address_city: "NYC",
//   hobbies_0: "reading",
//   hobbies_1: "gaming"
// }
```

**Interview Tips:**
- Handle arrays and objects recursively
- Create unique keys for paths
- Null check for objects
- Show practical use cases

**Company Asked At:** Fractal, Various

---

## SECTION 2: MEDIUM PATTERNS (20 Patterns)

### Pattern 2.1: Promise.all Polyfill ⭐⭐⭐

**Problem:** Implement Promise.all from scratch

**Content:**

```javascript
Promise.myAll = function(promises) {
    return new Promise((resolve, reject) => {
        const results = new Array(promises.length);
        let completed = 0;
        
        if (promises.length === 0) {
            resolve([]);
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = value;
                    completed++;
                    
                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject);
        });
    });
};

// Test
Promise.myAll([
    Promise.resolve(1),
    Promise.resolve(2),
    3
])
.then(results => console.log(results)); // [1, 2, 3]

// Rejection case
Promise.myAll([
    Promise.resolve(1),
    Promise.reject('Error')
])
.catch(err => console.log(err)); // 'Error'
```

**Key Points:**
- Use Promise.resolve() to handle non-promises
- Maintain order using array indexing
- Reject immediately on first error
- Resolve when all complete

**Company Asked At:** Salesforce, Google

---

### Pattern 2.2: Promise.race Polyfill ⭐⭐

### Pattern 2.3: LRU Cache ⭐⭐⭐

**Problem:** Implement Least Recently Used cache

**Content:**

```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // Maintains insertion order
    }
    
    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        
        // Move to end (mark as recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        
        return value;
    }
    
    set(key, value) {
        // If exists, delete first
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        // If at capacity, remove least recently used
        else if (this.cache.size >= this.capacity) {
            // First key is least recently used
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        // Add to end
        this.cache.set(key, value);
    }
}

// Test
const cache = new LRUCache(2);
cache.set('a', 1);
cache.set('b', 2);
console.log(cache.get('a')); // 1
cache.set('c', 3); // Evicts 'b'
console.log(cache.get('b')); // -1 (evicted)
```

**Interview Tips:**
- Use Map for order preservation
- Move accessed items to end
- Evict first item (oldest)
- Show practical use cases

**Company Asked At:** Salesforce, Google

---

### Pattern 2.4: Deep Clone with Circular Refs ⭐⭐⭐

### Pattern 2.5: JSON.stringify Polyfill ⭐⭐⭐

### Pattern 2.6: Extended Event Emitter ⭐⭐⭐

**Problem:** Add once() and subscribeOnceAsync() methods

**Content:**

```javascript
class EventEmitter {
    constructor() {
        this._subscriptions = new Map();
    }
    
    subscribe(name, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }
        
        if (!this._subscriptions.has(name)) {
            this._subscriptions.set(name, []);
        }
        
        const subscriptionId = Symbol();
        const subscriptions = this._subscriptions.get(name);
        subscriptions.push({ id: subscriptionId, callback });
        
        return {
            remove: () => {
                const index = subscriptions.findIndex(
                    sub => sub.id === subscriptionId
                );
                if (index !== -1) {
                    subscriptions.splice(index, 1);
                }
            }
        };
    }
    
    subscribeOnce(name, callback) {
        const removeOnce = this.subscribe(name, (...args) => {
            callback(...args);
            removeOnce.remove();
        });
    }
    
    async subscribeOnceAsync(name) {
        return new Promise((resolve) => {
            const removeOnce = this.subscribe(name, (data) => {
                resolve(data);
                removeOnce.remove();
            });
        });
    }
    
    emit(name, ...args) {
        const subscriptions = this._subscriptions.get(name);
        if (!subscriptions) {
            return;
        }
        
        subscriptions.forEach(sub => sub.callback(...args));
    }
    
    publishAll(data) {
        this._subscriptions.forEach(subscriptions => {
            subscriptions.forEach(sub => sub.callback(data));
        });
    }
}

// Test
const emitter = new EventEmitter();

emitter.subscribeOnce('event', (data) => {
    console.log('Once:', data);
});

emitter.emit('event', 'first'); // Executes
emitter.emit('event', 'second'); // Doesn't execute

emitter.subscribeOnceAsync('asyncEvent')
    .then(data => console.log('Async:', data));

emitter.emit('asyncEvent', 'async data'); // Executes
```

**Interview Tips:**
- Use Symbol for unique IDs
- Implement once with removal
- Show async/await pattern
- Mention use cases

**Company Asked At:** Coursera

---

### Pattern 2.7-2.20: Other Medium Patterns

- Promise.allSettled Polyfill
- JSON.parse Polyfill
- call, apply, bind Polyfills
- Cancellable Promise
- Sort Array (QuickSort)
- Find Matching Element in DOM
- Group By Polyfill
- Filter Object Data
- mapLimit with Concurrency
- Advanced Memoization
- React DOM Render
- Performance Measurement Function
- (And more...)

**[Each with detailed implementation and practice problems]**

---

## SECTION 3: HARD PATTERNS (12 Patterns)

### Pattern 3.1: Document Comparison (Deep Diff) ⭐⭐⭐

**Problem:** Compare two objects and return differences

**Content:**

```javascript
function deepDiff(obj1, obj2) {
    const diff = {};
    
    // Check all keys in both objects
    const allKeys = new Set([
        ...Object.keys(obj1),
        ...Object.keys(obj2)
    ]);
    
    for (const key of allKeys) {
        if (!(key in obj1)) {
            diff[key] = {
                type: 'added',
                value: obj2[key]
            };
        } else if (!(key in obj2)) {
            diff[key] = {
                type: 'removed',
                value: obj1[key]
            };
        } else if (
            typeof obj1[key] === 'object' &&
            typeof obj2[key] === 'object' &&
            obj1[key] !== null &&
            obj2[key] !== null
        ) {
            const nested = deepDiff(obj1[key], obj2[key]);
            if (Object.keys(nested).length > 0) {
                diff[key] = nested;
            }
        } else if (obj1[key] !== obj2[key]) {
            diff[key] = {
                type: 'changed',
                from: obj1[key],
                to: obj2[key]
            };
        }
    }
    
    return diff;
}

// Test
const original = {
    name: 'John',
    age: 30,
    address: { city: 'NYC' }
};

const updated = {
    name: 'Jane',
    age: 30,
    address: { city: 'LA' }
};

console.log(deepDiff(original, updated));
// {
//   name: { type: 'changed', from: 'John', to: 'Jane' },
//   address: { city: { type: 'changed', from: 'NYC', to: 'LA' } }
// }
```

**Company Asked At:** Google

---

### Pattern 3.2-3.12: Other Hard Patterns

- Stream Data Merging
- Lazy-Loading Tabs Component
- Google Docs Editor Design (CRDT vs OT)
- Flood Fill Algorithm
- List Virtualization
- Typeahead with Caching
- Race Condition Handling
- And more...

**[Each with detailed implementation]**

---

## ASSESSMENT & PRACTICE

### Practice Problems by Difficulty:
- **Easy:** 30 problems (1-2 hours each)
- **Medium:** 20 problems (2-3 hours each)
- **Hard:** 10 problems (3-4 hours each)

### Mock Interviews:
- Pattern Practice Tests (1-2 patterns, 45 min)
- Full Mock (5-6 patterns, 3-4 hours)
- Company-specific Mocks

---

**Expected Completion Time:** 35-45 hours  
**Prerequisite:** JavaScript Module completion  
**Next Module:** Data Structures & Algorithms  

**By the end of this module, you should implement any pattern under 60 minutes.**
