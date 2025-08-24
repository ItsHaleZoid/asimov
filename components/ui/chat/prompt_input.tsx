"use client"
import { cn } from "@/lib/utils"
import * as React from "react"
import { ArrowRight, Plus } from "lucide-react"

export interface PromptInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PromptInput = ({ className, type, ...props }: PromptInputProps) => {
  return (
    <div className="relative w-1/2">
      <button className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-white hover:text-white transition-colors hover:bg-white/10 rounded-full cursor-pointer">
        <Plus className="h-6 w-6" />
      </button>
      <input
        placeholder="Ask me anything..."
        type={type}
        className={cn(
          "flex h-17 w-full rounded-full border border-white/20 bg-white/5 pl-16 pr-12 py-1 text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30",
          className
        )}
        {...props}
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-black bg-white rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
        <ArrowRight className="h-7 w-7" />
      </button>
    </div>
  )
}

export { PromptInput }