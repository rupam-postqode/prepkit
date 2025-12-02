"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  className?: string
}

function Progress({ value = 0, max = 100, className, ...props }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full bg-primary rounded-full transition-all duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        )}
        style={{ 
          width: `${percentage}%`,
          '--progress-width': `${percentage}%` 
        } as React.CSSProperties}
      />
    </div>
  )
}

export { Progress, type ProgressProps }
