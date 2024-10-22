import { Hono } from "hono";
import { env } from "hono/adapter";

import { Redis } from "@upstash/redis/cloudflare";

type Env = {
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
};

const app = new Hono<{
	Bindings: Env;
	Env: Env;
}>();

// Types for our API key schema
type CreateKeyRequest = {
	apiId: string;
	prefix?: string;
	byteLength?: number;
	ownerId?: string;
	name?: string;
	meta?: Record<string, unknown>;
	expires?: number;
	ratelimit?: {
		type: "fast" | "consistent";
		limit: number;
		refillRate: number;
		refillInterval: number;
	};
	remaining?: number;
	refill?: {
		amount: number;
		interval: "daily" | "monthly";
	};
	enabled?: boolean;
};

type CreateKeyResponse = {
	key: string;
	keyId: string;
};

type VerifyKeyRequest = {
	key: string;
};

type VerifyKeyResponse = {
	valid: boolean;
	ownerId?: string;
	meta?: Record<string, unknown>;
	expires?: number;
	ratelimit?: {
		limit: number;
		remaining: number;
		reset: number;
	};
};

// Helper function to generate API keys
function generateApiKey(
	prefix: string | undefined,
	byteLength: number
): string {
	const randomBytes = crypto.getRandomValues(new Uint8Array(byteLength));
	const key = btoa(String.fromCharCode(...new Uint8Array(randomBytes)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
	return prefix ? `${prefix}_${key}` : key;
}

// Create API Key endpoint
app.post("/keys/create", async (c) => {
	const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = c.env;
	const redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN,
	});
	const body = await c.req.json<CreateKeyRequest>();

	const apiId = body.apiId || crypto.randomUUID();

	const keyId = crypto.randomUUID();
	const key = generateApiKey(body.prefix, body.byteLength || 16);

	const keyData = {
		...body,
		key,
		keyId,
		createdAt: Date.now(),
	};

	// Encode the key before storing
	await redis.set(`key:${keyId}`, JSON.stringify(keyData));
	await redis.set(`lookup:${encodeURIComponent(key)}`, keyId);

	return c.json<CreateKeyResponse>({ key, keyId });
});

// Verify API Key endpoint
app.post("/keys/verify", async (c) => {
	const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = c.env;
	const redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN,
	});
	try {
		const body = await c.req.json<VerifyKeyRequest>();

		if (!body.key) {
			return c.json({ error: "key is required" }, 400);
		}

		// Encode the key before retrieving, but don't encode the underscore
		const encodedKey = body.key
			.split("_")
			.map((part) => encodeURIComponent(part))
			.join("_");
		const keyId = await redis.get<string>(`lookup:${encodedKey}`);
		if (!keyId) {
			return c.json<VerifyKeyResponse>({ valid: false });
		}

		const keyDataString = await redis.get<string>(`key:${keyId}`);
		if (!keyDataString) {
			return c.json<VerifyKeyResponse>({ valid: false });
		}

		const keyData = JSON.parse(keyDataString) as CreateKeyRequest & {
			key: string;
			keyId: string;
			createdAt: number;
		};

		if (keyData.expires && keyData.expires < Date.now()) {
			await redis.del(`key:${keyId}`);
			await redis.del(`lookup:${encodedKey}`);
			return c.json<VerifyKeyResponse>({ valid: false });
		}

		// Remove ownerId and apiId from the response
		const { ownerId, apiId, ...responseData } = keyData;

		const response: VerifyKeyResponse = {
			valid: true,
			meta: responseData.meta,
			expires: responseData.expires,
		};

		if (responseData.ratelimit) {
			response.ratelimit = {
				limit: responseData.ratelimit.limit,
				remaining: responseData.ratelimit.limit, // This should be updated based on actual usage
				reset: Date.now() + responseData.ratelimit.refillInterval,
			};
		}

		return c.json(response);
	} catch (error) {
		return c.json({ error: `Internal Server Error: ${error}` }, 500);
	}
});

export default app;
