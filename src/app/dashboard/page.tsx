"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import BackgroundAnimation from '@/components/BackgroundAnimation';

type GeneratedImage = {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-48"></div>
        ))}
      </div>
    </div>
  );
}

function UserInfo({ credits }: { credits: number }) {
  const { data: session } = useSession();
  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {session?.user?.name}!</h2>
      <p className="text-lg mb-4">You have <span className="font-bold">{credits}</span> credits remaining.</p>
      <Link 
        href="/pricing" 
        className="bg-[#4E904D] text-white px-4 py-2 rounded-lg hover:bg-[#3E7A3D] transition duration-300"
      >
        Get More Credits
      </Link>
    </div>
  );
}

function ImageGrid({ images }: { images: GeneratedImage[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">您生成的图片</h2>
      {images.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">您还没有生成任何图片。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <Link href={`/image/${image.id}`} className="block relative aspect-square">
                <Image
                  src={image.imageUrl}
                  alt={image.prompt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{formatDate(new Date(image.createdAt))}</p>
                <Link href={`/image/${image.id}`} className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
                  {truncate(image.prompt, 50)}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const [creditsResponse, imagesResponse] = await Promise.all([
        fetch('/api/user/credits'),
        fetch('/api/user/images')
      ]);
      const creditsData = await creditsResponse.json();
      const imagesData = await imagesResponse.json();
      setCredits(creditsData.credits);
      setGeneratedImages(imagesData.images);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-100 dark:bg-gray-900">
      <BackgroundAnimation />
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">仪表板</h1>
        <Suspense fallback={<SkeletonLoader />}>
          <UserInfo credits={credits} />
          <ImageGrid images={generatedImages} />
        </Suspense>
      </div>
    </div>
  );
}