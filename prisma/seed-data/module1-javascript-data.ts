export const javascriptModuleData = {
  chapters: [
    {
      title: "Hoisting & Variable Scope",
      slug: "hoisting-variable-scope",
      description: "Master variable declarations, hoisting behavior, and scope chain in JavaScript",
      orderIndex: 1,
      difficultyLevel: "BEGINNER",
      estimatedHours: 8,
      lessons: [
        {
          title: "var, let, const Differences",
          slug: "var-let-const-differences",
          description: "Understanding scope differences between var, let, and const declarations",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/js-1-1-video",
          videoDurationSec: 720,
          markdownContent: `# var, let, const Differences

## Learning Objectives
- Understand scope differences between var, let, and const
- Master hoisting behavior
- Know temporal dead zone
- Identify when to use each

## Content

### Part 1: Understanding Variable Declarations

**var:**
- Function-scoped (not block-scoped)
- Hoisted to top (initialized as undefined)
- Can be re-declared
- Creates property on global object (in browser)

**let:**
- Block-scoped (within {} only)
- Hoisted but not initialized (Temporal Dead Zone)
- Cannot be re-declared in same scope
- Doesn't create global property

**const:**
- Block-scoped (like let)
- Hoisted but not initialized (TDZ)
- Cannot be re-declared
- Cannot be reassigned (but object properties CAN be)
- Doesn't create global property

### Part 2: Scope Chain

When looking for a variable, JavaScript searches:
1. Local scope
2. Outer function scope(s)
3. Global scope
4. Throws ReferenceError if not found

\`\`\`javascript
function example() {
    let local = 'local';
    console.log(local);   // 'local' (local scope)
}

function outer() {
    let outerVar = 'outer';
    
    function inner() {
        console.log(outerVar); // 'outer' (outer scope)
        console.log(local);    // ReferenceError
    }
    
    inner();
}
\`\`\`

### Part 3: Practice Problems

1. **Predict the output:**
\`\`\`javascript
function test() {
    console.log(x); // ?
    if (true) {
        var x = 10;
    }
    console.log(x); // ?
}
test();
// Output: undefined, 10
\`\`\`

2. **Identify the scope:**
\`\`\`javascript
var a = 1;
let b = 2;
const c = 3;

function scope1() {
    var a = 10;
    let b = 20;
    const c = 30;
    console.log(a, b, c); // ?
}

scope1();
console.log(a, b, c); // ?
// Output: 10, 20, 30 then 1, 2, 3
\`\`\`

3. **Loop scope issue:**
\`\`\`javascript
for (var i = 0; i < 3; i++) {
    // var is function-scoped, not block-scoped
}
console.log(i); // ?

for (let j = 0; j < 3; j++) {
    // let is block-scoped
}
console.log(j); // ?
// Output: 3, then ReferenceError
\`\`\`

## Interview Tips
- Mention "function scope" when talking about var
- Say "block scope" for let/const
- Explain why var can cause issues in loops
- Demonstrate scope chain with nested functions

## Follow-up Questions
1. Why would you use const by default?
2. What's the advantage of block scope?
3. Can you re-assign a const object?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Variables and Scopes",
              problemUrl: "https://leetcode.com/problems/variables-and-scopes",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "JavaScript Scope Practice",
              problemUrl: "https://codesandbox.io/s/javascript-scope-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Hoisting Explained",
          slug: "hoisting-explained",
          description: "Understand variable hoisting and function hoisting behavior",
          orderIndex: 2,
          difficulty: "EASY",
          videoUrl: "https://example.com/js-1-2-video",
          videoDurationSec: 900,
          markdownContent: `# Hoisting Explained

## Learning Objectives
- Understand variable hoisting
- Know function hoisting
- Understand priority of hoisting
- Explain Temporal Dead Zone (TDZ)

## Content

### Part 1: Variable Hoisting

JavaScript moves variable and function declarations to the top during compilation.

**var hoisting:**
\`\`\`javascript
console.log(x); // undefined (not ReferenceError)
var x = 5;
console.log(x); // 5

// Interpreted as:
// var x;
// console.log(x); // undefined
// x = 5;
// console.log(x); // 5
\`\`\`

**let/const hoisting (TDZ):**
\`\`\`javascript
console.log(y); // ReferenceError
let y = 5;

// They ARE hoisted but in "Temporal Dead Zone"
// From start of scope until declaration line
\`\`\`

### Part 2: Function Hoisting

Functions are fully hoisted (both declaration AND assignment).

**Function Declaration:**
\`\`\`javascript
console.log(func()); // "Hello" - fully hoisted

function func() {
    return "Hello";
}
\`\`\`

**Function Expression:**
\`\`\`javascript
console.log(func); // undefined (var is hoisted, not function)
var func = function() {
    return "Hello";
};

console.log(func()); // Error: func is not a function
\`\`\`

### Part 3: Hoisting Priority

When hoisting, the order is:
1. Function declarations (highest priority)
2. Variable declarations
3. Variable assignments (NOT hoisted)

\`\`\`javascript
function test() {
    console.log(name); // ?
    console.log(greet()); // ?
    
    var name = "John";
    
    function greet() {
        return "Hello";
    }
}

test();
// Output: undefined, "Hello"
// function greet is hoisted first, then var name
\`\`\`

### Part 4: Practice Problems

1. **Output prediction:**
\`\`\`javascript
var x = 1;
function func() {
    console.log(x); // ?
    var x = 2;
}
func();
// Output: undefined (var x is hoisted in function scope)
\`\`\`

2. **Function hoisting:**
\`\`\`javascript
console.log(add(2, 3)); // ?

function add(a, b) {
    return a + b;
}
// Output: 5 (function fully hoisted)
\`\`\`

3. **Mixed hoisting:**
\`\`\`javascript
var a = 1;
var b = 2;

function test() {
    console.log(a); // ?
    console.log(b); // ?
    
    if (true) {
        var a = 10;
        let b = 20;
    }
}

test();
// Output: undefined, 2
\`\`\`

## Interview Tips
- Explain the hoisting process clearly
- Mention "Temporal Dead Zone" for let/const
- Show difference between function declaration and expression
- Explain why this matters in production code

## Follow-up Questions
1. What's the difference between hoisting and TDZ?
2. Why do function declarations get fully hoisted?
3. How would you fix the loop problem?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Hoisting Questions",
              problemUrl: "https://leetcode.com/problems/hoisting-questions",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "JavaScript Hoisting Practice",
              problemUrl: "https://codesandbox.io/s/hoisting-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Scope Chain & Closures",
          slug: "scope-chain-closures",
          description: "Understanding lexical scope and closure creation",
          orderIndex: 3,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/js-1-3-video",
          videoDurationSec: 1200,
          markdownContent: `# Scope Chain & Closures

## Learning Objectives
- Understand lexical scope
- Define and create closures
- Know closure use cases
- Understand scope chain resolution

## Content

### Part 1: Lexical Scope

JavaScript uses **lexical (static) scope**: inner functions can access outer function variables, not based on CALL location but DEFINITION location.

\`\`\`javascript
var globalVar = "global";

function outer() {
    var outerVar = "outer";
    
    function inner() {
        var innerVar = "inner";
        console.log(innerVar);   // 'inner'
        console.log(outerVar);   // 'outer'
        console.log(globalVar);  // 'global'
    }
    
    inner();
}

outer();
\`\`\`

**Key: inner function accesses variables based on WHERE IT'S DEFINED, not where it's called**

### Part 2: What is a Closure?

A **closure** is a function that has access to variables from its outer (enclosing) scope, even after that outer function returns.

\`\`\`javascript
function makeCounter() {
    let count = 0;
    
    return function() {
        count++;
        return count;
    };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// The returned function "remembers" count variable
// This is a closure
\`\`\`

### Part 3: Closure Applications

**Use Case 1: Data Privacy**
\`\`\`javascript
function createBankAccount(initialBalance) {
    let balance = initialBalance; // Private variable
    
    return {
        deposit(amount) {
            balance += amount;
            return balance;
        },
        withdraw(amount) {
            balance -= amount;
            return balance;
        },
        getBalance() {
            return balance;
        }
    };
}

const account = createBankAccount(1000);
account.deposit(500);   // 1500
account.withdraw(200);  // 1300
// balance cannot be accessed directly
\`\`\`

**Use Case 2: Function Factory**
\`\`\`javascript
function multiplyBy(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
\`\`\`

**Use Case 3: Callbacks**
\`\`\`javascript
function setupButtons() {
    for (var i = 0; i < 3; i++) {
        const button = document.createElement('button');
        button.textContent = \`Button \${i}\`;
        
        button.addEventListener('click', function() {
            console.log(\`Clicked button \${i}\`);
        });
        
        document.body.appendChild(button);
    }
}
// Each click handler has closure over 'i'
\`\`\`

### Part 4: Practice Problems

1. **Closure detection:**
\`\`\`javascript
function counter() {
    let count = 0;
    return () => ++count;
}

const c = counter();
console.log(c()); // 1
console.log(c()); // 2
// Does this have a closure? YES - over 'count'
\`\`\`

2. **Closure with loop:**
\`\`\`javascript
var functions = [];
for (var i = 0; i < 3; i++) {
    functions.push(function() {
        return i;
    });
}

console.log(functions[0]()); // 3
console.log(functions[1]()); // 3
console.log(functions[2]()); // 3
// All reference same 'i', which is now 3
\`\`\`

3. **Fix with closure:**
\`\`\`javascript
var functions = [];
for (var i = 0; i < 3; i++) {
    functions.push((function(num) {
        return function() {
            return num;
        };
    })(i));
}

console.log(functions[0]()); // 0
console.log(functions[1]()); // 1
console.log(functions[2]()); // 2
// Each function has closure over different num value
\`\`\`

## Interview Tips
- Define closure clearly
- Give practical examples (module pattern, data privacy)
- Explain lexical vs dynamic scope
- Show closure issues with loops

## Follow-up Questions
1. Why is closure useful?
2. What's the memory implication of closures?
3. How would you fix the loop problem?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Closure Questions",
              problemUrl: "https://leetcode.com/problems/closure-questions",
              difficulty: "MEDIUM",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "JavaScript Closure Practice",
              problemUrl: "https://codesandbox.io/s/closure-practice",
              difficulty: "MEDIUM",
              orderIndex: 2
            }
          ]
        },
        {
          title: "var in Loops",
          slug: "var-in-loops",
          description: "Understand loop scope issues with var and solutions",
          orderIndex: 4,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/js-1-4-video",
          videoDurationSec: 900,
          markdownContent: `# var in Loops

## Learning Objectives
- Understand loop scope issues with var
- Master IIFE solution
- Know let solution
- Understand closure in loops

## Content

### Part 1: The Classic Problem

\`\`\`javascript
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}

// Output: 3, 3, 3
// Expected: 0, 1, 2

// Why? var is function-scoped
// Loop completes, i = 3
// Then timeouts execute, all see i = 3
\`\`\`

### Part 2: Solution 1 - IIFE (Immediately Invoked Function Expression)

\`\`\`javascript
for (var i = 0; i < 3; i++) {
    (function(num) {
        setTimeout(function() {
            console.log(num);
        }, 1000);
    })(i);
}

// Output: 0, 1, 2
// Why? Each IIFE creates new scope with num = i
// Each timeout closes over different num
\`\`\`

### Part 3: Solution 2 - let (Modern Solution)

\`\`\`javascript
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}

// Output: 0, 1, 2
// Why? let is block-scoped
// Each iteration creates NEW i variable
// Each timeout closes over different i
\`\`\`

### Part 4: Why let Works

JavaScript creates a NEW lexical environment for each loop iteration when using let:

\`\`\`javascript
// Conceptually:
{
    let i = 0;
    // iteration 1
}
{
    let i = 1;
    // iteration 2
}
{
    let i = 2;
    // iteration 3
}
\`\`\`

### Part 5: Practice Problems

1. **Predict output:**
\`\`\`javascript
for (var i = 0; i < 3; i++) {
    console.log(i);
}
console.log(i); // ?

// Output: 0, 1, 2, then 3
\`\`\`

2. **With let:**
\`\`\`javascript
for (let i = 0; i < 3; i++) {
    console.log(i);
}
console.log(i); // ?

// Output: 0, 1, 2, then ReferenceError
\`\`\`

3. **Closure issue:**
\`\`\`javascript
var arr = [];
for (var i = 0; i < 3; i++) {
    arr.push(function() {
        return i;
    });
}
console.log(arr[0]()); // 3
console.log(arr[1]()); // 3
console.log(arr[2]()); // 3
// All return 3 (closure over same i)
\`\`\`

4. **Fix with let:**
\`\`\`javascript
var arr = [];
for (let i = 0; i < 3; i++) {
    arr.push(function() {
        return i;
    });
}
console.log(arr[0]()); // 0
console.log(arr[1]()); // 1
console.log(arr[2]()); // 2
// Each returns different i (closure over different i)
\`\`\`

## Interview Tips
- Explain var is function-scoped, not block-scoped
- Demonstrate why loop problem occurs
- Show IIFE solution step-by-step
- Mention let as modern solution
- Explain why let works (new binding per iteration)

## Company Asked At
ServiceNow, Flipkart, Amazon, Publicis Sapient`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Loop and Scope Questions",
              problemUrl: "https://leetcode.com/problems/loop-and-scope-questions",
              difficulty: "MEDIUM",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "JavaScript Loop Practice",
              problemUrl: "https://codesandbox.io/s/loop-practice",
              difficulty: "MEDIUM",
              orderIndex: 2
            }
          ]
        },
        {
          title: "Temporal Dead Zone (TDZ)",
          slug: "temporal-dead-zone",
          description: "Understanding TDZ concept and its implications",
          orderIndex: 5,
          difficulty: "EASY",
          videoUrl: "https://example.com/js-1-5-video",
          videoDurationSec: 600,
          markdownContent: `# Temporal Dead Zone (TDZ)

## Learning Objectives
- Understand TDZ concept
- Know which variables are affected
- Recognize TDZ errors
- Use properly in code

## Content

### Part 1: What is TDZ?

The **Temporal Dead Zone** is the period from when a let/const variable is hoisted until its declaration is reached.

\`\`\`javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization

let x = 5;

// x enters TDZ at start of scope
// x leaves TDZ when declaration line is reached
\`\`\`

### Part 2: Why TDZ Exists

TDZ enforces good practices:
- Catch bugs earlier
- Make code more predictable
- Prevent accidental undefined values

\`\`\`javascript
// WITHOUT TDZ (with var):
console.log(y); // undefined (confusing!)

// WITH TDZ (with let):
console.log(z); // ReferenceError (clear error!)
let z = 5;
\`\`\`

### Part 3: TDZ Scope

TDZ extends to entire block, not just top of scope:

\`\`\`javascript
function test() {
    // x is in TDZ here
    if (true) {
        console.log(x); // ReferenceError
        let x = 5;
        // x exits TDZ here
        console.log(x); // 5
    }
}
\`\`\`

### Part 4: Practice Problems

1. **Identify TDZ:**
\`\`\`javascript
console.log(a); // ? (TDZ - ReferenceError)
let a = 1;
\`\`\`

2. **const also has TDZ:**
\`\`\`javascript
console.log(b); // ? (TDZ - ReferenceError)
const b = 2;
\`\`\`

3. **var doesn't have TDZ:**
\`\`\`javascript
console.log(c); // ? (undefined - no TDZ)
var c = 3;
\`\`\`

4. **TDZ in blocks:**
\`\`\`javascript
let x = 'outer';
{
    console.log(x); // ? (ReferenceError - TDZ)
    let x = 'inner';
    console.log(x); // 'inner'
}
// TDZ shadows outer x
\`\`\`

## Interview Tips
- Mention TDZ is specific to let/const
- Explain it helps catch bugs
- Show ReferenceError happens, not undefined
- Compare with var behavior

## Follow-up Questions
1. What's the benefit of TDZ?
2. Why doesn't var have TDZ?
3. Can you have TDZ with function declarations?`,
          practiceLinks: [
            {
              platform: "LEETCODE",
              problemTitle: "Temporal Dead Zone Questions",
              problemUrl: "https://leetcode.com/problems/temporal-dead-zone-questions",
              difficulty: "EASY",
              orderIndex: 1
            },
            {
              platform: "CODESANDBOX",
              problemTitle: "JavaScript TDZ Practice",
              problemUrl: "https://codesandbox.io/s/tdz-practice",
              difficulty: "EASY",
              orderIndex: 2
            }
          ]
        }
      ]
    }
  ]
};