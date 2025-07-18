"use client";

import Image from "next/image";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface ModelBoxProps {
  modelName?: string;
  modelCompany?: string;
  modelImage?: string;
  companyLogo?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
  modelImageClass?: string;
  modelImageSize?: number;
  companyLogoSize?: number;
  gradientFill?: string;
  companyLogoClass?: string;
  modelNameClass?: string;
}

export default function ModelBox({
  modelName,
  modelCompany,
  modelImage,
  companyLogo,
  buttonText,
  onButtonClick,
  className,
  modelImageSize = 400,
  companyLogoSize = 75,
  modelImageClass = "",
  gradientFill,
  companyLogoClass,
  modelNameClass = ""
}: ModelBoxProps) {
  return (
    <div className={`relative overflow-hidden shadow-xl hover:border-white/30 border border-white/20 aspect-[4/3] w-full max-w-sm p-6 hover:bg-gradient-to-b hover:from-black hover:to-[#171717] transition duration-300 ${className}`}>
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div className="absolute top-0 left-0 w-1 h-1 bg-white z-10"></div>
      <div className="absolute top-0 right-0 w-1 h-1 bg-white z-10"></div>
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-white z-10"></div>
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-white z-10"></div>
      
      {/* Corner boxes */}
     
      <div className="flex flex-col h-full">
        {/* Model Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center flex-col gap-3">
            <div className="relative">
              <Image 
                src={modelImage || ""} 
                alt={`${modelName} model`} 
                width={modelImageSize} 
                height={modelImageSize} 
                className={`filter ${modelNameClass}  ${modelImageClass}`} 
              />
              {gradientFill && (
                <div 
                  className={`absolute inset-0 ${gradientFill}`}
                  style={{ 
                    maskImage: `url(${modelImage})`,
                    WebkitMaskImage: `url(${modelImage})`,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center'
                  }}
                />
              )}
            </div>
            <span className={`bg-gradient-to-t from-white to-[#b3b3b3] bg-clip-text text-transparent text-2xl flex items-center gap-2 ${modelNameClass}`}>
              {modelName} by 
              <Image 
                src={companyLogo || ""} 
                
                alt={`${modelCompany} logo`} 
                width={companyLogoSize} 
                height={companyLogoSize} 
                className={`grayscale ${companyLogoClass} brightness-180 saturate-100`} 
              />
            </span>
          </div>
        </div>

        {/* Select Model Button */}
       
      </div>
    </div>
  )
}