'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

// Komponent dla pojedynczej gwiazdy
const Star = ({ style }: { style: React.CSSProperties }) => {
  return <div className="absolute bg-white rounded-full star" style={style}></div>;
};

// Przykładowe dane dla Star Graphs (zaślepki)
const sampleGraphs = [
  { id: 1, title: "Star Wars Saga", image: "/placeholder-graph-1.jpg" },
  { id: 2, title: "Marvel Universe", image: "/placeholder-graph-2.jpg" },
  { id: 3, title: "Christopher Nolan Films", image: "/placeholder-graph-3.jpg" },
];

export default function Home() {
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  
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
            <Image 
              src="/logo.png" 
              alt="Star Graphs Logo" 
              width={300} 
              height={120}
              priority
              className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
            
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
            <Image 
              src="/hero.png" 
              alt="Star Graphs visualization example" 
              width={600} 
              height={400}
              className="rounded-lg shadow-2xl transition-all duration-500 animate-float"
            />
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
            {sampleGraphs.map((graph) => (
              <Link 
                key={graph.id} 
                href={`#`}
                className="group"
              >
                <button className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg overflow-hidden border border-purple-500 transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black cursor-pointer">
                  <div className="h-48 relative bg-purple-800/30">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-purple-900/60 z-10"></div>
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-100">{graph.title}</h3>
                    <div className="text-purple-200 hover:text-white text-sm flex items-center gap-1">
                      View graph 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </button>
              </Link>
            ))}
          </div>
          
          {/* Obrazek na środku pod listą grafów */}
          <div className="flex justify-center mt-12">
            <Image
              src="/concept1.png"
              alt=""
              width={500}
              height={300}
              className="object-contain"
              aria-hidden="true"
            />
          </div>
        </section>
      </div>
      
      <main className="relative z-10 max-w-[1600px] mx-auto">
        {/* Stopka */}
        <footer className="relative z-10 py-8 px-6 text-center text-sm text-white">
          <div className="flex justify-center mb-4">
            <Image
              src="/cookies.png"
              alt=""
              width={200}
              height={60}
              className="object-contain"
              aria-hidden="true"
            />
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
      `}</style>
    </div>
  );
}
