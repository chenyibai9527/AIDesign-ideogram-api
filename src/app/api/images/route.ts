import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const skip = (page - 1) * limit;

  // 添加缓存控制头
  const headers = new Headers();
  headers.append('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');

  try {
    const [images, totalCount] = await Promise.all([
      prisma.image.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
        select: {
          id: true,
          prompt: true,
          imageUrl: true,
          createdAt: true,
        },
      }),
      prisma.image.count({ where: { isPublic: true } })
    ]);

    console.log('API: Fetched images:', images.length);
    
    // 验证图片 URL
    const validImages = images.map(img => ({
      ...img,
      imageUrl: img.imageUrl && img.imageUrl.startsWith('http') ? img.imageUrl : '/placeholder.jpg'
    }));
    
    return NextResponse.json({
      images: validImages,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    }, { headers });
  } catch (error) {
    console.error('API: Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500, headers });
  }
}