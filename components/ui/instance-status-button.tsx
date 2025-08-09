"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getAuthHeaders } from '@/lib/utils';

interface Job {
  id: string;
  status: string;
  model_name: string;
  dataset_name: string;
  start_time: string;
  completed_at?: string;
  error_message?: string;
  user_id: string;
  job_params?: any;
}

interface InstanceStatusButtonProps {
  className?: string;
}

export default function InstanceStatusButton({ className }: InstanceStatusButtonProps) {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideCompletedJob, setHideCompletedJob] = useState(false);
  const [timeUntilHide, setTimeUntilHide] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchUserJobs = useCallback(async () => {
    if (!user) return;
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/jobs', { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      const jobs = data.jobs || [];
      
      // Find the most recent active job (running, pending, etc.) or the latest completed job
      const activeJob = jobs.find((job: Job) => 
        ['initializing', 'preparing', 'searching_gpu', 'found_gpu', 'creating_instance', 
         'instance_ready', 'uploading_script', 'loading_model', 'loading_dataset', 
         'training', 'saving', 'uploading_model'].includes(job.status)
      );
      
      // If no active job, get the most recent completed/failed job
      const latestJob = activeJob || jobs.find((job: Job) => 
        ['completed', 'failed', 'cancelled'].includes(job.status)
      );
      
      setCurrentJob(latestJob || null);
      setError(null);
      
      // Reset hide flag when we get a new active job
      if (activeJob) {
        setHideCompletedJob(false);
        setTimeUntilHide(null);
      }
    } catch (err) {
      console.error('Error fetching user jobs:', err);
      setError('Failed to fetch job status');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchUserJobs();

    // Poll every 5 seconds
    const interval = setInterval(fetchUserJobs, 5000);

    return () => clearInterval(interval);
  }, [user, fetchUserJobs]);

  // Handle auto-hide for completed jobs after 2 minutes
  useEffect(() => {
    if (!currentJob) {
      setTimeUntilHide(null);
      return;
    }

    // Failed/cancelled jobs disappear immediately, completed jobs get 2-minute countdown
    if (['cancelled', 'failed'].includes(currentJob.status)) {
      setHideCompletedJob(true);
      setTimeUntilHide(null);
      return;
    }

    // Only completed jobs get the countdown
    const isCompleted = currentJob.status === 'completed';
    if (!isCompleted) {
      setTimeUntilHide(null);
      return;
    }

    // Calculate time since completion
    const completedAt = currentJob.completed_at;
    if (!completedAt) {
      setTimeUntilHide(null);
      return;
    }

    const completionTime = new Date(completedAt).getTime();
    const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds

    // Update countdown every second
    const updateCountdown = () => {
      const currentTime = Date.now();
      const timeSinceCompletion = currentTime - completionTime;
      const remainingTime = twoMinutes - timeSinceCompletion;

      if (remainingTime <= 0) {
        setHideCompletedJob(true);
        setTimeUntilHide(null);
        return false; // Stop interval
      }

      setTimeUntilHide(Math.ceil(remainingTime / 1000)); // Convert to seconds
      return true; // Continue interval
    };

    // Initial check
    if (!updateCountdown()) return;

    // Update every second
    const interval = setInterval(() => {
      if (!updateCountdown()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentJob]);

  const handleClick = () => {
    if (currentJob) {
      router.push(`/training/${currentJob.id}`);
    }
  };

  // Don't render if user is not authenticated
  if (!user || loading) {
    return null;
  }

  // Don't render if there's no job or if completed job should be hidden
  if (!currentJob || hideCompletedJob) {
    return null;
  }

  const getButtonContent = () => {
    const isRunning = ['initializing', 'preparing', 'searching_gpu', 'found_gpu', 'creating_instance', 
                      'instance_ready', 'uploading_script', 'loading_model', 'loading_dataset', 
                      'training', 'saving', 'uploading_model'].includes(currentJob.status);
    
    const isCompleted = currentJob.status === 'completed';
    const isFailed = ['failed', 'cancelled'].includes(currentJob.status);

    if (isRunning) {
      return (
        <>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Training...</span>
          </div>
        </>
      );
    }

    if (isCompleted) {
      return (
        <>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Fine Tuning Done</span>
            {timeUntilHide && timeUntilHide > 0 && (
              <span className="text-xs text-white/50 ml-1">
                ({Math.floor(timeUntilHide / 60)}:{(timeUntilHide % 60).toString().padStart(2, '0')})
              </span>
            )}
          </div>
        </>
      );
    }

    if (isFailed) {
      return (
        <>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-medium">Training Failed</span>
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <span className="text-sm font-medium">{currentJob.status}</span>
      </div>
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg 
        bg-white/5 hover:bg-white/10 
        border border-white/10 hover:border-white/20
        transition-all duration-200 
        text-white hover:text-white
        mr-3
        ${className}
      `}
      title={
        currentJob.status === 'completed' && timeUntilHide 
          ? `${currentJob.model_name} - ${currentJob.status} (hiding in ${Math.floor(timeUntilHide / 60)}:${(timeUntilHide % 60).toString().padStart(2, '0')})`
          : `${currentJob.model_name} - ${currentJob.status}`
      }
    >
      {getButtonContent()}
    </button>
  );
}