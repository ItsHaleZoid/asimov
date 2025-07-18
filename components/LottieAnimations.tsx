"use client"
import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieAnimation = ({
  animationPath,
  className = "",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) => {
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(animationPath);
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.status}`);
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (err) {
        console.error("Error loading Lottie animation:", err);
        setError(err instanceof Error ? err.message : "Failed to load animation");
      }
    };

    loadAnimation();
  }, [animationPath]);

  if (error) {
    return (
      <div className={className}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          width: "100%", 
          height: "100%",
          color: "#999"
        }}>
          Animation failed to load
        </div>
      </div>
    );
  }

  if (!animationData) {
    return (
      <div className={className}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          width: "100%", 
          height: "100%",
          color: "#999"
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
      />
    </div>
  );
};

export default LottieAnimation;
