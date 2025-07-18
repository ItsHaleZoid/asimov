import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  label?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white/80">{label}</label>
            <span className="text-sm text-white/60">{value}</span>
          </div>
        )}
        <div className="relative">
          <input
            type="range"
            ref={ref}
            value={value}
            onChange={(e) => onValueChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className={cn(
              "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer",
              "slider-thumb:appearance-none slider-thumb:h-4 slider-thumb:w-4 slider-thumb:rounded-full slider-thumb:bg-blue-500 slider-thumb:cursor-pointer slider-thumb:shadow-md",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md",
              "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-0",
              className
            )}
            {...props}
          />
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg pointer-events-none"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }