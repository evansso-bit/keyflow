import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
	args: {
		method: v.string(),
		url: v.string(),
		status_code: v.number(),
		body: v.optional(v.object({})),
		created_at: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("api_requests", args);
	},
});

export const get = query({
	handler: async (ctx) => {
		return await ctx.db.query("api_requests").order("desc").collect();
	},
});
