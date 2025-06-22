'use client';

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import Link from "next/link";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Template {
  id: string;
  name: string;
  description: string;
}

type GenerationStatus = 'IDLE' | 'STARTED' | 'NOCATEGORY' | 'MOVIENOTFOUND' | 'PERSONNOTFOUND' | 'READY' | 'ERROR';

const statusMessages = {
  IDLE: 'Enter your query and select a template',
  STARTED: 'Star Graph generation started...',
  NOCATEGORY: 'Query is not recognized as a person or movie title',
  MOVIENOTFOUND: 'Movie with this title was not found',
  PERSONNOTFOUND: 'Person with this name was not found',
  READY: 'Star Graph has been generated!',
  ERROR: 'An error occurred during generation'
};

// Komponent dla pojedynczej gwiazdy
const Star = ({ style }: { style: React.CSSProperties }) => {
  return <div className="absolute bg-white rounded-full star" style={style}></div>;
};

export default function GeneratePage() {
  const [query, setQuery] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [status, setStatus] = useState<GenerationStatus>('IDLE');
  const [infographicId, setInfographicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const statusSectionRef = useRef<HTMLDivElement>(null);

  // Generowanie animowanych gwiazd
  useEffect(() => {
    const starCount = 100;
    const newStars = [];
    
    for (let i = 0; i < starCount; i++) {
      const moveX = Math.random() > 0.5 ? '100%' : '-100%';
      
      newStars.push({
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        opacity: Math.random() * 0.8 + 0.2,
        animationDuration: `${Math.random() * 100 + 50}s, 5s`,
        animationDelay: `${Math.random() * 50}s, ${Math.random() * 5}s`,
        animationName: `drift, twinkle`,
        animationIterationCount: 'infinite, infinite',
        animationTimingFunction: 'linear, ease-in-out',
        animationDirection: 'normal, normal',
        animationFillMode: 'none, none',
        '--move-x': moveX,
      } as React.CSSProperties);
    }
    
    setStars(newStars);
  }, []);

  // Fetch templates from Supabase
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        setTemplatesError(null);
        
        const { data, error } = await supabase
          .from('templates')
          .select('id, name, description')
          .order('name', { ascending: true }); // Sortowanie alfabetyczne po nazwie

        if (error) {
          throw error;
        }
        
        setTemplates(data || []);
        if (data && data.length > 0) {
          setSelectedTemplateId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        setTemplatesError('Failed to load templates. Please refresh the page.');
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  // Check infographic status
  const checkInfographicStatus = async (id: string) => {
    const { data, error } = await supabase
      .from('infographics')
      .select('generation_status')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error checking status:', error);
      setStatus('ERROR');
      return false;
    }

    const newStatus = data.generation_status as GenerationStatus;
    setStatus(newStatus);

    // Stop polling if status is final
    return ['READY', 'NOCATEGORY', 'MOVIENOTFOUND', 'PERSONNOTFOUND', 'ERROR'].includes(newStatus);
  };

  // Generate infographic
  const handleGenerate = async () => {
    if (!query.trim() || !selectedTemplateId) {
      alert('Enter a query and select a template');
      return;
    }

    setIsLoading(true);
    const id = uuidv4();
    setInfographicId(id);
    setStatus('STARTED');

    // Scroll to status section
    setTimeout(() => {
      statusSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);

    try {
      // Call local API endpoint instead of direct webhook
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          id: id,
          template_id: selectedTemplateId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API call error');
      }

      // Start polling status
      const pollStatus = async () => {
        const isComplete = await checkInfographicStatus(id);
        if (!isComplete) {
          setTimeout(pollStatus, 2000); // Check every 2 seconds
        } else {
          setIsLoading(false);
        }
      };

      // First check after 1 second
      setTimeout(pollStatus, 1000);

    } catch (error) {
      console.error('Error generating:', error);
      setStatus('ERROR');
      setIsLoading(false);
    }
  };

  const handleViewInfographic = () => {
    if (infographicId) {
      // Use Link instead of window.open for better navigation
      window.open(`/${infographicId}`, '_blank');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animowane gwiazdy w tle */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        {stars.map((style, index) => (
          <Star key={index} style={style} />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-8 lg:px-16" role="banner">
        <div className="max-w-[1600px] mx-auto text-center">
          <Link 
            href="/"
            className="inline-block transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
            aria-label="Go back to homepage"
          >
            <div className="w-[200px] h-[80px] relative mx-auto">
              <Image 
                src="/logo.png" 
                alt="Star Graphs Logo" 
                fill
                priority
                sizes="200px"
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all duration-300 object-contain"
              />
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-8 lg:px-16" role="main">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-16 mb-8">
            {/* Left side - Concept image */}
            <div className="flex-shrink-0">
              <div className="w-[300px] h-[250px] relative">
                <Image
                  src="/concept2.png"
                  alt="Infographic concept illustration"
                  fill
                  priority
                  sizes="300px"
                  className="object-contain"
                />
              </div>
            </div>
            
            {/* Right side - Title and description */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Generate Your Star Graph
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl">
                Enter a movie title, director or actor, choose style, and let the little spirits from planet SPAM create something magical.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Biała sekcja z formularzem - zawsze widoczna */}
      <div className="relative">
        {/* Białe tło ze skosem na całą szerokość ekranu */}
        <div className="absolute inset-0 bg-white transform -skew-y-1 origin-top-left"></div>
        
        <section className="relative z-10 px-4 sm:px-8 lg:px-16 py-16 pb-16 max-w-[1600px] mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Templates Error */}
            {templatesError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-xl" role="alert">
                <p className="text-red-600 mb-4">{templatesError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Refresh Page
                </button>
              </div>
            )}

            {/* Main Form - Always show */}
            {!templatesError && (
              <>
                {/* Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleGenerate();
                  }}
                  className="bg-white rounded-lg p-8 mb-8 shadow-xl border border-gray-200"
                >
                  <div className="space-y-6">
                    {/* Query Field */}
                    <div>
                      <label htmlFor="query" className="block text-lg font-semibold mb-3 text-black">
                        What are you looking for?
                      </label>
                      <input
                        id="query"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. Leonardo DiCaprio, Matrix, Star Wars..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    {/* Template Selection */}
                    <fieldset>
                      <legend className="block text-lg font-semibold mb-3 text-black">
                        Choose a style
                      </legend>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr" role="radiogroup">
                        {isLoadingTemplates ? (
                          // Skeleton loading dla szablonów
                          <div className="text-center text-gray-500">Loading styles...</div>
                        ) : (
                          templates.map((template) => (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => setSelectedTemplateId(template.id)}
                              disabled={isLoading}
                              role="radio"
                              aria-checked={selectedTemplateId === template.id}
                              className={`p-4 rounded-lg border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white flex flex-col justify-start h-full ${
                                selectedTemplateId === template.id
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-25'
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <h3 className="font-semibold text-black mb-2">{template.name}</h3>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </fieldset>

                    {/* Generate Button */}
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={isLoading || !query.trim() || !selectedTemplateId || isLoadingTemplates}
                        className="bg-purple-600 hover:bg-purple-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-12 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.7)] transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        aria-label={isLoading ? 'Generation in progress' : 'Generate infographic'}
                      >
                        {isLoadingTemplates ? 'Loading styles...' : isLoading ? 'Generating...' : 'Generate Star Graph'}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Generation Status */}
                {status !== 'IDLE' && (
                  <div 
                    ref={statusSectionRef}
                    className="bg-white rounded-lg p-6 mb-8 shadow-xl border border-gray-200" 
                    role="status" 
                    aria-live="polite"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-black">Generation Status</h3>
                        <p className={`text-sm ${
                          status === 'READY' ? 'text-green-600' : 
                          status === 'ERROR' || status === 'NOCATEGORY' || status === 'MOVIENOTFOUND' || status === 'PERSONNOTFOUND' 
                            ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {statusMessages[status]}
                        </p>
                      </div>
                      
                      {status === 'READY' && (
                        <button
                          onClick={handleViewInfographic}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          aria-label="View generated infographic"
                        >
                          View Star Graph
                        </button>
                      )}
                    </div>

                    {isLoading && (
                      <div className="mt-4" aria-label="Generation progress bar">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Information */}
                <div className="text-center text-gray-600 text-sm">
                  <p>Infographic generation may take few seconds. Don't refresh page.</p>
                  <p>We support movies, actors, directors and other personalities from the world of cinema.</p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Stopka ze strony głównej */}
      <main className="relative z-10 max-w-[1600px] mx-auto">
        <footer className="relative z-10 py-8 px-6 text-center text-sm text-white">
          <div className="flex justify-center mb-4">
            <div className="w-[800px] h-[240px] relative">
              <Image
                src="/cookies.png"
                alt=""
                fill
                sizes="200px"
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="font-bold mb-2">
            Star Graphs does not collect any cookies. Your data stays in a galaxy far, far away.
          </p>
          <p>© 2025 AI.vertics</p>
        </footer>
      </main>

      {/* Globalne style dla animacji gwiazd */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        
        @keyframes drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--move-x, 100vw)); }
        }
        
        .star {
          animation-name: drift, twinkle;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
          animation-direction: normal, normal;
        }
      `}</style>
    </div>
  );
}
