"use client"
import React, { useState, useEffect } from 'react';
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidDropdown } from './ui/liquid-dropdown';
import { IoMdArrowDropright } from "react-icons/io";
import { Space_Grotesk } from 'next/font/google';
import { BlurFade } from './ui/blur-fade';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';


const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});



export default function Hero() {
  const [selectedModel, setSelectedModel] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    // No-op effect placeholder
  }, []);

  const handleFineTuneClick = () => {
    switch (selectedModel) {
      case "mistral-family":
        router.push('/fine-tune/mistral-family');
        break;
      case "gemma-family":
        router.push('/fine-tune/gemma-family');
        break;
      case "gpt-oss":
        router.push('/fine-tune/gpt-oss');
        break;
      case "qwen":
        router.push('/fine-tune/qwen');
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Top lighting effects - subtle warm glow */}
      <div className="absolute top-0 left-0 w-full h-full rotate-180 mt-38">
        <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#451cff] via-[#000000] to-transparent blur-3xl" 
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
        <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ac99ff] via-amber-50/4 to-transparent blur-[80px] rounded-full"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
        <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#2c00c7] via-transparent to-transparent blur-[500px] rounded-full -z-10"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen px-8 max-w-6xl mx-auto">
        

        
        {/* Main Heading */}
        <BlurFade duration={0.6} > 
        <div className={`${spaceGrotesk.className} text-gray-300 text-sm mb-2 tracking-wider font-light opacity-90`}>
          [ ASIMOV AI ]
        </div> 
        </BlurFade>
        <BlurFade delay={0.4} duration={0.6} > 
        <h1 className="text-6xl lg:text-7xl bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent font-light leading-tight mb-4">
          Run customized AI models <br />
        </h1>
        </BlurFade>
        <BlurFade delay={0.8} duration={0.6} > 
        <div className="flex flex-row gap-4">
        <LiquidDropdown
          placeholder="Select Model"
          className={`${spaceGrotesk.className} font-medium transition-all duration-200 hover:shadow-lg text-xs`}
          size="xl"
         
          rounded="default"
          variant="destructive"
          items={[
            { label: "Qwen Models", value: "qwen" },
            { label: "Gemma Models", value: "gemma-family" },
            { label: "GPT-OSS Models", value: "gpt-oss" },
            
          ]}
          value={selectedModel}
          onChange={setSelectedModel}
        />

        {user ? (
        <LiquidButton
          className={`${spaceGrotesk.className} font-medium transition-all duration-200 hover:scale-95 hover:shadow-lg text-xs`}
          size="xl"
          rounded="none"
          variant="destructive"
          onClick={handleFineTuneClick}
          style={{
            background: "linear-gradient(135deg, #000dff 0%, #6600ff 100%)",
            color: "white",
            
          }}
         
        >
          <div className="flex flex-row items-center gap-1">
         Fine Tune <IoMdArrowDropright className="w-4 h-4" />
         </div>
          
        </LiquidButton>
        ) : (
          <LiquidButton
          className={`${spaceGrotesk.className} font-medium transition-all duration-200 hover:scale-95 hover:shadow-lg text-xs`}
          size="xl"
          rounded="none"
          variant="destructive"
          onClick={() => router.push('/get-started')}
          style={{
            background: "linear-gradient(135deg, #000dff 0%, #6600ff 100%)",
            color: "white",
            
          }}
         
        >
            Fine Tune
          </LiquidButton>
        )}
        </div>
        </BlurFade>
      </div>
      
      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 w-full px-8 pb-12">
        <div className="max-w-6xl mx-auto flex items-end justify-between">
          {/* Scroll Indicator */}
          
          {/* Mission Text */}
          
        </div>
      </div>
    </div>
  );
}
