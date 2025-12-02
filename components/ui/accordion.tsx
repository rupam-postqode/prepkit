"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  value: string[]
  onValueChange: (value: string[]) => void
  collapsible?: boolean
  type?: "single" | "multiple"
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

function useAccordionContext() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion provider")
  }
  return context
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string[]
  onValueChange?: (value: string[]) => void
  collapsible?: boolean
  defaultValue?: string[]
  type?: "single" | "multiple"
}

function Accordion({ 
  value, 
  onValueChange, 
  collapsible = true, 
  defaultValue = [],
  type = "single",
  className, 
  children, 
  ...props 
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = React.useCallback((newValue: string[]) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }, [value, onValueChange])

  const contextValue = React.useMemo(() => ({
    value: currentValue,
    onValueChange: handleValueChange,
    collapsible,
    type,
  }), [currentValue, handleValueChange, collapsible, type])

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        data-slot="accordion"
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function AccordionItem({ className, value, children, ...props }: AccordionItemProps) {
  const { value: currentValue } = useAccordionContext()
  const isOpen = currentValue.includes(value)

  return (
    <div
      data-slot="accordion-item"
      className={cn(
        "border-b last:border-b-0",
        "transition-all duration-200",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === AccordionTrigger) {
          return React.cloneElement(child as React.ReactElement<AccordionTriggerProps>, {
            key: child.key || index,
            value,
            isOpen,
          })
        }
        if (React.isValidElement(child) && child.type === AccordionContent) {
          return React.cloneElement(child as React.ReactElement<AccordionContentProps>, {
            key: child.key || index,
            isOpen,
          })
        }
        return child
      })}
    </div>
  )
}

interface AccordionTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value?: string
  isOpen?: boolean
}

function AccordionTrigger({ className, children, value, isOpen, ...props }: AccordionTriggerProps) {
  const { value: currentValue, onValueChange, collapsible, type } = useAccordionContext()
  const itemValue = value || ''
  const isItemOpen = isOpen || false

  const handleClick = React.useCallback(() => {
    if (type === "single") {
      const isCurrentlyOpen = currentValue.includes(itemValue)
      onValueChange(isCurrentlyOpen ? [] : [itemValue])
    } else {
      const isCurrentlyOpen = currentValue.includes(itemValue)
      if (isCurrentlyOpen) {
        onValueChange(currentValue.filter(v => v !== itemValue))
      } else {
        onValueChange([...currentValue, itemValue])
      }
    }
  }, [type, currentValue, onValueChange, itemValue])

  return (
    <div className="flex">
      <button
        type="button"
        data-slot="accordion-trigger"
        className={cn(
          // Base styles
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium",
          "transition-all duration-200",
          "outline-none",
          "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Hover states
          "hover:bg-gray-50 hover:underline",
          "dark:hover:bg-gray-800",
          
          // Open state
          "[&[data-state=open]>svg]:rotate-180",
          
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        <ChevronDownIcon 
          className={cn(
            "text-gray-500 dark:text-gray-400 pointer-events-none size-4 shrink-0",
            "transition-transform duration-200",
            "translate-y-0.5"
          )} 
        />
      </button>
    </div>
  )
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { collapsible } = useAccordionContext()
  const isOpen = props.isOpen || false

  if (!isOpen && !collapsible) {
    return null
  }

  return (
    <div
      data-slot="accordion-content"
      className={cn(
        // Base styles
        "overflow-hidden text-sm",
        
        // Animations
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        
        // Spacing
        "pt-0 pb-4",
        
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
