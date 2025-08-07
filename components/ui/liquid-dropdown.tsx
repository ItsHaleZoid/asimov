"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const liquidDropdownVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap text-sm font-medium transition-[color,box-shadow,transform] duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-100 active:scale-95 duration-300 transition text-primary",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 hover:scale-100 active:scale-95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-100 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-100 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-100 active:scale-95",
      },
      rounded: {
        default: "",
        full: "rounded-full",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        xl: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xl",
    },
  }
)

interface DropdownItem {
  label: string
  value: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface LiquidDropdownProps extends VariantProps<typeof liquidDropdownVariants> {
  items: DropdownItem[]
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  rounded?: "default" | "full"
}

export function LiquidDropdown({
  items,
  placeholder = "Select an option",
  value,
  onChange,
  className,
  variant,
  size,
  rounded,
}: LiquidDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const selectedItem = items.find(item => item.value === selectedValue)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return
    setSelectedValue(item.value)
    onChange?.(item.value)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative group",
          liquidDropdownVariants({ variant, size, className, rounded })
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Glass Effect Background */}
        <div className="absolute top-0 left-0 z-0 h-full w-full 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
            transition-all duration-300 ease-out
            group-hover:shadow-[0_0_8px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.12),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.95),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.9),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.7),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.7),inset_0_0_8px_8px_rgba(0,0,0,0.18),inset_0_0_4px_4px_rgba(0,0,0,0.1),0_0_16px_rgba(255,255,255,0.25)]
            dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]
            dark:group-hover:shadow-[0_0_12px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.12),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.12),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.9),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.7),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.7),inset_0_0_8px_8px_rgba(255,255,255,0.18),inset_0_0_4px_4px_rgba(255,255,255,0.1),0_0_16px_rgba(0,0,0,0.25)]" />

        {/* Button Content */}
        <div className="pointer-events-none z-10 flex items-center gap-2 transition-all duration-300 ease-out group-hover:scale-105 group-active:scale-95">
          {selectedItem?.icon}
          <span>{selectedItem?.label || placeholder}</span>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        className={cn(
          "absolute top-full mt-2 left-0 origin-top transition-all duration-300",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
        )}
        style={{ width: buttonRef.current?.offsetWidth || 'auto' }}
      >
        <div className="border border-border/20 bg-background/100 w-full
                        shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_48px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.1)]
                        dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_48px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <ul className="py-1" role="listbox">
            {items.map((item) => (
              <li key={item.value} role="option" aria-selected={item.value === selectedValue}>
                <button
                  onClick={() => handleSelect(item)}
                  disabled={item.disabled}
                  className={cn(
                    "relative w-full px-3 py-2 text-left text-sm transition-all duration-200",
                    "hover:bg-accent/50 hover:backdrop-blur-sm",
                    "focus:bg-accent/50 focus:outline-none",
                    "disabled:pointer-events-none disabled:opacity-50",
                    item.value === selectedValue && "bg-accent/30 font-medium",
                    "group/item"
                  )}
                >
                  {/* Item Glass Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100">
                    <div className="absolute inset-0 
                                    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.1)]
                                    dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),inset_0_-1px_0_0_rgba(0,0,0,0.2)]" />
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Glass Filter SVG */}
      <svg className="hidden">
        <defs>
          <filter
            id="dropdown-glass"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.05"
              numOctaves="1"
              seed="1"
              result="turbulence"
            />
            <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="70"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
            <feComposite in="finalBlur" in2="finalBlur" operator="over" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

// Example usage:
export function LiquidDropdownExample() {
  const [selected, setSelected] = React.useState<string>("")
  
  const dropdownItems: DropdownItem[] = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3", disabled: true },
    { label: "Option 4", value: "option4" },
  ]

  return (
    <LiquidDropdown
      items={dropdownItems}
      placeholder="Choose an option"
      value={selected}
      onChange={setSelected}
      size="xl"
      variant="default"
    />
  )
}