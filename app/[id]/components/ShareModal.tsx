'use client'

import { useState } from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  FacebookIcon,
  LinkedinIcon,
} from 'react-share'

interface ShareModalProps {
  url: string
  title: string
  description: string
}

export default function ShareModal({ url, title, description }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-3 font-medium cursor-pointer font-sans text-base"
        aria-label="Share Star Graph"
      >
        <i className="bi bi-share text-[20px]"></i>
        <span>Share</span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 font-sans text-base"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-slate-700 relative font-sans">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white font-sans">Share Star Graph</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* Social Media Buttons */}
              <div className="flex justify-center gap-4">
                <FacebookShareButton
                  url={url}
                  hashtag="#stargraph"
                  className="hover:scale-110 transition-transform"
                >
                  <FacebookIcon size={48} round />
                </FacebookShareButton>

                <LinkedinShareButton
                  url={url}
                  title={title}
                  summary={description}
                  className="hover:scale-110 transition-transform"
                >
                  <LinkedinIcon size={48} round />
                </LinkedinShareButton>

                {/* Instagram - copy link button */}
                <button
                  onClick={copyToClipboard}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  title="Copy link for Instagram"
                  aria-label="Copy link for Instagram"
                >
                  <i className="bi bi-instagram text-white text-xl"></i>
                </button>
              </div>

              {/* Labels */}
              <div className="flex justify-center gap-4 text-sm text-gray-400 font-sans">
                <span>Facebook</span>
                <span>LinkedIn</span>
                <span>Instagram</span>
              </div>

              {/* Copy Link Section */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <label htmlFor="share-url" className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                  Or copy link:
                </label>
                <div className="flex gap-2">
                  <input
                    id="share-url"
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm border border-slate-600 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors font-sans ${
                      copied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Instagram Instructions */}
              <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-gray-400 font-sans">
                  <i className="bi bi-info-circle mr-1"></i>
                  For Instagram: Copy the link and paste it in your Instagram story or bio
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
