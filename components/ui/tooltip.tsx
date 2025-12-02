"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  delayDuration?: number
  triggerRef?: React.RefObject<HTMLDivElement | null>
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined)

function useTooltipContext() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error("Tooltip components must be used within a Tooltip provider")
  }
  return context
}

interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
}

function TooltipProvider({ children, delayDuration = 0 }: TooltipProviderProps) {
  return (
    <TooltipContext.Provider value={{ open: false, setOpen: () => {}, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  )
}

interface TooltipProps {
  children: React.ReactNode
  delayDuration?: number
}

function Tooltip({ children, delayDuration = 0 }: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  const handleOpen = React.useCallback((shouldOpen: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (shouldOpen) {
      timeoutRef.current = setTimeout(() => {
        setOpen(true)
      }, delayDuration)
    } else {
      setOpen(false)
    }
  }, [delayDuration])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const triggerRef = React.useRef<HTMLDivElement>(null)
  
  const contextValue = React.useMemo(() => ({
    open,
    setOpen: handleOpen,
    delayDuration,
    triggerRef,
  }), [open, handleOpen, delayDuration, triggerRef])

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  )
}

type TooltipTriggerProps = React.HTMLAttributes<HTMLDivElement>

function TooltipTrigger({ className, children, ...props }: TooltipTriggerProps) {
  const { setOpen, triggerRef } = useTooltipContext()
  const localTriggerRef = React.useRef<HTMLDivElement>(null)

  // Use the provided triggerRef or create a local one
  const ref = triggerRef || localTriggerRef

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  )
}

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
}

function TooltipContent({ 
  className, 
  children, 
  sideOffset = 0, 
  side = "top",
  align = "center",
  ...props 
}: TooltipContentProps) {
  const { open, triggerRef } = useTooltipContext()
  const contentRef = React.useRef<HTMLDivElement>(null)

  const [positionStyles, setPositionStyles] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (open && triggerRef?.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      
      let top = 0
      let left = 0

      // Calculate position based on side
      switch (side) {
        case "top":
          top = triggerRect.top + window.scrollY - contentRect.height - sideOffset
          left = triggerRect.left + window.scrollX + (triggerRect.width - contentRect.width) / 2
          
          // Adjust for alignment
          if (align === "start") {
            left = triggerRect.left + window.scrollX
          } else if (align === "end") {
            left = triggerRect.right + window.scrollX - contentRect.width
          }
          break
          
        case "bottom":
          top = triggerRect.bottom + window.scrollY + sideOffset
          left = triggerRect.left + window.scrollX + (triggerRect.width - contentRect.width) / 2
          
          // Adjust for alignment
          if (align === "start") {
            left = triggerRect.left + window.scrollX
          } else if (align === "end") {
            left = triggerRect.right + window.scrollX - contentRect.width
          }
          break
          
        case "left":
          top = triggerRect.top + window.scrollY + (triggerRect.height - contentRect.height) / 2
          left = triggerRect.left + window.scrollX - contentRect.width - sideOffset
          
          // Adjust for alignment
          if (align === "start") {
            top = triggerRect.top + window.scrollY
          } else if (align === "end") {
            top = triggerRect.bottom + window.scrollY - contentRect.height
          }
          break
          
        case "right":
          top = triggerRect.top + window.scrollY + (triggerRect.height - contentRect.height) / 2
          left = triggerRect.right + window.scrollX + sideOffset
          
          // Adjust for alignment
          if (align === "start") {
            top = triggerRect.top + window.scrollY
          } else if (align === "end") {
            top = triggerRect.bottom + window.scrollY - contentRect.height
          }
          break
      }

      // Keep tooltip within viewport bounds
      if (top < window.scrollY) {
        top = window.scrollY + sideOffset
      }
      if (top + contentRect.height > viewportHeight + window.scrollY) {
        top = viewportHeight + window.scrollY - contentRect.height - sideOffset
      }
      if (left < window.scrollX) {
        left = window.scrollX + sideOffset
      }
      if (left + contentRect.width > viewportWidth + window.scrollX) {
        left = viewportWidth + window.scrollX - contentRect.width - sideOffset
      }

      setPositionStyles({
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 50,
      })
    }
  }, [open, side, sideOffset, align, triggerRef])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className={cn(
        // Base styles
        "z-50 overflow-hidden rounded-md border px-3 py-1.5 text-xs",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        "w-fit origin-[var(--radix-tooltip-content-transform-origin)]",
        "text-balance",
        
        // Modern design
        "bg-gray-900 text-white border-gray-700",
        "dark:bg-gray-100 dark:text-gray-900 dark:border-gray-300",
        
        // Glassmorphism effect
        "backdrop-blur-sm bg-gray-900/95 dark:bg-gray-100/95",
        
        className
      )}
      style={positionStyles}
      role="tooltip"
      {...props}
    >
      {children}
      {/* Arrow */}
      <div
        className={cn(
          "absolute z-50 h-2 w-2 rotate-45 rounded-[2px]",
          "bg-gray-900 border-gray-700",
          "dark:bg-gray-100 dark:border-gray-300"
        )}
        style={{
          // Position arrow based on side
          ...(side === "top" && {
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
          }),
          ...(side === "bottom" && {
            top: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
          }),
          ...(side === "left" && {
            right: "-4px",
            top: "50%",
            transform: "translateY(-50%)",
          }),
          ...(side === "right" && {
            left: "-4px",
            top: "50%",
            transform: "translateY(-50%)",
          }),
        }}
      />
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
