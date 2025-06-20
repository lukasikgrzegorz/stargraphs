'use client'

import { useState } from 'react'

interface DownloadButtonProps {
  infographicId: string
}

export default function DownloadButton({ infographicId }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    
    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://stargraphs.vercel.app'}/${infographicId}`,
          footerCut: 160
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate screenshot')
      }

      // Pobierz obraz jako blob
      const blob = await response.blob()
      
      // Utwórz URL do pobierania
      const downloadUrl = window.URL.createObjectURL(blob)
      
      // Utwórz element anchor i kliknij
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `star-graph-${infographicId}.png`
      document.body.appendChild(link)
      link.click()
      
      // Wyczyść
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download Star Graph. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button 
      onClick={handleDownload}
      disabled={isDownloading}
      className={`text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-3 font-medium ${
        isDownloading 
          ? 'bg-gray-600 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700'
      }`}
      aria-label="Download Star Graph"
    >
      <i className={`text-[20px] ${
        isDownloading ? 'bi bi-hourglass-split animate-spin' : 'bi bi-download'
      }`}></i>
      <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
    </button>
  )
}
