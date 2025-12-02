"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextValue {
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select provider")
  }
  return context
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  disabled?: boolean
  children: React.ReactNode
}

function Select({ value, onValueChange, defaultValue, disabled = false, children }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = React.useCallback((newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
    setOpen(false)
  }, [value, onValueChange])

  const contextValue = React.useMemo(() => ({
    value: currentValue,
    onValueChange: handleValueChange,
    open,
    setOpen,
    triggerRef,
  }), [currentValue, handleValueChange, open])

  // Close dropdown when clicking outside
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
  }, [open])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return

      if (event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative" data-disabled={disabled}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default"
}

function SelectTrigger({ className, size = "default", children, ...props }: SelectTriggerProps) {
  const { open, setOpen, triggerRef } = useSelectContext()

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      data-size={size}
      className={cn(
        // Base styles
        "flex w-full items-center justify-between gap-2 rounded-md border",
        "bg-white text-gray-900 shadow-sm",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=open]:border-indigo-500 data-[state=open]:ring-2 data-[state=open]:ring-indigo-500 data-[state=open]:ring-offset-2",
        
        // Size variants
        "data-[size=default]:h-10 data-[size=default]:px-3 data-[size=default]:py-2 data-[size=default]:text-sm",
        "data-[size=sm]:h-8 data-[size=sm]:px-2 data-[size=sm]:py-1 data-[size=sm]:text-xs",
        
        // Border colors using CSS variables
        "border-gray-200 hover:border-gray-300",
        "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600",
        
        // Modern animations
        "hover:shadow-md",
        
        className
      )}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setOpen(!open)
        }
      }}
      {...props}
    >
      <span className="flex-1 text-left truncate">{children}</span>
      <ChevronDownIcon 
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          "text-gray-500 dark:text-gray-400",
          "data-[state=open]:rotate-180"
        )} 
      />
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useSelectContext()

  return (
    <span className="block truncate">
      {value || placeholder}
    </span>
  )
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "popper" | "item-aligned"
  align?: "start" | "center" | "end"
}

function SelectContent({ className, children, position = "popper", align = "center", ...props }: SelectContentProps) {
  const { open, triggerRef } = useSelectContext()
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Calculate position for popper
  const [positionStyles, setPositionStyles] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (position === "popper" && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentHeight = contentRef.current.offsetHeight
      const viewportHeight = window.innerHeight
      
      let top = triggerRect.bottom + window.scrollY
      let left = triggerRect.left + window.scrollX
      const width = triggerRect.width

      // Adjust for alignment
      if (align === "start") {
        left = triggerRect.left + window.scrollX
      } else if (align === "end") {
        left = triggerRect.right + window.scrollX - width
      } else if (align === "center") {
        left = triggerRect.left + window.scrollX + (triggerRect.width - width) / 2
      }

      // Adjust if content would go below viewport
      if (top + contentHeight > viewportHeight + window.scrollY) {
        top = triggerRect.top + window.scrollY - contentHeight
      }

      setPositionStyles({
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        zIndex: 50,
      })
    }
  }, [open, position, align, triggerRef])

  if (!open) return null

  if (position === "popper") {
    return (
      <div
        ref={contentRef}
        className={cn(
          // Base styles
          "overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          
          // Modern design
          "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
          
          // Glassmorphism effect
          "backdrop-blur-sm bg-white/95 dark:bg-gray-800/95",
          
          className
        )}
        style={positionStyles}
        {...props}
      >
        <div className="max-h-60 overflow-auto p-1">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        // Base styles
        "absolute top-full left-0 right-0 z-50 mt-1",
        "overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        
        // Modern design
        "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
        
        // Glassmorphism effect
        "backdrop-blur-sm bg-white/95 dark:bg-gray-800/95",
        
        className
      )}
      {...props}
    >
      <div className="max-h-60 overflow-auto p-1">
        {children}
      </div>
    </div>
  )
}

type SelectLabelProps = React.HTMLAttributes<HTMLDivElement>

function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400",
        className
      )}
      {...props}
    />
  )
}

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function SelectItem({ className, children, value, ...props }: SelectItemProps) {
  const { value: currentValue, onValueChange } = useSelectContext()
  const isSelected = currentValue === value
  const itemRef = React.useRef<HTMLButtonElement>(null)

  // Focus the selected item when dropdown opens
  React.useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.focus()
    }
  }, [isSelected])

  return (
    <button
      ref={itemRef}
      type="button"
      role="option"
      aria-selected={isSelected}
      data-state={isSelected ? "checked" : "unchecked"}
      data-value={value}
      className={cn(
        // Base styles
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm",
        "transition-colors duration-150",
        "focus:outline-none",
        
        // Colors
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        "focus:bg-gray-100 focus:text-gray-900",
        "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        "dark:focus:bg-gray-700 dark:focus:text-gray-100",
        
        // Selected state
        "data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-900",
        "dark:data-[state=checked]:bg-indigo-900/20 dark:data-[state=checked]:text-indigo-100",
        
        // Disabled state
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        
        className
      )}
      onClick={() => onValueChange?.(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onValueChange?.(value)
        }
      }}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && (
          <CheckIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        )}
      </span>
      {children}
    </button>
  )
}

type SelectSeparatorProps = React.HTMLAttributes<HTMLDivElement>

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <div
      className={cn(
        "my-1 h-px bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  )
}

type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>

function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <div
      role="group"
      className={cn("py-1", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
