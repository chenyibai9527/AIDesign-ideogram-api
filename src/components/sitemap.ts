import prisma from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = "https://aidesign.click";

  // 获取所有公开的图片
  const images = await prisma.image.findMany({
    where: { isPublic: true },
    select: { id: true, createdAt: true }, // 将 updatedAt 改为 createdAt
  });

  const imageUrls = images.map((image) => ({
    url: `${baseUrl}/image/${image.id}`,
    lastModified: image.createdAt, // 使用 createdAt 替代 updatedAt
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/generate`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
    },
    ...imageUrls,
  ];
}