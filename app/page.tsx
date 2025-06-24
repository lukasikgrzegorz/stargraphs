'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Komponent dla pojedynczej gwiazdy
const Star = ({ style }: { style: React.CSSProperties }) => {
  return <div className="absolute bg-white rounded-full star" style={style}></div>;
};

// Typ dla infografiki
type Infographic = {
  id: string;
  user_query: string;
  content: string;
  created_at: string;
};

// Inicjalizacja klienta Supabase (przenieś dane do .env.local w produkcji)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const [recentGraphs, setRecentGraphs] = useState<Infographic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedIframes, setLoadedIframes] = useState<Record<string, boolean>>({});

  // Pobieranie najnowszych infografik
  useEffect(() => {
    const fetchRecentGraphs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('infographics')
          .select('*')
          .eq('generation_status', 'READY') // Zakładając, że taki status oznacza gotową infografikę
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        setRecentGraphs(data as Infographic[]);
      } catch (err) {
        console.error('Błąd pobierania infografik:', err);
        setError('Failed to load recent graphs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentGraphs();
  }, []);

  useEffect(() => {
    // Generowanie losowych gwiazd
    const starCount = 100;
    const newStars = [];

    for (let i = 0; i < starCount; i++) {
      // Losowy kierunek ruchu (poziomy)
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

  // Funkcja obsługująca załadowanie iframe
  const handleIframeLoad = (graphId: string) => {
    setLoadedIframes(prev => ({
      ...prev,
      [graphId]: true
    }));
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animowane gwiazdy w tle */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        {stars.map((style, index) => (
          <Star key={index} style={style} />
        ))}
      </div>

      {/* Główna zawartość */}
      <main className="relative z-10 px-4 sm:px-8 lg:px-16 py-12 max-w-[1600px] mx-auto">
        {/* Sekcja Hero */}
        <section className="flex flex-col m-auto lg:flex-row items-center justify-between gap-12" aria-labelledby="hero-title">
          <div className="flex flex-col items-center gap-8 lg:w-1/2">
            <div className="w-[300px] h-[120px] relative">
              <Image 
                src="/logo.png" 
                alt="Star Graphs Logo" 
                fill
                priority
                sizes="300px"
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] object-contain"
              />
            </div>
            
            <h1 
              id="hero-title"
              className="text-3xl md:text-4xl lg:text-5xl text-center font-bold tracking-wider"
            >
              Turning Internet Junk into Stellar Stories
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 text-center lg:text-left max-w-xl">
              A long time ago, in a galaxy not so far away, on the planet SPAM...
              Tiny good spirits searched through Internet junk, trying to build something meaningful.
              Big fans of Hollywood, they craft eye-catching infographics about movies and stars.
              Dare to ask them for content?
            </p>
            
            <Link 
              href="/generate"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.7)] transform hover:scale-105 cursor-pointer inline-block text-center"
              aria-label="Generate your star graph"
            >
              Generate Your Star Graph
            </Link>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="w-[95vw] h-[400px] md:h-[550px] relative">
              <Image 
                src="/hero.png" 
                alt="Star Graphs visualization example" 
                fill
                priority
                sizes="(max-width: 768px) 95vw, (max-width: 1200px) 500px, 800px"
                className="rounded-lg shadow-2xl transition-all duration-500 animate-float object-contain"
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Sekcja ostatnich grafik z białym tłem na całą szerokość */}
      <div className="relative">
        {/* Białe tło ze skosem na całą szerokość ekranu */}
        <div className="absolute inset-0 bg-white transform -skew-y-1 origin-top-left"></div>
        
        <section className="relative z-10 px-4 sm:px-8 lg:px-16 py-16 pb-16 max-w-[1600px] mx-auto" aria-labelledby="recent-graphs">
          <h2 id="recent-graphs" className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Recent Star Graphs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              // Stan ładowania
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="w-full bg-purple-100 rounded-lg overflow-hidden border border-purple-200 animate-pulse" aria-hidden="true">
                  <div className="h-96 bg-purple-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-purple-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-purple-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              // Stan błędu
              <div className="md:col-span-3 text-center p-8 bg-red-100 text-red-700 rounded-lg">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Refresh page
                </button>
              </div>
            ) : recentGraphs.length > 0 ? (
              // Infografiki z bazy danych
              recentGraphs.map((graph) => (
                <Link 
                  key={graph.id} 
                  href={`/${graph.id}`}
                  className="group"
                >
                  <div className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg overflow-hidden border border-purple-500 transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black cursor-pointer">
                    <div className="h-96 relative overflow-hidden bg-white">
                      {/* Placeholder podczas ładowania */}
                      {!loadedIframes[graph.id] && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                          <div className="w-12 h-12 border-4 border-t-purple-600 border-r-purple-600 border-b-transparent border-l-transparent rounded-full animate-spin mb-4" role="status" aria-label="Loading"></div>
                          <p className="text-purple-700 font-medium">Loading graph...</p>
                        </div>
                      )}
                      
                      {/* iframe z zawartością infografiki */}
                      <iframe 
                        src={`/${graph.id}`}
                        title={`Preview of ${graph.user_query}`}
                        className={`w-full h-full border-none bg-white transition-opacity duration-500 ${loadedIframes[graph.id] ? 'opacity-100' : 'opacity-0'}`}
                        sandbox="allow-same-origin"
                        scrolling="no"
                        style={{ 
                          overflow: 'hidden', 
                          filter: 'none',
                          transform: 'translateY(-400px)',
                          height: 'calc(100% + 400px)',
                          pointerEvents: 'none',
                          userSelect: 'none'
                        }}
                        onLoad={() => handleIframeLoad(graph.id)}
                        aria-hidden="true"
                      ></iframe>
                    </div>
                    <div className="p-4 text-left">
                      <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-100 truncate">{graph.user_query}</h3>
                      <div className="text-purple-200 hover:text-white text-sm flex items-center gap-1">
                        View graph 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Brak infografik
              <div className="md:col-span-3 text-center p-8 bg-purple-100 text-purple-700 rounded-lg">
                <p className="text-xl font-medium">No infographics to display</p>
                <p className="mt-2">Be the first to create a Star Graph!</p>
                <Link
                  href="/generate"
                  className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create first Star Graph
                </Link>
              </div>
            )}
          </div>
          
          {/* Obrazek na środku pod listą grafów */}
          <div className="flex justify-center mt-12">
            <div className="w-[500px] h-[300px] relative">
              <Image
                src="/concept1.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </div>
        </section>
      </div>
      
      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Stopka */}
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
          <p>© 2025 <Link 
            href="https://aivertics.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-bold"
          >
            AI.Vertics
          </Link></p>
        </footer>
      </div>
      
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
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .star {
          animation-name: drift, twinkle;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
          animation-direction: normal, normal;
        }
        
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}