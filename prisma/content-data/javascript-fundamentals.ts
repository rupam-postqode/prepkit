// prisma/content-data/javascript-fundamentals.ts

export const javascriptFundamentalsLessons = [
  // Chapter 1: Basics & Fundamentals (4 lessons)
  {
    title: "What is JavaScript?",
    slug: "what-is-javascript",
    description: "Understanding JavaScript's role in modern web development and interview preparation",
    markdownContent: `# What is JavaScript?

## JavaScript: The Language of the Web

JavaScript is a **high-level, interpreted programming language** that enables interactive web pages and is an essential part of web applications. It's one of the three core technologies of World Wide Web content production, alongside HTML and CSS.

### Why JavaScript for Interviews?

JavaScript has become the **most important programming language** for technical interviews because:

- **Ubiquitous**: Runs everywhere (browsers, servers, mobile, desktop)
- **Versatile**: Frontend, backend, full-stack development
- **Modern Features**: ES6+ features test algorithmic thinking
- **Industry Demand**: 97% of websites use JavaScript on the client-side

### JavaScript Evolution

#### ES5 (2009) - The Foundation
- Basic language features
- Prototypal inheritance
- Function scope
- Limited modern constructs

#### ES6/ES2015 (2015) - The Modern Era
- Arrow functions
- Classes
- Modules
- Promises
- Destructuring
- Template literals

#### ES2020+ - The Future
- Optional chaining
- Nullish coalescing
- BigInt
- Dynamic imports

### JavaScript Engines

#### V8 (Chrome, Node.js)
- Developed by Google
- Powers Chrome browser and Node.js
- Known for speed and performance

#### SpiderMonkey (Firefox)
- First JavaScript engine ever created
- Powers Firefox browser
- Developed by Brendan Eich

#### JavaScriptCore (Safari)
- Powers Safari and iOS browsers
- Known for energy efficiency

### Setting Up Your Environment

#### Browser Console
\`\`\`javascript
// Open browser dev tools (F12)
// Go to Console tab
console.log("Hello, JavaScript!");
// Output: Hello, JavaScript!
\`\`\`

#### Node.js Setup
\`\`\`bash
# Install Node.js from nodejs.org
node --version
# Create a file: hello.js
console.log("Hello from Node.js!");
# Run: node hello.js
\`\`\`

#### Online Playgrounds
- **CodeSandbox**: Full development environment
- **JSFiddle**: Quick prototyping
- **CodePen**: Frontend experiments
- **LeetCode**: Algorithm practice

### First JavaScript Program

\`\`\`javascript
// hello.js
function greet(name) {
  return \`Hello, \${name}! Welcome to JavaScript.\`;
}

console.log(greet("Developer"));
// Output: Hello, Developer! Welcome to JavaScript.
\`\`\`

### Key Takeaways

- JavaScript is essential for modern web development
- ES6+ features are crucial for interviews
- Practice in browser console or Node.js
- Understanding engines helps with performance optimization

### Common Interview Questions

**Q: What's the difference between JavaScript and ECMAScript?**
- JavaScript is the language implementation
- ECMAScript is the specification/standard
- ES6, ES2015, etc. are ECMAScript versions

**Q: Why is JavaScript single-threaded?**
- Designed for browser environment
- Event loop handles asynchronous operations
- Web Workers for multi-threading when needed

Master the fundamentals - they're the building blocks of everything else! 🚀`,
    keyTakeaways: [
      "JavaScript is the most important language for technical interviews",
      "ES6+ features are essential for modern development",
      "Practice in browser console, Node.js, or online playgrounds",
      "Understanding JavaScript engines helps with performance optimization",
      "Single-threaded with event loop for asynchronous operations"
    ],
    commonMistakes: [
      "Confusing JavaScript with Java (different languages)",
      "Thinking JavaScript only runs in browsers (also servers, mobile, desktop)",
      "Not understanding the difference between ES versions",
      "Skipping environment setup and jumping straight to complex topics"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 12
  },

  {
    title: "Variables, Types & Operators",
    slug: "variables-types-operators",
    description: "Master JavaScript variables, data types, and operators",
    markdownContent: `# Variables, Types & Operators

## Variables: Storing Data

Variables are **containers for storing data values**. JavaScript provides three ways to declare variables:

### var (Legacy, Avoid in Modern Code)
\`\`\`javascript
var name = "John";     // String
var age = 25;          // Number
var isStudent = true;  // Boolean
\`\`\`

**Problems with var:**
- Function scope (not block scope)
- Hoisting issues
- Can be redeclared

### let (Block Scope, Modern)
\`\`\`javascript
let name = "John";     // Can be reassigned
name = "Jane";         // ✅ Valid

let age = 25;          // Block scoped
if (true) {
  let age = 30;        // Different variable
  console.log(age);    // 30
}
console.log(age);      // 25
\`\`\`

### const (Immutable, Preferred)
\`\`\`javascript
const PI = 3.14159;    // Cannot be reassigned
const user = { name: "John" };
user.name = "Jane";    // ✅ Valid (object properties can change)
user = {};             // ❌ Error: Assignment to constant variable
\`\`\`

## Data Types

### Primitive Types (7 total)
\`\`\`javascript
// 1. String
let name = "John";
let greeting = \`Hello, \${name}!\`; // Template literal

// 2. Number
let age = 25;
let price = 99.99;
let infinity = Infinity;
let notANumber = NaN;

// 3. Boolean
let isStudent = true;
let hasJob = false;

// 4. undefined
let unassigned;        // undefined
let empty = undefined; // explicitly undefined

// 5. null
let nothing = null;    // intentional absence of value

// 6. Symbol (ES6)
let uniqueId = Symbol("id");
let anotherId = Symbol("id");
console.log(uniqueId === anotherId); // false

// 7. BigInt (ES2020)
let bigNumber = 123456789012345678901234567890n;
\`\`\`

### Reference Types
\`\`\`javascript
// Objects
let person = {
  name: "John",
  age: 25,
  isStudent: true
};

// Arrays
let numbers = [1, 2, 3, 4, 5];
let mixed = ["hello", 42, true, null];

// Functions
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Type Coercion

JavaScript **automatically converts types** in certain situations:

### Implicit Coercion (Type Conversion)
\`\`\`javascript
// String concatenation
"5" + 3     // "53" (string)
5 + "3"     // "53" (string)

// Arithmetic operations
"5" - 3     // 2 (number)
"5" * 3     // 15 (number)
"5" / 3     // 1.666... (number)

// Boolean context
!!"hello"   // true
!!""        // false
!!0         // false
!!null      // false
!!undefined // false
\`\`\`

### Explicit Coercion (Type Casting)
\`\`\`javascript
// To String
String(123)       // "123"
(123).toString()  // "123"
123 + ""          // "123"

// To Number
Number("123")     // 123
parseInt("123px") // 123
parseFloat("1.23") // 1.23
+"123"            // 123 (unary plus)

// To Boolean
Boolean(1)        // true
Boolean(0)        // false
!!1               // true
!!0               // false
\`\`\`

## Operators

### Arithmetic Operators
\`\`\`javascript
let a = 10, b = 3;

a + b  // 13 (addition)
a - b  // 7 (subtraction)
a * b  // 30 (multiplication)
a / b  // 3.333... (division)
a % b  // 1 (modulus)
a ** b // 1000 (exponentiation)
\`\`\`

### Comparison Operators
\`\`\`javascript
let a = 10, b = "10";

a == b   // true (loose equality, type coercion)
a === b  // false (strict equality, no coercion)
a != b   // false
a !== b  // true

a > b    // false
a < b    // false
a >= b   // true
a <= b   // true
\`\`\`

### Logical Operators
\`\`\`javascript
let a = true, b = false;

a && b  // false (AND: both must be true)
a || b  // true (OR: at least one must be true)
!a      // false (NOT: invert boolean)

// Short-circuit evaluation
true && console.log("executed")   // executed
false && console.log("not executed") // not executed

false || console.log("executed")  // executed
true || console.log("not executed")  // not executed
\`\`\`

### Assignment Operators
\`\`\`javascript
let x = 10;

x += 5;  // x = x + 5;  // 15
x -= 3;  // x = x - 3;  // 12
x *= 2;  // x = x * 2;  // 24
x /= 4;  // x = x / 4;  // 6
x %= 5;  // x = x % 5;  // 1
x **= 3; // x = x ** 3; // 1
\`\`\`

## Interview Questions

**Q: What's the difference between == and ===?**
- \`==\` performs type coercion before comparison
- \`===\` compares both value and type without coercion
- Always use \`===\` unless you specifically need type coercion

**Q: What are truthy and falsy values?**
- Falsy: \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`
- Truthy: Everything else, including \`[]\`, \`{}\`, \`"0"\`

**Q: When should you use const vs let vs var?**
- \`const\` for immutable values (preferred)
- \`let\` for mutable variables
- \`var\` never (legacy, avoid)

Master these fundamentals - they're used in every JavaScript program! 🎯`,
    keyTakeaways: [
      "Use const for immutable values, let for mutable variables, avoid var",
      "JavaScript has 7 primitive types: string, number, boolean, undefined, null, symbol, bigint",
      "== performs type coercion, === compares strictly without coercion",
      "Falsy values: false, 0, \"\", null, undefined, NaN",
      "Template literals use backticks: `Hello ${name}!`"
    ],
    commonMistakes: [
      "Using var instead of let/const",
      "Confusing == with ===",
      "Not understanding type coercion behavior",
      "Trying to reassign const variables",
      "Forgetting that objects/arrays declared with const can still be mutated"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 15
  },

  {
    title: "Control Flow",
    slug: "control-flow",
    description: "Master conditional statements and loops in JavaScript",
    markdownContent: `# Control Flow: Making Decisions

## Conditional Statements

Control flow determines **which code executes** based on conditions.

### if/else Statements
\`\`\`javascript
let age = 18;

if (age >= 18) {
  console.log("You can vote!");
} else {
  console.log("You cannot vote yet.");
}

// Multiple conditions
if (age < 13) {
  console.log("Child");
} else if (age < 20) {
  console.log("Teenager");
} else if (age < 65) {
  console.log("Adult");
} else {
  console.log("Senior");
}
\`\`\`

### Ternary Operator (Conditional Expression)
\`\`\`javascript
// condition ? expressionIfTrue : expressionIfFalse
let canVote = age >= 18 ? "Yes" : "No";

// Nested ternary (use sparingly)
let category = age < 13 ? "Child" :
               age < 20 ? "Teenager" :
               age < 65 ? "Adult" : "Senior";
\`\`\`

### Switch Statement
\`\`\`javascript
let day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of work week");
    break;
  case "Friday":
    console.log("TGIF!");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Regular workday");
}

// Switch with expressions (ES6+)
switch (true) {
  case age < 13:
    console.log("Child");
    break;
  case age < 20:
    console.log("Teenager");
    break;
  default:
    console.log("Adult");
}
\`\`\`

## Loops: Repeating Code

Loops execute code **multiple times**.

### for Loop
\`\`\`javascript
// Basic for loop
for (let i = 0; i < 5; i++) {
  console.log(\`Iteration \${i}\`);
}

// Looping through arrays
let fruits = ["apple", "banana", "orange"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// Reverse loop
for (let i = fruits.length - 1; i >= 0; i--) {
  console.log(fruits[i]);
}
\`\`\`

### while Loop
\`\`\`javascript
let count = 0;

// Condition checked before execution
while (count < 5) {
  console.log(\`Count: \${count}\`);
  count++;
}

// Infinite loop (dangerous!)
while (true) {
  console.log("This will run forever!");
  break; // Don't forget to break!
}
\`\`\`

### do-while Loop
\`\`\`javascript
let num = 0;

// Executes at least once, then checks condition
do {
  console.log(\`Number: \${num}\`);
  num++;
} while (num < 3);
\`\`\`

### for...of Loop (ES6+)
\`\`\`javascript
// Iterating over arrays
let colors = ["red", "green", "blue"];
for (let color of colors) {
  console.log(color);
}

// Iterating over strings
let name = "JavaScript";
for (let char of name) {
  console.log(char);
}
\`\`\`

### for...in Loop (Objects)
\`\`\`javascript
let person = {
  name: "John",
  age: 25,
  city: "New York"
};

for (let key in person) {
  console.log(\`\${key}: \${person[key]}\`);
}
\`\`\`

## Break and Continue

### break: Exit the loop entirely
\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break; // Exit loop when i is 5
  }
  console.log(i); // Prints 0, 1, 2, 3, 4
}
\`\`\`

### continue: Skip current iteration
\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) {
    continue; // Skip even numbers
  }
  console.log(i); // Prints 1, 3, 5, 7, 9
}
\`\`\`

## Nested Loops
\`\`\`javascript
// Multiplication table
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(\`\${i} × \${j} = \${i * j}\`);
  }
}

// Breaking out of nested loops
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outerLoop; // Break out of both loops
    }
    console.log(\`i: \${i}, j: \${j}\`);
  }
}
\`\`\`

## Practical Examples

### Finding Maximum in Array
\`\`\`javascript
function findMax(arr) {
  if (arr.length === 0) return undefined;

  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}
\`\`\`

### Checking if Array is Sorted
\`\`\`javascript
function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}
\`\`\`

### FizzBuzz (Classic Interview Problem)
\`\`\`javascript
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}
\`\`\`

## Performance Considerations

### Time Complexity of Loops
- **Single loop**: O(n)
- **Nested loops**: O(n²)
- **Loop with constant iterations**: O(1)

### Optimization Tips
- **Cache array length** in for loops
- **Use for loops** for known iterations
- **Use while loops** for unknown iterations
- **Break early** when possible
- **Avoid nested loops** when O(n) solution exists

## Interview Questions

**Q: What's the difference between for...of and for...in?**
- \`for...of\` iterates over values of iterable objects
- \`for...in\` iterates over enumerable properties of objects

**Q: When would you use a while loop vs a for loop?**
- \`for\` loop: known number of iterations
- \`while\` loop: condition-based iteration

**Q: How do you break out of nested loops?**
- Use labeled breaks: \`break outerLoop;\`
- Extract nested logic into separate function
- Use flags or return statements

Master control flow - it's the logic behind every algorithm! 🎯`,
    keyTakeaways: [
      "Use if/else for conditions, ternary for simple expressions",
      "for loops for known iterations, while for condition-based",
      "for...of for arrays/strings, for...in for object properties",
      "break exits loop entirely, continue skips current iteration",
      "Nested loops are O(n²) - optimize when possible"
    ],
    commonMistakes: [
      "Forgetting break in switch statements",
      "Infinite loops (missing increment/break condition)",
      "Using == instead of === in conditions",
      "Off-by-one errors in loop bounds",
      "Modifying loop counter inside loop body"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 18
  },

  {
    title: "Functions",
    slug: "functions",
    description: "Understanding function declarations, expressions, and scope",
    markdownContent: `# Functions: Reusable Code Blocks

## What is a Function?

A function is a **reusable block of code** that performs a specific task. Functions help organize code, reduce repetition, and make programs more modular.

### Why Functions Matter?

- **Code Reusability**: Write once, use many times
- **Modularity**: Break complex problems into smaller pieces
- **Maintainability**: Easier to debug and modify
- **Abstraction**: Hide implementation details
- **Testing**: Test individual functions separately

## Function Declaration
\`\`\`javascript
// Function declaration (hoisted)
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("John")); // "Hello, John!"
\`\`\`

## Function Expression
\`\`\`javascript
// Anonymous function expression
const greet = function(name) {
  return \`Hello, \${name}!\`;
};

// Named function expression
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
};
\`\`\`

## Arrow Functions (ES6+)
\`\`\`javascript
// Basic arrow function
const greet = (name) => \`Hello, \${name}!\`;

// Multiple parameters
const add = (a, b) => a + b;

// Multiple statements (need curly braces)
const calculate = (a, b) => {
  const sum = a + b;
  const product = a * b;
  return { sum, product };
};

// Single parameter (parentheses optional)
const square = x => x * x;
const greet = name => \`Hello, \${name}!\`;
\`\`\`

## Parameters and Arguments

### Default Parameters
\`\`\`javascript
function greet(name = "Guest") {
  return \`Hello, \${name}!\`;
}

console.log(greet());        // "Hello, Guest!"
console.log(greet("John"));  // "Hello, John!"
\`\`\`

### Rest Parameters (ES6+)
\`\`\`javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3));     // 6
console.log(sum(1, 2, 3, 4));  // 10
\`\`\`

### Arguments Object (Legacy)
\`\`\`javascript
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log(sum(1, 2, 3)); // 6
\`\`\`

## Return Values

### Returning Values
\`\`\`javascript
function add(a, b) {
  return a + b;  // Explicit return
}

function greet(name) {
  console.log(\`Hello, \${name}!\`);
  // No return statement = returns undefined
}
\`\`\`

### Early Returns
\`\`\`javascript
function findFirstEven(numbers) {
  for (let num of numbers) {
    if (num % 2 === 0) {
      return num;  // Exit function immediately
    }
  }
  return null;  // If no even number found
}
\`\`\`

## Scope and Hoisting

### Global Scope
\`\`\`javascript
let globalVar = "I'm global";

function testScope() {
  console.log(globalVar); // Accessible
}
\`\`\`

### Function Scope
\`\`\`javascript
function testScope() {
  let localVar = "I'm local";
  console.log(localVar); // Accessible
}

console.log(localVar); // ❌ ReferenceError
\`\`\`

### Block Scope (ES6+)
\`\`\`javascript
if (true) {
  let blockVar = "I'm block scoped";
  const anotherVar = "Also block scoped";
  var functionVar = "I'm function scoped";
}

console.log(blockVar);    // ❌ ReferenceError
console.log(anotherVar);  // ❌ ReferenceError
console.log(functionVar); // ✅ "I'm function scoped"
\`\`\`

### Hoisting
\`\`\`javascript
// Function declarations are hoisted
console.log(greet("John")); // ✅ Works!

function greet(name) {
  return \`Hello, \${name}!\`;
}

// Function expressions are NOT hoisted
console.log(square(5)); // ❌ TypeError

const square = x => x * x;
\`\`\`

## Function Types and Patterns

### IIFE (Immediately Invoked Function Expression)
\`\`\`javascript
// Creates private scope
(function() {
  let privateVar = "I'm private";
  console.log(privateVar);
})();

console.log(privateVar); // ❌ ReferenceError
\`\`\`

### Callback Functions
\`\`\`javascript
function processArray(arr, callback) {
  for (let item of arr) {
    callback(item);
  }
}

processArray([1, 2, 3], function(num) {
  console.log(num * 2);
});
// Output: 2, 4, 6
\`\`\`

### Higher-Order Functions
\`\`\`javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
\`\`\`

## Pure Functions vs Impure Functions

### Pure Functions
\`\`\`javascript
// Always returns same output for same input
// No side effects
function add(a, b) {
  return a + b;
}

// Benefits: Predictable, testable, cacheable
\`\`\`

### Impure Functions
\`\`\`javascript
let counter = 0;

// Has side effects, depends on external state
function incrementCounter() {
  counter++; // Side effect
  return counter;
}

// Depends on external input
function getRandomNumber() {
  return Math.random(); // Unpredictable
}
\`\`\`

## Recursion

### Basic Recursion
\`\`\`javascript
function factorial(n) {
  if (n <= 1) {
    return 1; // Base case
  }
  return n * factorial(n - 1); // Recursive case
}

console.log(factorial(5)); // 120
\`\`\`

### Recursion with Memoization
\`\`\`javascript
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}
\`\`\`

## Interview Questions

**Q: What's the difference between function declaration and expression?**
- Declaration: Hoisted, can be called before definition
- Expression: Not hoisted, must be defined before use

**Q: When should you use arrow functions vs regular functions?**
- Arrow: Lexical \`this\`, shorter syntax, no arguments object
- Regular: When you need \`this\` context, arguments object, or constructors

**Q: What is a closure?**
- Function that remembers variables from its outer scope
- Even after outer function has finished executing

**Q: What's function hoisting?**
- Function declarations are moved to top of scope during compilation
- Allows calling functions before they're defined

Master functions - they're the building blocks of JavaScript programs! 🚀`,
    keyTakeaways: [
      "Functions are reusable blocks of code that perform specific tasks",
      "Use function declarations for hoisting, expressions for flexibility",
      "Arrow functions have lexical this binding and shorter syntax",
      "Parameters can have defaults, rest syntax collects multiple args",
      "Pure functions are predictable with no side effects"
    ],
    commonMistakes: [
      "Confusing function declarations with expressions",
      "Forgetting return statements in functions",
      "Using var instead of let/const in loops with closures",
      "Not understanding hoisting behavior",
      "Infinite recursion without proper base cases"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 20
  },

  // Chapter 2: ES6+ Features (5 lessons)
  {
    title: "Arrow Functions & Modern Syntax",
    slug: "arrow-functions-modern-syntax",
    description: "Master ES6+ arrow functions and modern JavaScript syntax",
    markdownContent: `# Arrow Functions & Modern Syntax

## Arrow Functions: The Modern Way

Arrow functions introduced in ES6 provide a **concise syntax** for writing functions and solve common \`this\` binding issues.

### Basic Syntax
\`\`\`javascript
// Traditional function
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow function
const greet = (name) => \`Hello, \${name}!\`;

// Multiple parameters
const add = (a, b) => a + b;

// No parameters
const sayHello = () => "Hello!";

// Single parameter (parentheses optional)
const square = x => x * x;
const greet = name => \`Hello, \${name}!\`;
\`\`\`

### Implicit vs Explicit Return
\`\`\`javascript
// Implicit return (single expression)
const add = (a, b) => a + b;
const getUser = () => ({ name: "John", age: 25 });

// Explicit return (multiple statements)
const calculate = (a, b) => {
  const sum = a + b;
  const product = a * b;
  return { sum, product };
};
\`\`\`

## The \`this\` Binding Difference

### Traditional Functions
\`\`\`javascript
const person = {
  name: "John",
  greet: function() {
    console.log(\`Hello, I'm \${this.name}\`);
  }
};

person.greet(); // "Hello, I'm John"
\`\`\`

### Arrow Functions (Lexical \`this\`)
\`\`\`javascript
const person = {
  name: "John",
  greet: () => {
    console.log(\`Hello, I'm \${this.name}\`);
  }
};

person.greet(); // "Hello, I'm undefined" (this refers to global/window)
\`\`\`

### When to Use Each
\`\`\`javascript
const button = document.querySelector('button');

// ✅ Arrow function: lexical this
button.addEventListener('click', () => {
  console.log('Button clicked!');
});

// ✅ Traditional function: dynamic this
const person = {
  name: "John",
  greet: function() {
    console.log(\`Hello, I'm \${this.name}\`);
  }
};

// ✅ Arrow function: concise callbacks
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

// ❌ Don't use arrow functions as methods
const obj = {
  value: 42,
  getValue: () => this.value // undefined
};
\`\`\`

## Arguments Object

### Traditional Functions Have \`arguments\`
\`\`\`javascript
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log(sum(1, 2, 3)); // 6
\`\`\`

### Arrow Functions Don't Have \`arguments\`
\`\`\`javascript
const sum = () => {
  // console.log(arguments); // ❌ ReferenceError
};

// Use rest parameters instead
const sum = (...args) => {
  return args.reduce((total, num) => total + num, 0);
};

console.log(sum(1, 2, 3)); // 6
\`\`\`

## Constructor Functions

### Traditional Constructors
\`\`\`javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return \`Hello, I'm \${this.name}\`;
};

const john = new Person("John", 25);
\`\`\`

### Arrow Functions Cannot Be Constructors
\`\`\`javascript
const Person = (name, age) => {
  this.name = name;
  this.age = age;
};

// const john = new Person("John", 25); // ❌ TypeError
\`\`\`

## Modern JavaScript Patterns

### Method Shorthand
\`\`\`javascript
// ES6+ object literal
const person = {
  name: "John",
  age: 25,

  // Method shorthand
  greet() {
    return \`Hello, I'm \${this.name}\`;
  },

  // Arrow function (lexical this)
  getAge: () => this.age, // ❌ undefined

  // Traditional function
  getName: function() {
    return this.name; // ✅ "John"
  }
};
\`\`\`

### Computed Property Names
\`\`\`javascript
const key = "dynamicKey";
const obj = {
  [key]: "dynamic value",
  [\`computed_\${key}\`]: "another value"
};

console.log(obj.dynamicKey);        // "dynamic value"
console.log(obj.computed_dynamicKey); // "another value"
\`\`\`

### Shorthand Property Names
\`\`\`javascript
const name = "John";
const age = 25;

// ES6+ shorthand
const person = { name, age };
// Equivalent to: { name: name, age: age }
\`\`\`

## Practical Examples

### Array Methods with Arrow Functions
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2);

// Filter
const evens = numbers.filter(n => n % 2 === 0);

// Reduce
const sum = numbers.reduce((total, n) => total + n, 0);

// Find
const firstEven = numbers.find(n => n % 2 === 0);
\`\`\`

### Promises with Arrow Functions
\`\`\`javascript
const fetchUser = (id) => {
  return fetch(\`/api/users/\${id}\`)
    .then(response => response.json())
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(error => console.error(error));
};
\`\`\`

### Event Handlers
\`\`\`javascript
// ✅ Arrow function maintains lexical scope
class Counter extends React.Component {
  state = { count: 0 };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <button onClick={this.increment}>
        Count: {this.state.count}
      </button>
    );
  }
}
\`\`\`

## Performance Considerations

### When Arrow Functions Are Slower
\`\`\`javascript
// Arrow function in render (creates new function each time)
const Component = () => {
  const items = [1, 2, 3];

  return (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li> // ❌ New function each render
      ))}
    </ul>
  );
};

// Optimized version
const Component = () => {
  const items = [1, 2, 3];

  const renderItem = useCallback((item) => (
    <li key={item}>{item}</li>
  ), []);

  return (
    <ul>
      {items.map(renderItem)}
    </ul>
  );
};
\`\`\`

## Interview Questions

**Q: When should you NOT use arrow functions?**
- As object methods (wrong \`this\` binding)
- As constructor functions
- When you need \`arguments\` object
- In recursive functions where you need \`this\` context

**Q: What's the difference between arrow functions and regular functions?**
- Arrow: lexical \`this\`, no \`arguments\`, cannot be constructors
- Regular: dynamic \`this\`, has \`arguments\`, can be constructors

**Q: How do arrow functions affect performance?**
- Generally same performance
- May create new function instances in render loops
- Use \`useCallback\` in React to optimize

Master arrow functions - they're everywhere in modern JavaScript! 🎯`,
    keyTakeaways: [
      "Arrow functions provide concise syntax and lexical this binding",
      "Use () => for implicit return, () => {} for explicit return",
      "Arrow functions don't have their own this or arguments",
      "Don't use arrows as object methods or constructors",
      "Arrow functions are perfect for callbacks and array methods"
    ],
    commonMistakes: [
      "Using arrow functions as object methods (wrong this binding)",
      "Trying to use arguments object in arrow functions",
      "Attempting to use arrow functions as constructors",
      "Forgetting parentheses for multiple parameters",
      "Creating new arrow functions in render loops (performance)"
    ],
    difficulty: "BEGINNER",
    premium: true,
    estimatedMinutes: 16
  },

  {
    title: "Destructuring & Spread",
    slug: "destructuring-spread",
    description: "Master destructuring assignment and spread/rest operators",
    markdownContent: `# Destructuring & Spread Operators

## Destructuring: Unpacking Values

Destructuring allows you to **unpack values** from arrays or objects into distinct variables.

### Array Destructuring
\`\`\`javascript
// Basic array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, third] = numbers;

console.log(first);  // 1
console.log(second); // 2
console.log(third);  // 3

// Skipping values
const [a, , c] = numbers;
console.log(a, c); // 1, 3

// Rest operator
const [head, ...tail] = numbers;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Default values
const [x = 10, y = 20] = [5];
console.log(x, y); // 5, 20
\`\`\`

### Object Destructuring
\`\`\`javascript
// Basic object destructuring
const person = {
  name: "John",
  age: 25,
  city: "New York"
};

const { name, age, city } = person;
console.log(name, age, city); // "John", 25, "New York"

// Renaming variables
const { name: fullName, age: years } = person;
console.log(fullName, years); // "John", 25

// Default values
const { name, country = "USA" } = person;
console.log(name, country); // "John", "USA"

// Nested destructuring
const user = {
  id: 1,
  profile: {
    firstName: "John",
    lastName: "Doe"
  }
};

const {
  profile: { firstName, lastName }
} = user;
console.log(firstName, lastName); // "John", "Doe"
\`\`\`

### Function Parameters
\`\`\`javascript
// Array destructuring in parameters
function processNumbers([first, second, ...rest]) {
  console.log(first, second, rest);
}

processNumbers([1, 2, 3, 4]); // 1, 2, [3, 4]

// Object destructuring in parameters
function createUser({ name, age, email, ...otherProps }) {
  console.log(name, age, email);
  console.log(otherProps);
}

createUser({
  name: "John",
  age: 25,
  email: "john@example.com",
  role: "admin"
});
// "John", 25, "john@example.com"
// { role: "admin" }

// Default parameters with destructuring
function greet({ name = "Guest", age = 18 } = {}) {
  console.log(\`Hello \${name}, you are \${age} years old\`);
}

greet(); // "Hello Guest, you are 18 years old"
greet({ name: "John" }); // "Hello John, you are 18 years old"
\`\`\`

## Spread Operator: Spreading Values

The spread operator (\`...\`) allows you to **expand** iterables into individual elements.

### Array Spread
\`\`\`javascript
// Copying arrays
const original = [1, 2, 3];
const copy = [...original];
console.log(copy); // [1, 2, 3]

// Merging arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];
console.log(merged); // [1, 2, 3, 4, 5, 6]

// Adding elements
const withExtras = [0, ...arr1, 4, 5];
console.log(withExtras); // [0, 1, 2, 3, 4, 5]

// Converting to array
function sum(a, b, c) {
  return a + b + c;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6
\`\`\`

### Object Spread
\`\`\`javascript
// Copying objects
const original = { name: "John", age: 25 };
const copy = { ...original };
console.log(copy); // { name: "John", age: 25 }

// Merging objects
const person = { name: "John", age: 25 };
const address = { city: "New York", country: "USA" };
const merged = { ...person, ...address };
console.log(merged); // { name: "John", age: 25, city: "New York", country: "USA" }

// Overriding properties
const updated = { ...person, age: 26 };
console.log(updated); // { name: "John", age: 26 }

// Adding properties
const withId = { id: 1, ...person };
console.log(withId); // { id: 1, name: "John", age: 25 }
\`\`\`

### String Spread
\`\`\`javascript
// Spreading strings into characters
const name = "JavaScript";
const chars = [...name];
console.log(chars); // ['J', 'a', 'v', 'a', 'S', 'c', 'r', 'i', 'p', 't']
\`\`\`

## Rest vs Spread

### Rest: Collecting Values
\`\`\`javascript
// Rest in function parameters
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

// Rest in destructuring
const [first, ...rest] = [1, 2, 3, 4];
console.log(rest); // [2, 3, 4]

const { name, ...otherProps } = { name: "John", age: 25, city: "NYC" };
console.log(otherProps); // { age: 25, city: "NYC" }
\`\`\`

### Spread: Expanding Values
\`\`\`javascript
// Spread in function calls
const numbers = [1, 2, 3];
console.log(Math.max(...numbers)); // 3

// Spread in arrays
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

// Spread in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
\`\`\`

## Practical Examples

### Swapping Variables
\`\`\`javascript
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
\`\`\`

### Function with Variable Arguments
\`\`\`javascript
function createLogger(prefix, ...messages) {
  messages.forEach(message => {
    console.log(\`[\${prefix}] \${message}\`);
  });
}

createLogger("INFO", "Server started", "Database connected");
// [INFO] Server started
// [INFO] Database connected
\`\`\`

### Deep Copy vs Shallow Copy
\`\`\`javascript
// Shallow copy (nested objects still reference original)
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 3;
console.log(original.nested.b); // 3 (affected!)

// Deep copy (requires JSON or libraries)
const deep = JSON.parse(JSON.stringify(original));
deep.nested.b = 4;
console.log(original.nested.b); // 3 (unaffected)
\`\`\`

### React Props Spreading
\`\`\`javascript
function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// Usage
<Button
  className="primary"
  onClick={handleClick}
  disabled={isLoading}
>
  Click me
</Button>
\`\`\`

### Configuration Objects
\`\`\`javascript
const defaultConfig = {
  theme: "light",
  language: "en",
  notifications: true
};

function createApp(config) {
  const finalConfig = { ...defaultConfig, ...config };
  // Use finalConfig...
}

// Usage
createApp({ theme: "dark" }); // Overrides theme, keeps other defaults
\`\`\`

## Performance Considerations

### Spread Operator Performance
\`\`\`javascript
// ✅ Efficient for small arrays/objects
const small = [1, 2, 3];
const copy = [...small];

// ❌ Inefficient for large arrays (creates full copy)
const large = Array.from({ length: 100000 }, (_, i) => i);
const copy = [...large]; // Creates 100K element array

// Better: Use original reference if no mutation needed
function processArray(arr) {
  // Don't spread if you don't need to modify
  return arr.filter(x => x > 0);
}
\`\`\`

### Destructuring in Loops

## Interview Questions

**Q: What's the difference between rest and spread operators?**
- Rest: Collects multiple elements into array/object
- Spread: Expands array/object into individual elements

**Q: When would you use destructuring?**
- Extracting multiple properties from objects
- Getting specific elements from arrays
- Function parameters with default values
- Swapping variables without temp variable

**Q: What's shallow copy vs deep copy?**
- Shallow: Spread operator creates shallow copy
- Deep: Need JSON.parse/stringify or structuredClone()

Master destructuring and spread - they're essential modern JavaScript! 🎯`,
    keyTakeaways: [
      "Destructuring unpacks arrays/objects into variables",
      "Spread operator expands iterables into elements",
      "Rest collects remaining elements in destructuring",
      "Use spread for copying, merging, and function calls",
      "Object spread creates shallow copies"
    ],
    commonMistakes: [
      "Confusing rest (...) with spread (...)",
      "Forgetting commas when skipping array elements",
      "Using spread on large arrays (performance impact)",
      "Not understanding shallow vs deep copy behavior",
      "Trying to destructure undefined/null without defaults"
    ],
    difficulty: "BEGINNER",
    premium: true,
    estimatedMinutes: 18
  },

  // Chapter 3: Closures & Scope (3 lessons)
  {
    title: "Understanding Scope",
    slug: "understanding-scope",
    description: "Master JavaScript scope, hoisting, and lexical environment",
    markdownContent: `# Understanding Scope

## What is Scope?

**Scope** determines the accessibility (visibility) of variables, functions, and objects in different parts of your code during runtime.

### Why Scope Matters

- **Prevents naming conflicts**: Variables in different scopes don't interfere
- **Memory management**: Variables are cleaned up when scope ends
- **Security**: Limits access to sensitive data
- **Debugging**: Helps understand variable lifecycle

## Types of Scope

### Global Scope
\`\`\`javascript
// Global scope - accessible everywhere
let globalVar = "I'm global";

function testGlobal() {
  console.log(globalVar); // ✅ Accessible
}

console.log(globalVar); // ✅ Accessible
\`\`\`

**Problems with global scope:**
- Naming conflicts
- Memory leaks (never garbage collected)
- Hard to debug
- Security risks

### Function Scope (var)
\`\`\`javascript
function testFunctionScope() {
  var functionVar = "I'm function scoped";
  console.log(functionVar); // ✅ Accessible
}

console.log(functionVar); // ❌ ReferenceError
\`\`\`

### Block Scope (let/const)
\`\`\`javascript
if (true) {
  let blockVar = "I'm block scoped";
  const blockConst = "Also block scoped";
  var functionVar = "I'm function scoped";

  console.log(blockVar);    // ✅ Accessible
  console.log(blockConst);  // ✅ Accessible
}

console.log(blockVar);    // ❌ ReferenceError
console.log(blockConst);  // ❌ ReferenceError
console.log(functionVar); // ✅ Accessible (function scope)
\`\`\`

## Lexical Scope (Static Scope)

JavaScript uses **lexical scoping** (also called static scoping). The scope of a variable is determined by its position in the source code.

\`\`\`javascript
let globalVar = "global";

function outer() {
  let outerVar = "outer";

  function inner() {
    let innerVar = "inner";
    console.log(innerVar); // "inner"
    console.log(outerVar); // "outer" (lexical scope)
    console.log(globalVar); // "global" (lexical scope)
  }

  inner();
  console.log(innerVar); // ❌ ReferenceError
}

outer();
\`\`\`

## Scope Chain

When you reference a variable, JavaScript looks for it in the following order:

1. **Current scope**
2. **Parent scope** (lexical parent)
3. **Grandparent scope**
4. **...until global scope**
5. **ReferenceError** if not found

\`\`\`javascript
let global = "global";

function level1() {
  let level1Var = "level1";

  function level2() {
    let level2Var = "level2";

    function level3() {
      let level3Var = "level3";
      console.log(level3Var); // "level3" (current)
      console.log(level2Var); // "level2" (parent)
      console.log(level1Var); // "level1" (grandparent)
      console.log(global);    // "global" (global)
    }

    level3();
  }

  level2();
}

level1();
\`\`\`

## Hoisting

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope during compilation.

### Variable Hoisting
\`\`\`javascript
console.log(hoistedVar); // undefined (hoisted but not initialized)
var hoistedVar = "I'm hoisted";

console.log(letVar); // ❌ ReferenceError
let letVar = "Not hoisted";
\`\`\`

### Function Declaration Hoisting
\`\`\`javascript
// Function declarations are fully hoisted
hoistedFunction(); // ✅ "I'm hoisted!"

function hoistedFunction() {
  console.log("I'm hoisted!");
}
\`\`\`

### Function Expression Hoisting
\`\`\`javascript
expressionFunction(); // ❌ TypeError

var expressionFunction = function() {
  console.log("Not hoisted");
};
\`\`\`

## Temporal Dead Zone (TDZ)

The **Temporal Dead Zone** is the period between entering scope and variable declaration.

\`\`\`javascript
{
  // TDZ starts here
  console.log(letVar); // ❌ ReferenceError
  console.log(constVar); // ❌ ReferenceError

  let letVar = "let variable";
  const constVar = "const variable";

  // TDZ ends here
}
\`\`\`

## Practical Examples

### Module Pattern (Pre-ES6)
\`\`\`javascript
// IIFE creates private scope
const Counter = (function() {
  let count = 0; // Private variable

  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
})();

console.log(Counter.getCount()); // 0
Counter.increment();
console.log(Counter.getCount()); // 1
\`\`\`

### Avoiding Global Pollution
\`\`\`javascript
// Bad: Global variables
let userData = { name: "John" };
function updateUser() {
  userData.name = "Jane";
}

// Good: Local scope
function createUserManager() {
  let userData = { name: "John" };

  return {
    updateUser: function(newName) {
      userData.name = newName;
    },
    getUser: function() {
      return userData;
    }
  };
}

const userManager = createUserManager();
userManager.updateUser("Jane");
\`\`\`

## Scope in Loops

### var in Loops (Problematic)
\`\`\`javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 3, 3, 3 (closure captures final value)
  }, 100);
}
\`\`\`

### let in Loops (Block Scope)
\`\`\`javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 0, 1, 2 (each iteration has its own i)
  }, 100);
}
\`\`\`

## Interview Questions

**Q: What's the difference between scope and context?**
- Scope: Variable accessibility (lexical)
- Context: Value of \`this\` (runtime)

**Q: What is hoisting?**
- Declarations moved to top of scope during compilation
- \`var\` variables hoisted as \`undefined\`
- \`let\`/\`const\` not hoisted (TDZ)

**Q: Why is global scope bad?**
- Naming conflicts
- Memory leaks
- Security issues
- Hard to debug

**Q: What's lexical scope?**
- Scope determined by code structure
- Functions access variables from parent scopes
- Predictable and static

Master scope - it's fundamental to JavaScript! 🎯`,
    keyTakeaways: [
      "Scope determines variable accessibility in code",
      "JavaScript uses lexical (static) scoping",
      "let/const are block scoped, var is function scoped",
      "Hoisting moves declarations to top of scope",
      "TDZ prevents access to let/const before declaration"
    ],
    commonMistakes: [
      "Using var instead of let/const",
      "Assuming let/const are hoisted like var",
      "Creating too many global variables",
      "Not understanding closure scope capture",
      "Confusing scope with context (this)"
    ],
    difficulty: "INTERMEDIATE",
    premium: false,
    estimatedMinutes: 16
  },

  {
    title: "Closures Explained",
    slug: "closures-explained",
    description: "Master closures, the most important JavaScript concept",
    markdownContent: `# Closures Explained

## What is a Closure?

A **closure** is a function that remembers variables from its outer (enclosing) scope even after the outer function has finished executing.

### The Closure Definition

> "A closure is the combination of a function and the lexical environment within which that function was declared."

### Why Closures Matter

- **Data privacy**: Create private variables
- **Function factories**: Generate specialized functions
- **Callbacks**: Maintain state between calls
- **Memory management**: Variables persist as long as closure exists
- **Asynchronous operations**: Preserve context

## Basic Closure Example
\`\`\`javascript
function outerFunction() {
  let outerVariable = "I'm from outer scope";

  function innerFunction() {
    console.log(outerVariable); // ✅ Can access outerVariable
  }

  return innerFunction;
}

const closureFunction = outerFunction();
closureFunction(); // "I'm from outer scope"
\`\`\`

Even though \`outerFunction\` finished executing, \`innerFunction\` still has access to \`outerVariable\`.

## Closure with Parameters
\`\`\`javascript
function createGreeting(greeting) {
  return function(name) {
    return \`\${greeting}, \${name}!\`;
  };
}

const sayHello = createGreeting("Hello");
const sayHi = createGreeting("Hi");

console.log(sayHello("John")); // "Hello, John!"
console.log(sayHi("Jane"));    // "Hi, Jane!"
\`\`\`

## Practical Applications

### 1. Data Privacy (Module Pattern)
\`\`\`javascript
function createCounter() {
  let count = 0; // Private variable

  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
counter.increment();
console.log(counter.getCount()); // 1
console.log(counter.count); // undefined (private!)
\`\`\`

### 2. Function Factory
\`\`\`javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log(double(5));     // 10
console.log(triple(5));     // 15
console.log(quadruple(5));  // 20
\`\`\`

### 3. Memoization
\`\`\`javascript
function createMemoizedFunction(fn) {
  const cache = {}; // Private cache

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }

    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

function expensiveCalculation(n) {
  console.log(\`Calculating for \${n}\`);
  return n * n;
}

const memoizedCalc = createMemoizedFunction(expensiveCalculation);

console.log(memoizedCalc(5)); // "Calculating for 5" then 25
console.log(memoizedCalc(5)); // 25 (cached, no calculation)
\`\`\`

### 4. Event Handlers
\`\`\`javascript
function createEventHandler(elementId) {
  const element = document.getElementById(elementId);
  let clickCount = 0;

  element.addEventListener('click', function() {
    clickCount++;
    console.log(\`Clicked \${clickCount} times\`);
  });

  return {
    getClickCount: function() {
      return clickCount;
    }
  };
}

const handler = createEventHandler('myButton');
// Click the button multiple times
console.log(handler.getClickCount()); // Shows current count
\`\`\`

## Common Closure Pitfalls

### 1. Loops with var (Classic Bug)
\`\`\`javascript
// ❌ Wrong: var creates function scope
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 3, 3, 3
  }, 100);
}

// ✅ Correct: let creates block scope
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 0, 1, 2
  }, 100);
}

// ✅ Alternative: IIFE
for (var i = 0; i < 3; i++) {
  (function(index) {
    setTimeout(() => {
      console.log(index); // 0, 1, 2
    }, 100);
  })(i);
}
\`\`\`

### 2. Memory Leaks
\`\`\`javascript
function createLeak() {
  const largeData = new Array(1000000).fill('data');

  return function() {
    console.log(largeData.length);
  };
}

const leakyFunction = createLeak();
// largeData cannot be garbage collected
// because leakyFunction maintains reference
\`\`\`

## Advanced Closure Patterns

### 1. Partial Application
\`\`\`javascript
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn.apply(this, [...fixedArgs, ...remainingArgs]);
  };
}

function greet(greeting, name) {
  return \`\${greeting}, \${name}!\`;
}

const sayHello = partial(greet, "Hello");
console.log(sayHello("John")); // "Hello, John!"
\`\`\`

### 2. Currying
\`\`\`javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, [...args, ...moreArgs]);
      };
    }
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
\`\`\`

## Interview Questions

**Q: What is a closure?**
- Function that captures variables from outer scope
- Maintains access even after outer function returns
- Creates private data and function factories

**Q: How do closures relate to memory management?**
- Closures prevent garbage collection of captured variables
- Can cause memory leaks if not careful
- Useful for caching and memoization

**Q: What's the classic closure interview question?**
- Loop with setTimeout using var vs let
- Demonstrates scope and closure capture

**Q: When should you use closures?**
- Data privacy and encapsulation
- Creating function factories
- Event handlers and callbacks
- Memoization and caching

Master closures - they're the heart of JavaScript! 🚀`,
    keyTakeaways: [
      "Closure is function + lexical environment",
      "Functions remember variables from outer scope",
      "Used for data privacy, factories, and callbacks",
      "Can cause memory leaks if not careful",
      "Classic interview topic with loops + setTimeout"
    ],
    commonMistakes: [
      "Using var in loops with closures",
      "Not understanding memory implications",
      "Trying to access closure variables directly",
      "Creating unnecessary closures in loops",
      "Memory leaks from large captured data"
    ],
    difficulty: "INTERMEDIATE",
    premium: true,
    estimatedMinutes: 22
  },

  {
    title: "Closures in Interviews",
    slug: "closures-in-interviews",
    description: "Master closure interview questions and patterns",
    markdownContent: `# Closures in Interviews

## Why Closures Matter in Interviews

Closures are a **fundamental JavaScript concept** that appear in nearly every technical interview. Understanding closures demonstrates:

- Deep understanding of scope and execution context
- Knowledge of memory management
- Ability to solve complex problems
- Experience with asynchronous programming

## Classic Interview Questions

### Question 1: Loop with setTimeout
\`\`\`javascript
// What will this print?
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}

// Answer: 3, 3, 3
// Why: var is function scoped, closure captures final value
\`\`\`

**Solutions:**
\`\`\`javascript
// Solution 1: Use let (block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Output: 0, 1, 2

// Solution 2: IIFE (creates new scope)
for (var i = 0; i < 3; i++) {
  (function(index) {
    setTimeout(() => {
      console.log(index);
    }, 100);
  })(i);
}
// Output: 0, 1, 2

// Solution 3: Bind with closure
for (var i = 0; i < 3; i++) {
  setTimeout(console.log.bind(null, i), 100);
}
// Output: 0, 1, 2
\`\`\`

### Question 2: Private Variables
\`\`\`javascript
// Create a counter with private state
function createCounter() {
  // Implement this
}

// Usage:
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
\`\`\`

**Solution:**
\`\`\`javascript
function createCounter() {
  let count = 0; // Private variable

  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}
\`\`\`

### Question 3: Function Factory
\`\`\`javascript
// Create multiplier functions
function createMultiplier(multiplier) {
  // Return a function that multiplies by multiplier
}

// Usage:
const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
\`\`\`

**Solution:**
\`\`\`javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}
\`\`\`

## Advanced Interview Patterns

### Pattern 1: Memoization
\`\`\`javascript
function memoize(fn) {
  const cache = {};

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }

    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

// Usage
const expensiveFunction = (n) => {
  console.log(\`Computing \${n}\`);
  return n * n;
};

const memoized = memoize(expensiveFunction);
memoized(5); // "Computing 5", 25
memoized(5); // 25 (cached)
\`\`\`

### Pattern 2: Once Function
\`\`\`javascript
function once(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

// Usage
const initialize = once(() => {
  console.log("Initializing...");
  return "done";
});

initialize(); // "Initializing...", "done"
initialize(); // "done" (no re-initialization)
\`\`\`

### Pattern 3: Debounce with Closure
\`\`\`javascript
function debounce(fn, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce((query) => {
  console.log(\`Searching for: \${query}\`);
}, 300);

// User types quickly
debouncedSearch("h");
debouncedSearch("he");
debouncedSearch("hel");
debouncedSearch("hell");
// Only "hell" search executes after 300ms delay
\`\`\`

## Real Interview Scenarios

### Scenario 1: Event Handlers
\`\`\`javascript
// Problem: Create event handlers that remember their index
function createButtons() {
  for (var i = 0; i < 3; i++) {
    const button = document.createElement('button');
    button.textContent = \`Button \${i}\`;

    // Fix this to log correct index
    button.addEventListener('click', function() {
      console.log(\`Button \${i} clicked\`);
    });

    document.body.appendChild(button);
  }
}
\`\`\`

**Solutions:**
\`\`\`javascript
// Solution 1: let (block scope)
for (let i = 0; i < 3; i++) {
  const button = document.createElement('button');
  button.textContent = \`Button \${i}\`;
  button.addEventListener('click', () => {
    console.log(\`Button \${i} clicked\`);
  });
  document.body.appendChild(button);
}

// Solution 2: IIFE
for (var i = 0; i < 3; i++) {
  (function(index) {
    const button = document.createElement('button');
    button.textContent = \`Button \${index}\`;
    button.addEventListener('click', function() {
      console.log(\`Button \${index} clicked\`);
    });
    document.body.appendChild(button);
  })(i);
}

// Solution 3: Data attribute
for (var i = 0; i < 3; i++) {
  const button = document.createElement('button');
  button.textContent = \`Button \${i}\`;
  button.dataset.index = i;
  button.addEventListener('click', function() {
    console.log(\`Button \${this.dataset.index} clicked\`);
  });
  document.body.appendChild(button);
}
\`\`\`

### Scenario 2: API Rate Limiting
\`\`\`javascript
function createRateLimiter(maxCalls, timeWindow) {
  // Implement rate limiter that allows maxCalls per timeWindow
}

// Usage
const limitedAPI = createRateLimiter(3, 1000); // 3 calls per second

limitedAPI(() => console.log("Call 1"));
limitedAPI(() => console.log("Call 2"));
limitedAPI(() => console.log("Call 3"));
limitedAPI(() => console.log("Call 4")); // Should be blocked
\`\`\`

**Solution:**
\`\`\`javascript
function createRateLimiter(maxCalls, timeWindow) {
  let calls = [];

  return function(fn) {
    const now = Date.now();

    // Remove old calls outside time window
    calls = calls.filter(time => now - time < timeWindow);

    if (calls.length < maxCalls) {
      calls.push(now);
      return fn();
    } else {
      console.log("Rate limit exceeded");
    }
  };
}
\`\`\`

## Memory Management Questions

### Question: Memory Leaks with Closures
\`\`\`javascript
// Problem: This creates a memory leak
function createLeak() {
  const largeArray = new Array(1000000).fill('data');

  return function() {
    console.log('Function called');
  };
}

const leakyFunction = createLeak();
// largeArray cannot be garbage collected!
\`\`\`

**Solutions:**
\`\`\`javascript
// Solution 1: Don't capture large data
function noLeak() {
  return function() {
    console.log('Function called');
  };
}

// Solution 2: Clean up references
function withCleanup() {
  let largeArray = new Array(1000000).fill('data');

  const cleanup = () => {
    largeArray = null; // Allow garbage collection
  };

  const fn = () => {
    if (largeArray) {
      console.log('Function called with data:', largeArray.length);
    }
  };

  return { fn, cleanup };
}
\`\`\`

## Interview Tips

### 1. Explain Step by Step
- Define what a closure is
- Show scope chain
- Demonstrate with examples
- Explain memory implications

### 2. Common Follow-ups
- "How do closures relate to memory leaks?"
- "What's the difference between closure and scope?"
- "How do arrow functions affect closures?"

### 3. Red Flags to Avoid
- Saying "closures are hard" or "I don't understand them"
- Confusing closures with callbacks
- Not understanding the scope chain

### 4. Practice Problems
- Loop + setTimeout (must know)
- Counter with private state
- Memoization implementation
- Event handler binding

Master closures - they're your ticket to interview success! 🎯`,
    keyTakeaways: [
      "Closures capture variables from outer scope",
      "Classic interview: loop + setTimeout with var",
      "Used for private variables, factories, memoization",
      "Can cause memory leaks if not careful",
      "Essential for understanding JavaScript deeply"
    ],
    commonMistakes: [
      "Using var in loops expecting block scope",
      "Not understanding memory implications",
      "Confusing closures with callbacks",
      "Forgetting to clean up large captured data",
      "Not explaining closures clearly in interviews"
    ],
    difficulty: "INTERMEDIATE",
    premium: true,
    estimatedMinutes: 25
  },

  // Chapter 4: Asynchronous JavaScript (4 lessons)
  {
    title: "Callbacks & Event Loop",
    slug: "callbacks-event-loop",
    description: "Understanding asynchronous JavaScript, callbacks, and the event loop",
    markdownContent: `# Callbacks & Event Loop

## Why Asynchronous JavaScript?

JavaScript runs in a **single-threaded environment** but needs to handle:
- User interactions (clicks, scrolls)
- Network requests (API calls)
- File operations
- Timers and intervals

**Asynchronous programming** allows JavaScript to handle these without blocking the main thread.

## Synchronous vs Asynchronous

### Synchronous (Blocking)
\`\`\`javascript
console.log("Start");

function slowOperation() {
  // Simulate slow operation
  for (let i = 0; i < 1000000000; i++) {}
  return "Done";
}

const result = slowOperation();
console.log(result); // Blocks until complete
console.log("End");

// Output:
// Start
// Done (after delay)
// End
\`\`\`

### Asynchronous (Non-blocking)
\`\`\`javascript
console.log("Start");

setTimeout(() => {
  console.log("Async operation complete");
}, 1000);

console.log("End");

// Output:
// Start
// End
// Async operation complete (after 1 second)
\`\`\`

## Callbacks: The Foundation

A **callback** is a function passed as an argument to another function, executed when operation completes.

### Basic Callback Pattern
\`\`\`javascript
function doAsyncTask(callback) {
  setTimeout(() => {
    const result = "Task completed";
    callback(result);
  }, 1000);
}

// Usage
doAsyncTask((result) => {
  console.log(result); // "Task completed"
});

console.log("Task started");
\`\`\`

### Error Handling with Callbacks
\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    const error = Math.random() > 0.8 ? "Network error" : null;
    const data = error ? null : { user: "John", id: 1 };

    callback(error, data);
  }, 1000);
}

// Usage
fetchData((error, data) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data:", data);
  }
});
\`\`\`

## Callback Hell (Pyramid of Doom)

Nested callbacks create hard-to-read code:

\`\`\`javascript
// ❌ Callback hell
getUser(userId, (userError, user) => {
  if (userError) {
    console.error(userError);
    return;
  }

  getPosts(user.id, (postsError, posts) => {
    if (postsError) {
      console.error(postsError);
      return;
    }

    getComments(posts[0].id, (commentsError, comments) => {
      if (commentsError) {
        console.error(commentsError);
        return;
      }

      console.log("User:", user);
      console.log("First post:", posts[0]);
      console.log("Comments:", comments);
    });
  });
});
\`\`\`

## The JavaScript Event Loop

The **event loop** is JavaScript's concurrency model that handles asynchronous operations.

### Key Components

#### 1. Call Stack
- Executes function calls
- Last In, First Out (LIFO)
- Only one call stack in JavaScript

#### 2. Web APIs (Browser)
- setTimeout, setInterval
- DOM events
- fetch, XMLHttpRequest
- Browser-specific APIs

#### 3. Callback Queue (Task Queue)
- Holds callbacks from async operations
- First In, First Out (FIFO)

#### 4. Event Loop
- Monitors call stack and callback queue
- Moves callbacks to call stack when empty

### Event Loop Visualization
\`\`\`javascript
console.log("Start"); // 1. Executed immediately

setTimeout(() => {
  console.log("Timeout"); // 4. Executed after call stack empty
}, 0);

Promise.resolve().then(() => {
  console.log("Promise"); // 3. Microtask executed before timeout
});

console.log("End"); // 2. Executed immediately

// Output:
// Start
// End
// Promise
// Timeout
\`\`\`

## Microtasks vs Macrotasks

### Microtasks (Higher Priority)
- Promise callbacks (.then, .catch, .finally)
- MutationObserver callbacks
- process.nextTick (Node.js)

### Macrotasks (Lower Priority)
- setTimeout, setInterval
- setImmediate (Node.js)
- I/O operations
- UI rendering

### Execution Order
\`\`\`javascript
console.log("Script start");

setTimeout(() => console.log("setTimeout"), 0);

Promise.resolve()
  .then(() => console.log("Promise 1"))
  .then(() => console.log("Promise 2"));

console.log("Script end");

// Output:
// Script start
// Script end
// Promise 1
// Promise 2
// setTimeout
\`\`\`

## Practical Examples

### Sequential Async Operations
\`\`\`javascript
function getUser(userId, callback) {
  setTimeout(() => callback(null, { id: userId, name: "John" }), 500);
}

function getPosts(userId, callback) {
  setTimeout(() => callback(null, [{ id: 1, title: "Post 1" }]), 300);
}

// Sequential execution
getUser(1, (error, user) => {
  if (error) return console.error(error);

  console.log("User:", user);

  getPosts(user.id, (error, posts) => {
    if (error) return console.error(error);

    console.log("Posts:", posts);
  });
});
\`\`\`

### Parallel Async Operations
\`\`\`javascript
function getUser(userId, callback) {
  setTimeout(() => callback(null, { id: userId, name: "John" }), 500);
}

function getPosts(userId, callback) {
  setTimeout(() => callback(null, [{ id: 1, title: "Post 1" }]), 300);
}

// Parallel execution
let completed = 0;
const results = {};

function checkComplete() {
  completed++;
  if (completed === 2) {
    console.log("User:", results.user);
    console.log("Posts:", results.posts);
  }
}

getUser(1, (error, user) => {
  if (error) return console.error(error);
  results.user = user;
  checkComplete();
});

getPosts(1, (error, posts) => {
  if (error) return console.error(error);
  results.posts = posts;
  checkComplete();
});
\`\`\`

## Common Interview Questions

**Q: What is the event loop?**
- Concurrency model for handling async operations
- Monitors call stack and callback queue
- Moves tasks to call stack when empty

**Q: What's the difference between microtasks and macrotasks?**
- Microtasks: Promises, higher priority
- Macrotasks: setTimeout, lower priority
- Microtasks execute before macrotasks in same cycle

**Q: Why is setTimeout not guaranteed to execute exactly on time?**
- Minimum delay, not exact
- Event loop must be free
- Other tasks may delay execution

**Q: What causes callback hell?**
- Nested callbacks for sequential async operations
- Hard to read and maintain
- Error handling becomes complex
- Solved by promises and async/await

Master callbacks and event loop - foundation of async JavaScript! 🎯`,
    keyTakeaways: [
      "JavaScript is single-threaded but handles async with event loop",
      "Callbacks are functions executed after async operations",
      "Event loop moves tasks from queue to call stack",
      "Microtasks (promises) execute before macrotasks (setTimeout)",
      "Callback hell solved by promises and async/await"
    ],
    commonMistakes: [
      "Blocking main thread with synchronous operations",
      "Not handling errors in callbacks",
      "Confusing execution order of micro/macrotasks",
      "Creating callback hell instead of using promises",
      "Assuming setTimeout executes exactly on time"
    ],
    difficulty: "INTERMEDIATE",
    premium: false,
    estimatedMinutes: 20
  },

  {
    title: "Promises",
    slug: "promises",
    description: "Master JavaScript promises for handling asynchronous operations",
    markdownContent: `# Promises: Modern Async JavaScript

## What is a Promise?

A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.

### Promise States

1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      resolve("Operation successful!");
    } else {
      reject("Operation failed!");
    }
  }, 1000);
});
\`\`\`

## Basic Promise Usage

### Creating Promises
\`\`\`javascript
// Promise constructor
const simplePromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Hello, Promises!");
  }, 1000);
});

// Promise.resolve() - creates resolved promise
const resolvedPromise = Promise.resolve("Immediate success");

// Promise.reject() - creates rejected promise
const rejectedPromise = Promise.reject("Immediate failure");
\`\`\`

### Consuming Promises
\`\`\`javascript
simplePromise
  .then(result => {
    console.log("Success:", result);
  })
  .catch(error => {
    console.log("Error:", error);
  })
  .finally(() => {
    console.log("Always executes");
  });
\`\`\`

## Promise Methods

### .then() - Handle Success
\`\`\`javascript
const promise = Promise.resolve("Success");

promise.then(result => {
  console.log(result); // "Success"
  return result.toUpperCase();
}).then(upperResult => {
  console.log(upperResult); // "SUCCESS"
});
\`\`\`

### .catch() - Handle Errors
\`\`\`javascript
const promise = Promise.reject("Error occurred");

promise
  .catch(error => {
    console.log("Caught:", error); // "Caught: Error occurred"
    return "Recovered";
  })
  .then(result => {
    console.log("Result:", result); // "Result: Recovered"
  });
\`\`\`

### .finally() - Always Execute
\`\`\`javascript
const promise = Promise.resolve("Done");

promise
  .then(result => console.log(result))
  .finally(() => {
    console.log("Cleanup code here");
    // Always runs regardless of success/failure
  });
\`\`\`

## Promise Chaining

### Sequential Operations
\`\`\`javascript
function getUser(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id: userId, name: "John" }), 500);
  });
}

function getPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve([{ id: 1, title: "Post 1" }]), 300);
  });
}

function getComments(postId) {
  return new Promise(resolve => {
    setTimeout(() => resolve([{ id: 1, text: "Comment 1" }]), 200);
  });
}

// Chain promises
getUser(1)
  .then(user => {
    console.log("User:", user);
    return getPosts(user.id);
  })
  .then(posts => {
    console.log("Posts:", posts);
    return getComments(posts[0].id);
  })
  .then(comments => {
    console.log("Comments:", comments);
  })
  .catch(error => {
    console.error("Error:", error);
  });
\`\`\`

## Promise Combinators

### Promise.all() - All or Nothing
\`\`\`javascript
const promise1 = Promise.resolve("Fast");
const promise2 = new Promise(resolve => setTimeout(() => resolve("Slow"), 1000));
const promise3 = Promise.resolve("Medium");

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // ["Fast", "Slow", "Medium"]
  })
  .catch(error => {
    console.log("One failed:", error);
  });

// If any promise rejects, Promise.all rejects immediately
\`\`\`

### Promise.allSettled() - Wait for All
\`\`\`javascript
const promises = [
  Promise.resolve("Success 1"),
  Promise.reject("Error 1"),
  Promise.resolve("Success 2")
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(\`Promise \${index} succeeded:\`, result.value);
      } else {
        console.log(\`Promise \${index} failed:\`, result.reason);
      }
    });
  });

// Output:
// Promise 0 succeeded: Success 1
// Promise 1 failed: Error 1
// Promise 2 succeeded: Success 2
\`\`\`

### Promise.race() - First to Complete
\`\`\`javascript
const fastPromise = new Promise(resolve =>
  setTimeout(() => resolve("Fast"), 500)
);

const slowPromise = new Promise(resolve =>
  setTimeout(() => resolve("Slow"), 1000)
);

Promise.race([fastPromise, slowPromise])
  .then(result => {
    console.log("Winner:", result); // "Winner: Fast"
  });
\`\`\`

### Promise.any() - First Success
\`\`\`javascript
const promises = [
  Promise.reject("Error 1"),
  Promise.resolve("Success 1"),
  Promise.reject("Error 2")
];

Promise.any(promises)
  .then(result => {
    console.log("First success:", result); // "First success: Success 1"
  })
  .catch(error => {
    console.log("All failed:", error.errors);
  });
\`\`\`

## Error Handling Patterns

### Centralized Error Handling
\`\`\`javascript
function handleError(error) {
  console.error("Global error handler:", error);
  // Log to monitoring service
  // Show user-friendly message
}

somePromise
  .then(result => processResult(result))
  .catch(handleError);
\`\`\`

### Conditional Error Handling
\`\`\`javascript
function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`);
      }
      return response.json();
    });
}

fetchData('/api/data')
  .then(data => console.log(data))
  .catch(error => {
    if (error.message.includes('404')) {
      console.log('Data not found');
    } else if (error.message.includes('500')) {
      console.log('Server error');
    } else {
      console.log('Unknown error');
    }
  });
\`\`\`

## Converting Callbacks to Promises

### Callback-based Function
\`\`\`javascript
function oldApiFunction(param, callback) {
  setTimeout(() => {
    if (param === 'error') {
      callback('Something went wrong');
    } else {
      callback(null, \`Result: \${param}\`);
    }
  }, 500);
}
\`\`\`

### Promisify Function
\`\`\`javascript
function promisifyOldApi(param) {
  return new Promise((resolve, reject) => {
    oldApiFunction(param, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// Usage
promisifyOldApi('success')
  .then(result => console.log(result))
  .catch(error => console.error(error));
\`\`\`

## Real-World Examples

### API Calls with Error Handling
\`\`\`javascript
function apiCall(endpoint) {
  return fetch(\`https://api.example.com\${endpoint}\`)
    .then(response => {
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      return response.json();
    });
}

function getUserData(userId) {
  return Promise.all([
    apiCall(\`/users/\${userId}\`),
    apiCall(\`/users/\${userId}/posts\`),
    apiCall(\`/users/\${userId}/friends\`)
  ])
  .then(([user, posts, friends]) => ({
    user,
    posts,
    friends
  }));
}

getUserData(123)
  .then(data => console.log('User data:', data))
  .catch(error => console.error('Failed to load user:', error));
\`\`\`

### Retry Logic
\`\`\`javascript
function retryPromise(fn, maxRetries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    function attempt(retryCount) {
      fn()
        .then(resolve)
        .catch(error => {
          if (retryCount < maxRetries) {
            setTimeout(() => attempt(retryCount + 1), delay);
          } else {
            reject(error);
          }
        });
    }

    attempt(0);
  });
}

// Usage
const unreliableApiCall = () => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.7) {
      resolve("Success!");
    } else {
      reject("Network error");
    }
  });
};

retryPromise(unreliableApiCall, 3, 500)
  .then(result => console.log(result))
  .catch(error => console.log("All retries failed:", error));
\`\`\`

## Interview Questions

**Q: What's the difference between Promise.all() and Promise.allSettled()?**
- Promise.all(): Rejects if any promise rejects
- Promise.allSettled(): Waits for all, returns results/errors

**Q: How do you handle errors in promise chains?**
- .catch() at end of chain
- Individual .catch() for specific operations
- Centralized error handling

**Q: What's promise chaining?**
- Calling .then() on promise returns new promise
- Allows sequential async operations
- Each .then() receives result from previous

**Q: How do you convert callback-based code to promises?**
- Wrap callback function in Promise constructor
- Resolve on success, reject on error
- Use util.promisify in Node.js

Master promises - they're essential for modern JavaScript! 🚀`,
    keyTakeaways: [
      "Promises represent eventual completion of async operations",
      "States: pending, fulfilled, rejected",
      "Methods: then(), catch(), finally()",
      "Combinators: all(), race(), allSettled(), any()",
      "Chain promises for sequential operations"
    ],
    commonMistakes: [
      "Forgetting to return promises in chains",
      "Not handling errors with catch()",
      "Using Promise.all() when you need allSettled()",
      "Creating promise constructor anti-patterns",
      "Not understanding promise resolution timing"
    ],
    difficulty: "INTERMEDIATE",
    premium: true,
    estimatedMinutes: 22
  },

  {
    title: "Async/Await",
    slug: "async-await",
    description: "Master async/await syntax for cleaner asynchronous code",
    markdownContent: `# Async/Await: Synchronous-Style Async Code

## What is Async/Await?

**Async/await** is syntactic sugar built on top of promises that makes asynchronous code look and behave like synchronous code.

### async Function
\`\`\`javascript
// async function always returns a promise
async function myAsyncFunction() {
  return "Hello, Async!";
}

myAsyncFunction().then(result => console.log(result));
// Output: "Hello, Async!"
\`\`\`

### await Expression
\`\`\`javascript
// await pauses execution until promise resolves
async function fetchUser() {
  const response = await fetch('/api/user');
  const user = await response.json();
  return user;
}

// Usage
fetchUser().then(user => console.log(user));
\`\`\`

## Basic Syntax

### async Function Declaration
\`\`\`javascript
async function getData() {
  const result = await someAsyncOperation();
  return result;
}
\`\`\`

### async Function Expression
\`\`\`javascript
const getData = async function() {
  const result = await someAsyncOperation();
  return result;
};
\`\`\`

### async Arrow Function
\`\`\`javascript
const getData = async () => {
  const result = await someAsyncOperation();
  return result;
};
\`\`\`

## Error Handling

### try/catch with async/await
\`\`\`javascript
async function fetchUser(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error; // Re-throw to caller
  }
}
\`\`\`

### Multiple Async Operations
\`\`\`javascript
async function getUserData(userId) {
  try {
    // Sequential execution
    const user = await fetchUser(userId);
    const posts = await fetchUserPosts(userId);
    const friends = await fetchUserFriends(userId);

    return { user, posts, friends };
  } catch (error) {
    console.error("Failed to get user data:", error);
  }
}
\`\`\`

### Parallel Execution
\`\`\`javascript
async function getUserDataParallel(userId) {
  try {
    // Parallel execution - all start simultaneously
    const [user, posts, friends] = await Promise.all([
      fetchUser(userId),
      fetchUserPosts(userId),
      fetchUserFriends(userId)
    ]);

    return { user, posts, friends };
  } catch (error) {
    console.error("Failed to get user data:", error);
  }
}
\`\`\`

## Converting Promises to Async/Await

### Promise Chain to Async/Await
\`\`\`javascript
// Promise chain
function getUserData(userId) {
  return fetchUser(userId)
    .then(user => fetchUserPosts(user.id))
    .then(posts => fetchUserFriends(user.id))
    .then(friends => ({ user, posts, friends }))
    .catch(error => console.error(error));
}

// Async/await version
async function getUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchUserPosts(user.id);
    const friends = await fetchUserFriends(user.id);
    return { user, posts, friends };
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## Top-Level Await (ES2022+)

### In Modules
\`\`\`javascript
// module.js
const data = await fetch('/api/data').then(r => r.json());
export { data };
\`\`\`

### In Scripts (with caution)
\`\`\`html
<script type="module">
  // Top-level await works in modules
  const data = await fetch('/api/data').then(r => r.json());
  console.log(data);
</script>
\`\`\`

## Real-World Examples

### API Calls
\`\`\`javascript
class ApiService {
  async getUser(userId) {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`Failed to fetch user: \${response.status}\`);
    }

    return await response.json();
  }

  async createUser(userData) {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(\`Failed to create user: \${response.status}\`);
    }

    return await response.json();
  }

  async updateUser(userId, updates) {
    const response = await fetch(\`/api/users/\${userId}\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(\`Failed to update user: \${response.status}\`);
    }

    return await response.json();
  }
}
\`\`\`

### Sequential vs Parallel Processing
\`\`\`javascript
// Sequential (slower)
async function processSequentially(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);
  }

  return results;
}

// Parallel (faster)
async function processInParallel(items) {
  const promises = items.map(item => processItem(item));
  return await Promise.all(promises);
}

// Controlled concurrency (balanced)
async function processWithConcurrency(items, concurrency = 3) {
  const results = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    results.push(...batchResults);
  }

  return results;
}
\`\`\`

### Error Recovery
\`\`\`javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      console.log(\`Attempt \${attempt} failed, retrying...\`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
\`\`\`

## Common Patterns

### Loading States
\`\`\`javascript
async function loadUserProfile(userId) {
  setLoading(true);
  try {
    const user = await fetchUser(userId);
    const posts = await fetchUserPosts(userId);
    setUser(user);
    setPosts(posts);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
\`\`\`

### Cleanup with finally
\`\`\`javascript
async function processFile(file) {
  const connection = await openDatabase();

  try {
    const data = await readFile(file);
    const processed = await processData(data);
    await saveToDatabase(connection, processed);
    return processed;
  } finally {
    await connection.close(); // Always cleanup
  }
}
\`\`\`

## Performance Considerations

### When to Use Async/Await vs Promises
\`\`\`javascript
// ✅ Async/await for sequential operations
async function sequentialOperations() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  return { user, posts };
}

// ✅ Promise.all for parallel operations
async function parallelOperations() {
  const [user, config] = await Promise.all([
    fetchUser(),
    fetchConfig()
  ]);
  return { user, config };
}

// ✅ Promise combinators when needed
async function complexOperations() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);

  return results.filter(r => r.status === 'fulfilled').map(r => r.value);
}
\`\`\`

## Interview Questions

**Q: What's the difference between async/await and promises?**
- Async/await is syntactic sugar over promises
- Makes async code look synchronous
- Still returns promises, can be chained

**Q: How do you handle errors with async/await?**
- Use try/catch blocks
- Async functions can throw errors
- Unhandled rejections become uncaught exceptions

**Q: Can you use await outside async functions?**
- No, await must be inside async function
- Top-level await available in ES2022+ modules
- Not available in regular scripts

**Q: What's the performance difference between async/await and promises?**
- No significant performance difference
- Async/await may create more stack frames
- Promises can be more memory efficient in some cases

Master async/await - it's the modern way to handle asynchronous JavaScript! 🚀`,
    keyTakeaways: [
      "Async/await makes async code look synchronous",
      "async functions always return promises",
      "await pauses execution until promise resolves",
      "Use try/catch for error handling",
      "Promise.all for parallel, sequential for dependencies"
    ],
    commonMistakes: [
      "Using await outside async functions",
      "Forgetting to handle errors with try/catch",
      "Unnecessarily sequential operations (use Promise.all)",
      "Not understanding that async functions return promises",
      "Mixing async/await with raw promises inconsistently"
    ],
    difficulty: "INTERMEDIATE",
    premium: true,
    estimatedMinutes: 24
  }
];
