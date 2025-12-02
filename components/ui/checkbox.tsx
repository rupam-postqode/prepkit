"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({ 
  className, 
  checked, 
  onCheckedChange, 
  disabled = false,
  ...props 
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = React.useState(checked || false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isChecked = checked !== undefined ? checked : internalChecked

  const handleCheckedChange = React.useCallback((newChecked: boolean) => {
    if (checked === undefined) {
      setInternalChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
  }, [checked, onCheckedChange])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => handleCheckedChange(e.target.checked)}
        {...props}
      />
      <div
        data-state={isChecked ? "checked" : "unchecked"}
        data-disabled={disabled}
        className={cn(
          // Base styles
          "peer size-4 shrink-0 rounded-[4px] border shadow-xs",
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
          
          // Invalid state
          "aria-invalid:border-red-500 aria-invalid:ring-red-500",
          "dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-400",
          
          className
        )}
        role="checkbox"
        aria-checked={isChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleCheckedChange(!isChecked)
          }
        }}
        onClick={() => !disabled && handleCheckedChange(!isChecked)}
      >
        <CheckIcon 
          className={cn(
            "size-3.5 text-white transition-all duration-200",
            isChecked 
              ? "scale-100 opacity-100" 
              : "scale-0 opacity-0"
          )} 
        />
      </div>
    </div>
  )
}

export { Checkbox, type CheckboxProps }
