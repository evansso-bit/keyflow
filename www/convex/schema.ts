import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
	api_requests: defineTable({
		method: v.string(),
		url: v.string(),
		status_code: v.number(),
		body: v.optional(v.object({})),
		created_at: v.string(),
	})
		.searchIndex("search_api_requests", { searchField: "url" })
		.searchIndex("search_api_requests_method", { searchField: "method" }),
});
