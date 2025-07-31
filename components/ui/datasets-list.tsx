"use client"

import React, { useState, useEffect } from 'react'
import { SearchIcon, Database } from 'lucide-react'

interface Dataset {
  id: string
  name: string
  description: string
  downloads: number
  hf_link: string
  likes: number
  category: 'mistral' | 'gemma' | 'flux' | 'general'
}

interface DatasetsListProps {
  searchQuery: string
  modelFamily?: 'mistral' | 'gemma' | 'flux'
  onDatasetSelect?: (dataset: Dataset) => void
}

const MOCK_DATASETS: Dataset[] = [
  // Mistral-specific datasets
  {
    id: '1',
    name: 'mistral-instruct-v0.2',
    description: 'Official Mistral instruction-following dataset optimized for chat',
    downloads: 145000,
    hf_link: 'https://huggingface.co/datasets/mistralai/mistral-instruct-v0.2',
    likes: 2800,
    category: 'mistral'
  },
  {
    id: '2',
    name: 'open-orca-mistral',
    description: 'Large-scale instruction tuning dataset formatted for Mistral models',
    downloads: 98000,
    hf_link: 'https://huggingface.co/datasets/mistralai/open-orca-mistral',
    likes: 1950,
    category: 'mistral'
  },
  {
    id: '3',
    name: 'code-mistral-7b',
    description: 'Code instruction dataset specifically tuned for Mistral 7B',
    downloads: 76000,
    hf_link: 'https://huggingface.co/datasets/mistralai/code-mistral-7b',
    likes: 1520,
    category: 'mistral'
  },
  {
    id: '4',
    name: 'mistral-math-reasoning',
    description: 'Mathematical reasoning dataset optimized for Mistral architecture',
    downloads: 52000,
    hf_link: 'https://huggingface.co/datasets/mistralai/mistral-math-reasoning',
    likes: 1100,
    category: 'mistral'
  },
  
  // Gemma-specific datasets
  {
    id: '5',
    name: 'gemma-instruction-tuning',
    description: 'Google Gemma optimized instruction-following dataset',
    downloads: 134000,
    hf_link: 'https://huggingface.co/datasets/google/gemma-instruction-tuning',
    likes: 2650,
    category: 'gemma'
  },
  {
    id: '6',
    name: 'gemma-code-assist',
    description: 'Code generation and assistance dataset for Gemma models',
    downloads: 89000,
    hf_link: 'https://huggingface.co/datasets/google/gemma-code-assist',
    likes: 1780,
    category: 'gemma'
  },
  {
    id: '7',
    name: 'gemma-safety-aligned',
    description: 'Safety-aligned conversational dataset for responsible AI',
    downloads: 67000,
    hf_link: 'https://huggingface.co/datasets/google/gemma-safety-aligned',
    likes: 1340,
    category: 'gemma'
  },
  {
    id: '8',
    name: 'gemma-multilingual',
    description: 'Multilingual instruction dataset supporting 50+ languages',
    downloads: 43000,
    hf_link: 'https://huggingface.co/datasets/google/gemma-multilingual',
    likes: 890,
    category: 'gemma'
  },
  
  // Flux-specific datasets (image generation)
  {
    id: '9',
    name: 'flux-style-transfer',
    description: 'Artistic style transfer dataset for FLUX image generation',
    downloads: 156000,
    hf_link: 'https://huggingface.co/datasets/google/flux-style-transfer',
    likes: 3200,
    category: 'flux'
  },
  {
    id: '10',
    name: 'flux-portraits',
    description: 'High-quality portrait generation dataset with diverse subjects',
    downloads: 123000,
    hf_link: 'https://huggingface.co/datasets/google/flux-portraits',
    likes: 2890,
    category: 'flux'
  },
  {
    id: '11',
    name: 'flux-architecture',
    description: 'Architectural and building design dataset for FLUX models',
    downloads: 78000,
    hf_link: 'https://huggingface.co/datasets/google/flux-architecture',
    likes: 1670,
    category: 'flux'
  },
  {
    id: '12',
    name: 'flux-concept-art',
    description: 'Fantasy and sci-fi concept art dataset for creative generation',
    downloads: 94000,
    hf_link: 'https://huggingface.co/datasets/google/flux-concept-art',
    likes: 2100,
    category: 'flux'
  },
  {
    id: '13',
    name: 'flux-product-design',
    description: 'Product design and visualization dataset for commercial use',
    downloads: 65000,
    hf_link: 'https://huggingface.co/datasets/google/flux-product-design',
    likes: 1450,
    category: 'flux'
  },
  
  // General datasets (available for all)
  {
    id: '14',
    name: 'alpaca-gpt4-data',
    description: 'GPT-4 generated instruction-following dataset (universal)',
    downloads: 187000,
    hf_link: 'https://huggingface.co/datasets/google/alpaca-gpt4-data',
    likes: 3400,
    category: 'general'
  },
  {
    id: '15',
    name: 'dolly-15k',
    description: 'High-quality human-generated instruction following dataset',
    downloads: 142000,
    hf_link: 'https://huggingface.co/datasets/google/dolly-15k',
    likes: 2600,
    category: 'general'
  },
  {
    id: '16',
    name: 'common-crawl-filter',
    description: 'Filtered and cleaned Common Crawl web data',
    downloads: 234000,
    hf_link: 'https://huggingface.co/datasets/google/common-crawl-filter',
    likes: 4100,
    category: 'general'
  }
]

export default function DatasetsList({ searchQuery, modelFamily, onDatasetSelect }: DatasetsListProps) {
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDatasets([])
      return
    }

    // Filter by model family first, then by search query
    let datasetsToSearch = MOCK_DATASETS
    if (modelFamily) {
      datasetsToSearch = MOCK_DATASETS.filter(dataset => 
        dataset.category === modelFamily || dataset.category === 'general'
      )
    }

    const filtered = datasetsToSearch.filter(dataset =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredDatasets(filtered)
  }, [searchQuery, modelFamily])

  if (!searchQuery.trim()) {
    return null
  }

  return (
    <div className="w-full">
      <div className="bg-black/30 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
        {filteredDatasets.length > 0 ? (
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
              }
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
              }
            `}</style>
            {filteredDatasets.map((dataset) => (
              <div
                key={dataset.id}
                onClick={() => onDatasetSelect?.(dataset)}
                className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm group-hover:text-gray-200 transition-colors">
                      {dataset.name}
                    </h3>
                    <p className="text-white/60 text-xs mt-1 line-clamp-2">
                      {dataset.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                      <span>{dataset.downloads.toLocaleString()} downloads</span>
                      <span>{dataset.likes.toLocaleString()} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-white/60">
            <SearchIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No datasets found for "{searchQuery}"</p>
            <p className="text-xs mt-1 opacity-60">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  )
}