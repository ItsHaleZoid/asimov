"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90",
        cool: "dark:inset-shadow-2xs dark:inset-shadow-white/10 bg-linear-to-t border border-b-2 border-zinc-950/40 from-primary to-primary/85 shadow-md shadow-primary/20 ring-1 ring-inset ring-white/25 transition-[filter] duration-200 hover:brightness-110 active:brightness-90 dark:border-x-0 text-primary-foreground dark:text-primary-foreground dark:border-t-0 dark:border-primary/50 dark:ring-white/5",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, liquidbuttonVariants, LiquidButton }

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap text-sm font-medium transition-[color,box-shadow,transform] duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 active:scale-95 duration-300 transition text-primary",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 hover:scale-105 active:scale-95 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 text-xs gap-1.5 px-4 has-[>svg]:px-4",
        lg: "h-10 px-6 has-[>svg]:px-4",
        xl: "h-12 px-8 has-[>svg]:px-6",
        xxl: "h-14 px-10 has-[>svg]:px-8",
        icon: "size-9",
      },
      roundness: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xxl",
      roundness: "md",
    },
  }
)

function LiquidButton({
  className,
  variant,
  size,
  roundness,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <>
      <Comp
        data-slot="button"
        className={cn(
          "relative group",
          liquidbuttonVariants({ variant, size, roundness, className })
        )}
        {...props}
      >
        <div className={cn(
          "absolute top-0 left-0 z-0 h-full w-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all duration-300 ease-out group-hover:shadow-[0_0_8px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.12),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.95),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.9),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.7),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.7),inset_0_0_8px_8px_rgba(0,0,0,0.18),inset_0_0_4px_4px_rgba(0,0,0,0.1),0_0_16px_rgba(255,255,255,0.25)] group-active:shadow-[0_0_4px_rgba(0,0,0,0.02),0_1px_3px_rgba(0,0,0,0.06),inset_2px_2px_0.5px_-2px_rgba(0,0,0,0.8),inset_-2px_-2px_0.5px_-2px_rgba(0,0,0,0.75),inset_0.5px_0.5px_0.5px_-0.25px_rgba(0,0,0,0.5),inset_-0.5px_-0.5px_0.5px_-0.25px_rgba(0,0,0,0.5),inset_0_0_4px_4px_rgba(0,0,0,0.08),inset_0_0_1px_1px_rgba(0,0,0,0.04),0_0_8px_rgba(255,255,255,0.1)] dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)] dark:group-hover:shadow-[0_0_12px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.12),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.12),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.9),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.7),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.7),inset_0_0_8px_8px_rgba(255,255,255,0.18),inset_0_0_4px_4px_rgba(255,255,255,0.1),0_0_16px_rgba(0,0,0,0.25)] dark:group-active:shadow-[0_0_4px_rgba(0,0,0,0.02),0_1px_3px_rgba(0,0,0,0.06),inset_2px_2px_0.5px_-2px_rgba(255,255,255,0.06),inset_-2px_-2px_0.5px_-2px_rgba(255,255,255,0.75),inset_0.5px_0.5px_0.5px_-0.25px_rgba(255,255,255,0.5),inset_-0.5px_-0.5px_0.5px_-0.25px_rgba(255,255,255,0.5),inset_0_0_4px_4px_rgba(255,255,255,0.08),inset_0_0_1px_1px_rgba(255,255,255,0.04),0_0_8px_rgba(0,0,0,0.1)]",
          {
            "rounded-none": roundness === "none",
            "rounded-sm": roundness === "sm", 
            "rounded-md": roundness === "md" || !roundness,
            "rounded-lg": roundness === "lg",
            "rounded-xl": roundness === "xl",
            "rounded-full": roundness === "full",
          }
        )} />
      

        <div className="pointer-events-none z-10 transition-all duration-300 ease-out group-hover:scale-105 group-active:scale-95">
          {children}
        </div>
        <GlassFilter />
      </Comp>
    </>
  )
}


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

type ColorVariant =
  | "default"
  | "primary"
  | "success"
  | "error"
  | "gold"
  | "bronze";

type RoundnessVariant = "none" | "sm" | "md" | "lg" | "xl" | "full";
 
interface MetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
  roundness?: RoundnessVariant;
}
 
const colorVariants: Record<
  ColorVariant,
  {
    outer: string;
    inner: string;
    button: string;
    textColor: string;
    textShadow: string;
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[#FAFAFA] via-[#3E3E3E] to-[#E5E5E5]",
    button: "bg-gradient-to-b from-[#B9B9B9] to-[#969696]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]",
  },
  primary: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-primary via-secondary to-muted",
    button: "bg-gradient-to-b from-primary to-primary/40",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(30_58_138_/_100%)]",
  },
  success: {
    outer: "bg-gradient-to-b from-[#005A43] to-[#7CCB9B]",
    inner: "bg-gradient-to-b from-[#E5F8F0] via-[#00352F] to-[#D1F0E6]",
    button: "bg-gradient-to-b from-[#9ADBC8] to-[#3E8F7C]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]",
  },
  error: {
    outer: "bg-gradient-to-b from-[#5A0000] to-[#FFAEB0]",
    inner: "bg-gradient-to-b from-[#FFDEDE] via-[#680002] to-[#FFE9E9]",
    button: "bg-gradient-to-b from-[#F08D8F] to-[#A45253]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(146_64_14_/_100%)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
    inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
    button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
    textColor: "text-[#FFFDE5]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(178_140_2_/_100%)]",
  },
  bronze: {
    outer: "bg-gradient-to-b from-[#864813] to-[#E9B486]",
    inner: "bg-gradient-to-b from-[#EDC5A1] via-[#5F2D01] to-[#FFDEC1]",
    button: "bg-gradient-to-b from-[#FFE3C9] to-[#A36F3D]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]",
  },
};

const roundnessClasses: Record<RoundnessVariant, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};
 
const metalButtonVariants = (
  variant: ColorVariant = "default",
  roundness: RoundnessVariant = "md",
  isPressed: boolean,
  isHovered: boolean,
  isTouchDevice: boolean,
) => {
  const colors = colorVariants[variant];
  const roundnessClass = roundnessClasses[roundness];
  const transitionStyle = "all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)";
 
  return {
    wrapper: cn(
      "relative inline-flex transform-gpu p-[1.25px] will-change-transform transition-all duration-300",
      colors.outer,
      roundnessClass,
    ),
    wrapperStyle: {
      transform: isPressed
        ? "translateY(3px) scale(0.98) rotateX(2deg)"
        : isHovered && !isTouchDevice
        ? "translateY(-1px) scale(1.02) rotateX(-1deg)"
        : "translateY(0) scale(1) rotateX(0deg)",
      boxShadow: isPressed
        ? "0 1px 3px rgba(0, 0, 0, 0.2), 0 0 8px rgba(0, 0, 0, 0.1)"
        : isHovered && !isTouchDevice
          ? "0 8px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)"
          : "0 4px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.05)",
      transition: transitionStyle,
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
    },
    inner: cn(
      "absolute inset-[1px] transform-gpu will-change-transform transition-all duration-300",
      colors.inner,
      roundnessClass === "rounded-none" ? "rounded-none" : 
      roundnessClass === "rounded-sm" ? "rounded-sm" :
      roundnessClass === "rounded-md" ? "rounded-lg" :
      roundnessClass === "rounded-lg" ? "rounded-lg" :
      roundnessClass === "rounded-xl" ? "rounded-xl" :
      "rounded-full",
    ),
    innerStyle: {
      transition: transitionStyle,
      transformOrigin: "center center",
      filter: isHovered && !isPressed && !isTouchDevice 
        ? "brightness(1.1) contrast(1.05)" 
        : isPressed 
        ? "brightness(0.95) contrast(1.1)"
        : "brightness(1) contrast(1)",
      transform: isPressed 
        ? "scale(0.98)" 
        : isHovered && !isTouchDevice
        ? "scale(1.01)"
        : "scale(1)",
    },
    button: cn(
      "relative z-10 m-[1px] inline-flex h-11 transform-gpu cursor-pointer items-center justify-center overflow-hidden px-6 py-2 text-sm leading-none font-semibold will-change-transform outline-none transition-all duration-300",
      colors.button,
      colors.textColor,
      colors.textShadow,
      roundnessClass === "rounded-none" ? "rounded-none" : 
      roundnessClass === "rounded-sm" ? "rounded-sm" :
      roundnessClass === "rounded-md" ? "rounded-md" :
      roundnessClass === "rounded-lg" ? "rounded-lg" :
      roundnessClass === "rounded-xl" ? "rounded-xl" :
      "rounded-full",
    ),
    buttonStyle: {
      transform: isPressed 
        ? "scale(0.96) translateY(1px)" 
        : isHovered && !isTouchDevice
        ? "scale(1.01) translateY(-0.5px)"
        : "scale(1) translateY(0px)",
      transition: transitionStyle,
      transformOrigin: "center center",
      filter: isHovered && !isPressed && !isTouchDevice 
        ? "brightness(1.05) saturate(1.1)" 
        : isPressed
        ? "brightness(0.9) saturate(1.2)"
        : "brightness(1) saturate(1)",
    },
  };
};
 
const ShineEffect = ({ isPressed, isHovered, roundness }: { isPressed: boolean; isHovered: boolean; roundness: RoundnessVariant }) => {
  const roundnessClass = roundnessClasses[roundness];
  
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden transition-all duration-500 ease-out",
        roundnessClass,
        isPressed ? "opacity-40 scale-110" : isHovered ? "opacity-30 scale-105" : "opacity-0 scale-100",
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-r from-transparent via-neutral-100 to-transparent animate-pulse", roundnessClass)} />
      <div className={cn("absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent", roundnessClass)} />
    </div>
  );
};
 
export const MetalButton = React.forwardRef<
  HTMLButtonElement,
  MetalButtonProps
>(({ children, className, variant = "default", roundness = "md", ...props }, ref) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
 
  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
 
  const buttonText = children || "Button";
  const variants = metalButtonVariants(
    variant,
    roundness,
    isPressed,
    isHovered,
    isTouchDevice,
  );
 
  const handleInternalMouseDown = () => {
    setIsPressed(true);
  };
  const handleInternalMouseUp = () => {
    setIsPressed(false);
  };
  const handleInternalMouseLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
  };
  const handleInternalMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
    }
  };
  const handleInternalTouchStart = () => {
    setIsPressed(true);
  };
  const handleInternalTouchEnd = () => {
    setIsPressed(false);
  };
  const handleInternalTouchCancel = () => {
    setIsPressed(false);
  };
 
  return (
    <div className={variants.wrapper} style ={{...variants.wrapperStyle, transformStyle: "preserve-3d"}}>
      <div className={variants.inner} style={variants.innerStyle}></div>
      <button
        ref={ref}
        className={cn(variants.button, className)}
        style={variants.buttonStyle}
        {...props}
        onMouseDown={handleInternalMouseDown}
        onMouseUp={handleInternalMouseUp}
        onMouseLeave={handleInternalMouseLeave}
        onMouseEnter={handleInternalMouseEnter}
        onTouchStart={handleInternalTouchStart}
        onTouchEnd={handleInternalTouchEnd}
        onTouchCancel={handleInternalTouchCancel}
      >
        <ShineEffect isPressed={isPressed} isHovered={isHovered} roundness={roundness} />
        <span className="relative z-30 transition-all duration-300">{buttonText}</span>
        {isHovered && !isPressed && !isTouchDevice && (
          <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent to-white/10 transition-opacity duration-300 animate-pulse", roundnessClasses[roundness])} />
        )}
      </button>
    </div>
  );
});
 
MetalButton.displayName = "MetalButton";