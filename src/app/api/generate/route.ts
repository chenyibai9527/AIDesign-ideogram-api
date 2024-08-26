import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/auth-options'
import { rateLimit } from '@/lib/rate-limit'
import { logApiCall } from '@/lib/logApiCall'

type AspectRatio = 'ASPECT_10_16' | 'ASPECT_16_10' | 'ASPECT_9_16' | 'ASPECT_16_9' | 'ASPECT_3_2' | 'ASPECT_2_3' | 'ASPECT_4_3' | 'ASPECT_3_4' | 'ASPECT_1_1' | 'ASPECT_1_3' | 'ASPECT_3_1';
type Model = 'V_1' | 'V_1_TURBO' | 'V_2' | 'V_2_TURBO';
type MagicPromptOption = 'AUTO' | 'ON' | 'OFF';
type Style = 'GENERAL' | 'REALISTIC' | 'DESIGN' | 'RENDER_3D' | 'ANIME';

interface GenerateImageRequest {
  prompt: string;
  aspectRatio: AspectRatio;
  model: Model;
  magicPromptOption: MagicPromptOption;
  style: Style;
  isPublic: boolean;
}

const limiter = rateLimit({
  interval: 60 * 1000, // 1分钟
  tokensPerInterval: 100, // 暂时增加到每分钟100个请求
})

export async function POST(req: NextRequest) {
  console.log('New request received');
  console.log('Request IP:', req.ip);
  console.log('Request method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers));
  console.log('Referer:', req.headers.get('referer'));
  console.log('Expected base URL:', process.env.NEXT_PUBLIC_BASE_URL);

  const ip = req.ip || 'unknown'
  const userAgent = req.headers.get('user-agent') || null
  let status = 200
  let userId: string | null = null

  try {
    // 检查 referer（仅在生产环境中）
    if (process.env.NODE_ENV === 'production') {
      const referer = req.headers.get('referer')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      if (!referer || !baseUrl || !referer.includes(baseUrl)) {
        console.log('Invalid referer. Referer:', referer, 'Base URL:', baseUrl);
        status = 403
        throw new Error("Invalid referer")
      }
    } else {
      console.log('Skipping referer check in development environment');
    }

    // 速率限制
    console.log('Checking rate limit...');
    const rateLimitResult = await limiter.check(req, 10, 'CACHE_TOKEN')
    if (rateLimitResult instanceof NextResponse) {
      console.log('Rate limit exceeded. Remaining tokens:', rateLimitResult.headers.get('X-RateLimit-Remaining'));
      status = 429
      throw new Error("Rate limit exceeded")
    }
    console.log('Rate limit check passed.');

    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      status = 401
      throw new Error("Unauthorized")
    }

    userId = session.user.id

    const { prompt, aspectRatio, model, magicPromptOption, style, isPublic }: GenerateImageRequest = await req.json()

    // 验证输入
    if (!prompt || !aspectRatio || !model || !magicPromptOption || !style) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 验证模型选项
    if (!['V_1', 'V_1_TURBO', 'V_2', 'V_2_TURBO'].includes(model)) {
      return NextResponse.json({ error: "Invalid model selection" }, { status: 400 })
    }

    // 验证宽高比选项
    const validAspectRatios = ['ASPECT_10_16', 'ASPECT_16_10', 'ASPECT_9_16', 'ASPECT_16_9', 'ASPECT_3_2', 'ASPECT_2_3', 'ASPECT_4_3', 'ASPECT_3_4', 'ASPECT_1_1', 'ASPECT_1_3', 'ASPECT_3_1'];
    if (!validAspectRatios.includes(aspectRatio)) {
      return NextResponse.json({ error: "Invalid aspect ratio selection" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      status = 404
      throw new Error("User not found")
    }

    if (user.credits < 1) {
      status = 403
      throw new Error("Insufficient credits")
    }

    // 调用 Ideogram API
    console.log('Calling Ideogram API...');
    const response = await fetch("https://api.ideogram.ai/generate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Api-Key": process.env.IDEOGRAM_API_KEY as string,
      },
      body: JSON.stringify({
        image_request: {
          model: model,
          magic_prompt_option: magicPromptOption,
          aspect_ratio: aspectRatio,
          prompt: prompt,
          style: style,
        }
      }),
    })

    console.log('Ideogram API response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ideogram API error:', errorText);
      status = response.status
      throw new Error(`Ideogram API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Ideogram API response data:', data);

    if (data.data && data.data.length > 0) {
      const imageUrls = data.data.map((item: any) => item.url)
      console.log('Generated image URLs:', imageUrls);

      // 扣除积分
      console.log('Deducting credits...');
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      })
      console.log('Credits deducted. Remaining credits:', updatedUser.credits);

      // 保存生成的图片到数据库
      console.log('Saving images to database...');
      await Promise.all(imageUrls.map((url: string) => 
        prisma.image.create({
          data: {
            userId: user.id,
            prompt,
            imageUrl: url,
            isPublic,
          },
        })
      ))
      console.log('Images saved to database');

      return NextResponse.json({ imageUrls, remainingCredits: updatedUser.credits })
    } else {
      status = 500
      throw new Error('No image generated')
    }
  } catch (error: unknown) {
    console.error('Error generating image:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to generate image', details: error.message },
        { status }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to generate image', details: 'An unknown error occurred' },
        { status: 500 }
      )
    }
  } finally {
    // 记录 API 调用
    console.log('Logging API call...');
    await logApiCall(
      userId,
      '/api/generate',
      'POST',
      status,
      ip,
      userAgent
    )
    console.log('API call logged');
  }
}