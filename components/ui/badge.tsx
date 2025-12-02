import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-all duration-200 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
        secondary:
          "border-transparent bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
        destructive:
          "border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
        outline:
          "border-gray-300 text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
        success:
          "border-transparent bg-green-600 text-white shadow-sm hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-600 text-white shadow-sm hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        md: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Explicitly define the variant type
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
type BadgeSize = "sm" | "md" | "lg"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  asChild?: boolean
}

function Badge({ className, variant = "default", size = "md", asChild = false, ...props }: BadgeProps) {
  const Comp = "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
