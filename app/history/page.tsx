'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface HistoryItem {
  id: string
  query: string
  response: string
  timestamp: string
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('flashcardHistory')
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory)
      } catch (error) {
        console.error('Error parsing history:', error)
        setHistory([])
      }
    }
  }, [])

  const handleViewFlashcard = (item: HistoryItem) => {
    // Store in sessionStorage and navigate to results
    sessionStorage.setItem('flashcardResponse', item.response)
    sessionStorage.setItem('originalQuery', item.query)
    router.push('/results')
  }

  const handleDeleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('flashcardHistory', JSON.stringify(updatedHistory))
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([])
      localStorage.removeItem('flashcardHistory')
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const extractTitle = (response: string) => {
    // Look for the title after # (flashcard title)
    const titleMatch = response.match(/#([^\n]+)/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    
    // If no title found, use first line of content or fallback
    const lines = response.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].replace(/#+\s*/, '').trim();
      return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
    }
    
    return 'Untitled Flashcard';
  }

  const togglePreview = (item: HistoryItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null); // Close preview if same item clicked
    } else {
      setSelectedItem(item); // Open preview for new item
    }
  }

  return (
    <main className="min-h-screen bg-[#1f1f1f]">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo (Left) */}
          <div className="flex items-center">
            <Image 
              src="/Obsidian_Flash.png" 
              alt="ObsidianFlash Logo" 
              width={100} 
              height={100} 
              className="object-contain" 
            />
          </div>
          
          {/* Title (Right) */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
            History
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-4 max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="bg-white text-black py-2 px-4 rounded-lg hover:bg-black hover:text-white transition-colors"
          >
            ← Back to Generator
          </button>
          
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl mb-4">No flashcard history yet</p>
            <p>Generate some flashcards to see them here!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-2 text-lg">
                      {extractTitle(item.response)}
                    </h3>
                    <p className="text-gray-400 text-sm mb-1">
                      Query: {item.query.length > 60 ? item.query.substring(0, 60) + '...' : item.query}
                    </p>
                    <p className="text-gray-500 text-xs mb-4">
                      Generated on {formatDate(item.timestamp)}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewFlashcard(item)}
                        className="bg-white text-black py-2 px-4 rounded hover:bg-black hover:text-white transition-colors text-sm"
                      >
                        View Flashcards
                      </button>
                      <button
                        onClick={() => togglePreview(item)}
                        className={`py-2 px-4 rounded transition-colors text-sm ${
                          selectedItem?.id === item.id 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {selectedItem?.id === item.id ? 'Hide Preview' : 'Show Preview'}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-4"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Preview */}
                {selectedItem?.id === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="bg-black rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">Flashcard Content</h4>
                        <span className="text-gray-400 text-xs">
                          {item.response.length} characters
                        </span>
                      </div>
                      <div className="max-h-96 overflow-y-auto bg-gray-900 rounded p-3">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                          {item.response}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
