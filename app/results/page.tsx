'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import image from 'public/ObsidianFlash.png';

export default function Results() {
  const [response, setResponse] = useState('')
  const [originalQuery, setOriginalQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Get the response from sessionStorage
    const flashcardResponse = sessionStorage.getItem('flashcardResponse')
    const query = sessionStorage.getItem('originalQuery')
    
    console.log('Retrieved from sessionStorage:', { flashcardResponse, query }) // Debug log
    
    if (flashcardResponse && flashcardResponse !== 'undefined') {
      setResponse(flashcardResponse)
      setOriginalQuery(query || '')
    } else {
      console.log('No valid response data, redirecting to home')
      // If no response data, redirect back to home
      router.push('/')
    }
  }, [router])

  const handleNewInput = () => {
    // Clear the stored data and go back to input page
    sessionStorage.removeItem('flashcardResponse')
    sessionStorage.removeItem('originalQuery')
    router.push('/')
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response)
      alert('Flashcards copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([response], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = 'flashcards.md'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSaveToHistory = () => {
    try {
      // Get existing history
      const existingHistory = localStorage.getItem('flashcardHistory')
      const history = existingHistory ? JSON.parse(existingHistory) : []
      
      // Create new history item
      const newItem = {
        id: Date.now().toString(),
        query: originalQuery,
        response: response,
        timestamp: new Date().toISOString()
      }
      
      // Add to beginning of array (most recent first)
      history.unshift(newItem)
      
      // Keep only last 50 items to prevent storage overflow
      if (history.length > 50) {
        history.splice(50)
      }
      
      // Save to localStorage
      localStorage.setItem('flashcardHistory', JSON.stringify(history))
      alert('Flashcards saved to history!')
    } catch (error) {
      console.error('Error saving to history:', error)
      alert('Failed to save to history')
    }
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1f1f1f]">
        <div className="text-black text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main>
<header className="w-full px-6 py-4 bg-[#1f1f1f]">
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
          
          {/* Title (Right) */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Obsidian Flash
            </h1>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-[#1f1f1f] p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Generated Flashcards</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button
              onClick={handleNewInput}
              className="bg-white text-black py-3 px-6 rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
            >
              ← Create New Flashcards
            </button>
            
            <button
              onClick={handleSaveToHistory}
              className="bg-white text-black py-3 px-6 rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
            >
              💾 Save to History
            </button>
            
            <button
              onClick={handleCopyToClipboard}
              className="bg-white text-black py-3 px-6 rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
            >
              📋 Copy to Clipboard
            </button>
            
            <button
              onClick={handleDownload}
              className="bg-white text-black py-3 px-6 rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
            >
              📥 Download as .md
            </button>
          </div>

          {/* Results Display */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-black">Your Flashcards</h2>
              <p className="text-sm text-black mt-1">
                Ready to import into Obsidian with the Spaced Repetition plugin
              </p>
            </div>
            
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-black font-mono leading-relaxed overflow-x-auto">
                {response}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-black rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">📝 How to use these flashcards:</h3>
            <ol className="text-gray-300 space-y-2 list-decimal list-inside">
              <li>Copy the flashcards above or download the .md file</li>
              <li>Create a new note in your Obsidian vault</li>
              <li>Paste the content into the note</li>
              <li>Make sure you have the "Spaced Repetition" plugin by Stephen Mwangi installed</li>
              <li>Add the title to the flashcard tags in spaced repetition</li>
              <li>Start studying your new flashcards!</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}
