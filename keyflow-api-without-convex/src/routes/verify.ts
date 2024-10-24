import { Redis } from "@upstash/redis/cloudflare";
import type {
	VerifyKeyRequest,
	VerifyKeyResponse,
	Env,
	CreateKeyRequest,
} from "../types/api";
import { Hono } from "hono";
import { rateLimitMiddleware } from "../lib/ratelimit";

const verify = new Hono<{
	Bindings: Env;
	Env: Env;
}>();

verify.post("/verify", rateLimitMiddleware, async (c) => {
	const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = c.env;
	const redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN,
	});
	const body = await c.req.json<VerifyKeyRequest>();
	try {
		console.log("Parsed request body:", body);

		if (!body.key) {
			return c.json({ error: "key is required" }, 400);
		}

		const encodedKey = encodeURIComponent(body.key);
		const keyId = await redis.get<string>(`lookup:${encodedKey}`);

		console.log("Key ID:", keyId);

		if (keyId) {
			return c.json<VerifyKeyResponse>({ valid: true });
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (!keyId) {
			return c.json<VerifyKeyResponse>({ valid: false });
		}

		// Get the raw string data from Redis
		const keyDataString = await redis.get<string>(`key:${keyId}`);
		console.log("Raw key data from Redis:", keyDataString);

		if (!keyDataString || typeof keyDataString !== "string") {
			return c.json<VerifyKeyResponse>({ valid: false });
		}

		// Parse the string data
		let keyData: CreateKeyRequest & {
			key: string;
			keyId: string;
			createdAt: number;
		};

		try {
			// Handle case where Redis might return an object instead of a string
			if (typeof keyDataString === "object") {
				keyData = keyDataString as any;
			} else {
				keyData = JSON.parse(keyDataString);
			}
		} catch (parseError) {
			console.error("Key data parse error:", parseError);
			// If the data in Redis is corrupt, clean it up
			await Promise.all([
				redis.del(`key:${keyId}`),
				redis.del(`lookup:${encodedKey}`),
			]);
			return c.json(
				{
					error: "Invalid key data in storage",
					details:
						parseError instanceof Error
							? parseError.message
							: "Unknown parse error",
					valid: false,
				},
				500
			);
		}

		if (keyData.expires && keyData.expires < Date.now()) {
			await Promise.all([
				redis.del(`key:${keyId}`),
				redis.del(`lookup:${encodedKey}`),
			]);
			return c.json<VerifyKeyResponse>({ valid: false });
		}

		const response: VerifyKeyResponse = {
			valid: true,
			ownerId: keyData.ownerId,
			meta: keyData.meta,
			expires: keyData.expires,
		};

		if (keyData.ratelimit) {
			response.ratelimit = {
				limit: keyData.ratelimit.limit,
				remaining: keyData.ratelimit.limit,
				reset: Date.now() + keyData.ratelimit.refillInterval,
			};
		}

		return c.json(response);
	} catch (error) {
		console.error("Error in /keys/verify:", error);

		return c.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : "Unknown error",
				valid: false,
			},
			500
		);
	}
});

export default verify;
