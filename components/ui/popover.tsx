"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

function usePopoverContext() {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error("Popover components must be used within a Popover provider")
  }
  return context
}

interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Popover({ 
  open: controlledOpen, 
  onOpenChange, 
  className, 
  children, 
  ...props 
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = React.useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [controlledOpen, onOpenChange])

  // Close popover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, setOpen])

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    triggerRef,
  }), [open, setOpen])

  return (
    <PopoverContext.Provider value={contextValue}>
      <div
        data-slot="popover"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

type PopoverTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function PopoverTrigger({ className, children, ...props }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef } = usePopoverContext()

  return (
    <button
      ref={triggerRef}
      type="button"
      data-slot="popover-trigger"
      aria-haspopup="dialog"
      aria-expanded={open}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        
        // Colors
        "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:text-gray-900",
        "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  )
}

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  sideOffset?: number
}

function PopoverContent({ 
  className, 
  children, 
  align = "center",
  sideOffset = 4,
  ...props 
}: PopoverContentProps) {
  const { open, triggerRef } = usePopoverContext()
  const contentRef = React.useRef<HTMLDivElement>(null)

  const [positionStyles, setPositionStyles] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      
      let top = triggerRect.bottom + window.scrollY + sideOffset
      let left = triggerRect.left + window.scrollX

      // Adjust for alignment
      if (align === "start") {
        left = triggerRect.left + window.scrollX
      } else if (align === "end") {
        left = triggerRect.right + window.scrollX - contentRect.width
      } else if (align === "center") {
        left = triggerRect.left + window.scrollX + (triggerRect.width - contentRect.width) / 2
      }

      // Adjust if content would go below viewport
      if (top + contentRect.height > viewportHeight + window.scrollY) {
        top = triggerRect.top + window.scrollY - contentRect.height - sideOffset
      }

      // Adjust if content would go right of viewport
      if (left + contentRect.width > viewportWidth + window.scrollX) {
        left = triggerRect.right + window.scrollX - contentRect.width
      }

      setPositionStyles({
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 50,
      })
    }
  }, [open, align, sideOffset, triggerRef])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      data-slot="popover-content"
      className={cn(
        // Base styles
        "w-72 rounded-md border p-4 shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        
        // Modern design
        "bg-white text-gray-900 border-gray-200",
        "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700",
        
        // Glassmorphism effect
        "backdrop-blur-sm bg-white/95 dark:bg-gray-800/95",
        
        className
      )}
      style={positionStyles}
      {...props}
    >
      {children}
    </div>
  )
}

type PopoverAnchorProps = React.HTMLAttributes<HTMLDivElement>

function PopoverAnchor({ className, ...props }: PopoverAnchorProps) {
  return (
    <div
      data-slot="popover-anchor"
      className={cn("relative", className)}
      {...props}
    />
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
