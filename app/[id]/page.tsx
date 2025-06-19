import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// Function to clean content from potential formatting artifacts
function cleanContent(content: string): string {
  if (!content) return content;
  
  return content
    // Remove HTML code block markers
    .replace(/^```html\s*/i, '')
    .replace(/\s*```$/i, '')
    // Remove generic code block markers
    .replace(/^```\s*/, '')
    .replace(/\s*```$/, '')
    // Remove leading/trailing newlines and whitespace
    .replace(/^\s*\n+/, '')
    .replace(/\n+\s*$/, '')
    .trim();
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}

  try {
    const { data: infographic, error } = await supabase
      .from('infographics')
      .select('content, user_query, created_at, generation_status, template_id')
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

    // Clean the content before rendering
    const cleanedContent = cleanContent(infographic.content);

    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        {/* Load template-specific CSS if template_id exists */}
        {infographic.template_id && (
          <link rel="stylesheet" href={`/styles/${infographic.template_id}.css`} />
        )}
        
        {/* Add icon library CSS */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" />
        
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: cleanedContent }}
        />
        
        {/* Floating action buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Udostępnij infografikę"
          >
            <i className="bi bi-share text-[20px]"></i>
          </button>
          
          <button 
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Pobierz infografikę"
          >
            <i className="bi bi-download text-[20px]"></i>
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
      .select('user_query, created_at, template_id')
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
}

export async function generateStaticParams() {
  try {
    const { data: infographics } = await supabase
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