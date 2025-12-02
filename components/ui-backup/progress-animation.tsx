"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressAnimationProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  showCheckmark?: boolean;
  className?: string;
  duration?: number; // Animation duration in ms
  color?: "primary" | "success" | "warning" | "error";
}

export function ProgressAnimation({
  progress,
  size = "md",
  showPercentage = true,
  showCheckmark = true,
  className,
  duration = 1000,
  color = "primary",
}: ProgressAnimationProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const colorClasses = {
    primary: "stroke-indigo-500",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    error: "stroke-red-500",
  };

  const bgColorClasses = {
    primary: "text-indigo-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
      if (progress === 100) {
        setTimeout(() => setIsComplete(true), duration);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [progress, duration]);

  const radius = size === "sm" ? 24 : size === "md" ? 36 : 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        className={cn("transform -rotate-90", sizeClasses[size])}
        viewBox={`0 0 ${radius * 2 + 8} ${radius * 2 + 8}`}
      >
        {/* Background circle */}
        <circle
          cx={radius + 4}
          cy={radius + 4}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={radius + 4}
          cy={radius + 4}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className={cn(colorClasses[color], "transition-all duration-1000 ease-out")}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            strokeLinecap: "round",
          }}
        />
      </svg>

      {/* Content in the center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isComplete && showCheckmark ? (
          <div className={cn("animate-bounce-in", bgColorClasses[color])}>
            <svg
              className={cn(
                size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-10 h-10"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                className="animate-checkmark"
              />
            </svg>
          </div>
        ) : showPercentage ? (
          <span className={cn("font-semibold", textSizes[size], bgColorClasses[color])}>
            {Math.round(animatedProgress)}%
          </span>
        ) : null}
      </div>

      {/* Completion celebration effect */}
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-ping bg-green-400 opacity-20 rounded-full" />
          <div className="absolute inset-0 animate-ping animation-delay-200 bg-green-400 opacity-20 rounded-full" />
        </div>
      )}
    </div>
  );
}

interface ProgressBarAnimationProps {
  progress: number;
  height?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
  duration?: number;
  color?: "primary" | "success" | "warning" | "error";
  animated?: boolean;
}

export function ProgressBarAnimation({
  progress,
  height = "md",
  showPercentage = true,
  className,
  duration = 1000,
  color = "primary",
  animated = true,
}: ProgressBarAnimationProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const heightClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  const colorClasses = {
    primary: "bg-indigo-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  useEffect(() => {
    const updateProgress = () => {
      setAnimatedProgress(progress);
      if (progress === 100) {
        const completeTimer = setTimeout(() => setIsComplete(true), duration);
        return completeTimer;
      }
      return null;
    };

    if (animated) {
      const timer = setTimeout(() => {
        const completeTimer = updateProgress();
        return completeTimer;
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const completeTimer = updateProgress();
      return () => {
        if (completeTimer) clearTimeout(completeTimer);
      };
    }
  }, [progress, duration, animated]);

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("relative w-full bg-gray-200 rounded-full overflow-hidden", heightClasses[height])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
            colorClasses[color]
          )}
          style={{ width: `${animatedProgress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-shimmer" />
          
          {/* Completion glow effect */}
          {isComplete && (
            <div className="absolute inset-0 animate-glow" />
          )}
        </div>
      </div>
      
      {showPercentage && (
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(animatedProgress)}% Complete
          </span>
          {isComplete && (
            <span className="text-sm font-medium text-green-600 animate-bounce-in">
              ✓ Completed!
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface MilestoneProgressProps {
  milestones: Array<{
    id: string;
    label: string;
    completed: boolean;
    current?: boolean;
  }>;
  className?: string;
}

export function MilestoneProgress({ milestones, className }: MilestoneProgressProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Progress line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
        <div
          className="h-full bg-green-500 transition-all duration-500 ease-out"
          style={{
            width: `${(milestones.filter(m => m.completed).length / milestones.length) * 100}%`,
          }}
        />
      </div>

      {/* Milestones */}
      <div className="relative flex justify-between">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={cn(
              "flex flex-col items-center animate-slide-in-up",
              `stagger-${index + 1}`
            )}
          >
            {/* Milestone dot */}
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 bg-white transition-all duration-300",
                milestone.completed
                  ? "border-green-500 bg-green-500"
                  : milestone.current
                  ? "border-indigo-500 bg-indigo-500 animate-pulse"
                  : "border-gray-300"
              )}
            >
              {milestone.completed && (
                <svg
                  className="w-full h-full text-white p-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>

            {/* Milestone label */}
            <span
              className={cn(
                "mt-2 text-xs font-medium text-center max-w-20",
                milestone.completed
                  ? "text-green-600"
                  : milestone.current
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-500"
              )}
            >
              {milestone.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}