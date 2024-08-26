import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    console.error("Missing session ID");
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const credits = parseInt(session.metadata?.credits || '0');
      const userEmail = session.client_reference_id;

      if (!userEmail) {
        console.error("Missing client_reference_id in session");
        return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
      }

      // 检查这个支付是否已经被处理过
      const existingPayment = await prisma.payment.findUnique({
        where: { sessionId: sessionId },
      });

      if (existingPayment) {
        console.log(`支付 ${sessionId} 已经处理过`);
        return NextResponse.json({ success: true, credits: existingPayment.credits });
      }

      // 使用事务来确保数据一致性
      const result = await prisma.$transaction(async (transactionPrisma) => {
        // 记录这个支付
        const payment = await transactionPrisma.payment.create({
          data: {
            sessionId: sessionId,
            amount: session.amount_total ?? 0,
            credits: credits,
            userEmail: userEmail,
          },
        });

        // 更新用户积分
        const updatedUser = await transactionPrisma.user.update({
          where: { email: userEmail },
          data: { credits: { increment: credits } },
        });

        return { payment, updatedUser };
      });

      console.log(`Payment ${sessionId} processed successfully. Credits added: ${credits}`);
      return NextResponse.json({ success: true, credits: credits });
    } else {
      console.warn(`Payment ${sessionId} not completed`);
      return NextResponse.json({
        success: false,
        error: "Payment not completed",
      });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}