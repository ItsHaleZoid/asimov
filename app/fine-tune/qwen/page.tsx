"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";
import Image from "next/image";
import { LiquidDropdown } from '@/components/ui/liquid-dropdown';
import { LiquidInput } from '@/components/ui/liquid-glass-input';
import { SearchIcon } from "lucide-react";
import DatasetsList from '@/components/ui/datasets-list';
import { withSubscriptionGuard } from '@/lib/hoc/withSubscriptionGuard';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Readex_Pro } from 'next/font/google';
import { BlurFade } from "@/components/ui/blur-fade";

const readexPro = Readex_Pro({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

function FineTunePage() {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<{ id: string; name: string; thinking_name: string | null; description: string; subsets: string[]; hf_link: string; category: string } | null>(null);
  const [selectedSubset, setSelectedSubset] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [filteredDatasets, setFilteredDatasets] = useState<{ id: string; name: string; thinking_name: string | null; description: string; subsets: string[]; hf_link: string; category: string }[]>([]);
  const [hasRunningJob, setHasRunningJob] = useState(false);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const [loadingJobStatus, setLoadingJobStatus] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Check for running jobs
  useEffect(() => {
    const checkRunningJobs = async () => {
      if (!user) {
        setLoadingJobStatus(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setLoadingJobStatus(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const activeJob = data.jobs?.find((job: any) => 
            ['initializing', 'preparing', 'searching_gpu', 'found_gpu', 'creating_instance', 
             'instance_ready', 'uploading_script', 'loading_model', 'loading_dataset', 
             'training', 'saving', 'uploading_model'].includes(job.status)
          );

          if (activeJob) {
            setHasRunningJob(true);
            setRunningJobId(activeJob.id);
          } else {
            setHasRunningJob(false);
            setRunningJobId(null);
          }
        }
      } catch (error) {
        console.error('Error checking running jobs:', error);
      } finally {
        setLoadingJobStatus(false);
      }
    };

    checkRunningJobs();
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  const handleDatasetSelect = (dataset: { id: string; name: string; thinking_name: string | null; description: string; subsets: string[]; hf_link: string; category: string }) => {
    setSelectedDataset(dataset);
    setSelectedSubset(dataset.subsets?.[0] || ""); // Auto-select first subset
    setSearchQuery("");
  };

  const handleFineTune = async () => {
    if (!selectedModel || !selectedDataset || !selectedSubset) {
      alert("Please select model, dataset, and subset");
      return;
    }

    if (!user) {
      alert("Please sign in to start training");
      router.push('/signin');
      return;
    }

    // Allow multiple concurrent jobs - removed restriction
    // if (hasRunningJob) {
    //   alert("You already have a running job. Please wait for it to complete before starting a new one.");
    //   if (runningJobId) {
    //     router.push(`/training/${runningJobId}`);
    //   }
    //   return;
    // }

    setIsStarting(true);

    try {
      // Get authentication headers
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      // Extract dataset ID from HuggingFace link
      const datasetId = selectedDataset.hf_link.split('/').slice(-2).join('/');
      const thinking_name = selectedDataset.thinking_name;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/start-training`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          model_id: selectedModel,
          dataset_id: datasetId,
          dataset_name: selectedDataset.name,
          dataset_subset: selectedSubset,
          model_name: (selectedModel),
          thinking_dataset: thinking_name || "bespokelabs/bespoke-manim",
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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className={`${readexPro.className} bg-black relative overflow-hidden h-250`}>
      

      <div className="absolute top-0 left-0 w-full h-full rotate-180 mt-20 transform skew-x-2 skew-y-1 scale-105">
        <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#c574ff] via-[#000000] to-transparent blur-3xl" 
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
        <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#e0cae8] via-amber-50/4 to-transparent blur-[80px] rounded-full"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
        <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#7b25fc] via-transparent to-transparent blur-[500px] rounded-full -z-10"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
      </div>
      
      <Header />
    
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="flex flex-col items-center justify-center mt-40">
          <BlurFade delay={0} className="-mb-12">
            <h1 className="text-5xl font-light px-4 py-2 rounded-full bg-gradient-to-r from-[rgb(254,254,255)] to-[#b68efa] bg-clip-text text-transparent -mb-4 -mt-25 z-20">
              Fine-Tune Qwen Models
            </h1>
          </BlurFade>
          <BlurFade delay={0.1} className="-mb-12">
          <div className="flex flex-row items-center justify-center relative w-full z-10 mt-6">
            <p className="text-xl -mt-1 mr-2">By</p>
          <Image src="/qwen.png" alt="Qwen" width={40} height={40} className="brightness-0 invert opacity-80" />
          </div>
          </BlurFade>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4 mt-25 relative">
        <BlurFade delay={0.2} >
          <p className="text-white text-2xl font-light opacity-80 mb-2">
            Select a model and search for datasets to begin fine-tuning
          </p>
          </BlurFade>
          <BlurFade delay={0.3} className="w-full z-10">
          <div className="flex flex-row items-center justify-center gap-2 relative w-full z-10">
            <LiquidDropdown
              placeholder="Select a model"
              items={[
                { label: "Qwen 4B Thinking", value: "Qwen/Qwen3-4B-Thinking-2507" },
                { label: "Qwen 30B Thinking", value: "Qwen/Qwen3-30B-A3B-Thinking-2507" },
                { label: "Qwen 235B Thinking (FP8)", value: "Qwen/Qwen3-235B-A22B-Thinking-2507-FP8" },
              ]}
              value={selectedModel}
              onChange={setSelectedModel}
            />
            {selectedDataset && selectedDataset.subsets && selectedDataset.subsets.length > 1 && (
              <LiquidDropdown
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
                  modelFamily="mistral"
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
          </BlurFade>

          {/* Running Job Warning */}
          {hasRunningJob && !loadingJobStatus && (
            <BlurFade delay={0.35}>
            <div className="mt-4 p-4 bg-orange-500/10 backdrop-blur-xl rounded-lg border border-orange-500/30 w-full max-w-2xl"
              style={{
                boxShadow: "0 30px 100px 0 rgba(251, 146, 60, 0.3)"
              }}>
              <p className="text-orange-300 text-sm font-medium">⚠️ Job Already Running</p>
              <p className="text-orange-200/80 text-xs mt-1">
                You already have a training job in progress. Please wait for it to complete before starting a new one.
              </p>
              {runningJobId && (
                <button
                  onClick={() => router.push(`/training/${runningJobId}`)}
                  className="mt-2 text-orange-300 text-xs underline hover:text-orange-200 transition-colors"
                >
                  View Running Job →
                </button>
              )}
            </div>
            </BlurFade>
          )}

          {/* Fine Tune Button */}
          <BlurFade delay={0.4}>
          <LiquidButton
            className="mt-6 px-8 py-3"
            size="xl"
            onClick={handleFineTune}
            disabled={!selectedModel || !selectedDataset || !selectedSubset || isStarting || loadingJobStatus}
            style={{
              background: selectedModel && selectedDataset && selectedSubset
                ? "linear-gradient(135deg, #6f03fc 0%, #a927f0 100%)"
                : "linear-gradient(135deg, #333 0%, #555 100%)",
              color: "white",
              opacity: selectedModel && selectedDataset && selectedSubset && !isStarting && !loadingJobStatus ? 1 : 0.5,
              cursor: selectedModel && selectedDataset && selectedSubset && !isStarting && !loadingJobStatus ? "pointer" : "not-allowed",
              border: "0 30px 100px 0 rgba(0, 0, 0, 0.8)",
            }}
          >
            {loadingJobStatus ? "Checking..." : 
             isStarting ? "Starting..." : "Start Fine-Tuning"}
          </LiquidButton>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

export default withSubscriptionGuard(FineTunePage, {
  loadingMessage: "Loading Qwen Models..."
});