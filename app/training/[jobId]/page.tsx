"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { StarsBackground } from '@/components/ui/stars';
import TrainingProgress from '@/components/ui/training-progress';

export default function TrainingPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<any>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usePolling, setUsePolling] = useState<boolean>(true); // Start with polling enabled

  useEffect(() => {
    // Fetch initial job status
    const fetchInitialJob = async () => {
      try {
        const { getAuthHeaders } = await import('@/lib/utils');
        const headers = await getAuthHeaders();
        const res = await fetch(`http://localhost:8000/api/job/${jobId}`, { headers });
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load training job');
      }
    };
    
    fetchInitialJob();

    // Connect WebSocket for real-time updates
    const websocket = new WebSocket(`ws://localhost:8000/ws/${jobId}`);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      // Keep polling enabled as backup even if WebSocket connects
      // setUsePolling(false); // Commented out to keep both active
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      
      if (data.type === 'initial_state') {
        setJob(data.job);
      } else if (data.type === 'status_update') {
        // CRITICAL FIX: API sends status in data.job, not directly in data
        const jobData = data.job;
        console.log('✅ Status update received:', jobData);
        console.log(`📊 Status: ${jobData.status}, Progress: ${jobData.progress}%`);
        
        // Special logging for completion
        if (jobData.status === 'completed') {
          console.log('🎉 TRAINING COMPLETED! Frontend should now show success state.');
        }
        
        setJob((prev: any) => ({
          ...prev,
          ...jobData, // Update with complete job data
          logs: jobData.logs || prev?.logs || []
        }));
      } else if (data.type === 'log_update') {
        // Handle individual log updates
        setJob((prev: any) => ({
          ...prev,
          logs: [...(prev?.logs || []), data.log]
        }));
      } else if (data.type === 'log') {
        setJob((prev: any) => ({
          ...prev,
          logs: [...(prev?.logs || []), {
            timestamp: new Date().toISOString(),
            message: data.message,
            type: 'log'
          }]
        }));
      } else {
        // Fallback: treat any message as a potential job update
        console.log('Unknown WebSocket message type, attempting to extract job data:', data);
        
        // Check if it's a nested job structure (data.job)
        if (data.job && (data.job.status !== undefined || data.job.progress !== undefined)) {
          console.log('Fallback: Updating with nested job data:', data.job);
          setJob((prev: any) => ({
            ...prev,
            ...data.job,
            logs: data.job.logs || prev?.logs || []
          }));
        } 
        // Check if it's a flat structure (data.status)
        else if (data.status !== undefined || data.progress !== undefined) {
          console.log('Fallback: Updating with flat data structure:', data);
          setJob((prev: any) => ({
            ...prev,
            status: data.status || prev?.status,
            progress: data.progress !== undefined ? data.progress : prev?.progress,
            logs: data.logs || prev?.logs || []
          }));
        }
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setUsePolling(true);
      console.log('Enabling polling due to WebSocket failure');
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [jobId]);

  // Fallback polling when WebSocket fails
  useEffect(() => {
    if (!usePolling) return;

    console.log('Starting polling every 2 seconds...');
    
    const pollJobStatus = async () => {
      try {
        console.log('🔄 Polling job status...');
        const { getAuthHeaders } = await import('@/lib/utils');
        const headers = await getAuthHeaders();
        const response = await fetch(`http://localhost:8000/api/job/${jobId}`, { headers });
        if (response.ok) {
          const data = await response.json();
          console.log('📡 Polling received job data:', data);
          console.log(`📊 Polling Status: ${data.status}, Progress: ${data.progress}%`);
          
          // Special logging for completion via polling
          if (data.status === 'completed') {
            console.log('🎉 TRAINING COMPLETED! (via polling) Frontend should now show success state.');
          }
          
          setJob(data);
        } else {
          console.error('❌ Polling failed with status:', response.status);
        }
      } catch (error) {
        console.error('❌ Polling error:', error);
      }
    };

    // Poll immediately, then every 2 seconds
    pollJobStatus();
    const interval = setInterval(pollJobStatus, 2000);
    return () => clearInterval(interval);
  }, [jobId, usePolling]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this training job?')) return;
    
    try {
      const { getAuthHeaders } = await import('@/lib/utils');
      const headers = await getAuthHeaders();
      const response = await fetch(`http://localhost:8000/api/job/${jobId}/cancel`, {
        method: 'POST',
        headers
      });
      
      if (response.ok) {
        // Job will update via WebSocket
      } else {
        throw new Error('Failed to cancel job');
      }
    } catch (error) {
      console.error('Error cancelling job:', error);
      alert('Failed to cancel job');
    }
  };

  const handleBackToModels = () => {
    router.push('/');
  };

  return (
    <div className="bg-black min-h-screen relative ">
     
      <Header />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {error ? (
          <div className="text-red-500 text-xl bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            {error}
          </div>
        ) : job ? (
          <TrainingProgress 
            job={job} 
            onCancel={handleCancel}
            onBackToModels={handleBackToModels}
            enablePolling={usePolling}
            onJobUpdate={setJob}
          />
        ) : (
          <div className="text-white text-2xl">Loading training job...</div>
        )}
      </div>
    </div>
  );
}   