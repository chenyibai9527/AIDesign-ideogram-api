import { RateLimiter } from "limiter";
import { NextRequest, NextResponse } from "next/server";

type RateLimitConfig = {
  interval: number;
  tokensPerInterval: number;
};

export function rateLimit(config: RateLimitConfig) {
  const limiter = new RateLimiter(config);

  return {
    check: async (req: NextRequest, limit: number, token: string) => {
      const identifier = req.ip || "anonymous";
      console.log(`Rate limit check for IP: ${identifier}`);
      const remainingTokens = await limiter.removeTokens(1);
      console.log(`Remaining tokens: ${remainingTokens}`);

      if (remainingTokens < 0) {
        console.log(`Rate limit exceeded for IP: ${identifier}`);
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          {
            status: 429,
            headers: {
              "Retry-After": String(config.interval / 1000),
              "X-RateLimit-Limit": String(config.tokensPerInterval),
              "X-RateLimit-Remaining": String(Math.max(0, remainingTokens)),
              "X-RateLimit-Reset": String(Date.now() + config.interval)
            }
          }
        );
      }

      console.log(`Rate limit check passed for IP: ${identifier}`);
      return null;
    },
  };
}