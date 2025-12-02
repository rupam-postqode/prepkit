"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        // Base styles
        "text-sm font-medium leading-none",
        
        // Flex and alignment
        "flex items-center gap-2",
        
        // Selection
        "select-none",
        
        // Disabled states
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        
        // Colors
        "text-gray-700 dark:text-gray-300",
        
        // Focus states
        "peer-focus-visible:text-indigo-600 dark:peer-focus-visible:text-indigo-400",
        
        // Transitions
        "transition-colors duration-200",
        
        className
      )}
      {...props}
    />
  )
}

export { Label, type LabelProps }
