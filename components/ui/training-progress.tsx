"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { ChevronDown, ChevronUp, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TrainingProgressProps {
  job: {
    job_id: string;
    job_status: string;
    model_id: string;
    dataset_id: string;
    model_name?: string;
    dataset_name?: string;
    together_job_id?: string;
    output_name?: string;
    created_at: string;
    updated_at: string;
    error_message?: string;
    config?: {
      epochs?: number;
      batch_size?: number;
      learning_rate?: number;
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

  const handleJobUpdate = useCallback((updatedJob: any) => {
    if (onJobUpdate) {
      onJobUpdate(updatedJob);
    }
  }, [onJobUpdate]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const start = new Date(job.created_at).getTime();
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
    
    return () => clearInterval(timeInterval);
  }, [job.created_at]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-blue-400';
      case 'running':
      case 'submitted':
        return 'text-yellow-400';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
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
      'pending': 'Preparing to start training...',
      'running': 'Training in progress...',
      'submitted': 'Job submitted to Together AI...',
      'completed': 'Training completed successfully!',
      'failed': 'Training failed'
    };
    return statusMap[status] || `Status: ${status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}`;
  };

  // Calculate progress based on status
  const getProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'submitted': return 25;
      case 'running': return 75;
      case 'completed': return 100;
      case 'failed': return 0;
      default: return 0;
    }
  };

  const progress = getProgress(job.job_status);
  const isFinished = ['completed', 'failed'].includes(job.job_status);

  return (
    <div className="w-full max-w-4xl mx-auto mt-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-light text-white mb-4">
          {isFinished ? 'Training Complete' : 'Fine-Tuning in Progress'}
        </h1>
        <p className="text-xl text-white/60">
          {job.model_id} with {job.dataset_id}
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
              <div className={getStatusColor(job.job_status)}>
                {getStatusIcon(job.job_status)}
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Status</p>
                <p className={cn("text-2xl font-light", getStatusColor(job.job_status))}>
                  {getStatusText(job.job_status)}
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
                <p className="text-white/60 text-sm">{progress}%</p>
              </div>
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
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
            {['Setup', 'Submission', 'Training', 'Completion'].map((stage, index) => {
              const stageProgress = progress / 25 - index;
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

          {/* Together AI Job Info */}
          {job.together_job_id && (
            <div className="mb-6 p-3 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm">
                Together AI Job: <span className="text-white font-mono">{job.together_job_id}</span>
              </p>
            </div>
          )}

          {/* Configuration Info */}
          {job.config && (
            <div className="mb-6 p-3 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm mb-2">Training Configuration:</p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-white/40">Epochs:</span>{' '}
                  <span className="text-white">{job.config.epochs || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-white/40">Batch Size:</span>{' '}
                  <span className="text-white">{job.config.batch_size || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-white/40">Learning Rate:</span>{' '}
                  <span className="text-white">{job.config.learning_rate || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {job.error_message && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                <strong>Error:</strong> {job.error_message}
              </p>
            </div>
          )}

          {/* Job Details Section */}
          <div className="border-t border-white/10 pt-6">
            <div className="text-white/60 text-sm mb-4">Job Information</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Job ID:</span>
                <span className="text-white font-mono">{job.job_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Created:</span>
                <span className="text-white">{new Date(job.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Updated:</span>
                <span className="text-white">{new Date(job.updated_at).toLocaleString()}</span>
              </div>
              {job.output_name && (
                <div className="flex justify-between">
                  <span className="text-white/40">Output Model:</span>
                  <span className="text-green-400">{job.output_name}</span>
                </div>
              )}
            </div>
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
                {job.job_status === 'completed' && job.output_name && (
                  <LiquidButton
                    onClick={() => window.open(`https://huggingface.co/${job.output_name}`, '_blank')}
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
      {job.job_status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-500">
              Fine-tuning completed successfully!
              {job.output_name && ' Model available on HuggingFace.'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}