"use client";

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'

type Image = {
  id: string
  userId: string
  prompt: string
  imageUrl: string
  isPublic: boolean
  createdAt: Date
}

export default function ImageGrid({ images }: { images: Image[] }) {
  console.log('ImageGrid received images:', images)

  if (!images || images.length === 0) {
    return <p>No images to display.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  )
}

function ImageCard({ image }: { image: Image }) {
  const [imgSrc, setImgSrc] = useState(image.imageUrl)

  return (
    <Link href={`/image/${image.id}`} className="block">
      <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg group">
        <div className="absolute inset-0">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={image.prompt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImgSrc('/placeholder.jpg')}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Image not available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-sm line-clamp-2 overflow-hidden">
              {image.prompt}
            </p>
            <p className="text-gray-300 text-xs mt-2">
              {new Date(image.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}