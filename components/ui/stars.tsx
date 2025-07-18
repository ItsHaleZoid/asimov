"use client";

import * as React from "react";
import {
  type HTMLMotionProps,
  motion,
  type SpringOptions,
  type Transition,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

type StarLayerProps = HTMLMotionProps<"div"> & {
  count: number;
  size: number;
  transition: Transition;
  starColor: string;
};

function generateStars(count: number, starColor: string) {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(", ");
}

function StarLayer({
  count = 10000,
  size = 2,
  transition = { repeat: Infinity, duration: 50, ease: "linear" },
  starColor = "#ffffff",
  className,
  ...props
}: StarLayerProps) {
  const [boxShadow, setBoxShadow] = React.useState<string>("");

  React.useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  return (
    <motion.div
      data-slot="star-layer"
      animate={{ y: [0, -2000] }}
      transition={transition}
      className={cn("absolute top-0 left-0 w-full h-[2000px]", className)}
      {...props}
    >
      <div
        className="absolute bg-transparent rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
      <div
        className="absolute bg-transparent rounded-full top-[2000px]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
    </motion.div>
  );
}

type ShootingStarProps = {
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete?: () => void;
};

function ShootingStar({
  delay,
  duration,
  startX,
  startY,
  endX,
  endY,
  onComplete,
}: ShootingStarProps) {
  // Calculate angle for trail orientation (45 degrees from top-left to bottom-right)
  const angle = Math.atan2(endY - startY, endX - startX);
  const trailLength = 100;
  const trailWidth = 0.5;
  
  return (
    <motion.div
      className="absolute"
      initial={{
        x: startX,
        y: startY,
        opacity: 0,
      }}
      animate={{
        x: [startX, endX],
        y: [startY, endY],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
        times: [0, 0.1, 0.9, 1],
      }}
      onAnimationComplete={onComplete}
    >
      {/* Main shooting star - much smaller with minimal glow */}
      <motion.div
        className="absolute w-0.5 h-0.5 bg-white rounded-full"
        style={{
          boxShadow: "0 0 0px #ffffff",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 1, 0] }}
        transition={{
          duration: duration,
          ease: "easeOut",
          times: [0, 0.1, 0.9, 1],
        }}
      />
      
      {/* Trail - thin streaking line */}
      <motion.div
        className="absolute h-0.5 bg-gradient-to-r from-white/60 via-white/40 to-transparent rounded-full -rotate-135"
        style={{
          width: `${trailLength}px`,
          transformOrigin: "left center",
          transform: `rotate(${angle + Math.PI}rad)`,
          left: "0px",
          top: "0px",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: [0, 1, 1, 0], 
          opacity: [0, 0.8, 0.6, 0] 
        }}
        transition={{
          duration: duration * 0.8,
          delay: delay,
          ease: "easeOut",
          times: [0, 0.3, 0.7, 1],
        }}
      />
    </motion.div>
  );
}

function ShootingStarField() {
  const [shootingStars, setShootingStars] = React.useState<Array<{ id: number; props: ShootingStarProps }>>([]);
  const nextId = React.useRef(0);

  const createShootingStar = React.useCallback(() => {
    const id = nextId.current++;
    
    // Always start from top-left area
    const startX = -100 + Math.random() * 200; // Start from left edge with some variation
    const startY = -400 + Math.random() * 400; // Start from top edge with some variation
    
    // Fixed 45-degree angle (top-left to bottom-right)
    const angle = Math.PI / 4; // 45 degrees in radians
    const distance = 400 + Math.random() * 600;
    
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;
    const duration = 0.8 + Math.random() * 1.2;
    const delay = Math.random() * 2.0;

    const props: ShootingStarProps = {
      delay,
      duration,
      startX,
      startY,
      endX,
      endY,
      onComplete: () => {
        setShootingStars(prev => prev.filter(star => star.id !== id));
      },
    };

    setShootingStars(prev => [...prev, { id, props }]);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.6) { // 100% chance every interval
        createShootingStar();
      }
    }, 1000); // Fixed interval - no randomization

    return () => clearInterval(interval);
  }, [createShootingStar]);

  return (
    <>
      {shootingStars.map(({ id, props }) => (
        <ShootingStar key={id} {...props} />
      ))}
    </>
  );
}

type StarsBackgroundProps = React.ComponentProps<"div"> & {
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string;
  showShootingStars?: boolean;
};

export function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = "#9c9c9c",
  showShootingStars = true,
  ...props
}: StarsBackgroundProps) {
  const offsetX = useMotionValue(1);
  const offsetY = useMotionValue(1);

  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const newOffsetX = -(e.clientX - centerX) * factor;
      const newOffsetY = -(e.clientY - centerY) * factor;
      offsetX.set(newOffsetX);
      offsetY.set(newOffsetY);
    },
    [offsetX, offsetY, factor],
  );

  return (
    <div
      data-slot="stars-background"
      className={cn(
        "relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#000000_0%,_#000_100%)]",
        className,
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div style={{ x: springX, y: springY }}>
        <StarLayer
          count={1000}
          size={1}
          transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
          starColor={starColor}
        />
        <StarLayer
          count={400}
          size={1.5}
          transition={{
            repeat: Infinity,
            duration: speed * 2,
            ease: "linear",
          }}
          starColor={starColor}
        />
        <StarLayer
          count={200}
          size={2}
          transition={{
            repeat: Infinity,
            duration: speed * 3,
            ease: "linear",
          }}
          starColor={starColor}
        />
      </motion.div>
      {showShootingStars && <ShootingStarField />}
      
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_transparent_0,_rgba(0,0,0,0.3)_20%,_rgba(0,0,0,0.8)_100%)]"
        style={{ zIndex: 1 }}
      />
      
      {children}
    </div>
  );
}
