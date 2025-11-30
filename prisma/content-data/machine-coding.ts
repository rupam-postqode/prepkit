// prisma/content-data/machine-coding.ts

export const machineCodingLessons = [
  // Section 1: Frontend Machine Coding (8 lessons)
  {
    title: "React Todo App",
    slug: "react-todo-app",
    description: "Build a complete todo application with React",
    markdownContent: `# React Todo App

## Problem Statement

Create a **fully functional todo application** using React with following features:
- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Filter todos (all, active, completed)
- Edit existing todos
- Local storage persistence
- Clean UI with proper state management

## Requirements

### Functional Requirements
1. **Add Todo**: Input field with add button
2. **Toggle Complete**: Checkbox to mark todo as done
3. **Delete Todo**: Delete button for each todo
4. **Edit Todo**: Double-click to edit inline
5. **Filter Todos**: Show all/active/completed
6. **Persistence**: Save to localStorage
7. **Count Display**: Show remaining todos count

### Technical Requirements
1. **React Hooks**: Use useState, useEffect
2. **Component Architecture**: Break into reusable components
3. **State Management**: Proper state lifting
4. **Event Handling**: Handle user interactions
5. **Styling**: Clean, responsive design
6. **Error Handling**: Handle edge cases gracefully

## Solution Approach

### Step 1: Component Structure
\\\`\\\`
TodoApp (Main)
├── TodoForm (Add new todos)
├── TodoList (Display todos)
│   └── TodoItem (Individual todo)
├── TodoFilter (Filter controls)
└── TodoStats (Count display)
\\\`\\\`

### Step 2: State Management
\\\`\\\`javascript
const [todos, setTodos] = useState([]);
const [filter, setFilter] = useState('all');
const [inputValue, setInputValue] = useState('');
\\\`\\\`

### Step 3: Core Functions
- \\\`addTodo()\\\`: Add new todo to list
- \\\`toggleTodo()\\\`: Toggle completion status
- \\\`deleteTodo()\\\`: Remove todo from list
- \\\`editTodo()\\\`: Update todo text
- \\\`clearCompleted()\\\`: Remove all completed todos

## Complete Implementation

### TodoApp Component
\\\`\\\`jsx
import React, { useState, useEffect } from 'react';

function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [inputValue, setInputValue] = useState('');

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('todos');
        if (saved) {
            setTodos(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage when todos change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (inputValue.trim()) {
            const newTodo = {
                id: Date.now(),
                text: inputValue.trim(),
                completed: false
            };
            setTodos([newTodo, ...todos]);
            setInputValue('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const editTodo = (id, newText) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: newText } : todo
        ));
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const activeCount = todos.filter(todo => !todo.completed).length;

    return (
        <div className="todo-app">
            <h1>Todo App</h1>
            
            <TodoForm
                inputValue={inputValue}
                setInputValue={setInputValue}
                addTodo={addTodo}
            />
            
            <TodoFilter
                filter={filter}
                setFilter={setFilter}
                clearCompleted={clearCompleted}
            />
            
            <TodoList
                todos={filteredTodos}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
            />
            
            <TodoStats activeCount={activeCount} />
        </div>
    );
}
\\\`\\\`

### TodoForm Component
\\\`\\\`jsx
function TodoForm({ inputValue, setInputValue, addTodo }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        addTodo();
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                className="todo-input"
            />
            <button type="submit" className="add-button">
                Add
            </button>
        </form>
    );
}
\\\`\\\`

### TodoItem Component
\\\`\\\`jsx
function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSave = () => {
        if (editText.trim()) {
            editTodo(todo.id, editText.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    return (
        <div className={\\\`todo-item \\\${todo.completed ? 'completed' : ''}\\\`}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
            />
            
            {isEditing ? (
                <div className="edit-mode">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        className="todo-edit-input"
                        autoFocus
                    />
                    </div>
            ) : (
                <span
                    onDoubleClick={() => setIsEditing(true)}
                    className="todo-text"
                >
                    {todo.text}
                </span>
            )}
            
            <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
            >
                ×
            </button>
        </div>
    );
}
\\\`\\\`

## Styling

### CSS Implementation
\\\`\\\`css
.todo-app {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.todo-form {
    display: flex;
    margin-bottom: 20px;
}

.todo-input {
    flex: 1;
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.add-button {
    padding: 10px 20px;
    margin-left: 10px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.todo-item.completed {
    opacity: 0.6;
}

.todo-text {
    flex: 1;
    margin: 0 15px;
    cursor: pointer;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
}

.delete-button {
    background: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-size: 18px;
}
\\\`\\\`

## Testing Strategy

### Unit Tests
\\\`\\\`javascript
// Test adding todos
test('should add new todo', () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp />);
    
    const input = getByPlaceholderText('What needs to be done?');
    const button = getByText('Add');
    
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(button);
    
    expect(getByText('Test todo')).toBeInTheDocument();
});

// Test toggling completion
test('should toggle todo completion', () => {
    const { getByText, getByRole } = render(<TodoApp />);
    
    // Add a todo first
    // ... setup code
    
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(checkbox).toBeChecked();
});
\\\`\\\`

### Integration Tests
- Test full user flow
- Test localStorage persistence
- Test filter functionality
- Test responsive design

## Common Interview Follow-ups

1. **Performance Optimization**: How would you handle 10,000+ todos?
2. **Server Integration**: How would you add API calls?
3. **Advanced Features**: Add due dates, priorities, categories?
4. **Accessibility**: ARIA labels, keyboard navigation?
5. **State Management**: Redux/Zustand for complex state?

## Time Management

### 45-Minute Breakdown
- **5 min**: Understanding requirements and planning
- **15 min**: Core components implementation
- **10 min**: State management and event handling
- **10 min**: Styling and refinement
- **5 min**: Testing and edge cases

## Key Learnings

- **Component Composition**: Break UI into reusable components
- **State Lifting**: Pass state down to child components
- **Event Handling**: Proper event binding and handling
- **Side Effects**: Use useEffect for localStorage and API calls
- **Immutability**: Never mutate state directly

## Company Focus
- **All companies** - Frontend roles often ask this
- **Meta, Amazon** - Expect component architecture questions
- **Startups** - Focus on practical implementation speed`,
    keyTakeaways: [
      "Break complex UI into smaller, reusable components",
      "Use proper React hooks for state and side effects",
      "Implement local storage for data persistence",
      "Handle user interactions and edge cases gracefully"
    ],
    commonMistakes: [
      "Mutating state directly instead of using setState",
      "Not handling edge cases like empty inputs",
      "Forgetting proper event handling and binding",
      "Not structuring components for reusability"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 45
  }
];
