import prisma from "@/lib/prisma";

export async function logApiCall(
  userId: string | null,
  endpoint: string,
  method: string,
  status: number,
  ip: string,
  userAgent: string | null
) {
  try {
    await prisma.apiLog.create({
      data: {
        userId,
        endpoint,
        method,
        status,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log API call:", error);
  }
}
