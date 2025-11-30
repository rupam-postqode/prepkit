// prisma/content-data/machine-coding.ts

export const machineCodingLessons = [
  // Section 1: Frontend Machine Coding (8 lessons)
  {
    title: "React Todo App",
    slug: "react-todo-app",
    description: "Build a complete todo application with React",
    markdownContent: `# React Todo App

## Problem Statement

Create a **fully functional todo application** using React with the following features:
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
\`\`\`
TodoApp (Main)
├── TodoForm (Add new todos)
├── TodoList (Display todos)
│   └── TodoItem (Individual todo)
├── TodoFilter (Filter controls)
└── TodoStats (Count display)
\`\`\`

### Step 2: State Management
\`\`\`javascript
const [todos, setTodos] = useState([]);
const [filter, setFilter] = useState('all');
const [inputValue, setInputValue] = useState('');
\`\`\`

### Step 3: Core Functions
- \`addTodo()\`: Add new todo to list
- \`toggleTodo()\`: Toggle completion status
- \`deleteTodo()\`: Remove todo from list
- \`editTodo()\`: Update todo text
- \`clearCompleted()\`: Remove all completed todos

## Complete Implementation

### TodoApp Component
\`\`\`jsx
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
\`\`\`

### TodoForm Component
\`\`\`jsx
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
\`\`\`

### TodoItem Component
\`\`\`jsx
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
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
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
\`\`\`

## Styling

### CSS Implementation
\`\`\`css
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
\`\`\`

## Testing Strategy

### Unit Tests
\`\`\`javascript
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
\`\`\`

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
  },

  {
    title: "Search and Filter Component",
    slug: "search-filter-component",
    description: "Build an advanced search and filter interface",
    markdownContent: `# Search and Filter Component

## Problem Statement

Create a **search and filter component** that can filter a large dataset with multiple criteria:
- Text search across multiple fields
- Category filtering with checkboxes
- Price range slider
- Rating filter with stars
- Date range selection
- Sort by multiple options
- Real-time filtering
- Reset filters functionality

## Requirements

### Data Structure
\`\`\`javascript
const sampleData = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 99.99,
        rating: 4.5,
        dateAdded: "2024-01-15",
        description: "Bluetooth wireless headphones with noise cancellation"
    },
    // ... more items
];
\`\`\`

### Functional Requirements
1. **Text Search**: Search across name, description, category
2. **Category Filter**: Multiple categories with checkboxes
3. **Price Range**: Min/max price slider
4. **Rating Filter**: Star rating selection
5. **Date Range**: From/to date pickers
6. **Sort Options**: Price (low/high), rating, date, name
7. **Real-time**: Filters update results immediately
8. **Reset**: Clear all filters at once

### Performance Requirements
1. **Efficient**: Handle 1000+ items smoothly
2. **Debounced**: Search input debounced (300ms)
3. **Memoized**: Expensive computations cached
4. **Virtual Scrolling**: For large result sets

## Solution Approach

### Step 1: Component Architecture
\`\`\`
FilterPanel
├── SearchInput
├── CategoryFilter
├── PriceRangeSlider
├── RatingFilter
├── DateRangePicker
├── SortSelector
└── ResetButton
\`\`\`

### Step 2: Filter Logic
\`\`\`javascript
const useFilters = (data) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [rating, setRating] = useState(0);
    const [dateRange, setDateRange] = useState([null, null]);
    const [sortBy, setSortBy] = useState('name');

    // Debounced search
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Memoized filter function
    const filteredData = useMemo(() => {
        return data
            .filter(item => matchesSearch(item, debouncedSearch))
            .filter(item => matchesCategory(item, selectedCategories))
            .filter(item => matchesPriceRange(item, priceRange))
            .filter(item => matchesRating(item, rating))
            .filter(item => matchesDateRange(item, dateRange))
            .sort((a, b) => sortItems(a, b, sortBy));
    }, [data, debouncedSearch, selectedCategories, priceRange, rating, dateRange, sortBy]);

    return {
        filteredData,
        filters: {
            searchTerm,
            selectedCategories,
            priceRange,
            rating,
            dateRange,
            sortBy
        },
        setFilters: {
            setSearchTerm,
            setSelectedCategories,
            setPriceRange,
            setRating,
            setDateRange,
            setSortBy
        }
    };
};
\`\`\`

## Complete Implementation

### Custom Hook: useDebounce
\`\`\`javascript
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
\`\`\`

### Filter Functions
\`\`\`javascript
const matchesSearch = (item, searchTerm) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
    );
};

const matchesCategory = (item, selectedCategories) => {
    return selectedCategories.length === 0 || 
           selectedCategories.includes(item.category);
};

const matchesPriceRange = (item, [min, max]) => {
    return item.price >= min && item.price <= max;
};

const matchesRating = (item, minRating) => {
    return item.rating >= minRating;
};

const matchesDateRange = (item, [startDate, endDate]) => {
    const itemDate = new Date(item.dateAdded);
    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    return true;
};

const sortItems = (a, b, sortBy) => {
    switch (sortBy) {
        case 'price-low':
            return a.price - b.price;
        case 'price-high':
            return b.price - a.price;
        case 'rating':
            return b.rating - a.rating;
        case 'date':
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'name':
        default:
            return a.name.localeCompare(b.name);
    }
};
\`\`\`

### SearchInput Component
\`\`\`jsx
function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="search-input-container">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Search..."}
                className="search-input"
            />
            <span className="search-icon">🔍</span>
        </div>
    );
}
\`\`\`

### CategoryFilter Component
\`\`\`jsx
function CategoryFilter({ categories, selectedCategories, onChange }) {
    const handleCategoryChange = (category) => {
        const updated = selectedCategories.includes(category)
            ? selectedCategories.filter(cat => cat !== category)
            : [...selectedCategories, category];
        onChange(updated);
    };

    return (
        <div className="category-filter">
            <h4>Categories</h4>
            {categories.map(category => (
                <label key={category} className="category-checkbox">
                    <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                    />
                    <span>{category}</span>
                </label>
            ))}
        </div>
    );
}
\`\`\`

### PriceRangeSlider Component
\`\`\`jsx
function PriceRangeSlider({ value, onChange, min, max }) {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (newRange) => {
        setLocalValue(newRange);
        onChange(newRange);
    };

    return (
        <div className="price-range-slider">
            <h4>Price Range</h4>
            <div className="range-container">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localValue[0]}
                    onChange={(e) => handleChange([parseInt(e.target.value), localValue[1]])}
                    className="range-slider"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localValue[1]}
                    onChange={(e) => handleChange([localValue[0], parseInt(e.target.value)])}
                    className="range-slider"
                />
            </div>
            <div className="range-labels">
                <span>₹{localValue[0]}</span>
                <span>₹{localValue[1]}</span>
            </div>
        </div>
    );
}
\`\`\`

### RatingFilter Component
\`\`\`jsx
function RatingFilter({ value, onChange }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="rating-filter">
            <h4>Minimum Rating</h4>
            <div className="star-rating">
                {stars.map(star => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className={`star-button ${star <= value ? 'active' : ''}`}
                    >
                        ⭐
                    </button>
                ))}
            </div>
            {value > 0 && (
                <button
                    onClick={() => onChange(0)}
                    className="clear-rating"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
\`\`\`

### Main FilterPanel Component
\`\`\`jsx
function FilterPanel({ data }) {
    const categories = [...new Set(data.map(item => item.category))];
    
    const {
        filteredData,
        filters,
        setFilters
    } = useFilters(data);

    const resetFilters = () => {
        setFilters.setSearchTerm('');
        setFilters.setSelectedCategories([]);
        setFilters.setPriceRange([0, 1000]);
        setFilters.setRating(0);
        setFilters.setDateRange([null, null]);
        setFilters.setSortBy('name');
    };

    const hasActiveFilters = 
        filters.searchTerm ||
        filters.selectedCategories.length > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 1000 ||
        filters.rating > 0 ||
        filters.dateRange[0] ||
        filters.dateRange[1];

    return (
        <div className="filter-panel">
            <div className="filter-section">
                <SearchInput
                    value={filters.searchTerm}
                    onChange={setFilters.setSearchTerm}
                    placeholder="Search products..."
                />
            </div>

            <CategoryFilter
                categories={categories}
                selectedCategories={filters.selectedCategories}
                onChange={setFilters.setSelectedCategories}
            />

            <PriceRangeSlider
                value={filters.priceRange}
                onChange={setFilters.setPriceRange}
                min={0}
                max={1000}
            />

            <RatingFilter
                value={filters.rating}
                onChange={setFilters.setRating}
            />

            <div className="filter-section">
                <h4>Sort By</h4>
                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters.setSortBy(e.target.value)}
                    className="sort-select"
                >
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="date">Date Added</option>
                </select>
            </div>

            {hasActiveFilters && (
                <button
                    onClick={resetFilters}
                    className="reset-button"
                >
                    Reset All Filters
                </button>
            )}

            <div className="results-count">
                Showing {filteredData.length} of {data.length} results
            </div>
        </div>
    );
}
\`\`\`

## Performance Optimizations

### Virtual Scrolling
\`\`\`jsx
import { FixedSizeList as List } from 'react-window';

function VirtualizedResults({ items }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            <ProductCard product={items[index]} />
        </div>
    );

    return (
        <List
            height={600}
            itemCount={items.length}
            itemSize={120}
            width="100%"
        >
            {Row}
        </List>
    );
}
\`\`\`

### Web Workers for Large Data
\`\`\`javascript
// filter.worker.js
self.onmessage = function(e) {
    const { data, filters } = e.data;
    
    const filtered = data.filter(item => {
        // Apply all filter logic
        return matchesSearch(item, filters.searchTerm) &&
               matchesCategory(item, filters.selectedCategories) &&
               matchesPriceRange(item, filters.priceRange) &&
               matchesRating(item, filters.rating) &&
               matchesDateRange(item, filters.dateRange);
    });
    
    self.postMessage({ filtered });
};
\`\`\`

## Testing Strategy

### Performance Testing
\`\`\`javascript
// Test with large dataset
test('should handle 1000+ items efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: \`Product \${i}\`,
        category: 'Test',
        price: Math.random() * 1000,
        rating: Math.random() * 5
    }));
    
    const { container } = render(<FilterPanel data={largeDataset} />);
    
    // Measure render time
    const startTime = performance.now();
    // Trigger filter changes
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // Should be fast
});
\`\`\`

### Accessibility Testing
- Keyboard navigation for all controls
- Screen reader compatibility
- ARIA labels and descriptions
- Color contrast compliance

## Common Interview Follow-ups

1. **Server-side Filtering**: How would you implement backend filtering?
2. **Caching Strategy**: How to cache filter results?
3. **URL State**: How to sync filters with URL?
4. **Mobile Optimization**: Touch-friendly interfaces?
5. **Analytics**: Track filter usage patterns?

## Time Management

### 45-Minute Breakdown
- **5 min**: Component planning and structure
- **15 min**: Core filter logic implementation
- **10 min**: UI components and styling
- **10 min**: Performance optimizations
- **5 min**: Testing and refinement

## Key Learnings

- **Debouncing**: Prevent excessive re-renders on search
- **Memoization**: Cache expensive filter computations
- **Component Composition**: Build reusable filter components
- **Performance**: Consider virtual scrolling for large datasets
- **User Experience**: Provide instant feedback and clear controls

## Company Focus
- **E-commerce companies** - Amazon, Flipkart, Myntra
- **Data-heavy applications** - Analytics platforms, dashboards
- **All companies** - Component architecture and performance`,
    keyTakeaways: [
      "Implement debouncing for search inputs to improve performance",
      "Use memoization for expensive filtering computations",
      "Break complex filters into smaller, reusable components",
      "Consider virtual scrolling for large datasets"
    ],
    commonMistakes: [
      "Not debouncing search inputs causing performance issues",
      "Mutating state directly instead of using immutable updates",
      "Not handling edge cases in filter logic",
      "Forgetting accessibility and keyboard navigation"
    ],
    difficulty: "INTERMEDIATE",
    premium: false,
    estimatedMinutes: 45
  },

  {
    title: "Data Table with Pagination",
    slug: "data-table-pagination",
    description: "Build a sortable, paginated data table",
    markdownContent: `# Data Table with Pagination

## Problem Statement

Create a **full-featured data table** component with:
- Column sorting (ascending/descending)
- Pagination with customizable page size
- Row selection (single/multiple)
- Search functionality
- Column visibility toggle
- Export functionality (CSV, JSON)
- Responsive design
- Loading states and error handling

## Requirements

### Core Features
1. **Sortable Columns**: Click headers to sort
2. **Pagination**: Navigate pages, change page size
3. **Row Selection**: Checkbox selection with select all
4. **Global Search**: Search across all columns
5. **Column Toggle**: Show/hide columns
6. **Export Data**: Download filtered data
7. **Responsive**: Mobile-friendly layout

### Data Structure
\`\`\`javascript
const sampleData = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Developer",
        department: "Engineering",
        salary: 75000,
        joinDate: "2022-01-15",
        status: "active"
    },
    // ... more records
];
\`\`\`

## Solution Approach

### Step 1: Table Component Structure
\`\`\`DataTable
├── TableHeader
│   ├── SortableHeader
│   └── ColumnToggle
├── TableBody
│   └── TableRow
│       └── TableCell
├── TablePagination
├── TableControls
│   ├── SearchInput
│   ├── ExportButton
│   └── PageSizeSelector
└── LoadingOverlay
\`\`\`

### Step 2: State Management
\`\`\`javascript
const useDataTable = (data) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleColumns, setVisibleColumns] = useState(
        Object.keys(data[0] || {})
    );

    // Memoized filtered and sorted data
    const processedData = useMemo(() => {
        let result = [...data];
        
        // Apply search filter
        if (searchTerm) {
            result = result.filter(row =>
                Object.values(row).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        
        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return result;
    }, [data, searchTerm, sortConfig]);

    // Pagination calculations
    const totalPages = Math.ceil(processedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = processedData.slice(startIndex, endIndex);

    return {
        data: paginatedData,
        totalItems: processedData.length,
        currentPage,
        totalPages,
        pageSize,
        sortConfig,
        selectedRows,
        searchTerm,
        visibleColumns,
        setCurrentPage,
        setPageSize,
        setSortConfig,
        setSelectedRows,
        setSearchTerm,
        setVisibleColumns
    };
};
\`\`\`

## Complete Implementation

### SortableHeader Component
\`\`\`jsx
function SortableHeader({ column, sortConfig, onSort, children }) {
    const isSorted = sortConfig.key === column;
    const sortDirection = isSorted ? sortConfig.direction : null;

    const handleSort = () => {
        let newDirection = 'asc';
        if (isSorted && sortDirection === 'asc') {
            newDirection = 'desc';
        } else if (isSorted && sortDirection === 'desc') {
            newDirection = null; // Remove sort
        }
        
        onSort(column, newDirection);
    };

    return (
        <th
            onClick={handleSort}
            className={`sortable-header ${isSorted ? 'sorted' : ''}`}
        >
            <span className="header-content">{children}</span>
            {isSorted && (
                <span className="sort-indicator">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
            )}
        </th>
    );
}
\`\`\`

### TableRow Component
\`\`\`jsx
function TableRow({ 
    row, 
    visibleColumns, 
    isSelected, 
    onSelect, 
    onToggleSelect 
}) {
    const handleCheckboxChange = (checked) => {
        onToggleSelect(row.id, checked);
    };

    return (
        <tr className={`table-row ${isSelected ? 'selected' : ''}`}>
            <td className="select-cell">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                />
            </td>
            {visibleColumns.map(column => (
                <td key={column} className="table-cell">
                    {formatCellValue(row[column], column)}
                </td>
            ))}
        </tr>
    );
}

function formatCellValue(value, column) {
    // Format based on column type
    if (column.includes('date')) {
        return new Date(value).toLocaleDateString();
    }
    if (column.includes('salary')) {
        return \`$${value.toLocaleString()}\`;
    }
    if (column === 'status') {
        return (
            <span className={`status-badge ${value}`}>
                {value}
            </span>
        );
    }
    return value;
}
\`\`\`

### TablePagination Component
\`\`\`jsx
function TablePagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange
}) {
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            } else if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l, '...');
                }
                }
            }
            l = i;
        }

        rangeWithDots.push(...range);
        return rangeWithDots;
    };

    return (
        <div className="table-pagination">
            <div className="pagination-info">
                Showing {((currentPage - 1) * pageSize) + 1} to{' '}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
            </div>
            
            <div className="pagination-controls">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Previous
                </button>
                
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={index} className="pagination-ellipsis">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    )
                ))}
                
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
            
            <div className="page-size-selector">
                <label>
                    Items per page:
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="page-size-select"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label>
            </div>
        </div>
    );
}
\`\`\`

### ExportButton Component
\`\`\`jsx
function ExportButton({ data, filename, format }) {
    const handleExport = () => {
        let content, mimeType, fileExtension;

        switch (format) {
            case 'csv':
                content = convertToCSV(data);
                mimeType = 'text/csv';
                fileExtension = 'csv';
                break;
            case 'json':
                content = JSON.stringify(data, null, 2);
                mimeType = 'application/json';
                fileExtension = 'json';
                break;
            default:
                return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = \`\${filename}.\${fileExtension}\`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const convertToCSV = (data) => {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Handle values with commas
                return typeof value === 'string' && value.includes(',') 
                    ? \`"\${value}"\` 
                    : value;
            }).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\\n');
    };

    return (
        <div className="export-button">
            <button onClick={() => handleExport('csv')} className="export-csv">
                📊 Export CSV
            </button>
            <button onClick={() => handleExport('json')} className="export-json">
                📄 Export JSON
            </button>
        </div>
    );
}
\`\`\`

### Main DataTable Component
\`\`\`jsx
function DataTable({ data, loading, error }) {
    const tableState = useDataTable(data);

    const handleSort = (key, direction) => {
        tableState.setSortConfig({ key, direction });
        tableState.setCurrentPage(1); // Reset to first page on sort
    };

    const handleSelectAll = (checked) => {
        const currentPageData = tableState.data;
        const ids = new Set(currentPageData.map(row => row.id));
        tableState.setSelectedRows(checked ? ids : new Set());
    };

    const handleRowSelect = (id, checked) => {
        const newSelection = new Set(tableState.selectedRows);
        if (checked) {
            newSelection.add(id);
        } else {
            newSelection.delete(id);
        }
        tableState.setSelectedRows(newSelection);
    };

    const isAllSelected = tableState.data.length > 0 && 
        tableState.data.every(row => tableState.selectedRows.has(row.id));

    const isAllIndeterminate = tableState.data.some(row => 
        tableState.selectedRows.has(row.id)
    ) && !isAllSelected;

    if (loading) {
        return <LoadingOverlay />;
    }

    if (error) {
        return (
            <div className="error-state">
                Error loading data: {error}
            </div>
        );
    }

    return (
        <div className="data-table-container">
            <div className="table-controls">
                <SearchInput
                    value={tableState.searchTerm}
                    onChange={tableState.setSearchTerm}
                    placeholder="Search all columns..."
                />
                
                <ExportButton
                    data={tableState.data}
                    filename="table-export"
                />
                
                <ColumnToggle
                    columns={Object.keys(data[0] || {})}
                    visibleColumns={tableState.visibleColumns}
                    onChange={tableState.setVisibleColumns}
                />
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="select-header">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={elem => {
                                        if (elem) elem.indeterminate = isAllIndeterminate;
                                    }}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </th>
                            {tableState.visibleColumns.map(column => (
                                <SortableHeader
                                    key={column}
                                    column={column}
                                    sortConfig={tableState.sortConfig}
                                    onSort={handleSort}
                                >
                                    {formatColumnName(column)}
                                </SortableHeader>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableState.data.map(row => (
                            <TableRow
                                key={row.id}
                                row={row}
                                visibleColumns={tableState.visibleColumns}
                                isSelected={tableState.selectedRows.has(row.id)}
                                onSelect={handleRowSelect}
                                onToggleSelect={handleRowSelect}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <TablePagination
                currentPage={tableState.currentPage}
                totalPages={tableState.totalPages}
                pageSize={tableState.pageSize}
                totalItems={tableState.totalItems}
                onPageChange={tableState.setCurrentPage}
                onPageSizeChange={tableState.setPageSize}
            />
        </div>
    );
}

function formatColumnName(column) {
    return column.split(/(?=[A-Z])/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}
\`\`\`

## Styling

### CSS Implementation
\`\`\`css
.data-table-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.table-wrapper {
    overflow-x: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

.data-table th {
    background: #f8f9fa;
    padding: 12px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #dee2e6;
    position: relative;
}

.sortable-header {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
}

.sortable-header:hover {
    background-color: #e9ecef;
}

.sort-indicator {
    margin-left: 8px;
    font-size: 12px;
    color: #007bff;
}

.data-table td {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
}

.table-row:hover {
    background-color: #f8f9fa;
}

.table-row.selected {
    background-color: #e3f2fd;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.active {
    background: #d4edda;
    color: #155724;
}

.status-badge.inactive {
    background: #f8d7da;
    color: #721c24;
}

.table-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.pagination-button {
    padding: 8px 16px;
    margin: 0 2px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

.pagination-button.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

.pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
\`\`\`

## Advanced Features

### Column Resizing
\`\`\`jsx
function ResizableHeader({ onResize, children }) {
    const [isResizing, setIsResizing] = useState(false);
    const headerRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing || !headerRef.current) return;
            
            const newWidth = e.clientX - headerRef.current.getBoundingClientRect().left;
            onResize(Math.max(100, newWidth)); // Minimum width
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing, onResize]);

    return (
        <th ref={headerRef} className="resizable-header">
            {children}
            <div
                className="resize-handle"
                onMouseDown={handleMouseDown}
            />
        </th>
    );
}
\`\`\`

### Infinite Scroll
\`\`\`javascript
function useInfiniteScroll(data, pageSize = 20) {
    const [visibleData, setVisibleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            const nextPage = page + 1;
            const startIndex = nextPage * pageSize;
            const endIndex = startIndex + pageSize;
            const newItems = data.slice(startIndex, endIndex);
            
            setVisibleData(prev => [...prev, ...newItems]);
            setPage(nextPage);
            setHasMore(endIndex < data.length);
            setLoading(false);
        }, 500);
    }, [page, pageSize, data, loading, hasMore]);

    useEffect(() => {
        // Initial load
        setVisibleData(data.slice(0, pageSize));
    }, [data, pageSize]);

    return { visibleData, loading, hasMore, loadMore };
}
\`\`\`

## Testing Strategy

### Performance Testing
\`\`\`javascript
describe('DataTable Performance', () => {
    test('should handle large datasets efficiently', () => {
        const largeData = Array.from({ length: 10000 }, (_, i) => ({
            id: i,
            name: \`Item \${i}\`,
            value: Math.random() * 1000
        }));
        
        const { container } = render(<DataTable data={largeData} />);
        
        // Test pagination performance
        const startTime = performance.now();
        
        // Simulate page changes
        for (let i = 0; i < 10; i++) {
            fireEvent.click(container.querySelector('[aria-label="Next Page"]'));
        }
        
        const endTime = performance.now();
        expect(endTime - startTime).toBeLessThan(1000); // Should be under 1 second
    });
});
\`\`\`

### Accessibility Testing
- Keyboard navigation (arrow keys, Enter, Space)
- Screen reader announcements
- ARIA labels and roles
- High contrast mode support
- Touch screen compatibility

## Common Interview Follow-ups

1. **Virtual Scrolling**: How to handle million rows?
2. **Server Integration**: How to add backend pagination?
3. **Real-time Updates**: How to handle live data changes?
4. **Caching Strategy**: How to cache sorted/filtered data?
5. **Mobile Optimization**: Touch gestures and responsive design?

## Time Management

### 45-Minute Breakdown
- **5 min**: Component structure and planning
- **15 min**: Core table and pagination logic
- **10 min**: Sorting and selection features
- **10 min**: Export and advanced features
- **5 min**: Styling and responsiveness

## Key Learnings

- **Performance Optimization**: Use pagination and memoization
- **User Experience**: Loading states, error handling, feedback
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Modular Design**: Break complex features into smaller components
- **State Management**: Handle complex interactions with custom hooks

## Company Focus
- **Enterprise software companies** - Microsoft, Oracle, SAP
- **Data-heavy applications** - Analytics, dashboards, CRM
- **All companies** - Component architecture and performance
</diff>
</replace_in_file>
