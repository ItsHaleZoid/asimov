"use client";
import { Gabarito } from 'next/font/google'
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

const gabarito = Gabarito({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

interface PricingCardProps {
  title: string;
  price: string;
  details: string;
  period?: string;
  features: string[];
  buttonText?: string;
  onButtonClick?: () => void;
  popular?: boolean;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
  greenFeatures?: string[];
}

const sizeMap = {
  sm: 'w-80 min-h-80',
  md: 'w-96 min-h-96',
  lg: 'w-[60rem] min-h-[28rem]'
};

const PricingCard: React.FC<PricingCardProps> = ({ 
  title,
  price,
  details,
  period = '/month',
  features,
  buttonText = 'Get Started',
  onButtonClick,
  popular = false,
  className = '', 
  glowColor = popular ? 'purple' : 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  greenFeatures = []
}) => {
  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ''; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles: any = {};

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  return (
    <div
      style={getInlineStyles()}
      className={cn(
        getSizeClasses(),
        "rounded-2xl relative shadow-2xl p-8 backdrop-blur-sm",
        "flex flex-col transition-all duration-300 group",
        "bg-black",
        "border border-white/20",
        className
      )}
    >
      {/* Glowing Effect */}
    
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            ⭐ Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-left mb-8 relative z-10 flex-shrink-0">
        <h3 className={`${gabarito.className} text-md font-light text-white mb-4 group-hover:text-gray-100 transition-colors uppercase`}>
          {title}
        </h3>
        <div className="flex items-baseline justify-left mb-2">
          <span className={`${gabarito.className} text-5xl text-white`}>
            {price}
          </span>     
          <span className={`${gabarito.className} text-gray-400 ml-2 text-sm mb-2`}>{period}</span>
        </div>
        <span className={`${gabarito.className} text-gray-400 text-sm`}>{details}</span>
        {/* Animated Divider */}
        <div className="relative my-6 overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-white/0 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 h-px">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_4s_ease-in-out_infinite] -translate-x-full"></div>
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { 
              transform: translateX(-100%); 
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% { 
              transform: translateX(100%); 
              opacity: 0;
            }
          }
        `}</style>
      </div>
      

      {/* Features */}
      <div className="flex-1 mb-8 relative z-10">
        <ul className="space-y-4">
          {features.map((feature, index) => {
            const isGreenFeature = greenFeatures.includes(feature);
            return (
              <li key={index} className={`flex items-start transition-colors ${
                isGreenFeature 
                  ? 'text-green-500 drop-shadow-[0_0px_30px_rgba(34,192,94,0.9)]' 
                  : 'text-gray-300 group-hover:text-gray-200'
              }`}>
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <span className="text-base leading-relaxed">{feature}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Button */}
      <div className="relative z-10 flex-shrink-0">
        <button
          onClick={onButtonClick}
          className={`
            w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 
            transform hover:scale-105 hover:shadow-lg active:scale-95
            relative overflow-hidden group/btn
           
              bg-gradient-to-r from-gray-300 to-white text-gray-900 hover:from-white hover:to-gray-50 shadow-lg'
          
          `}
        >
          <span className="relative z-10">{buttonText}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
        </button>
      </div>
    </div>
  );
};

// Keep the original GlowCard for backward compatibility
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const getSizeClasses = () => {
    if (customSize) {
      return '';
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles: any = {};

    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  return (
    <div
      style={getInlineStyles()}
      className={cn(
        getSizeClasses(),
        !customSize && 'aspect-[3/4]',
        "rounded-2xl relative grid grid-rows-[1fr_auto] shadow-2xl",
        "p-6 gap-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]",
        "bg-gradient-to-b from-gray-900/90 via-black/95 to-black/98",
        "border border-white/10",
        className
      )}
    >
      {/* Glowing Effect */}
    </div>
  );
};

export { GlowCard, PricingCard }