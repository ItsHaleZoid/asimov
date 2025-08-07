"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "relative group inline-flex items-center transition-colors justify-center cursor-text gap-2 whitespace-nowrap  text-sm font-medium transition-[color,box-shadow,transform] duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-transparent active:scale-105 duration-300 transition text-primary cursor-text",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 text-xs gap-1.5 px-4",
        lg: "h-10 rounded-md px-6",
        xl: "h-12 rounded-md px-8",
        xxl: "h-14 rounded-md px-10",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  recommendations?: string[]
  suggestions?: React.ReactNode
  showSuggestions?: boolean
}

const LiquidInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, asChild = false, icon, recommendations, suggestions, showSuggestions, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        data-slot="input-wrapper"
        className={cn(
          "relative group",
          inputVariants({ variant, size, className })
        )}
      >
        <div className="absolute top-0 left-0 z-0 h-full w-full 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
        transition-all duration-300 ease-out
        group-hover:shadow-[0_0_8px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.12),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.95),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.9),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.7),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.7),inset_0_0_8px_8px_rgba(0,0,0,0.18),inset_0_0_4px_4px_rgba(0,0,0,0.1),0_0_16px_rgba(255,255,255,0.25)]
        group-focus-within:shadow-[0_0_4px_rgba(0,0,0,0.02),0_1px_3px_rgba(0,0,0,0.06),inset_2px_2px_0.5px_-2px_rgba(0,0,0,0.8),inset_-2px_-2px_0.5px_-2px_rgba(0,0,0,0.75),inset_0.5px_0.5px_0.5px_-0.25px_rgba(0,0,0,0.5),inset_-0.5px_-0.5px_0.5px_-0.25px_rgba(0,0,0,0.5),inset_0_0_4px_4px_rgba(0,0,0,0.08),inset_0_0_1px_1px_rgba(0,0,0,0.04),0_0_8px_rgba(255,255,255,0.1)]
        dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]
        dark:group-hover:shadow-[0_0_12px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.12),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.12),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.9),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.7),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.7),inset_0_0_8px_8px_rgba(255,255,255,0.18),inset_0_0_4px_4px_rgba(255,255,255,0.1),0_0_16px_rgba(0,0,0,0.25)]
        dark:group-focus-within:shadow-[0_0_4px_rgba(0,0,0,0.02),0_1px_3px_rgba(0,0,0,0.06),inset_2px_2px_0.5px_-2px_rgba(255,255,255,0.06),inset_-2px_-2px_0.5px_-2px_rgba(255,255,255,0.75),inset_0.5px_0.5px_0.5px_-0.25px_rgba(255,255,255,0.5),inset_-0.5px_-0.5px_0.5px_-0.25px_rgba(255,255,255,0.5),inset_0_0_4px_4px_rgba(255,255,255,0.08),inset_0_0_1px_1px_rgba(255,255,255,0.04),0_0_8px_rgba(0,0,0,0.1)]" />
      
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            "relative z-10 w-full h-full bg-transparent outline-none py-2 transition-all duration-300 ease-out group-hover:scale-105 group-focus-within:scale-95",
            icon ? "pl-12 pr-4" : "px-4"
          )}
          {...props}
        />
        <GlassFilter />
        {showSuggestions && suggestions && (
          <div className="absolute top-full w-full mt-2 z-50">
            {suggestions}
          </div>
        )}
      </Comp>
    )
  }
)
LiquidInput.displayName = "LiquidInput"


function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Generate turbulent noise for distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />

          {/* Blur the turbulence pattern slightly */}
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />

          {/* Displace the source graphic with the noise */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />

          {/* Apply overall blur on the final result */}
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />

          {/* Output the result */}
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export { LiquidInput };