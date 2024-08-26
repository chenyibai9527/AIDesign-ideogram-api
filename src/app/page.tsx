"use client";

import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import ImageGrid from "@/components/ImageGrid"
import NavBar from "@/components/NavBar"
import Link from "next/link"
import BackgroundAnimation from "@/components/BackgroundAnimation"
import useSWRInfinite from 'swr/infinite'
import SEO from '@/components/SEO'
import Script from 'next/script'
import { ErrorBoundary } from 'react-error-boundary'

type Image = {
  id: string
  userId: string
  prompt: string
  imageUrl: string
  isPublic: boolean
  createdAt: Date
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert">
      <p>There was an error:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export default function Home() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.images.length) return null
    return `/api/images?page=${pageIndex + 1}&limit=12`
  }

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher)

  const images = data ? data.flatMap(page => page?.images || []) : []
  const isLoadingMore = data && typeof data[size - 1] === "undefined"
  const isEmpty = images.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.images?.length < 12)

  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1)
    }
  }, [isReachingEnd, isLoadingMore, setSize, size])

  useEffect(() => {
    if (error) {
      console.error('Error fetching images:', error)
    } else if (data) {
      console.log('Fetched images:', images.length)
      setIsLoading(false)
    }
  }, [error, data, images.length])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AIDesign",
    "url": "https://aidesign.click",
    "description": "AI-powered image generation tool",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://aidesign.click/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <main className="min-h-screen relative overflow-hidden">
        <BackgroundAnimation />
        <NavBar />
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <SEO 
            title="AI-Powered Image Generation"
            description="Transform your ideas into stunning visuals with our AI-powered image generation tool. Create unique, high-quality images from text descriptions."
            canonicalUrl="https://aidesign.click"
            ogImage="https://aidesign.click/logo.png"
          />
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <h1 className="text-4xl md:text-5xl font-bold text-center my-8 text-gray-800">
            Transform Your Ideas into Visuals
          </h1>
          <p className="text-xl text-center mb-8 text-gray-600">
            Bring your imagination to life with AI-powered design creation
          </p>
          <div className="text-center mb-12">
            <Link href="/generate" className="bg-white bg-opacity-40 text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-60 transition duration-300 backdrop-blur-sm shadow-lg">
              Create Now
            </Link>
          </div>
          {isLoading && <p>Loading images...</p>}
          {error && <p>Error: {error.message}</p>}
          {!isLoading && !error && <ImageGrid images={images} />}
          {!isReachingEnd && !isLoading && (
            <div className="text-center mt-8">
              <button 
                onClick={loadMore} 
                className="bg-white bg-opacity-40 text-black px-6 py-2 rounded-full text-lg font-semibold hover:bg-opacity-60 transition duration-300 backdrop-blur-sm shadow-lg"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </main>
    </ErrorBoundary>
  )
}