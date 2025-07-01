
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import image from 'public/ObsidianFlash.png';

export default function Home() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()
      
      console.log('API Response:', data) // Debug log
      
      if (data.response) {
        // Store the response in sessionStorage and navigate to results page
        sessionStorage.setItem('flashcardResponse', data.response)
        sessionStorage.setItem('originalQuery', query)
        router.push('/results')
      } else {
        console.error('No response in data:', data)
        alert('No response received from API. Please try again.')
      }
      
    } catch (error) {
      console.error('Error:', error)
      alert('Error generating flashcards. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#1f1f1f] relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#1f1f1f] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-black font-medium">Generating your flashcards...</p>
            <p className="text-gray-600 text-sm mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">          {/* Logo (Left) */}
          <div className="flex items-center">
            <Image 
              src="/Obsidian_Flash.png" 
              alt="ObsidianFlash Logo" 
              width={100} 
              height={100} 
              className="object-contain" 
            />
          </div>
          
          {/* Title (Center) */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Obsidian Flash
            </h1>
          </div>
          
          {/* History Button (Right) */}
          <div>
            <button
              onClick={() => router.push('/history')}
              className=" text-black bg-white py-2 px-4 rounded-lg font-bold hover:bg-black hover:text-white transition-colors  text-bold text-1xl"
            >
              HISTORY
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="mb-4">
            <label htmlFor="query" className="block text-sm font-semibold text-white mb-5">
              Enter your topic for flashcard generation:
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="input your notes here"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent resize-vertical min-h-[120px] text-black bg-white"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()} 
            className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-white hover:text-black disabled:bg-black disabled:cursor-not-allowed transition-colors disabled:text-white flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Flashcards...
              </>
            ) : (
              'Generate Flashcards'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
