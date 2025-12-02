"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    const ariaAttributes = decorative
      ? { role: "none" }
      : { role: "separator", "aria-orientation": orientation as "horizontal" | "vertical" }

    return (
      <div
        ref={ref}
        data-orientation={orientation}
        className={cn(
          "shrink-0 bg-border transition-colors duration-200",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...ariaAttributes}
        {...props}
      />
    )
  }
)

Separator.displayName = "Separator"

export { Separator }
