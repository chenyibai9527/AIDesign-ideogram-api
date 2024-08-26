"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { FaImage, FaCoins, FaMagic, FaPaintBrush, FaLock, FaUnlock, FaGlobe, FaCamera, FaPencilRuler, FaCube, FaUserNinja } from 'react-icons/fa';
import BackgroundAnimation from '@/components/BackgroundAnimation';

type AspectRatio = 'ASPECT_10_16' | 'ASPECT_16_10' | 'ASPECT_9_16' | 'ASPECT_16_9' | 'ASPECT_3_2' | 'ASPECT_2_3' | 'ASPECT_4_3' | 'ASPECT_3_4' | 'ASPECT_1_1' | 'ASPECT_1_3' | 'ASPECT_3_1';
type Model = 'V_1' | 'V_1_TURBO' | 'V_2' | 'V_2_TURBO';
type MagicPromptOption = 'AUTO' | 'ON' | 'OFF';
type Style = 'GENERAL' | 'REALISTIC' | 'DESIGN' | 'RENDER_3D' | 'ANIME';

const styleIcons = {
  GENERAL: FaGlobe,
  REALISTIC: FaCamera,
  DESIGN: FaPencilRuler,
  RENDER_3D: FaCube,
  ANIME: FaUserNinja,
};

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('ASPECT_1_1');
  const [model, setModel] = useState<Model>('V_1_TURBO');
  const [magicPromptOption, setMagicPromptOption] = useState<MagicPromptOption>('AUTO');
  const [style, setStyle] = useState<Style>('GENERAL');
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/credits')
        .then(res => res.json())
        .then(data => {
          if (data.credits !== undefined) {
            setCredits(data.credits);
          } else {
            console.error('Failed to fetch user credits');
          }
        })
        .catch(error => {
          console.error('Error fetching user credits:', error);
        });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }
    setIsLoading(true);
    setImageUrls([]);
    setError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, model, magicPromptOption, style, isPublic }),
      });
      const data = await response.json();
      if (response.ok && data.imageUrls) {
        setImageUrls(data.imageUrls);
        if (data.remainingCredits !== undefined) {
          setCredits(data.remainingCredits);
        }
        // 使用 setTimeout 确保在 DOM 更新后滚动
        setTimeout(() => {
          if (imageRef.current) {
            imageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        setError(`Failed to generate image: ${data.details || data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError('Error generating image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-gray-900">
      <BackgroundAnimation />
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Create Your Image</h1>
        <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prompt input */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prompt <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                rows={4}
                required
                placeholder="Describe the image you want to generate..."
              />
            </div>

            {/* Aspect Ratio and Model selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aspect Ratio <span className="text-red-500">*</span>
                </label>
                <select
                  id="aspectRatio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  required
                >
                  <option value="ASPECT_1_1">1:1 (Square)</option>
                  <option value="ASPECT_16_9">16:9</option>
                  <option value="ASPECT_9_16">9:16</option>
                  <option value="ASPECT_10_16">10:16</option>
                  <option value="ASPECT_16_10">16:10</option>
                  <option value="ASPECT_3_2">3:2</option>
                  <option value="ASPECT_2_3">2:3</option>
                  <option value="ASPECT_4_3">4:3</option>
                  <option value="ASPECT_3_4">3:4</option>
                  <option value="ASPECT_1_3">1:3</option>
                  <option value="ASPECT_3_1">3:1</option>
                </select>
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value as Model)}
                  className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  required
                >
                  <option value="V_1">Version 1</option>
                  <option value="V_1_TURBO">Version 1 Turbo</option>
                  <option value="V_2">Version 2</option>
                  <option value="V_2_TURBO">Version 2 Turbo</option>
                </select>
              </div>
            </div>

            {/* Magic Prompt Option */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Magic Prompt Option
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['AUTO', 'ON', 'OFF'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMagicPromptOption(option as MagicPromptOption)}
                    className={`p-2 rounded-lg text-center text-sm font-medium transition-colors duration-200 ${
                      magicPromptOption === option
                        ? 'bg-[#4E904D] text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-[#3E7A3D] hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Style selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(styleIcons).map(([styleOption, Icon]) => (
                  <button
                    key={styleOption}
                    type="button"
                    onClick={() => setStyle(styleOption as Style)}
                    className={`p-2 rounded-lg text-center text-sm font-medium transition-colors duration-200 flex flex-col items-center ${
                      style === styleOption
                        ? 'bg-[#4E904D] text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-[#3E7A3D] hover:text-white'
                    }`}
                  >
                    <Icon className="mb-1" />
                    {styleOption.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Public/Private toggle */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
                  isPublic ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform duration-200 ease-in-out bg-white rounded-full ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {isPublic ? 'Public Image' : 'Private Image'}
              </span>
            </div>

            {/* Credits and submit button */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">You have {credits} credits left</p>
              <Link href="/pricing" className="text-[#4E904D] hover:text-[#3E7A3D] transition duration-200">
                Get more credits
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading || credits < 1}
              className="w-full bg-[#4E904D] text-white py-2 px-4 rounded-lg hover:bg-[#3E7A3D] focus:outline-none focus:ring-2 focus:ring-[#4E904D] focus:ring-opacity-50 transition duration-200 ease-in-out disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>

        {/* Error message and generated image display */}
        {error && <p className="mt-4 text-red-500 dark:text-red-400 text-center">{error}</p>}
        {credits < 1 && (
          <p className="mt-4 text-center text-red-500 dark:text-red-400">
            You don&apos;t have enough credits. <Link href="/pricing" className="text-[#4E904D] hover:text-[#3E7A3D]">Buy more credits</Link> to generate images.
          </p>
        )}
        {imageUrls.length > 0 && (
          <div ref={imageRef} className="mt-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">Generated Image:</h2>
            <div className="w-full max-w-2xl aspect-square relative">
              <Image 
                src={imageUrls[0]} 
                alt="Generated Image" 
                layout="fill" 
                objectFit="contain" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">Generating your image...</p>
          </div>
        </div>
      )}
    </div>
  );
}