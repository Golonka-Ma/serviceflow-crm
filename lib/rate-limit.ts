import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || "",
  token: process.env.UPSTASH_REDIS_TOKEN || "",
});

type RateLimitOptions = {
  limit: number;
  window: number; // w sekundach
};

export async function rateLimit(
  req: NextRequest,
  options: RateLimitOptions = { limit: 10, window: 60 }
) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const key = `rate-limit:${ip}:${req.nextUrl.pathname}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, options.window);
  }

  const remaining = Math.max(0, options.limit - count);

  const res = NextResponse.next();

  res.headers.set("X-RateLimit-Limit", options.limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());

  if (count > options.limit) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": options.window.toString(),
          "X-RateLimit-Limit": options.limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return res;
}
