import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const baseUrl = "https://aidesign.click";

  // 获取所有公开图片
  const images = await prisma.image.findMany({
    where: { isPublic: true },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 1000, // 限制数量以避免sitemap过大
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/generate</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${baseUrl}/pricing</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
      ${images
        .map(
          (image) => `
        <url>
          <loc>${baseUrl}/image/${image.id}</loc>
          <lastmod>${image.createdAt.toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
      `
        )
        .join("")}
    </urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
