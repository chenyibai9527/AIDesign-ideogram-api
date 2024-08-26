import { Metadata } from 'next';
import prisma from "@/lib/prisma";
import Image from 'next/image';
import NavBar from '@/components/NavBar';

interface PageProps {
  params: { id: string }
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "'");
}

function truncateTitle(prompt: string, style: string | null, maxLength: number = 60) {
  const baseTitle = `AI-Generated Image: `;
  const availableLength = maxLength - baseTitle.length;
  if (prompt.length <= availableLength) {
    return baseTitle + prompt;
  }
  return baseTitle + prompt.slice(0, availableLength - 3) + '...';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const image = await prisma.image.findUnique({
    where: { id: params.id },
    select: { prompt: true }
  });

  if (!image) {
    return {
      title: 'Image Not Found',
      description: 'Sorry, we couldn&apos;t find the image you requested.'
    };
  }

  const title = escapeHtml(truncateTitle(image.prompt, null));
  const description = escapeHtml(`Explore a unique AI-generated image of ${image.prompt}. Discover the endless possibilities of AI art.`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [`https://aidesign.click/api/image/${params.id}`],
    },
  };
}

export default async function ImagePage({ params }: PageProps) {
  const image = await prisma.image.findUnique({
    where: { id: params.id },
    select: { 
      prompt: true, 
      imageUrl: true, 
      // 删除 width 和 height 字段，因为 Image 模型中没有这些字段
      user: { select: { name: true } }, 
      createdAt: true 
    }
  });

  if (!image) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">Image Not Found</div>
      </>
    );
  }

  const title = escapeHtml(truncateTitle(image.prompt, null));

  return (
    <>
      <NavBar />
      <main className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <div className="relative w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg" style={{ paddingTop: '100%' }}>
                <Image 
                  src={image.imageUrl} 
                  alt={escapeHtml(`${image.prompt} created by ${image.user.name || 'AI'} `)} 
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: title }}>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {escapeHtml(image.prompt)}
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Image Details</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    <span className="font-medium">Created by:</span> {escapeHtml(image.user.name || 'AI')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Created at:</span> {new Date(image.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  This image is a unique piece of art, showcasing the perfect blend of AI technology and creativity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "name": title,
          "description": escapeHtml(image.prompt),
          "contentUrl": `https://aidesign.click/api/image/${params.id}`,
          "creator": {
            "@type": "Person",
            "name": escapeHtml(image.user.name || 'Custom')
          },
          "dateCreated": image.createdAt
        })
      }} />
    </>
  );
}