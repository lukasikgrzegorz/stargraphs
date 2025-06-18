import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}

  try {
    const { data: infographic, error } = await supabase
      .from('infographics')
      .select('content, user_query, created_at, generation_status')
      .eq('id', id)
      .single()

    if (error || !infographic) {
      notFound()
    }

    if (infographic.generation_status !== 'READY') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4" />
            <p className="text-lg">Generowanie infografiki...</p>
            <p className="text-sm text-gray-400 mt-2">Status: {infographic.generation_status}</p>
          </div>
        </div>
      )
    }

    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: infographic.content }}
        />
        
        {/* Floating action buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Udostępnij infografikę"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
          
          <button 
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Pobierz infografikę"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Metadata for SEO */}
        <div className="sr-only">
          <h1>Infografika: {infographic.user_query}</h1>
          <p>Wygenerowano: {new Date(infographic.created_at).toLocaleDateString('pl-PL')}</p>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading infographic:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params

  try {
    const { data: infographic } = await supabase
      .from('infographics')
      .select('user_query, created_at')
      .eq('id', id)
      .single()

    if (!infographic) {
      return {
        title: 'Infografika nie znaleziona - Star Graphs'
      }
    }

    return {
      title: `${infographic.user_query} - Star Graphs`,
      description: `Interaktywna infografika o ${infographic.user_query}. Wygenerowano ${new Date(infographic.created_at).toLocaleDateString('pl-PL')}.`,
      openGraph: {
        title: `${infographic.user_query} - Star Graphs`,
        description: `Stylowa infografika filmowa o ${infographic.user_query}`,
        type: 'website'
      }
    }
  } catch (error) {
    return {
      title: 'Star Graphs - Infografiki filmowe'
    }
  }
}export async function generateStaticParams() {  try {    const { data: infographics } = await supabase
      .from('infographics')
      .select('id')
      .eq('generation_status', 'READY')

    if (!infographics) {
      return []
    }

    return infographics.map((infographic) => ({
      id: infographic.id
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}