"use client"
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { LiquidDropdown } from '@/components/ui/liquid-dropdown';
import { LiquidInput } from '@/components/ui/liquid-glass-input';
import { SearchIcon } from "lucide-react";
import LightRays from '@/components/ui/LightRays';
import { BlurFade } from '@/components/ui/blur-fade';
import { StarsBackground } from '@/components/ui/stars';
import DatasetsList from '@/components/ui/datasets-list';




export default function FineTunePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDatasetSelect = (dataset: any) => {
    console.log("Selected dataset:", dataset);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Focus input on any printable character key press
      if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        inputRef.current?.focus();
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    
    <div className="bg-black relative overflow-hidden overflow-x-hidden h-250">
      <StarsBackground className="absolute inset-0 -z-0 opacity-50" />

      <div className="absolute top-0 left-0 w-full h-full rotate-180 mt-20 transform skew-x-2 skew-y-1 scale-105">
        <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#ffae00] via-[#000000] to-transparent blur-3xl" 
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
        <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ffc400] via-amber-50/4 to-transparent blur-[80px] rounded-full"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
        <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ff8800] via-transparent to-transparent blur-[500px] rounded-full -z-10"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
      </div>
      
      <Header />
    
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center mt-20">
            
            <h1 className="text-5xl font-light px-4 py-2 rounded-full bg-gradient-to-r from-[#ffc400] to-[#ff6f00] bg-clip-text text-transparent -mb-4 -mt-25 z-20"
                
            >
              Fine-Tune Mistral Family Models
            </h1>
          
          
         <Image src="/mistral-wordmark-logo.png" alt="Mistral" width={180} height={20} className="brightness-0 invert opacity-80" />
         
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4 mt-25 relative">
          <p className="text-white text-2xl font-light opacity-80 mb-2">
            Select a model and search for datasets to begin fine-tuning
          </p>
          
          <div className="flex flex-row items-center justify-center gap-2 relative w-full">
            <LiquidDropdown
              placeholder="Select a model"
              items={[ { label: "Mistral Instruct (7B)", value: "model1" },
                { label: "Mistral Small (24B)", value: "model2" },
                { label: "Mistral Codestral (22B)", value: "model3" },
                { label: "Mistral Devstral Small (22B)", value: "model4" },
               
              ]}
              value={selectedModel}
              onChange={setSelectedModel}
            />
            <div className="relative flex-1 w-full">
              <LiquidInput
                ref={inputRef}
                placeholder="Search for Datasets"
                value={searchQuery}
                className="w-full h-12"
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<SearchIcon className="w-4 h-4 ml-1" />}
              />
              
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <DatasetsList 
                  searchQuery={searchQuery}
                  modelFamily="mistral"
                  onDatasetSelect={handleDatasetSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}