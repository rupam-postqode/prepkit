"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

function Switch({
  className,
  checked,
  onCheckedChange,
  disabled = false,
  onClick,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(checked || false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const isChecked = checked !== undefined ? checked : internalChecked

  const handleCheckedChange = React.useCallback((newChecked: boolean) => {
    if (checked === undefined) {
      setInternalChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
  }, [checked, onCheckedChange])

  const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      handleCheckedChange(!isChecked)
      onClick?.(e)
    }
  }, [disabled, isChecked, handleCheckedChange, onClick])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      handleCheckedChange(!isChecked)
    }
  }, [disabled, isChecked, handleCheckedChange])

  return (
    <button
      ref={buttonRef}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      data-state={isChecked ? "checked" : "unchecked"}
      data-disabled={disabled}
      className={cn(
        // Base styles
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full",
        "border border-transparent shadow-xs transition-all duration-200 ease-out",
        "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        // Colors
        "data-[state=unchecked]:bg-gray-200 data-[state=unchecked]:border-gray-300",
        "data-[state=unchecked]:hover:bg-gray-300",
        "dark:data-[state=unchecked]:bg-gray-700 dark:data-[state=unchecked]:border-gray-600",
        "dark:data-[state=unchecked]:hover:bg-gray-600",
        
        "data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600",
        "data-[state=checked]:hover:bg-indigo-700 data-[state=checked]:hover:border-indigo-700",
        "dark:data-[state=checked]:bg-indigo-500 dark:data-[state=checked]:border-indigo-500",
        "dark:data-[state=checked]:hover:bg-indigo-400 dark:data-[state=checked]:hover:border-indigo-400",
        
        // Focus ring
        "focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span
        data-state={isChecked ? "checked" : "unchecked"}
        className={cn(
          // Base styles
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform duration-200 ease-out",
          
          // Colors
          "bg-white shadow-sm",
          "dark:bg-gray-100",
          
          // Position
          "data-[state=unchecked]:translate-x-0",
          "data-[state=checked]:translate-x-[calc(100%-2px)]",
          
          // Dark mode adjustments
          "dark:data-[state=unchecked]:bg-gray-400",
          "dark:data-[state=checked]:bg-white"
        )}
      />
    </button>
  )
}

export { Switch, type SwitchProps }
