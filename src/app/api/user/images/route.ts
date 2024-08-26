import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 首先查找用户
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 然后使用用户ID查询图片
    const images = await prisma.image.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20, // 限制为最近的20张图片
      select: {
        id: true,
        prompt: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching user images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}