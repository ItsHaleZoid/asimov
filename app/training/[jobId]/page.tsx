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
  const [usePolling, setUsePolling] = useState<boolean>(false);

  useEffect(() => {
    // Fetch initial job status
    fetch(`http://localhost:8000/api/job/${jobId}`)
      .then(res => {
        if (!res.ok) throw new Error('Job not found');
        return res.json();
      })
      .then(data => setJob(data))
      .catch(err => {
        console.error('Error fetching job:', err);
        setError('Failed to load training job');
      });

    // Connect WebSocket for real-time updates
    const websocket = new WebSocket(`ws://localhost:8000/ws/${jobId}`);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'initial_state') {
        setJob(data.job);
      } else if (data.type === 'status_update') {
        setJob((prev: any) => ({
          ...prev,
          status: data.status,
          progress: data.progress,
          logs: [...(prev?.logs || []), {
            timestamp: new Date().toISOString(),
            message: data.message,
            type: 'status'
          }]
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
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setUsePolling(true);
      setError('WebSocket connection failed. Using polling for updates.');
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

    const pollJobStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/job/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    const interval = setInterval(pollJobStatus, 5000);
    return () => clearInterval(interval);
  }, [jobId, usePolling]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this training job?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/job/${jobId}/cancel`, {
        method: 'POST',
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
    <div className="bg-black min-h-screen relative overflow-hidden">
      <StarsBackground className="absolute inset-0 z-0" />
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
          />
        ) : (
          <div className="text-white text-2xl">Loading training job...</div>
        )}
      </div>
    </div>
  );
}   