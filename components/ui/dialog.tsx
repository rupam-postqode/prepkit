"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  className?: string
  children: React.ReactNode
  showCloseButton?: boolean
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
}
interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  React.useEffect(() => {
    setIsOpen(open || false)
  }, [open])
  
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }
  
  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ onClick, asChild = false, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    onOpenChange(true)
  }
  
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<React.ComponentPropsWithRef<'button'>>
    return React.cloneElement(child, {
      ...child.props,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(e)
        handleClick(e)
      },
    })
  }
  
  return (
    <button
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = React.useContext(DialogContext)
  
  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, showCloseButton = true, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext)
    
    const handleEscape = React.useCallback((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }, [onOpenChange])
    
    React.useEffect(() => {
      if (open) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [open, handleEscape])
    
    if (!open) return null
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <DialogOverlay />
        <div
          ref={ref}
          className={cn(
            "relative bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl p-6 w-full max-w-lg mx-4 transition-all duration-200 dark:bg-gray-900/95 dark:border-gray-700/50",
            open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100", className)}
      {...props}
    />
  )
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
      {...props}
    />
  )
)
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
}
