import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { transition, hover, focus, interactive } from "@/lib/transitions"

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium
   ${transition.default} ${hover.scale} ${focus.ringSubtle}
   disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
   [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none
   focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px]
   aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
   relative overflow-hidden group`,
  {
    variants: {
      variant: {
        default: `${interactive.buttonPrimary} bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md`,
        destructive:
          `${interactive.button} bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md focus-visible:ring-destructive/20`,
        outline:
          `${interactive.button} border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:shadow-sm`,
        secondary:
          `${interactive.button} bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm`,
        ghost:
          `${interactive.button} hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50`,
        link: `${interactive.linkUnderline} text-primary underline-offset-4`,
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-6 has-[>svg]:px-4 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), {
        "cursor-not-allowed": loading,
      })}
      disabled={disabled || loading}
      {...props}
    >
      {/* Subtle highlight overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200">
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </span>
      
      {/* Loading state */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      <span className={cn("relative z-10 flex items-center gap-2", { "opacity-50": loading })}>
        {children}
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }
