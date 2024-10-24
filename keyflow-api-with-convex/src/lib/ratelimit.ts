import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Middleware for rate limiting
export async function rateLimitMiddleware(c: any, next: () => Promise<void>) {
	const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = c.env;
	const redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN,
	});

	const ratelimit = new Ratelimit({
		redis: redis,
		limiter: Ratelimit.slidingWindow(5, "30 s"),
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
