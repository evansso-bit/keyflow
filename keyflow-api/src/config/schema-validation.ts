import { z } from "zod";

// Schema for validating the request body
export const createApiKeySchema = z.object({
	apiId: z.string().optional(),
	prefix: z.string().optional(),
	byteLength: z.number().int().min(16).max(32).optional(),
	ownerId: z.string().optional(),
	name: z.string(),
	meta: z
		.object({
			plan: z.string().optional(),
			createdBy: z.string().optional(),
		})
		.optional(),
	expires: z.number().optional(),
	ratelimit: z
		.object({
			type: z.enum(["consistent", "fast"]).optional(),
			limit: z.number().int().positive().optional(),
			refillRate: z.number().int().positive().optional(),
			refillInterval: z.number().int().positive().optional(),
		})
		.optional(),
	remaining: z.number().int().nonnegative().optional(),
	refill: z
		.object({
			amount: z.number().int().positive().optional(),
			interval: z.enum(["daily", "monthly"]).optional(),
		})
		.optional(),
	enabled: z.boolean().optional(),
});

// Schema for validating the request body
export const verifyApiKeySchema = z.object({
	apiKey: z.string(),
});
