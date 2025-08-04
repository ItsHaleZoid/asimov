"use client"

import React, { useState, useEffect } from 'react'
import { SearchIcon, Database } from 'lucide-react'

interface Dataset {
  id: string
  name: string
  description: string
  subsets: string[]
  downloads: number
  hf_link: string
  likes: number
  category: 'mistral' | 'gemma' | 'flux' | 'general'
}

interface DatasetsListProps {
  searchQuery?: string
  modelFamily?: 'mistral' | 'gemma' | 'flux'
  onDatasetSelect?: (dataset: Dataset) => void
  selectedDataset?: { hf_link: string } | null
  onFilteredDatasetsChange?: (datasets: Dataset[]) => void
}

const MOCK_DATASETS: Dataset[] = [
  // Mistral-specific datasets
  {
    id: '1',
    name: 'Awesome ChatGPT Prompts',
    description: 'A curated list of prompts for ChatGPT',
    subsets: ['default'],
    downloads: 145000,
    hf_link: 'fka/awesome-chatgpt-prompts',
    likes: 85200,
    category: 'general'
  },
  

  {
    id: '2',
    name: 'Microsoft rStar Coder',
    description: 'A dataset of code examples by Microsoft',
    subsets: ['seed_sft', 'synthetic_sft', 'seed_testcase', 'synthetic_sft_testcase', 'synthetic_rl'],
    downloads: 234000,
    hf_link: 'microsoft/rStar-Coder',
    likes: 4100,
    category: 'general'
  },
  {
    id: '3',
    name: 'Nvidia OpenCodeInstruct',
    description: '5M+ Prompt and Code examples for code instruction tuning provided by Nvidia',
    subsets: ['train'],
    downloads: 234000,
    hf_link: 'nvidia/OpenCodeInstruct',
    likes: 4100,
    category: 'general'
  }
]

export default function DatasetsList({ searchQuery, modelFamily, onDatasetSelect, selectedDataset, onFilteredDatasetsChange }: DatasetsListProps) {
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([])

  useEffect(() => {
    let datasetsToSearch = MOCK_DATASETS
    if (modelFamily) {
      datasetsToSearch = MOCK_DATASETS.filter(dataset => 
        dataset.category === modelFamily || dataset.category === 'general'
      )
    }

    if (searchQuery?.trim()) {
      const filtered = datasetsToSearch.filter(dataset =>
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredDatasets(filtered)
      onFilteredDatasetsChange?.(filtered)
    } else {
      setFilteredDatasets([])
      onFilteredDatasetsChange?.([])
    }
  }, [searchQuery, modelFamily, onFilteredDatasetsChange])

  // Don't render anything if there's no search query
  if (!searchQuery?.trim()) {
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
                className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group ${selectedDataset?.hf_link === dataset.hf_link ? 'bg-white/10' : ''}`}
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
                      <span>subsets: {dataset.subsets.join(', ')}</span>
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