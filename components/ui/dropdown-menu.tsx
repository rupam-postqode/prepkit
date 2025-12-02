"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("DropdownMenu components must be used within a DropdownMenu provider")
  }
  return context
}

interface DropdownMenuProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function DropdownMenu({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = React.useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [controlledOpen, onOpenChange])

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
  }, [open, setOpen])

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
  }, [open, setOpen])

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    triggerRef,
  }), [open, setOpen])

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

type DropdownMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function DropdownMenuTrigger({ className, ...props }: DropdownMenuTriggerProps) {
  const { open, setOpen, triggerRef } = useDropdownMenuContext()

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        
        // Modern hover effects
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        
        className
      )}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault()
          setOpen(true)
        }
      }}
      {...props}
    />
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number
}

function DropdownMenuContent({ className, sideOffset = 4, children, ...props }: DropdownMenuContentProps) {
  const { open, triggerRef } = useDropdownMenuContext()
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
  }, [open, sideOffset, triggerRef])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className={cn(
        // Base styles
        "overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        "p-1 min-w-[8rem]",
        
        // Modern design
        "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
        
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

type DropdownMenuGroupProps = React.HTMLAttributes<HTMLDivElement>

function DropdownMenuGroup({ className, ...props }: DropdownMenuGroupProps) {
  return (
    <div
      role="group"
      className={cn("py-1", className)}
      {...props}
    />
  )
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean
  variant?: "default" | "destructive"
}

function DropdownMenuItem({ className, inset, variant = "default", ...props }: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenuContext()

  return (
    <button
      type="button"
      role="menuitem"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // Base styles
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm",
        "transition-colors duration-150",
        "focus:outline-none",
        
        // Colors
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        "focus:bg-gray-100 focus:text-gray-900",
        "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        "dark:focus:bg-gray-700 dark:focus:text-gray-100",
        
        // Destructive variant
        "data-[variant=destructive]:text-red-600 data-[variant=destructive]:hover:bg-red-50 data-[variant=destructive]:hover:text-red-700",
        "data-[variant=destructive]:focus:bg-red-50 data-[variant=destructive]:focus:text-red-700",
        "dark:data-[variant=destructive]:text-red-400 dark:data-[variant=destructive]:hover:bg-red-900/20 dark:data-[variant=destructive]:hover:text-red-300",
        "dark:data-[variant=destructive]:focus:bg-red-900/20 dark:data-[variant=destructive]:focus:text-red-300",
        
        // Inset
        "data-[inset=true]:pl-8",
        
        // Disabled state
        "disabled:pointer-events-none disabled:opacity-50",
        
        className
      )}
      onClick={(e) => {
        props.onClick?.(e)
        setOpen(false)
      }}
      {...props}
    />
  )
}

interface DropdownMenuCheckboxItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
}

function DropdownMenuCheckboxItem({ className, children, checked, ...props }: DropdownMenuCheckboxItemProps) {
  const { setOpen } = useDropdownMenuContext()

  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        // Base styles
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm",
        "transition-colors duration-150",
        "focus:outline-none",
        
        // Colors
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        "focus:bg-gray-100 focus:text-gray-900",
        "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        "dark:focus:bg-gray-700 dark:focus:text-gray-100",
        
        // Disabled state
        "disabled:pointer-events-none disabled:opacity-50",
        
        className
      )}
      onClick={(e) => {
        props.onClick?.(e)
        setOpen(false)
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && (
          <CheckIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        )}
      </span>
      {children}
    </button>
  )
}

type DropdownMenuRadioGroupProps = React.HTMLAttributes<HTMLDivElement>

function DropdownMenuRadioGroup({ className, ...props }: DropdownMenuRadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn("py-1", className)}
      {...props}
    />
  )
}

interface DropdownMenuRadioItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function DropdownMenuRadioItem({ className, children, value, ...props }: DropdownMenuRadioItemProps) {
  const { setOpen } = useDropdownMenuContext()

  return (
    <button
      type="button"
      role="menuitemradio"
      data-state={props["aria-checked"] ? "checked" : "unchecked"}
      className={cn(
        // Base styles
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm",
        "transition-colors duration-150",
        "focus:outline-none",
        
        // Colors
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        "focus:bg-gray-100 focus:text-gray-900",
        "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        "dark:focus:bg-gray-700 dark:focus:text-gray-100",
        
        // Disabled state
        "disabled:pointer-events-none disabled:opacity-50",
        
        className
      )}
      onClick={(e) => {
        props.onClick?.(e)
        setOpen(false)
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {props["aria-checked"] && (
          <CircleIcon className="h-2 w-2 fill-current text-indigo-600 dark:text-indigo-400" />
        )}
      </span>
      {children}
    </button>
  )
}

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

function DropdownMenuLabel({ className, inset, ...props }: DropdownMenuLabelProps) {
  return (
    <div
      role="presentation"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium",
        "text-gray-500 dark:text-gray-400",
        "data-[inset=true]:pl-8",
        className
      )}
      {...props}
    />
  )
}

type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>

function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        "my-1 h-px bg-gray-200 dark:bg-gray-700",
        "-mx-1",
        className
      )}
      {...props}
    />
  )
}

type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>

function DropdownMenuShortcut({ className, ...props }: DropdownMenuShortcutProps) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest",
        "text-gray-500 dark:text-gray-400",
        className
      )}
      {...props}
    />
  )
}

// Sub menu components
interface DropdownMenuSubContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DropdownMenuSubContext = React.createContext<DropdownMenuSubContextValue | undefined>(undefined)

function useDropdownMenuSubContext() {
  const context = React.useContext(DropdownMenuSubContext)
  if (!context) {
    throw new Error("DropdownMenuSub components must be used within a DropdownMenuSub provider")
  }
  return context
}

type DropdownMenuSubProps = React.HTMLAttributes<HTMLDivElement>

function DropdownMenuSub({ children, ...props }: DropdownMenuSubProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // Close sub-menu when clicking outside
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

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    triggerRef,
  }), [open])

  return (
    <DropdownMenuSubContext.Provider value={contextValue}>
      <div {...props}>{children}</div>
    </DropdownMenuSubContext.Provider>
  )
}

interface DropdownMenuSubTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }: DropdownMenuSubTriggerProps) {
  const { open, setOpen, triggerRef } = useDropdownMenuSubContext()

  return (
    <button
      ref={triggerRef}
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      data-inset={inset}
      className={cn(
        // Base styles
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm",
        "transition-colors duration-150",
        "focus:outline-none",
        
        // Colors
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        "focus:bg-gray-100 focus:text-gray-900",
        "data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900",
        "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        "dark:focus:bg-gray-700 dark:focus:text-gray-100",
        "dark:data-[state=open]:bg-gray-700 dark:data-[state=open]:text-gray-100",
        
        // Inset
        "data-[inset=true]:pl-8",
        
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </button>
  )
}

type DropdownMenuSubContentProps = React.HTMLAttributes<HTMLDivElement>

function DropdownMenuSubContent({ className, children, ...props }: DropdownMenuSubContentProps) {
  const { open, triggerRef } = useDropdownMenuSubContext()
  const contentRef = React.useRef<HTMLDivElement>(null)

  const [positionStyles, setPositionStyles] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      
      let top = triggerRect.top + window.scrollY
      let left = triggerRect.right + window.scrollX

      // Adjust if content would go below viewport
      if (top + contentRect.height > viewportHeight + window.scrollY) {
        top = triggerRect.bottom + window.scrollY - contentRect.height
      }

      // Adjust if content would go right of viewport
      if (left + contentRect.width > viewportWidth + window.scrollX) {
        left = triggerRect.left + window.scrollX - contentRect.width
      }

      setPositionStyles({
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 50,
      })
    }
  }, [open, triggerRef])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className={cn(
        // Base styles
        "overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        "p-1 min-w-[8rem]",
        
        // Modern design
        "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
        
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

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
