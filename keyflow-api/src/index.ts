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
	const encodedKey = encodeURIComponent(key);
	await redis.set(`key:${keyId}`, JSON.stringify(keyData));
	await redis.set(`lookup:${encodedKey}`, keyId);

	return c.json<CreateKeyResponse>({ key, keyId });
});

// Add request body validation
function isValidVerifyKeyRequest(body: unknown): body is VerifyKeyRequest {
	return (
		typeof body === "object" &&
		body !== null &&
		"key" in body &&
		typeof (body as any).key === "string"
	);
}
// Verify API Key endpoint with enhanced error handling
app.post("/keys/verify", async (c) => {
	const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = c.env;
	const redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN,
	});

	try {
		// Log the raw request body for debugging
		const rawBody = await c.req.text();
		console.log("Raw request body:", rawBody);

		// Attempt to parse JSON
		let body: unknown;
		try {
			body = JSON.parse(rawBody);
		} catch (parseError) {
			console.error("JSON Parse Error:", parseError);
			return c.json(
				{
					error: "Invalid JSON in request body",
					details:
						parseError instanceof Error
							? parseError.message
							: "Unknown parse error",
					receivedBody: rawBody,
				},
				400
			);
		}

		// Validate the parsed body
		if (!isValidVerifyKeyRequest(body)) {
			return c.json(
				{
					error: "Invalid request format",
					details: "Request must include a 'key' field of type string",
					receivedBody: body,
				},
				400
			);
		}

		console.log("Parsed and validated body:", body);

		// Encode the key for Redis lookup
		const encodedKey = encodeURIComponent(body.key);
		console.log("Encoded key:", encodedKey);

		// Attempt Redis lookup
		let keyId: string | null;
		try {
			keyId = await redis.get<string>(`lookup:${encodedKey}`);
			console.log("Redis lookup result:", keyId);
		} catch (redisError) {
			console.error("Redis lookup error:", redisError);
			return c.json(
				{
					error: "Redis lookup failed",
					details:
						redisError instanceof Error
							? redisError.message
							: "Unknown Redis error",
					valid: false,
				},
				500
			);
		}

		if (!keyId) {
			return c.json<VerifyKeyResponse>({ valid: false });
		}

		// Fetch key data
		let keyDataString: string | null;
		try {
			keyDataString = await redis.get<string>(`key:${keyId}`);
			console.log("Key data string:", keyDataString);
		} catch (redisError) {
			console.error("Redis key data fetch error:", redisError);
			return c.json(
				{
					error: "Failed to fetch key data",
					details:
						redisError instanceof Error
							? redisError.message
							: "Unknown Redis error",
					valid: false,
				},
				500
			);
		}

		if (!keyDataString) {
			return c.json<VerifyKeyResponse>({ valid: false });
		}

		// Parse key data
		let keyData: CreateKeyRequest & {
			key: string;
			keyId: string;
			createdAt: number;
		};
		try {
			keyData = JSON.parse(keyDataString);
		} catch (parseError) {
			console.error("Key data parse error:", parseError);
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
		console.error("Unexpected error in /keys/verify:", error);
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

export default app;
