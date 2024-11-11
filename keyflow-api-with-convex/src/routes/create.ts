import { Hono } from "hono";
import type {
	CreateKeyRequest,
	CreateKeyResponse,
	Bindings,
} from "../types/api";
import { Redis } from "@upstash/redis/cloudflare";
import { convexMutation } from "../config/convex";
import { generateApiKey } from "../config/key-generator";
import { zValidator } from "@hono/zod-validator";
import { createApiKeySchema } from "../config/schema-validation";

const create = new Hono<{
	Bindings: Bindings;
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
		const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL, CONVEX_URL } =
			c.env;

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

			// Save the request in the database through the workflow
			await convexMutation(CONVEX_URL, "apiRequests:create", {
				method: "POST",
				url: "/keys/create",
				status_code: 200,
				request_body: {
					...body,
				},
				result_body: {
					key: key,
					keyId: keyId,
				},
			});

			return c.json<CreateKeyResponse>({ key, keyId });
		} catch (error) {
			await convexMutation(CONVEX_URL, "apiRequests:create", {
				method: "POST",
				url: "/keys/create",
				status_code: 500,
				request_body: {
					...body,
				},
				result_body: {
					error: error instanceof Error ? error.message : "Unknown error",
				},
			});

			console.error("Error in /keys/create:", error);
			return c.json({ error: "Internal Server Error" }, 500);
		}
	}
);

export default create;
