"use client"

import * as React from "react"
import { CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined)

function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error("RadioGroup components must be used within a RadioGroup provider")
  }
  return context
}

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

function RadioGroup({ 
  value, 
  onValueChange, 
  defaultValue,
  className, 
  children, 
  ...props 
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
  
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
    <RadioGroupContext.Provider value={contextValue}>
      <div
        data-slot="radio-group"
        className={cn(
          // Base styles
          "grid gap-3",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'value'> {
  value: string
}

function RadioGroupItem({ className, value, children, ...props }: RadioGroupItemProps) {
  const { value: currentValue, onValueChange } = useRadioGroupContext()
  const isChecked = currentValue === value

  const handleClick = React.useCallback(() => {
    onValueChange?.(value)
  }, [onValueChange, value])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onValueChange?.(value)
    }
  }, [onValueChange, value])

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      className={cn(
        // Base styles
        "aspect-square size-4 shrink-0 rounded-full border shadow-xs",
        "transition-all duration-200 ease-out",
        "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        // Colors
        "border-gray-300 bg-white hover:border-gray-400",
        "dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500",
        
        // Checked state
        "data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600",
        "data-[state=checked]:hover:border-indigo-700 data-[state=checked]:hover:bg-indigo-700",
        "dark:data-[state=checked]:border-indigo-500 dark:data-[state=checked]:bg-indigo-500",
        "dark:data-[state=checked]:hover:border-indigo-400 dark:data-[state=checked]:hover:bg-indigo-400",
        
        // Focus states
        "focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span
        className={cn(
          "relative flex items-center justify-center",
          "transition-all duration-200"
        )}
      >
        {isChecked && (
          <CircleIcon 
            className={cn(
              "absolute top-1/2 left-1/2 size-2",
              "fill-indigo-600 text-indigo-600",
              "dark:fill-indigo-400 dark:text-indigo-400",
              "transition-all duration-200"
            )} 
          />
        )}
      </span>
    </button>
  )
}

export { RadioGroup, RadioGroupItem }
