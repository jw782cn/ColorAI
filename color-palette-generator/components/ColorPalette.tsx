// src/components/ColorPalette.tsx
import React, { useRef } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import * as htmlToImage from 'html-to-image'
import { useToast } from "@/components/ui/use-toast"

interface ColorPaletteProps {
  palette: string[]
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ palette }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Color copied!",
      description: `${color.toUpperCase()} has been copied to clipboard.`,
    })
  }

  const downloadPalette = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 1000 // Increased resolution
    const height = 200 // Increased resolution
    canvas.width = width
    canvas.height = height

    const colorWidth = width / palette.length

    palette.forEach((color, index) => {
      ctx.fillStyle = color
      ctx.fillRect(index * colorWidth, 0, colorWidth, height)
    })

    // Add color codes
    palette.forEach((color, index) => {
      const x = (index + 0.5) * colorWidth
      const y = height - 20

      // Calculate contrasting color for text
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      const textColor = (yiq >= 128) ? 'black' : 'white'

      ctx.font = 'bold 16px Arial'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.fillText(color.toUpperCase(), x, y)
    })

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'color-palette.png'
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        toast({
          title: "Palette downloaded",
          description: "Your color palette has been downloaded successfully.",
        })
      }
    }, 'image/png', 1.0) // Highest quality
  }


  return (
    <Card ref={cardRef} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group relative">
      <div className="flex space-x-4">
        {palette.map((color, colorIndex) => (
          <div
            key={colorIndex}
            className="w-1/5 aspect-square rounded-lg overflow-hidden group/color relative cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => copyToClipboard(color)}
          >
            <div 
              className="w-full h-full transition-colors duration-500 ease-in-out"
              style={{ backgroundColor: color }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover/color:opacity-100 transition-opacity duration-300">
              {color.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      <Button
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        variant="secondary"
        size="sm"
        onClick={downloadPalette}
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </Card>
  )
}

export default ColorPalette
