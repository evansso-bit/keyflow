import { zValidator } from "@hono/zod-validator";
import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { generateApiKey } from "../config/generateApiKey";
import { createApiKeySchema } from "../config/schema-validation";
import type { CreateKeyRequest, CreateKeyResponse, Env } from "../types/api";

const create = new Hono<{
	Bindings: Env;
}>();

// Create API Key endpoint with proper JSON stringification
create.post(
	"/create",
	zValidator("json", createApiKeySchema, (result, c) => {
		if (!result.success) {
			return c.text("Invalid!", 400);
		}
	}),
	async (c) => {
		const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = c.env;
		const redis = new Redis({
			url: UPSTASH_REDIS_REST_URL,
			token: UPSTASH_REDIS_REST_TOKEN,
		});
		const body = await c.req.json<CreateKeyRequest>();

		const keyId = crypto.randomUUID();
		const key = generateApiKey(body.prefix, body.byteLength || 16);

		const keyData = {
			...body,
			key,
			keyId,
			createdAt: Date.now(),
		};

		// Make sure to stringify the keyData before storing
		const encodedKey = encodeURIComponent(key);

		try {
			await redis.set(`key:${keyId}`, JSON.stringify(keyData));
			await redis.set(`lookup:${encodedKey}`, keyId);

			return c.json<CreateKeyResponse>({ key, keyId });
		} catch (error) {
			console.error("Error in /keys/create:", error);
			return c.json({ error: "Internal Server Error" }, 500);
		}
	},
);

export default create;
