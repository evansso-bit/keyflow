import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	api_requests: defineTable({
		method: v.string(),
		request_body: v.object({
			apiId: v.optional(v.string()),
			byteLength: v.optional(v.float64()),
			enabled: v.optional(v.boolean()),
			expires: v.optional(v.float64()),
			key: v.optional(v.string()),
			meta: v.optional(
				v.object({
					createdBy: v.string(),
					plan: v.string(),
				})
			),
			name: v.optional(v.string()),
			ownerId: v.optional(v.string()),
			prefix: v.optional(v.string()),
			ratelimit: v.optional(
				v.object({
					limit: v.float64(),
					refillInterval: v.float64(),
					refillRate: v.float64(),
					type: v.string(),
				})
			),
			refill: v.optional(
				v.object({
					amount: v.float64(),
					interval: v.string(),
				})
			),
			remaining: v.optional(v.float64()),
		}),
		result_body: v.object({
			key: v.optional(v.string()),
			keyId: v.optional(v.string()),
			valid: v.optional(v.boolean()),
		}),
		status_code: v.float64(),
		url: v.string(),
	}),
});
