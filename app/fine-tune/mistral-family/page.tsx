"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";
import Image from "next/image";
import { LiquidDropdown } from '@/components/ui/liquid-dropdown';
import { LiquidInput } from '@/components/ui/liquid-glass-input';
import { SearchIcon } from "lucide-react";
import { StarsBackground } from '@/components/ui/stars';
import DatasetsList from '@/components/ui/datasets-list';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function FineTunePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [isStarting, setIsStarting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDatasetSelect = (dataset: any) => {
    setSelectedDataset(dataset);
    setSearchQuery("");
  };

  const handleFineTune = async () => {
    if (!selectedModel || !selectedDataset) {
      alert("Please select both a model and a dataset");
      return;
    }

    setIsStarting(true);

    try {
      // Extract dataset ID from HuggingFace link
      const datasetId = selectedDataset.hf_link.split('/').slice(-2).join('/');
      
      const response = await fetch('http://localhost:8000/api/start-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: selectedModel,
          dataset_id: datasetId,
          dataset_name: selectedDataset.name,
          model_name: getModelName(selectedModel)
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText}\nResponse: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.job_id) {
        console.log('Redirecting to:', `/training/${data.job_id}`);
        // Don't set isStarting to false here - let the redirect happen
        
        // Try multiple redirect methods
        setTimeout(() => {
          console.log('Attempting router.push...');
          router.push(`/training/${data.job_id}`);
        }, 100);
        
        // Fallback after 2 seconds
        setTimeout(() => {
          console.log('Fallback redirect with window.location...');
          window.location.href = `/training/${data.job_id}`;
        }, 2000);
        
      } else {
        console.error('API response missing job_id:', data);
        throw new Error(`No job ID received. API Response: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Error starting training:', error);
      alert('Failed to start training. Please make sure the API server is running.');
      setIsStarting(false);
    }
  };

  const getModelName = (modelValue: string) => {
    const models: { [key: string]: string } = {
      "mistral-instruct-7b": "Mistral Instruct (7B)",
      "mistral-small-24b": "Mistral Small (24B)",
      "mistral-codestral-22b": "Mistral Codestral (22B)",
      "mistral-devstral-22b": "Mistral Devstral Small (22B)",
    };
    return models[modelValue] || modelValue;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="bg-black relative overflow-hidden h-250">
      <StarsBackground className="absolute inset-0 z-0 opacity-50" />

      <div className="absolute top-0 left-0 w-full h-full rotate-180 mt-20 transform skew-x-2 skew-y-1 scale-105">
        <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#ffae00] via-[#000000] to-transparent blur-3xl" 
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
        <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ffc400] via-amber-50/4 to-transparent blur-[80px] rounded-full"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
        <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ff8800] via-transparent to-transparent blur-[500px] rounded-full -z-10"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
      </div>
      
      <Header />
    
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-5xl font-light px-4 py-2 rounded-full bg-gradient-to-r from-[#ffc400] to-[#ff6f00] bg-clip-text text-transparent -mb-4 -mt-25 z-20">
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
              items={[
                { label: "Mistral Instruct (7B)", value: "mistral-instruct-7b" },
                { label: "Mistral Small (24B)", value: "mistral-small-24b" },
                { label: "Mistral Codestral (22B)", value: "mistral-codestral-22b" },
                { label: "Mistral Devstral Small (22B)", value: "mistral-devstral-22b" },
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
              
              <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
                <DatasetsList 
                  searchQuery={searchQuery}
                  modelFamily="mistral"
                  onDatasetSelect={handleDatasetSelect}
                  selectedDataset={selectedDataset}
                />
              </div>
            </div>
          </div>

          {/* Selected Dataset Display */}
          {selectedDataset && (
            <div className="mt-4 p-4 bg-black/5 backdrop-blur-xl rounded-lg border border-white/20 w-full max-w-2xl -z-1"
            style={{
              boxShadow: "0 30px 100px 0 rgba(0, 0, 0, 0.5)"
            }}>
              <p className="text-white/60 text-sm">Selected Dataset:</p>
              <p className="text-white font-medium">{selectedDataset.name}</p>
              <p className="text-white/40 text-xs mt-1">{selectedDataset.description}</p>
            </div>
          )}

          {/* Fine Tune Button */}
          <LiquidButton
            className="mt-6 px-8 py-3"
            size="xl"
            onClick={handleFineTune}
            disabled={!selectedModel || !selectedDataset || isStarting}
            style={{
              background: selectedModel && selectedDataset 
                ? "linear-gradient(135deg, #ff6f00 0%, #ffc400 100%)"
                : "linear-gradient(135deg, #333 0%, #555 100%)",
              color: selectedModel && selectedDataset ? "black" : "white",
              opacity: selectedModel && selectedDataset && !isStarting ? 1 : 0.5,
              cursor: selectedModel && selectedDataset && !isStarting ? "pointer" : "not-allowed",
              border: selectedModel && selectedDataset ? "0 30px 100px 0 rgba(0, 0, 0, 0.8)" : "0 30px 100px 0 rgba(0, 0, 0, 0.8)",
            }}
          >
            {isStarting ? "Starting..." : "Start Fine-Tuning"}
          </LiquidButton>
        </div>
      </div>
    </div>
  );
}