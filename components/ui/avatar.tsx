"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type AvatarProps = React.HTMLAttributes<HTMLDivElement>

function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        // Base styles
        "relative flex shrink-0 overflow-hidden rounded-full",
        
        // Size
        "size-8",
        
        // Modern design
        "bg-gray-100 dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        
        className
      )}
      {...props}
    />
  )
}

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <img
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover",
        className
      )}
      {...props}
    />
  )
}

type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        // Base styles
        "flex size-full items-center justify-center rounded-full",
        
        // Modern design
        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        "border border-gray-200 dark:border-gray-700",
        
        // Typography
        "text-sm font-medium",
        
        // Animation
        "animate-in fade-in-0 duration-200",
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
