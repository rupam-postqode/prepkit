"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

function Tabs({ value, onValueChange, defaultValue, className, children, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = React.useCallback((newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }, [value, onValueChange])

  const contextValue = React.useMemo(() => ({
    value: currentValue,
    onValueChange: handleValueChange,
  }), [currentValue, handleValueChange])

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

type TabsListProps = React.HTMLAttributes<HTMLDivElement>

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        // Base styles
        "inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        "bg-gray-100 dark:bg-gray-800",
        
        // Modern design
        "border border-gray-200 dark:border-gray-700",
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: currentValue, onValueChange } = useTabsContext()
  const isActive = currentValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        // Base styles
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5",
        "rounded-md border px-2 py-1 text-sm font-medium whitespace-nowrap",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        
        // Colors
        "text-gray-600 dark:text-gray-400",
        "border-transparent",
        
        // Hover states
        "hover:text-gray-900 hover:bg-gray-50",
        "dark:hover:text-gray-100 dark:hover:bg-gray-700/50",
        
        // Active state
        "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
        "data-[state=active]:border-gray-200",
        "dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100 dark:data-[state=active]:border-gray-700",
        
        // Focus states
        "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        
        // Icon styles
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        
        className
      )}
      onClick={() => onValueChange(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onValueChange(value)
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: currentValue } = useTabsContext()
  const isActive = currentValue === value

  if (!isActive) return null

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        // Base styles
        "flex-1 outline-none",
        "animate-in fade-in-0 duration-200",
        
        className
      )}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
