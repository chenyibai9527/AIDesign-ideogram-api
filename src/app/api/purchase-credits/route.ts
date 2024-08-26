import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/auth-options";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { amount } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 这里应该添加实际的支付处理逻辑

    // 更新用户积分
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: { credits: { increment: amount } },
    });

    return NextResponse.json({ credits: updatedUser.credits });
  } catch (error) {
    console.error("Error purchasing credits:", error);
    return NextResponse.json(
      { error: "Failed to purchase credits" },
      { status: 500 }
    );
  }
}
