import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
	args: {
		method: v.string(),
		url: v.string(),
		status_code: v.number(),
		request_body: v.optional(
			v.object({
				name: v.optional(v.string()),
				apiId: v.optional(v.string()),
				prefix: v.optional(v.string()),
				byteLength: v.optional(v.number()),
				ownerId: v.optional(v.string()),
				meta: v.optional(
					v.object({
						plan: v.optional(v.string()),
						createdBy: v.optional(v.string()),
					})
				),
				expires: v.optional(v.number()),
				ratelimit: v.optional(
					v.object({
						type: v.optional(v.string()),
						limit: v.optional(v.number()),
						refillRate: v.optional(v.number()),
						refillInterval: v.optional(v.number()),
					})
				),
				remaining: v.optional(v.number()),
				refill: v.optional(
					v.object({
						amount: v.optional(v.number()),
						interval: v.optional(v.string()),
					})
				),
				enabled: v.optional(v.boolean()),
				key: v.optional(v.string()),
			})
		),
		result_body: v.optional(
			v.object({
				key: v.optional(v.string()),
				keyId: v.optional(v.string()),
				valid: v.optional(v.boolean()),
				error: v.optional(v.string()),
			})
		),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("api_requests", args);
	},
});

export const get = query({
	handler: async (ctx) => {
		const data = await ctx.db.query("api_requests").order("desc").collect();

		return data.map((item) => ({
			id: item._id,
			method: item.method,
			statusCode: item.status_code,
			path: item.url,
			createdAt: item._creationTime,
			request_body: item.request_body,
		}));
	},
});

export const getByPath = query({
	args: {
		path: v.string(),
	},
	handler: async (ctx, args) => {
		const data = await ctx.db
			.query("api_requests")
			.filter((q) => q.eq(q.field("url"), args.path))
			.collect();
		return data.map((item) => ({
			id: item._id,
			method: item.method,
			statusCode: item.status_code,
			path: item.url,
			createdAt: item._creationTime,
			request_body: item.request_body,
			response_body: item.result_body,
		}));
	},
});

export const getById = query({
	args: {
		id: v.id("api_requests"),
	},
	handler: async (ctx, args) => {
		const data = await ctx.db.get(args.id);
		return {
			requestData: data?.request_body,
			responseData: data?.result_body,
			path: data?.url,
			statusCode: data?.status_code,
		};
	},
});
