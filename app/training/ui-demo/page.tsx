"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { StarsBackground } from '@/components/ui/stars';
import TrainingProgressDemo from '@/components/ui/training-progress-demo';

// Mock job data for UI demonstration
const mockJobs = {
  initializing: {
    id: "demo-job-1",
    status: "initializing",
    progress: 5,
    logs: [
      { timestamp: new Date().toISOString(), message: "Training job created", type: "status" },
      { timestamp: new Date().toISOString(), message: "Initializing training environment...", type: "log" }
    ],
    model_name: "Mistral Instruct (7B)",
    dataset_name: "Custom Dataset",
    start_time: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    instance_id: "12345",
    config: {
      lora_model_repo: "user/demo-model"
    }
  },
  training: {
    id: "demo-job-2",
    status: "training",
    progress: 65,
    logs: [
      { timestamp: new Date().toISOString(), message: "Training job created", type: "status" },
      { timestamp: new Date().toISOString(), message: "GPU allocation completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Model loading completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Dataset loading completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training epoch 1/5 completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training epoch 2/5 completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training epoch 3/5 in progress...", type: "log" }
    ],
    model_name: "Mistral Small (24B)",
    dataset_name: "Code Instructions Dataset",
    start_time: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    instance_id: "67890",
    config: {
      lora_model_repo: "user/demo-model-2"
    }
  },
  completed: {
    id: "demo-job-3",
    status: "completed",
    progress: 100,
    logs: [
      { timestamp: new Date().toISOString(), message: "Training job created", type: "status" },
      { timestamp: new Date().toISOString(), message: "GPU allocation completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Model loading completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Dataset loading completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training epoch 1/5 completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training epoch 2/5 completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training epoch 3/5 completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training epoch 4/5 completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training epoch 5/5 completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Model saved successfully", type: "log" },
      { timestamp: new Date().toISOString(), message: "Uploading to HuggingFace Hub...", type: "log" },
      { timestamp: new Date().toISOString(), message: "Upload completed successfully!", type: "status" }
    ],
    model_name: "Mistral Codestral (22B)",
    dataset_name: "Python Code Dataset",
    start_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    instance_id: "54321",
    config: {
      lora_model_repo: "user/demo-model-3"
    }
  },
  failed: {
    id: "demo-job-4",
    status: "failed",
    progress: 25,
    logs: [
      { timestamp: new Date().toISOString(), message: "Training job created", type: "status" },
      { timestamp: new Date().toISOString(), message: "GPU allocation completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Model loading completed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Dataset loading failed", type: "log" },
      { timestamp: new Date().toISOString(), message: "Error: Dataset not found", type: "log" },
      { timestamp: new Date().toISOString(), message: "Training job failed", type: "status" }
    ],
    model_name: "Mistral Devstral Small (22B)",
    dataset_name: "Invalid Dataset",
    start_time: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    instance_id: "98765",
    config: {
      lora_model_repo: "user/demo-model-4"
    }
  }
};

export default function TrainingDemoPage() {
  const router = useRouter();
  const [selectedDemo, setSelectedDemo] = useState<keyof typeof mockJobs>('training');
  const [job, setJob] = useState(mockJobs[selectedDemo]);

  const handleDemoChange = (demoType: keyof typeof mockJobs) => {
    setSelectedDemo(demoType);
    setJob(mockJobs[demoType]);
  };

  const handleCancel = () => {
    alert('Demo: Cancel action triggered');
  };

  const handleBackToModels = () => {
    router.push('/');
  };

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      
      <Header />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Demo Controls */}
        <div className="mb-8 p-4 bg-black/40 backdrop-blur-xl rounded-lg border border-white/10">
          <h3 className="text-white text-lg mb-4">UI Demo Controls</h3>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(mockJobs).map((demoType) => (
              <button
                key={demoType}
                onClick={() => handleDemoChange(demoType as keyof typeof mockJobs)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedDemo === demoType
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {demoType.charAt(0).toUpperCase() + demoType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <TrainingProgressDemo 
          job={job} 
          onCancel={handleCancel}
          onBackToModels={handleBackToModels}
        />
      </div>
    </div>
  );
}