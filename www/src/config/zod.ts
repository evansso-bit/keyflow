import { z } from "zod";

export const formSchema = z.object({
	apiId: z.string().min(1, "API ID is required"),
	prefix: z.string().optional(),
	byteLength: z.number().int().min(16).max(32).default(16),
	ownerId: z.string().optional(),
	name: z.string().optional(),
	meta: z.record(z.unknown()).optional(),
	expires: z.number().optional(),
	ratelimit: z
		.object({
			type: z.enum(["consistent", "fast"]),
			limit: z.number().int().positive(),
			refillRate: z.number().int().positive(),
			refillInterval: z.number().int().positive(),
		})
		.optional(),
	remaining: z.number().int().nonnegative().optional(),
	refill: z
		.object({
			amount: z.number().int().positive(),
			interval: z.enum(["daily", "monthly"]),
		})
		.optional(),
	enabled: z.boolean().default(true),
});
