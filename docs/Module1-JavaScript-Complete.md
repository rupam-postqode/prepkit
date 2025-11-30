# PrepKit Module 1: JavaScript Fundamentals & Output Problems
## Complete Course Content

**Module Weight:** 20% of interview preparation  
**Total Duration:** 15-20 hours  
**Total Lessons:** 22  
**Practice Problems:** 100+  
**Difficulty:** Easy → Medium  

---

## 📚 MODULE OVERVIEW

This module is **critical** because:
- 60% of all first-round interviews start here
- Quick disqualifier if you fail
- Easy to master = competitive advantage
- Foundation for async JavaScript

**Target Companies:** All (Amazon, Google, Meta, Salesforce, ServiceNow, etc.)

---

## SECTION 1: HOISTING & VARIABLE SCOPE

### Lesson 1.1: var, let, const Differences ⭐⭐⭐

**Learning Objectives:**
- Understand scope differences (function vs block)
- Master hoisting behavior
- Know temporal dead zone
- Identify when to use each

**Content:**

#### Part 1: Understanding Variable Declarations

**var:**
- Function-scoped (not block-scoped)
- Hoisted to top (initialized as undefined)
- Can be re-declared
- Creates property on global object (in browser)

```javascript
function example() {
    if (true) {
        var x = 10;
    }
    console.log(x); // 10 (accessible outside block)
}
```

**let:**
- Block-scoped (within {} only)
- Hoisted but not initialized (Temporal Dead Zone)
- Cannot be re-declared in same scope
- Doesn't create global property

```javascript
function example() {
    if (true) {
        let y = 20;
    }
    console.log(y); // ReferenceError
}
```

**const:**
- Block-scoped (like let)
- Hoisted but not initialized (TDZ)
- Cannot be re-declared
- Cannot be reassigned (but object properties CAN be)

```javascript
const obj = { a: 1 };
obj.a = 2; // OK - modifying object
obj = {}; // Error - reassigning const
```

#### Part 2: Scope Chain

When looking for a variable, JavaScript searches:
1. Local scope
2. Outer function scope(s)
3. Global scope
4. Throws ReferenceError if not found

```javascript
let global = 'global';

function outer() {
    let outerVar = 'outer';
    
    function inner() {
        let innerVar = 'inner';
        console.log(innerVar);   // 'inner' (local)
        console.log(outerVar);   // 'outer' (outer scope)
        console.log(global);     // 'global' (global scope)
    }
    
    inner();
}
```

**Practice Problems:**

1. **Predict the output:**
```javascript
function test() {
    console.log(x); // ?
    if (true) {
        var x = 10;
        let y = 20;
    }
    console.log(x); // ?
    console.log(y); // ?
}
test();
// Output: undefined, 10, ReferenceError
```

2. **Identify the scope:**
```javascript
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
```

3. **Loop scope issue:**
```javascript
for (var i = 0; i < 3; i++) {
    // var is function-scoped, not block-scoped
}
console.log(i); // ?
// Output: 3 (accessible after loop)

for (let j = 0; j < 3; j++) {
    // let is block-scoped
}
console.log(j); // ?
// ReferenceError
```

**Interview Tips:**
- Mention "function scope" when talking about var
- Say "block scope" for let/const
- Explain why var can cause issues in loops
- Demonstrate scope chain with nested functions

**Follow-up Questions:**
1. Why would you use const by default?
2. What's the advantage of block scope?
3. Can you re-assign a const object?

---

### Lesson 1.2: Hoisting Explained ⭐⭐

**Learning Objectives:**
- Understand variable hoisting
- Know function hoisting
- Understand priority of hoisting
- Explain Temporal Dead Zone (TDZ)

**Content:**

#### Part 1: Variable Hoisting

JavaScript moves variable and function declarations to the top during compilation.

**var hoisting:**
```javascript
console.log(x); // undefined (not ReferenceError)
var x = 5;
console.log(x); // 5

// Interpreted as:
// var x;
// console.log(x); // undefined
// x = 5;
// console.log(x); // 5
```

**let/const hoisting (TDZ):**
```javascript
console.log(y); // ReferenceError
let y = 5;

// They ARE hoisted but in "Temporal Dead Zone"
// From start of scope until declaration line
```

#### Part 2: Function Hoisting

Functions are fully hoisted (both declaration AND assignment).

**Function Declaration:**
```javascript
console.log(func()); // "Hello" - fully hoisted

function func() {
    return "Hello";
}
```

**Function Expression:**
```javascript
console.log(func); // undefined (var is hoisted, not function)
var func = function() {
    return "Hello";
};

console.log(func()); // Error: func is not a function
```

#### Part 3: Hoisting Priority

When hoisting, the order is:
1. Function declarations (highest priority)
2. Variable declarations
3. Variable assignments (NOT hoisted)

```javascript
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
```

**Practice Problems:**

1. **Output prediction:**
```javascript
var x = 1;
function func() {
    console.log(x); // ?
    var x = 2;
}
func();
// Output: undefined (var x is hoisted in function scope)
```

2. **Function hoisting:**
```javascript
console.log(add(2, 3)); // ?

function add(a, b) {
    return a + b;
}
// Output: 5 (function fully hoisted)
```

3. **Mixed hoisting:**
```javascript
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
```

**Interview Tips:**
- Explain the hoisting process clearly
- Mention "Temporal Dead Zone" for let/const
- Show difference between function declaration and expression
- Explain why this matters in production code

---

### Lesson 1.3: Scope Chain & Closures ⭐⭐⭐

**Learning Objectives:**
- Understand lexical scope
- Define and create closures
- Know closure use cases
- Understand scope chain resolution

**Content:**

#### Part 1: Lexical Scope

JavaScript uses **lexical (static) scope**: inner functions can access outer function variables, not based on CALL location but DEFINITION location.

```javascript
var globalVar = "global";

function outer() {
    var outerVar = "outer";
    
    function inner() {
        var innerVar = "inner";
        console.log(innerVar);   // inner
        console.log(outerVar);   // outer
        console.log(globalVar);  // global
    }
    
    inner();
}

outer();
```

**Key: inner function accesses variables based on WHERE IT'S DEFINED, not where it's called**

#### Part 2: What is a Closure?

A **closure** is a function that has access to variables from its outer (enclosing) scope, even after that outer function returns.

```javascript
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
```

#### Part 3: Closure Applications

**Use Case 1: Data Privacy**
```javascript
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
```

**Use Case 2: Function Factory**
```javascript
function multiplyBy(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

**Use Case 3: Callbacks**
```javascript
function setupButtons() {
    for (var i = 0; i < 3; i++) {
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        
        button.addEventListener('click', function() {
            console.log(`Clicked button ${i}`);
        });
        
        document.body.appendChild(button);
    }
}
// Each click handler has closure over 'i'
```

**Practice Problems:**

1. **Closure detection:**
```javascript
function counter() {
    let count = 0;
    return () => ++count;
}

const c = counter();
console.log(c()); // 1
console.log(c()); // 2
// Does this have a closure? YES - over 'count'
```

2. **Closure with loop:**
```javascript
var functions = [];
for (var i = 0; i < 3; i++) {
    functions.push(function() {
        return i;
    });
}

console.log(functions[0]()); // 3 (closure over 'i')
console.log(functions[1]()); // 3
console.log(functions[2]()); // 3
// All reference same 'i', which is now 3
```

3. **Fix with closure:**
```javascript
var functions = [];
for (var i = 0; i < 3; i++) {
    functions.push((function(num) {
        return function() {
            return num;
        };
    })(i));
}

console.log(functions[0]()); // 0 (closure over num)
console.log(functions[1]()); // 1
console.log(functions[2]()); // 2
// Each function has closure over different num value
```

**Interview Tips:**
- Define closure clearly
- Give practical examples (module pattern, data privacy)
- Explain lexical vs dynamic scope
- Show closure issues with loops

**Follow-up Questions:**
1. Why is closure useful?
2. What's the memory implication of closures?
3. How would you fix the loop problem?

---

### Lesson 1.4: var in Loops ⭐⭐⭐

**Learning Objectives:**
- Understand loop scope issues with var
- Master IIFE solution
- Know let solution
- Understand closure in loops

**Content:**

#### Part 1: The Classic Problem

```javascript
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
```

#### Part 2: Solution 1 - IIFE (Immediately Invoked Function Expression)

```javascript
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
```

#### Part 3: Solution 2 - let (Modern Solution)

```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}

// Output: 0, 1, 2
// Why? let is block-scoped
// Each iteration creates NEW i variable
// Each timeout closes over different i
```

#### Part 4: Why let Works

JavaScript creates a NEW lexical environment for each loop iteration when using let:

```javascript
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
```

**Practice Problems:**

1. **Predict output:**
```javascript
for (var i = 0; i < 3; i++) {
    console.log(i);
}
console.log(i); // ?
// Output: 0, 1, 2, then 3
```

2. **With let:**
```javascript
for (let i = 0; i < 3; i++) {
    console.log(i);
}
console.log(i); // ?
// Output: 0, 1, 2, then ReferenceError
```

3. **Closure issue:**
```javascript
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
```

4. **Fix with let:**
```javascript
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
```

**Interview Tips:**
- Explain var is function-scoped, not block-scoped
- Demonstrate why loop problem occurs
- Show IIFE solution step-by-step
- Mention let as modern solution
- Explain why let works (new binding per iteration)

**Company Asked At:** ServiceNow, Flipkart, Amazon, Publicis Sapient

---

### Lesson 1.5: Temporal Dead Zone (TDZ) ⭐⭐

**Learning Objectives:**
- Understand TDZ concept
- Know which variables are affected
- Recognize TDZ errors
- Use properly in code

**Content:**

#### Part 1: What is TDZ?

The **Temporal Dead Zone** is the period from when a let/const variable is hoisted until its declaration is reached.

```javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization

let x = 5;

// x enters TDZ at start of scope
// x leaves TDZ when declaration line is reached
```

#### Part 2: Why TDZ Exists

TDZ enforces good practices:
- Catch bugs earlier
- Make code more predictable
- Prevent accidental undefined values

```javascript
// WITHOUT TDZ (with var):
console.log(y); // undefined (confusing!)
var y = 5;

// WITH TDZ (with let/const):
console.log(z); // ReferenceError (clear error!)
let z = 5;
```

#### Part 3: TDZ Scope

TDZ extends to entire block, not just top of scope:

```javascript
function test() {
    // x is in TDZ here
    if (true) {
        console.log(x); // ReferenceError
        let x = 5;
        // x exits TDZ here
        console.log(x); // 5
    }
}
```

**Practice Problems:**

1. **Identify TDZ:**
```javascript
console.log(a); // ? (TDZ - ReferenceError)
let a = 1;
```

2. **const also has TDZ:**
```javascript
console.log(b); // ? (TDZ - ReferenceError)
const b = 2;
```

3. **var doesn't have TDZ:**
```javascript
console.log(c); // ? (undefined - no TDZ)
var c = 3;
```

4. **TDZ in blocks:**
```javascript
let x = 'outer';
{
    console.log(x); // ? (ReferenceError - TDZ)
    let x = 'inner';
}
// TDZ shadows outer x
```

**Interview Tips:**
- Mention TDZ is specific to let/const
- Explain it helps catch bugs
- Show ReferenceError happens, not undefined
- Compare with var behavior

---

## SECTION 2: THIS BINDING & ARROW FUNCTIONS

### Lesson 2.1: Understanding 'this' ⭐⭐⭐

**Learning Objectives:**
- Know four binding rules
- Understand global, method, function contexts
- Know new binding
- Understand call-site determination

**Content:**

#### Part 1: Four Binding Rules

**Rule 1: Default Binding (Global Context)**
```javascript
function sayName() {
    console.log(this.name);
}

var name = "Global";
sayName(); // "Global"
// 'this' defaults to global object (non-strict)
// Or undefined (strict mode)
```

**Rule 2: Implicit Binding (Method)**
```javascript
var obj = {
    name: "John",
    greet: function() {
        console.log(this.name);
    }
};

obj.greet(); // "John"
// 'this' is object to left of dot
```

**Rule 3: Explicit Binding (call, apply, bind)**
```javascript
function greet() {
    console.log(this.name);
}

var person = { name: "Alice" };

greet.call(person); // "Alice"
// Explicitly set 'this' to person
```

**Rule 4: new Binding**
```javascript
function Person(name) {
    this.name = name;
}

var p = new Person("Bob");
console.log(p.name); // "Bob"
// 'this' refers to newly created object
```

#### Part 2: Priority (Precedence)

```
new binding > explicit binding > implicit binding > default binding
```

#### Part 3: Common Mistakes

```javascript
var obj = {
    name: "Object",
    greet: function() {
        console.log(this.name);
    }
};

// Lost context:
var fn = obj.greet;
fn(); // undefined (default binding)

// Correct:
var fn = obj.greet.bind(obj);
fn(); // "Object"
```

**Practice Problems:**

1. **Identify binding:**
```javascript
var person = {
    name: "John",
    sayName: function() {
        console.log(this.name);
    }
};

person.sayName(); // "John" (implicit)
var fn = person.sayName;
fn(); // undefined (default)
```

2. **Explicit binding:**
```javascript
function introduce() {
    console.log(`I am ${this.name}`);
}

var john = { name: "John" };
var jane = { name: "Jane" };

introduce.call(john);  // "I am John"
introduce.call(jane);  // "I am Jane"
```

3. **new binding:**
```javascript
function User(name) {
    this.name = name;
}

var user = new User("Alice");
console.log(user.name); // "Alice"
```

**Interview Tips:**
- Mention the four binding rules
- Give priority order
- Show common mistakes
- Explain call-site vs definition-site

---

### Lesson 2.2: Arrow Functions vs Regular Functions ⭐⭐⭐

**Learning Objectives:**
- Know arrow function syntax
- Understand lexical 'this'
- Know when NOT to use arrow functions
- Compare with regular functions

**Content:**

#### Part 1: Syntax Differences

```javascript
// Regular function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => {
    return a + b;
};

// Arrow with implicit return
const add = (a, b) => a + b;

// Arrow with one param (parens optional)
const double = x => x * 2;
```

#### Part 2: The Key Difference - 'this' Binding

**Regular function - Dynamic 'this':**
```javascript
var obj = {
    name: "Object",
    greet: function() {
        console.log(this.name); // depends on call-site
    }
};

obj.greet(); // "Object" (this = obj)
var fn = obj.greet;
fn(); // undefined (this = global)
```

**Arrow function - Lexical 'this':**
```javascript
var obj = {
    name: "Object",
    greet: () => {
        console.log(this.name); // captured at definition
    }
};

obj.greet(); // undefined (this = global/outer scope)
// Arrow captures 'this' from outer scope
```

#### Part 3: When to Use Each

**Use Regular Functions for:**
- Object methods (need dynamic this)
- Constructors (new binding)
- When you need 'this' context

```javascript
const person = {
    name: "John",
    introduce: function() {
        console.log(`I'm ${this.name}`);
    }
};

person.introduce(); // "I'm John"
```

**Use Arrow Functions for:**
- Callbacks (need preserved this)
- Array methods
- When you don't need 'this'

```javascript
const numbers = [1, 2, 3];

// Arrow preserves 'this'
const obj = {
    name: "counter",
    count: function() {
        numbers.forEach(num => {
            console.log(`${this.name}: ${num}`);
        });
    }
};

obj.count(); // Works - 'this' is preserved
```

#### Part 4: Common Pitfalls

```javascript
// ❌ DON'T: Arrow as object method
const obj = {
    value: 42,
    getValue: () => {
        return this.value; // undefined
    }
};

obj.getValue(); // undefined

// ✅ DO: Regular function for methods
const obj = {
    value: 42,
    getValue: function() {
        return this.value; // 42
    }
};

obj.getValue(); // 42
```

**Practice Problems:**

1. **Predict output:**
```javascript
var obj = {
    x: 10,
    print: () => {
        console.log(this.x);
    }
};

obj.print(); // undefined (arrow captures global this)
```

2. **Regular function:**
```javascript
var obj = {
    x: 10,
    print: function() {
        console.log(this.x);
    }
};

obj.print(); // 10 (this = obj)
```

3. **Nested scenario:**
```javascript
var obj = {
    name: "John",
    greet: function() {
        var inner = () => {
            console.log(this.name);
        };
        inner();
    }
};

obj.greet(); // "John" (arrow captured function's this)
```

**Interview Tips:**
- Explain "lexical this"
- Show when to use each
- Mention arrow functions don't have their own 'this'
- Give setTimeout example (arrow preserves this)

**Company Asked At:** Every company

---

### Lesson 2.3: call, apply, bind Polyfills ⭐⭐⭐

**Learning Objectives:**
- Understand call, apply, bind
- Implement each as polyfill
- Know differences
- Use in real scenarios

**Content:**

#### Part 1: call vs apply vs bind

**call(context, arg1, arg2, ...)**
```javascript
function greet(greeting, name) {
    console.log(`${greeting}, ${this.title} ${name}`);
}

const user = { title: "Mr." };

greet.call(user, "Hello", "John");
// "Hello, Mr. John"
```

**apply(context, [arg1, arg2, ...])**
```javascript
greet.apply(user, ["Hi", "Jane"]);
// "Hi, Mr. Jane"
// Same as call, but args as array
```

**bind(context, arg1, arg2, ...)**
```javascript
const boundGreet = greet.bind(user, "Hey");
boundGreet("Bob"); // "Hey, Mr. Bob"
// Returns NEW function, doesn't invoke immediately
```

#### Part 2: Implement call

```javascript
Function.prototype.myCall = function(context, ...args) {
    // 'this' is the function being called
    if (typeof this !== 'function') {
        throw new TypeError('Not a function');
    }
    
    // Set context to global if null/undefined
    context = context || globalThis;
    
    // Create unique property to avoid conflicts
    const symbol = Symbol();
    context[symbol] = this;
    
    // Call function with specified context
    const result = context[symbol](...args);
    
    // Clean up
    delete context[symbol];
    
    return result;
};

// Test
function introduce(greeting) {
    console.log(`${greeting}, I'm ${this.name}`);
}

const person = { name: "Alice" };
introduce.myCall(person, "Hello");
// "Hello, I'm Alice"
```

#### Part 3: Implement apply

```javascript
Function.prototype.myApply = function(context, args = []) {
    if (typeof this !== 'function') {
        throw new TypeError('Not a function');
    }
    
    context = context || globalThis;
    
    if (!Array.isArray(args)) {
        throw new TypeError('Args must be array');
    }
    
    const symbol = Symbol();
    context[symbol] = this;
    
    const result = context[symbol](...args);
    
    delete context[symbol];
    
    return result;
};

// Test
function sum(a, b) {
    return a + b + this.tax;
}

const context = { tax: 10 };
const result = sum.myApply(context, [5, 3]);
// 18
```

#### Part 4: Implement bind

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
    if (typeof this !== 'function') {
        throw new TypeError('Not a function');
    }
    
    const fn = this;
    context = context || globalThis;
    
    return function(...callArgs) {
        return fn.call(context, ...boundArgs, ...callArgs);
    };
};

// Test
function greet(greeting, name) {
    console.log(`${greeting} ${this.title} ${name}`);
}

const user = { title: "Dr." };
const boundGreet = greet.myBind(user, "Welcome");
boundGreet("Alice"); // "Welcome Dr. Alice"
```

**Practice Problems:**

1. **call usage:**
```javascript
const obj = { value: 42 };
function getValue() {
    return this.value;
}
console.log(getValue.call(obj)); // 42
```

2. **apply usage:**
```javascript
const numbers = [5, 6, 2, 8, 1];
const max = Math.max.apply(null, numbers);
console.log(max); // 8
```

3. **bind usage:**
```javascript
const person = {
    name: "John",
    getName: function() {
        return this.name;
    }
};

const getName = person.getName.bind(person);
console.log(getName()); // "John"
```

**Interview Tips:**
- Implement at least one polyfill in interview
- Explain use of Symbol for uniqueness
- Show difference between call and apply clearly
- Mention bind returns function vs call/apply execute

**Company Asked At:** Jio, Expedia, ServiceNow

---

### Lesson 2.4: IIFE & Execution Context ⭐⭐

**Learning Objectives:**
- Understand IIFE pattern
- Know when to use IIFE
- Understand execution context
- Use in real-world scenarios

**Content:**

#### Part 1: What is IIFE?

IIFE = **Immediately Invoked Function Expression**

It's a function that runs immediately after being defined.

```javascript
// IIFE
(function() {
    console.log("Runs immediately");
})();

// Or
(function() {
    console.log("Also runs immediately");
}());

// With arrow function
(() => {
    console.log("Arrow IIFE");
})();
```

#### Part 2: Why Use IIFE?

**Reason 1: Create Private Scope**
```javascript
// Without IIFE - pollutes global scope
var counter = 0;
function increment() {
    counter++;
}

// With IIFE - counter is private
var myModule = (function() {
    var counter = 0;
    
    return {
        increment: function() {
            counter++;
            return counter;
        },
        decrement: function() {
            counter--;
            return counter;
        }
    };
})();

console.log(myModule.increment()); // 1
console.log(myModule.increment()); // 2
console.log(counter); // undefined (private)
```

**Reason 2: Avoid Variable Conflicts**
```javascript
// In jQuery plugins
(function($) {
    // $ is local to this IIFE
    // Doesn't conflict with other libraries
    $('div').hide();
})(jQuery);
```

**Reason 3: Module Pattern**
```javascript
const Calculator = (function() {
    let result = 0;
    
    return {
        add(num) {
            result += num;
            return this;
        },
        multiply(num) {
            result *= num;
            return this;
        },
        getResult() {
            return result;
        }
    };
})();

console.log(Calculator.add(5).multiply(3).add(2).getResult()); // 17
```

#### Part 3: Execution Context

Every function has an execution context with:
- **this** - what the function is being called on
- **arguments** - parameters passed to function
- **variables** - local variables

```javascript
function example(a, b) {
    var x = 10;
    console.log(this); // execution context
}

// In IIFE, 'this' is global (or undefined in strict mode)
(function() {
    console.log(this); // window or global
})();

// Can set 'this' in IIFE
(function() {
    console.log(this.name); // controlled 'this'
}).call({ name: "John" });
```

**Practice Problems:**

1. **Basic IIFE:**
```javascript
(function() {
    console.log("Immediately invoked");
})();
// Output: "Immediately invoked"
```

2. **With parameters:**
```javascript
(function(x, y) {
    console.log(x + y);
})(3, 4);
// Output: 7
```

3. **Module pattern:**
```javascript
const counter = (function() {
    let count = 0;
    return {
        inc: () => ++count,
        dec: () => --count,
        get: () => count
    };
})();

console.log(counter.inc()); // 1
console.log(counter.inc()); // 2
console.log(counter.dec()); // 1
```

**Interview Tips:**
- Explain what IIFE stands for
- Show practical use (module pattern)
- Mention scope creation
- Show how to pass parameters

---

## SECTION 3: ASYNCHRONOUS JAVASCRIPT

### Lesson 3.1: Event Loop Mastery ⭐⭐⭐

**Learning Objectives:**
- Understand event loop
- Know macro vs micro tasks
- Predict execution order
- Master setTimeout, Promises ordering

**Content:**

#### Part 1: The Event Loop

JavaScript runs in **single thread** but can handle async using event loop:

```
┌─ Call Stack
│  (currently executing function)
├─ Micro Task Queue
│  (Promises, queueMicrotask)
├─ Macro Task Queue
│  (setTimeout, setInterval, I/O)
└─ Event Loop (checks when stack empty)
```

#### Part 2: Execution Order

1. All **synchronous code** on call stack
2. Check **micro tasks** (Promises, etc.)
3. Check **macro tasks** (setTimeout, etc.)
4. Repeat

```javascript
console.log('Start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

Promise.resolve()
    .then(() => {
        console.log('Promise');
    });

console.log('End');

// Output:
// Start
// End
// Promise (micro task)
// setTimeout (macro task)
```

#### Part 3: Micro vs Macro Tasks

**Micro Tasks** (Higher Priority):
- Promise.then/catch/finally
- queueMicrotask()
- MutationObserver

**Macro Tasks** (Lower Priority):
- setTimeout
- setInterval
- setImmediate
- I/O operations
- UI rendering

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0); // macro
Promise.resolve().then(() => console.log('3')); // micro

setTimeout(() => console.log('4'), 0); // macro
Promise.resolve().then(() => console.log('5')); // micro

console.log('6');

// Output: 1, 6, 3, 5, 2, 4
```

#### Part 4: Complex Example

```javascript
console.log('Start');

setTimeout(() => {
    console.log('Timeout 1');
    Promise.resolve().then(() => {
        console.log('Promise in Timeout 1');
    });
}, 0);

Promise.resolve()
    .then(() => {
        console.log('Promise 1');
        setTimeout(() => {
            console.log('Timeout in Promise 1');
        }, 0);
    })
    .then(() => {
        console.log('Promise 2');
    });

console.log('End');

// Output:
// Start
// End
// Promise 1
// Promise 2
// Timeout 1
// Promise in Timeout 1
// Timeout in Promise 1
```

**Practice Problems:**

1. **Predict output:**
```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');

// A, D, C, B
```

2. **Complex scenario:**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
setTimeout(() => console.log('3'), 0);
Promise.resolve().then(() => console.log('4'));
console.log('5');

// 1, 5, 4, 2, 3
```

3. **Nested:**
```javascript
Promise.resolve()
    .then(() => {
        console.log('P1');
        setTimeout(() => console.log('T1'), 0);
    })
    .then(() => {
        console.log('P2');
    });

setTimeout(() => console.log('T2'), 0);

// P1, P2, T1, T2
```

**Interview Tips:**
- Draw the event loop diagram
- Explain micro vs macro tasks
- Show multiple Promises execute in order
- Mention each macro task completion triggers micro task check

**Company Asked At:** Google, Meta, Amazon, ServiceNow

---

### Lesson 3.2: Promises Fundamentals ⭐⭐⭐

**Learning Objectives:**
- Know Promise states
- Understand then, catch, finally
- Know Promise chaining
- Understand Promise behavior

**Content:**

#### Part 1: Promise States

A Promise can be in one of three states:

**Pending:** Initial state, operation hasn't completed
**Fulfilled:** Operation succeeded, has value
**Rejected:** Operation failed, has reason

```javascript
const promise = new Promise((resolve, reject) => {
    // pending state
    
    if (success) {
        resolve(value); // fulfilled
    } else {
        reject(error); // rejected
    }
});
```

#### Part 2: then, catch, finally

```javascript
// then handles fulfilled/rejected
promise
    .then(
        (value) => { /* handle fulfilled */ },
        (error) => { /* handle rejected */ }
    );

// Better: separate catch
promise
    .then((value) => { /* fulfilled */ })
    .catch((error) => { /* rejected */ });

// finally: cleanup, runs regardless of state
promise
    .then((value) => { /* ... */ })
    .catch((error) => { /* ... */ })
    .finally(() => { /* cleanup */ });
```

#### Part 3: Promise Behavior

```javascript
// Promise resolves only once
const p = new Promise((resolve) => {
    resolve('first');
    resolve('second'); // ignored
    reject('error'); // ignored
});

p.then(val => console.log(val)); // 'first'
```

```javascript
// Throwing in executor rejects Promise
const p = new Promise(() => {
    throw new Error('Oops');
});

p.catch(err => console.log(err.message)); // 'Oops'
```

```javascript
// Promise.resolve wraps value
Promise.resolve(5)
    .then(val => console.log(val)); // 5

Promise.resolve(Promise.resolve(10))
    .then(val => console.log(val)); // 10
```

#### Part 4: Promise Chaining

```javascript
fetch('/user/1')
    .then(response => response.json())
    .then(user => fetch(`/posts/${user.id}`))
    .then(response => response.json())
    .then(posts => console.log(posts))
    .catch(error => console.error(error));

// Each then returns new Promise
// If return Promise, chains to it
// If return value, wraps in Promise
```

**Practice Problems:**

1. **Promise state:**
```javascript
const p = new Promise((resolve, reject) => {
    resolve(42);
});

p.then(val => console.log(val)); // 42
```

2. **Single resolution:**
```javascript
const p = new Promise((resolve) => {
    resolve('A');
    resolve('B');
});

p.then(val => console.log(val)); // 'A'
```

3. **Chaining:**
```javascript
Promise.resolve(1)
    .then(x => x + 1)
    .then(x => x * 2)
    .then(x => console.log(x)); // 4
```

**Interview Tips:**
- Explain three states clearly
- Show Promise can resolve only once
- Explain chaining mechanism
- Show error propagation in chains

---

### Lesson 3.3: Promise.all, .race, .allSettled ⭐⭐⭐

**Learning Objectives:**
- Know when to use each method
- Implement polyfills
- Understand behavior differences
- Know limitations

**Content:**

#### Part 1: Promise.all

Waits for ALL promises to fulfill, rejects if ANY rejects.

```javascript
Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
])
.then(results => console.log(results)); // [1, 2, 3]

// If any rejects:
Promise.all([
    Promise.resolve(1),
    Promise.reject('Error'),
    Promise.resolve(3)
])
.catch(err => console.log(err)); // 'Error'
```

**Polyfill:**
```javascript
Promise.myAll = function(promises) {
    return new Promise((resolve, reject) => {
        const results = [];
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
```

#### Part 2: Promise.race

Returns result of FIRST promise to settle (fulfill or reject).

```javascript
Promise.race([
    new Promise(res => setTimeout(() => res('A'), 100)),
    new Promise(res => setTimeout(() => res('B'), 50))
])
.then(result => console.log(result)); // 'B' (fastest)

// Can also be rejection:
Promise.race([
    Promise.resolve('OK'),
    Promise.reject('Error')
])
.catch(err => console.log(err)); // 'Error' (if rejects faster)
```

**Polyfill:**
```javascript
Promise.myRace = function(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            Promise.resolve(promise)
                .then(resolve)
                .catch(reject);
        });
    });
};
```

#### Part 3: Promise.allSettled

Waits for ALL promises to settle (fulfill OR reject).

```javascript
Promise.allSettled([
    Promise.resolve(1),
    Promise.reject('Error'),
    Promise.resolve(3)
])
.then(results => console.log(results));

// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'Error' },
//   { status: 'fulfilled', value: 3 }
// ]
```

**Polyfill:**
```javascript
Promise.myAllSettled = function(promises) {
    return Promise.all(
        promises.map(p =>
            Promise.resolve(p)
                .then(
                    value => ({ status: 'fulfilled', value }),
                    reason => ({ status: 'rejected', reason })
                )
        )
    );
};
```

**Practice Problems:**

1. **Promise.all rejection:**
```javascript
Promise.all([
    Promise.resolve(1),
    Promise.reject(2)
])
.catch(err => console.log(err)); // 2
```

2. **Promise.race:**
```javascript
Promise.race([
    new Promise(r => setTimeout(() => r('slow'), 100)),
    Promise.resolve('fast')
])
.then(r => console.log(r)); // 'fast'
```

3. **Promise.allSettled:**
```javascript
Promise.allSettled([
    Promise.resolve(1),
    Promise.reject('Error')
])
.then(results => {
    console.log(results[1].status); // 'rejected'
    console.log(results[1].reason); // 'Error'
});
```

**Interview Tips:**
- Explain when to use each
- Implement at least one polyfill
- Show error handling differences
- Mention use cases (file uploads, parallel tasks)

**Company Asked At:** Salesforce, Google, Every company

---

### Lesson 3.4: Async/Await ⭐⭐⭐

**Learning Objectives:**
- Understand async function syntax
- Know await keyword behavior
- Master error handling
- Understand async patterns

**Content:**

#### Part 1: Async Function Syntax

```javascript
// Returns Promise
async function fetchData() {
    // Can use await inside
    return 'data';
}

fetchData().then(data => console.log(data)); // 'data'

// Any throw becomes rejection
async function willReject() {
    throw new Error('Oops');
}

willReject().catch(err => console.log(err.message));
```

#### Part 2: await Keyword

```javascript
// Without await (doesn't wait)
async function test1() {
    const promise = fetch('/data');
    console.log(promise); // Promise object
}

// With await (waits for promise)
async function test2() {
    const response = await fetch('/data');
    console.log(response); // actual response
}
```

#### Part 3: Error Handling

```javascript
// Using try/catch
async function getData() {
    try {
        const response = await fetch('/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed:', error);
    }
}

// Or use .catch()
async function getDataAlt() {
    const response = await fetch('/data')
        .catch(err => console.error(err));
    return await response.json();
}
```

#### Part 4: Sequential vs Parallel

```javascript
// Sequential (slower)
async function sequential() {
    const a = await fetch('/a'); // wait
    const b = await fetch('/b'); // then wait
    return [a, b];
}

// Parallel (faster)
async function parallel() {
    const [a, b] = await Promise.all([
        fetch('/a'),
        fetch('/b')
    ]);
    return [a, b];
}
```

**Practice Problems:**

1. **Basic async/await:**
```javascript
async function test() {
    return 42;
}

test().then(val => console.log(val)); // 42
```

2. **Error handling:**
```javascript
async function test() {
    try {
        throw new Error('oops');
    } catch (e) {
        console.log(e.message);
    }
}

test(); // 'oops'
```

3. **Parallel execution:**
```javascript
async function test() {
    const [a, b] = await Promise.all([
        Promise.resolve(1),
        Promise.resolve(2)
    ]);
    console.log(a + b); // 3
}

test();
```

**Interview Tips:**
- Show async returns Promise
- Explain await pauses execution
- Show try/catch for errors
- Compare sequential vs parallel

---

### Lesson 3.5: Event Queue Mastery (Complex Scenarios) ⭐⭐⭐

**Learning Objectives:**
- Master complex event loop scenarios
- Combine setTimeout + Promise
- Understand rendering timing
- Predict complex execution

**Content:**

#### Complex Scenarios

```javascript
// Scenario 1: setTimeout in Promise
console.log('1');

Promise.resolve()
    .then(() => {
        console.log('2');
        setTimeout(() => console.log('3'), 0);
    })
    .then(() => {
        console.log('4');
    });

console.log('5');

// Output: 1, 5, 2, 4, 3
```

```javascript
// Scenario 2: Nested setTimeout and Promise
setTimeout(() => {
    console.log('T1');
    Promise.resolve().then(() => console.log('P1'));
}, 0);

setTimeout(() => {
    console.log('T2');
}, 0);

Promise.resolve().then(() => {
    console.log('P2');
    setTimeout(() => console.log('T3'), 0);
});

// Output: P2, T1, P1, T2, T3
```

```javascript
// Scenario 3: Multiple Promise chains
Promise.resolve()
    .then(() => console.log('1'))
    .then(() => console.log('2'));

Promise.resolve()
    .then(() => console.log('3'))
    .then(() => console.log('4'));

// Output: 1, 3, 2, 4
```

**Practice Problems:** (20+ variations in lesson)

**Interview Tips:**
- Draw event loop visualization
- Execute step-by-step verbally
- Explain why certain order happens
- Show mastery of micro/macro task queues

---

### Lesson 3.6: Promise Polyfills ⭐⭐⭐

**Learning Objectives:**
- Implement Promise constructor
- Create Promise.resolve/reject
- Understand Promise behavior
- Implement advanced features

**Content:**

Full Promise polyfill implementation (covered in separate detailed lesson with complete code).

---

## SECTION 4: PROTOTYPES & INHERITANCE

### Lesson 4.1: Prototype Chain Basics ⭐⭐⭐

**Learning Objectives:**
- Understand prototype concept
- Know property lookup
- Understand __proto__ vs prototype
- Master prototype chain

**Content:**

#### Part 1: What is a Prototype?

Every JavaScript object has a **prototype** - another object it delegates to.

```javascript
const obj = {};
console.log(Object.getPrototypeOf(obj)); // Object.prototype

// __proto__ points to prototype
console.log(obj.__proto__ === Object.prototype); // true
```

#### Part 2: Property Lookup Chain

When accessing a property:
1. Check own properties
2. Check prototype
3. Check prototype's prototype
4. Continue until null
5. Return undefined if not found

```javascript
const parent = {
    greet() { return 'Parent'; }
};

const child = Object.create(parent);
child.name = 'Child';

console.log(child.name); // 'Child' (own)
console.log(child.greet()); // 'Parent' (inherited)
```

#### Part 3: Prototype Chain

```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    return `${this.name} speaks`;
};

function Dog(name) {
    Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.bark = function() {
    return `${this.name} barks`;
};

const dog = new Dog('Rex');
console.log(dog.speak()); // 'Rex speaks' (inherited from Animal)
console.log(dog.bark()); // 'Rex barks' (own method)
```

**Practice Problems:** (6 problems in lesson)

---

### Lesson 4.2: Constructor Functions & new Keyword ⭐⭐

### Lesson 4.3: Prototypal Inheritance ⭐⭐

### Lesson 4.4: Object-Oriented Patterns ⭐⭐

---

## SECTION 5: TYPE COERCION & COMPARISON

### Lesson 5.1: Type Coercion Rules ⭐⭐⭐

### Lesson 5.2: NaN & typeof ⭐⭐

### Lesson 5.3: Equality Comparisons ⭐⭐

---

## SECTION 6: ADVANCED JAVASCRIPT

### Lesson 6.1: Destructuring & Spread ⭐⭐

### Lesson 6.2: WeakMap & Memory ⭐⭐

### Lesson 6.3: Deep Clone & Objects ⭐⭐⭐

---

## ASSESSMENT & PRACTICE

### Total Practice Problems: 100+
- 15 output prediction problems per section
- 5 implementation challenges
- 3 system design questions using JS concepts

### Mock Tests:
- Section 1 (Hoisting): 15 questions
- Section 2 (this binding): 20 questions
- Section 3 (Async): 25 questions
- Section 4 (Prototypes): 15 questions
- Section 5 (Coercion): 15 questions
- Combined: Full exam (90 questions, 90 min)

---

**Expected Completion Time:** 15-20 hours  
**Prerequisite:** Basic JavaScript knowledge  
**Next Module:** Machine Coding Round  

**By the end of this module, you should score 85%+ on JavaScript output problems.**
