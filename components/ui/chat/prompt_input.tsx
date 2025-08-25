"use client"
import { cn } from "@/lib/utils"
import * as React from "react"
import { ArrowRight, Plus, Loader2} from "lucide-react"
import { FaSquare} from "react-icons/fa"

export interface PromptInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isProcessing?: boolean;
}

const PromptInput = ({ 
  className, 
  value = "",
  onChange,
  onSubmit,
  onCancel,
  placeholder = "Ask me anything...",
  disabled = false,
  isLoading = false,
  isProcessing = false
}: PromptInputProps) => {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit && !isProcessing) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleSubmit = () => {
    if (onSubmit && !disabled && !isLoading && !isProcessing && value.trim()) {
      onSubmit();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={cn("relative w-full max-w-4xl", className)}>
      <button className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-white hover:text-white transition-colors hover:bg-white/10 rounded-full cursor-pointer">
        <Plus className="h-6 w-6" />
      </button>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading || isProcessing}
        className={cn(
          "flex h-17 w-full rounded-full border border-white/20 bg-white/5 pl-16 pr-16 py-1 text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      />
      <button 
        onClick={isProcessing ? handleCancel : handleSubmit}
        disabled={disabled || isLoading || (!value.trim() && !isProcessing)}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors cursor-pointer",
          isProcessing 
            ? "text-white bg-white/20 hover:bg-white/0" 
            : "text-black bg-white/70 hover:bg-white"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-7 w-7 animate-spin" />
        ) : isProcessing ? (
          <FaSquare className="h-7 w-7 text-white p-1" />
        ) : (
          <ArrowRight className="h-7 w-7" />
        )}
      </button>
    </div>
  )
}

export { PromptInput }