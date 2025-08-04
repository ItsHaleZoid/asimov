"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";
import Image from "next/image";
import { LiquidDropdown } from '@/components/ui/liquid-dropdown';
import { LiquidInput } from '@/components/ui/liquid-glass-input';
import { SearchIcon } from "lucide-react";
import LightRays from '@/components/ui/LightRays';
import { BlurFade } from '@/components/ui/blur-fade';
import { StarsBackground } from '@/components/ui/stars';
import DatasetsList from '@/components/ui/datasets-list';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import Spline from '@splinetool/react-spline';




export default function FineTunePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [selectedSubset, setSelectedSubset] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [filteredDatasets, setFilteredDatasets] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDatasetSelect = (dataset: any) => {
    setSelectedDataset(dataset);
    setSelectedSubset(dataset.subsets?.[0] || ""); // Auto-select first subset
    setSearchQuery("");
  };

  const handleFineTune = async () => {
    if (!selectedModel || !selectedDataset || !selectedSubset) {
      alert("Please select model, dataset, and subset");
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
          dataset_subset: selectedSubset,
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
        
        // Immediate redirect - more reliable
        try {
          router.push(`/training/${data.job_id}`);
        } catch (routerError) {
          console.warn('Router.push failed, using window.location:', routerError);
          window.location.href = `/training/${data.job_id}`;
        }
        
      } else {
        console.error('API response missing job_id:', data);
        throw new Error(`No job ID received. API Response: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Error starting training:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to start training. ';
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('fetch')) {
        errorMessage += 'Could not connect to API server. Make sure it is running on port 8000.';
      } else if (errorMsg.includes('job_id')) {
        errorMessage += 'Server started the job but did not return a job ID.';
      } else {
        errorMessage += `Error: ${errorMsg}`;
      }
      
      alert(errorMessage);
      setIsStarting(false);
    }
  };

  const getModelName = (modelValue: string) => {
    const models: { [key: string]: string } = {
      "gemma-2b": "Gemma 2B",
      "gemma-7b": "Gemma 7B",
    };
    return models[modelValue] || modelValue;
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
  
    
    <div className="bg-black relative overflow-hidden h-250">
        
       
      <div className="absolute top-0 left-0 w-full h-full rotate-180 mt-20 transform skew-x-2 skew-y-1 scale-105">
        <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#1702ff] via-[#000000] to-transparent blur-3xl" 
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
        <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#009dff] via-amber-50/4 to-transparent blur-[80px] rounded-full"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
        <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#0800ff] via-transparent to-transparent blur-[500px] rounded-full -z-10"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
      </div>
      
      <Header />
    
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="flex flex-col items-center justify-center mt-20">
            
            <h1 className="text-5xl font-light px-4 py-2 rounded-full bg-gradient-to-r from-[#00e1ff] to-[#006aff] bg-clip-text text-transparent -mb-4 -mt-25 z-20"
                
            >
              Fine-Tune Gemma Family Models
            </h1>
          
          
         <Image src="/google.png" alt="Google" width={100} height={20} className="brightness-0 invert opacity-70 mt-6" />
         
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4 mt-25 relative">
          <p className="text-white text-2xl font-light opacity-80 mb-2">
            Select a model and search for datasets to begin fine-tuning
          </p>
          
          <div className="flex flex-row items-center justify-center gap-2 relative w-full z-10">
            <LiquidDropdown
              placeholder="Select a model"
              items={[
                { label: "Gemma 3 Instruction Tuning 1B", value: "google/gemma-3-1b-it" },
                { label: "Gemma 3 Instruction Tuning 4B", value: "google/gemma-3-4b-it" },
                { label: "Gemma 3 Instruction Tuning 12B", value: "google/gemma-3-12b-it" },
                { label: "Gemma 3 Instruction Tuning 27B", value: "google/gemma-3-27b-it" },
                { label: "GPT 2", value: "gpt2" },
              ]}
              value={selectedModel}
              onChange={setSelectedModel}
            />
            {selectedDataset && selectedDataset.subsets && selectedDataset.subsets.length > 1 && (
              <LiquidDropdown
                className="w-full "
                placeholder="Dataset subset"
                items={selectedDataset.subsets.map((subset: string) => ({
                  label: subset.charAt(0).toUpperCase() + subset.slice(1),
                  value: subset
                }))}
                value={selectedSubset}
                onChange={setSelectedSubset}
              />
            )}
            <div className="relative flex-1 w-full">
              <LiquidInput
                ref={inputRef}
                placeholder="Search for Datasets"
                value={searchQuery}
                className="w-full h-12"
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<SearchIcon className="w-4 h-4 ml-1" />}
                recommendations={filteredDatasets.map(dataset => dataset.name)}
              />
              
              <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
                <DatasetsList 
                  searchQuery={searchQuery}
                  modelFamily="gemma"
                  onDatasetSelect={handleDatasetSelect}
                  selectedDataset={selectedDataset}
                  onFilteredDatasetsChange={setFilteredDatasets}
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
              {selectedSubset && (
                <p className="text-white/60 text-xs mt-1">Subset: <span className="text-white/80">{selectedSubset}</span></p>
              )}
            </div>
          )}

          {/* Fine Tune Button */}
          <LiquidButton
            className="mt-6 px-8 py-3"
            size="xl"
            onClick={handleFineTune}
            disabled={!selectedModel || !selectedDataset || !selectedSubset || isStarting}
            style={{
              background: selectedModel && selectedDataset && selectedSubset 
                ? "linear-gradient(135deg, #006aff 0%, #00e1ff 100%)"
                : "linear-gradient(135deg, #333 0%, #555 100%)",
              color: selectedModel && selectedDataset && selectedSubset ? "black" : "white",
              opacity: selectedModel && selectedDataset && selectedSubset && !isStarting ? 1 : 0.5,
              cursor: selectedModel && selectedDataset && selectedSubset && !isStarting ? "pointer" : "not-allowed",
              border: selectedModel && selectedDataset && selectedSubset ? "0 30px 100px 0 rgba(0, 0, 0, 0.8)" : "0 30px 100px 0 rgba(0, 0, 0, 0.8)",
            }}
          >
            {isStarting ? "Starting..." : "Start Fine-Tuning"}
          </LiquidButton>
        </div>
      </div>
    </div>

  );
}