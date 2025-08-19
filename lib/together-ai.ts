/**
 * Together AI Fine-tuning Service
 * Streamlined service for managing Together AI fine-tuning operations
 */

export interface TogetherJobConfig {
  model: string;
  dataset_content: string; // JSONL content
  training_method: 'lora' | 'full';
  n_epochs?: number;
  learning_rate?: number;
  suffix?: string;
}

export interface TogetherJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  model: string;
  created_at: number;
  finished_at?: number;
  fine_tuned_model?: string;
  training_method: string;
  hyperparameters: {
    n_epochs: number;
    learning_rate: number;
  };
  trained_tokens?: number;
  progress?: number; // 0-100
  error?: {
    message: string;
    code: string;
  };
}

export interface TogetherEvent {
  created_at: number;
  level: 'info' | 'error' | 'warning';
  message: string;
}

export interface CostEstimation {
  estimated_tokens: number;
  estimated_cost: number;
  method_multiplier: number;
}

export class TogetherAIService {
  private apiKey: string;
  private baseUrl = 'https://api.together.xyz/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TOGETHER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Together AI API key is required');
    }
  }

  /**
   * Create a fine-tuning job with simplified API
   */
  async createFineTuningJob(config: TogetherJobConfig): Promise<TogetherJob> {
    try {
      // First upload the dataset
      const fileId = await this.uploadDataset(config.dataset_content);
      
      // Create the fine-tuning job
      const response = await fetch(`${this.baseUrl}/fine-tunes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          training_file: fileId,
          model: config.model,
          n_epochs: config.n_epochs || 3,
          learning_rate: config.learning_rate || 1e-5,
          lora: config.training_method === 'lora',
          suffix: config.suffix,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error: ${error.error?.message || response.statusText}`);
      }

      const job = await response.json();
      return this.mapJobResponse(job);
    } catch (error) {
      console.error('Fine-tuning job creation failed:', error);
      throw new Error(`Failed to create fine-tuning job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get job status and details
   */
  async getJob(jobId: string): Promise<TogetherJob> {
    try {
      const response = await fetch(`${this.baseUrl}/fine-tunes/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const job = await response.json();
      return this.mapJobResponse(job);
    } catch (error) {
      console.error('Failed to get job:', error);
      throw new Error(`Failed to get job ${jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId: string): Promise<TogetherJob> {
    try {
      const response = await fetch(`${this.baseUrl}/fine-tunes/${jobId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const job = await response.json();
      return this.mapJobResponse(job);
    } catch (error) {
      console.error('Failed to cancel job:', error);
      throw new Error(`Failed to cancel job ${jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get job events/logs
   */
  async getJobEvents(jobId: string): Promise<TogetherEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/fine-tunes/${jobId}/events`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const events = await response.json();
      return events.data?.map((event: any) => ({
        created_at: event.created_at,
        level: event.level || 'info',
        message: event.message,
      })) || [];
    } catch (error) {
      console.error('Failed to get job events:', error);
      return [];
    }
  }

  /**
   * Get available models for fine-tuning (simplified list)
   */
  getAvailableModels(): Array<{id: string, name: string, context_length: number}> {
    return [
      {
        id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        name: 'Llama 3.1 8B Instruct',
        context_length: 8192
      },
      {
        id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
        name: 'Llama 3.1 70B Instruct',
        context_length: 8192
      },
      {
        id: 'mistralai/Mistral-7B-Instruct-v0.3',
        name: 'Mistral 7B Instruct',
        context_length: 32768
      },
      {
        id: 'google/gemma-2-9b-it',
        name: 'Gemma 2 9B IT',
        context_length: 8192
      },
      {
        id: 'Qwen/Qwen2.5-7B-Instruct',
        name: 'Qwen 2.5 7B Instruct',
        context_length: 32768
      }
    ];
  }

  /**
   * Estimate training cost (simplified calculation)
   */
  estimateCost(tokenCount: number, epochs: number = 3, trainingMethod: 'lora' | 'full' = 'lora'): CostEstimation {
    const baseCostPerMillionTokens = 3.0;
    const methodMultiplier = trainingMethod === 'lora' ? 1.0 : 2.5;
    
    const totalTokens = tokenCount * epochs;
    const costPerToken = (baseCostPerMillionTokens * methodMultiplier) / 1_000_000;
    const estimatedCost = Math.max(totalTokens * costPerToken, 6.0); // Minimum $6 charge

    return {
      estimated_tokens: totalTokens,
      estimated_cost: Math.round(estimatedCost * 100) / 100,
      method_multiplier: methodMultiplier
    };
  }

  /**
   * Convert dataset to Together AI format
   */
  convertDatasetFormat(
    data: any[], 
    schema: 'opencodeinstruct' | 'manim' | 'prompt_output',
    systemPrompt?: string
  ): string {
    const convertedLines: string[] = [];

    for (const item of data) {
      let messages: Array<{role: string, content: string}> = [];

      if (systemPrompt) {
        messages.push({role: 'system', content: systemPrompt});
      }

      switch (schema) {
        case 'opencodeinstruct':
          messages.push(
            {role: 'user', content: item.input || ''},
            {role: 'assistant', content: item.output || ''}
          );
          break;

        case 'manim':
          messages.push(
            {role: 'user', content: item.prompt || item.query || ''},
            {role: 'assistant', content: item.output || item.answer || ''}
          );
          break;

        case 'prompt_output':
          messages.push(
            {role: 'user', content: item.prompt || ''},
            {role: 'assistant', content: item.output || ''}
          );
          break;
      }

      convertedLines.push(JSON.stringify({messages}));
    }

    return convertedLines.join('\n');
  }

  /**
   * Count tokens in JSONL content (rough estimation)
   */
  countTokens(jsonlContent: string): number {
    const lines = jsonlContent.trim().split('\n');
    let totalTokens = 0;

    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.messages) {
          for (const message of data.messages) {
            // Rough estimation: 4 characters per token
            totalTokens += Math.ceil(message.content.length / 4);
          }
        }
      } catch (e) {
        // Skip invalid lines
      }
    }

    return totalTokens;
  }

  /**
   * Upload dataset file to Together AI
   */
  private async uploadDataset(content: string): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([content], { type: 'application/jsonl' });
    formData.append('file', blob, 'dataset.jsonl');
    formData.append('purpose', 'fine-tune');

    const response = await fetch(`${this.baseUrl}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`File upload failed: ${error.error?.message || response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  /**
   * Map Together AI API response to our job interface
   */
  private mapJobResponse(response: any): TogetherJob {
    return {
      id: response.id,
      status: response.status,
      model: response.model,
      created_at: response.created_at,
      finished_at: response.finished_at,
      fine_tuned_model: response.fine_tuned_model,
      training_method: response.lora ? 'lora' : 'full',
      hyperparameters: {
        n_epochs: response.hyperparameters?.n_epochs || 3,
        learning_rate: response.hyperparameters?.learning_rate || 1e-5,
      },
      trained_tokens: response.trained_tokens,
      progress: this.calculateProgress(response.status, response.trained_tokens),
      error: response.error
    };
  }

  /**
   * Calculate progress percentage based on status
   */
  private calculateProgress(status: string, trainedTokens?: number): number {
    switch (status) {
      case 'pending': return 5;
      case 'running': return trainedTokens ? Math.min(90, 10 + (trainedTokens / 1000000) * 10) : 20;
      case 'completed': return 100;
      case 'failed':
      case 'cancelled': return 0;
      default: return 0;
    }
  }
}

// Export singleton instance
export const togetherAI = new TogetherAIService();