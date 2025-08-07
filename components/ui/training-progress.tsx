"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { ChevronDown, ChevronUp, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TrainingProgressProps {
  job: {
    id: string;
    status: string;
    progress: number;
    logs: Array<{ timestamp: string; message: string; type?: string }>;
    model_name: string;
    dataset_name: string;
    start_time: string;
    instance_id?: string;
    config?: {
      lora_model_repo: string;
    };
  };
  onCancel: () => void;
  onBackToModels: () => void;
  enablePolling?: boolean;
  onJobUpdate?: (updatedJob: any) => void;
}

export default function TrainingProgress({ job, onCancel, onBackToModels, enablePolling = false, onJobUpdate }: TrainingProgressProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const router = useRouter();
  useEffect(() => {
    let statusInterval: NodeJS.Timeout | null = null;
    
    if (enablePolling) {
      const fetchJobStatus = async () => {
        try {
          const { getAuthHeaders } = await import('@/lib/utils');
          const headers = await getAuthHeaders();
          const response = await fetch(`http://localhost:8000/api/job/${job.id}`, { headers });
          if (response.ok) {
            const updatedJob = await response.json();
            if (onJobUpdate) {
              onJobUpdate(updatedJob);
            }
          }
        } catch (error) {
          console.error('Failed to fetch job status:', error);
        }
      };

      statusInterval = setInterval(fetchJobStatus, 5000);
    }
    
    const timeInterval = setInterval(() => {
      const start = new Date(job.start_time).getTime();
      const now = new Date().getTime();
      const elapsed = now - start;
      
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => {
      if (statusInterval) clearInterval(statusInterval);
      clearInterval(timeInterval);
    };
  }, [job.id, job.start_time, enablePolling]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initializing':
      case 'preparing':
        return 'text-blue-400';
      case 'searching_gpu':
      case 'found_gpu':
      case 'creating_instance':
        return 'text-yellow-400';
      case 'instance_ready':
      case 'uploading_script':
      case 'training':
      case 'loading_model':
      case 'loading_dataset':
        return 'text-green-400';
      case 'saving':
      case 'uploading_model':
        return 'text-purple-400';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'cancelled':
        return 'text-orange-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6" />;
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Loader2 className="w-6 h-6 animate-spin" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'initializing': 'Initializing training environment...',
      'preparing': 'Preparing configuration...',
      'searching_gpu': 'Searching for available GPU...',
      'found_gpu': 'GPU found! Negotiating price...',
      'creating_instance': 'Creating compute instance...',
      'instance_ready': 'Instance ready! Setting up environment...',
      'uploading_script': 'Uploading training scripts...',
      'loading_model': 'Loading model weights...',
      'loading_dataset': 'Loading dataset...',
      'training': 'Training in progress...',
      'saving': 'Saving model checkpoint...',
      'uploading_model': 'Uploading to HuggingFace Hub...',
      'completed': 'Training completed successfully!',
      'failed': 'Training failed',
      'cancelled': 'Training cancelled'
    };
    return statusMap[status] || `Status: ${status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}`;
  };

  const isFinished = ['completed', 'failed', 'cancelled'].includes(job.status);

  return (
    <div className="w-full max-w-4xl mx-auto mt-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-light text-white mb-4">
          {isFinished ? 'Training Complete' : 'Fine-Tuning in Progress'}
        </h1>
        <p className="text-xl text-white/60">
          {job.model_name} with {job.dataset_name} Dataset
        </p>
      </div>

      {/* Main Progress Card */}
      <div className="relative">
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl" />
        
        <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {/* Status */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={getStatusColor(job.status)}>
                {getStatusIcon(job.status)}
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Status</p>
                <p className={cn("text-2xl font-light", getStatusColor(job.status))}>
                  {getStatusText(job.status)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm mb-1">Elapsed Time</p>
              <p className="text-2xl font-mono text-white">{elapsedTime}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {!isFinished && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white/60 text-sm">Progress</p>
                <p className="text-white/60 text-sm">{job.progress}%</p>
              </div>
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${job.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: [-128, 1000],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          )}

          {/* Visual Progress Indicators */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {['Setup', 'GPU Allocation', 'Training', 'Finalization'].map((stage, index) => {
              const stageProgress = job.progress / 25 - index;
              const isActive = stageProgress > 0;
              const isComplete = stageProgress >= 1;
              
              return (
                <div key={stage} className="text-center">
                  <div className="relative mb-2">
                    <div
                      className={cn(
                        "w-full h-1 rounded-full transition-all duration-500",
                        isActive ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-white/10"
                      )}
                    />
                    <motion.div
                      className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        "w-6 h-6 rounded-full border-2",
                        isComplete
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 border-transparent"
                          : isActive
                          ? "border-purple-500 bg-black"
                          : "border-white/20 bg-black"
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {isComplete && (
                        <motion.svg
                          className="w-full h-full p-1 text-white"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </motion.div>
                  </div>
                  <p className={cn(
                    "text-sm transition-colors",
                    isActive ? "text-white" : "text-white/40"
                  )}>
                    {stage}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Instance Info */}
          {job.instance_id && (
            <div className="mb-6 p-3 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm">
                Vast.ai Instance: <span className="text-white font-mono">{job.instance_id}</span>
              </p>
            </div>
          )}

          {/* Logs Section */}
          <div className="border-t border-white/10 pt-6">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span className="text-sm">View Logs ({job.logs.length})</span>
            </button>
            
            <AnimatePresence>
              {showLogs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 max-h-64 overflow-y-auto bg-black/40 rounded-lg p-4 font-mono text-xs">
                    {job.logs.map((log, index) => (
                      <div key={index} className="mb-2">
                        <span className="text-white/40">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={cn(
                          "ml-2",
                          log.type === 'status' ? "text-blue-400" : "text-white/80"
                        )}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {!isFinished ? (
              <LiquidButton
                onClick={onCancel}
                variant="destructive"
                size="lg"
                className="flex-1"
                style={{
                  background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                  color: "white",
                }}
              >
                Cancel Training
              </LiquidButton>
            ) : (
              <>
                <LiquidButton
                  onClick={() => router.back()}
                  size="lg"
                  className="flex-1"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    color: "white",
                  }}
                >
                  Back to Models
                </LiquidButton>
                {job.status === 'completed' && (
                  <LiquidButton
                    onClick={() => window.open(`https://huggingface.co/${job.config?.lora_model_repo}`, '_blank')}
                    size="lg"
                    className="flex-1"
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                      color: "white",
                    }}
                  >
                    View on HuggingFace
                  </LiquidButton>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Animation */}
      {job.status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-500">Model successfully uploaded to HuggingFace!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}