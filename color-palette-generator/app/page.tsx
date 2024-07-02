'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ColorPalette from "@/components/ColorPalette"

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [palettes, setPalettes] = useState<string[][]>([])
  const [loading, setLoading] = useState(false)

  const generatePalettes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-palette', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      setPalettes(data.palettes)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Color Palette Generator</h1>
          <p className="text-gray-600">Enter a prompt to generate beautiful color palettes</p>
        </div>
        <div className="flex space-x-4">
          <Input
            placeholder="Enter a prompt for color palette"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow"
          />
          <Button 
            onClick={generatePalettes} 
            disabled={loading}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300 ease-in-out"
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        <div className="space-y-2">
          {palettes.map((palette, index) => (
            <ColorPalette key={index} palette={palette} />
          ))}
        </div>
      </div>
    </main>
  )
}
