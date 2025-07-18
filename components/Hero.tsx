import React, { useState, useEffect } from 'react';
import { ChevronDown, Mail, Search } from 'lucide-react';
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidDropdown } from './ui/liquid-dropdown';
import { LiquidInput } from './ui/liquid-glass-input';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {/* Top lighting effects - subtle warm glow */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#451cff] via-[#000000] to-transparent blur-3xl" 
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
        <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ac99ff] via-amber-50/4 to-transparent blur-[80px] rounded-full"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
        <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#2c00c7] via-transparent to-transparent blur-[500px] rounded-full -z-10"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-start justify-center min-h-screen px-8 max-w-6xl mx-auto">
        {/* Purpose Label */}
        <div className={`${spaceGrotesk.className} text-gray-400 text-sm mb-8 tracking-wider font-light`}>
          [ BUILD THE FUTURE ]
        </div>
        
        {/* Main Heading */}
        <h1 className="text-6xl lg:text-7xl bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent font-light leading-tight mb-12">
          Run your own AI Models<br />
          <span className="">on your own Compute.</span>
        </h1>
        
        {/* CTA Button */}
        <div className="flex flex-row gap-4">
          <LiquidDropdown
            variant="default" 
            rounded="full"            
            items={[{label: "NVIDIA A100", value: "NVIDIA A100"}]}
            placeholder="SELECT A GPU"
            
            onChange={() => {}}
            className="rounded-full font-medium transition-all duration-200 hover:scale-100 hover:shadow-lg"
            size="xl"
          />

          <LiquidInput
            variant="default"
            size="xl"
            placeholder="Search for an model"
            className="w-full"
            icon={<Search className="w-4 h-4 text-white" />}
          />
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 w-full px-8 pb-12">
        <div className="max-w-6xl mx-auto flex items-end justify-between">
          {/* Scroll Indicator */}
          <div className="flex flex-col items-center">
            <ChevronDown className="w-5 h-5 text-gray-400 animate-bounce" />
          </div>
          
          {/* Mission Text */}
          <div className="max-w-2xl text-gray-400 text-sm leading-relaxed">
           Run and fine-tune open-source AI models with compute with any code or technical skills. You can select the models and compute from a range of GPUs and models or import your own..
          </div>
        </div>
      </div>
    </div>
  );
}