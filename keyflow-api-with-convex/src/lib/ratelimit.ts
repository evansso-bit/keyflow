import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import { env } from "hono/adapter";
import type { Context, Next } from "hono";
import type { Bindings } from "../types/api";

// Middleware for rate limiting
export async function rateLimitMiddleware(c: Context, next: Next) {
	const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = env<Bindings>(c);

	const ratelimit = new Ratelimit({
		redis: new Redis({
			url: UPSTASH_REDIS_REST_URL,
			token: UPSTASH_REDIS_REST_TOKEN,
		}),
		limiter: Ratelimit.slidingWindow(5, "30 s"),
		analytics: true,
	});

	const ip = c.req.header("CF-Connecting-IP") || "127.0.0.1";
	const { success, limit, remaining, reset } = await ratelimit.limit(ip);

	if (!success) {
		return c.json({ error: "Rate limit exceeded" }, 429);
	}

	c.header("X-RateLimit-Limit", limit.toString());
	c.header("X-RateLimit-Remaining", remaining.toString());
	c.header("X-RateLimit-Reset", reset.toString());

	await next();
}
