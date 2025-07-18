"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'frosted' | 'subtle' | 'intense';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'low' | 'medium' | 'high';
  border?: boolean;
  glow?: boolean;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'white';
  interactive?: boolean;
}

const variantStyles = {
  default: 'bg-white/10 dark:bg-white/5',
  frosted: 'bg-white/20 dark:bg-white/10',
  subtle: 'bg-white/5 dark:bg-white/[0.02]',
  intense: 'bg-white/30 dark:bg-white/15'
};

const blurStyles = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
};

const opacityStyles = {
  low: 'bg-opacity-5 dark:bg-opacity-5',
  medium: 'bg-opacity-10 dark:bg-opacity-10',
  high: 'bg-opacity-20 dark:bg-opacity-20'
};

const glowColorStyles = {
  blue: 'shadow-blue-500/20 dark:shadow-blue-400/20',
  purple: 'shadow-purple-500/20 dark:shadow-purple-400/20',
  green: 'shadow-green-500/20 dark:shadow-green-400/20',
  red: 'shadow-red-500/20 dark:shadow-red-400/20',
  orange: 'shadow-orange-500/20 dark:shadow-orange-400/20',
  white: 'shadow-white/20 dark:shadow-white/10'
};

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  white: { base: 0, spread: 0 }
};

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  blur = 'md',
  opacity,
  border = true,
  glow = false,
  glowColor = 'white',
  interactive = false
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, [interactive]);

  const { base, spread } = glowColorMap[glowColor];

  const getInteractiveStyles = () => {
    if (!interactive) return {};

    return {
      '--base': base,
      '--spread': spread,
      '--radius': '12',
      '--border': '1',
      '--backdrop': 'rgba(255, 255, 255, 0.05)',
      '--backup-border': 'rgba(255, 255, 255, 0.1)',
      '--size': '200',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 1) * 1px)',
      '--spotlight-size': 'calc(var(--size, 200) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `
        radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px)
          calc(var(--y, 0) * 1px),
          hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.08)), transparent
        ),
        linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)
      `,
      backgroundColor: 'var(--backdrop)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      backgroundAttachment: 'fixed',
    } as React.CSSProperties & Record<string, any>;
  };

  const beforeAfterStyles = interactive ? `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.4) calc(var(--spotlight-size) * 0.4) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 60) * 1%) / var(--border-spot-opacity, 0.6)), transparent 100%
      );
      filter: brightness(1.2);
    }
    
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.2) calc(var(--spotlight-size) * 0.2) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 0.2)), transparent 100%
      );
    }
    
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 10);
      filter: blur(calc(var(--border-size) * 5));
      background: none;
      pointer-events: none;
      border: none;
    }
    
    [data-glow] > [data-glow]::before {
      inset: -5px;
      border-width: 5px;
    }
  ` : '';

  return (
    <>
      {interactive && <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />}
      <div
        ref={cardRef}
        data-glow={interactive ? '' : undefined}
        style={getInteractiveStyles()}
        className={cn(
          // Base styles
          'relative rounded-lg overflow-hidden',
          // Glass effect (only apply if not interactive)
          !interactive && [
            variantStyles[variant],
            blurStyles[blur],
            // Opacity override if provided
            opacity && opacityStyles[opacity],
          ],
          // Interactive glass effect
          interactive && [
            'backdrop-blur-md',
            'border border-white/10'
          ],
          // Border (only for non-interactive)
          !interactive && border && 'border border-white/20 dark:border-white/10',
          // Glow effect
          glow && [
            'shadow-lg',
            glowColorStyles[glowColor]
          ],
          // Transitions
          'transition-all duration-300 ease-out',
          // Hover effects (only for non-interactive)
          !interactive && [
            'hover:bg-white/15 dark:hover:bg-white/8',
            'hover:border-white/30 dark:hover:border-white/20',
          ],
          glow && 'hover:shadow-xl',
          className
        )}
      >
        {interactive && <div ref={innerRef} data-glow></div>}
        
        {/* Glass noise texture overlay (only for non-interactive) */}
        {!interactive && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 dark:from-white/3 dark:to-black/10 pointer-events-none" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}
