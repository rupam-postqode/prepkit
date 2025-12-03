"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void;
}>({
  toast: () => {},
});

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([]);
  const [counter, setCounter] = React.useState(0);

  const toast = ({ title, description, variant = "info", duration = 5000, action }: ToastProps) => {
    const id = `toast-${counter}`;
    setCounter(prev => prev + 1);
    
    const newToast = { id, title, description, variant, duration, action };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      dismiss(id);
    }, duration);
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}

function Toast({ title, description, variant, action, onDismiss }: ToastProps & { id: string; onDismiss: () => void }) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for exit animation
  };

  React.useEffect(() => {
    // Don't set auto-dismiss timer here since it's handled by the provider
    return () => {};
  }, []);

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm rounded-lg border shadow-lg p-4",
        "transform transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        getVariantStyles()
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 w-0 flex-1">
          {title && (
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 mt-2 underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={handleDismiss}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastViewport({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed top-0 right-0 z-50 flex flex-col-reverse p-4 space-y-reverse pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  );
}