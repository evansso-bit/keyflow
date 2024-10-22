import { Hono } from "hono";
import type { Env } from "../types/api";
import { serve } from "@upstash/workflow/hono";
import { convexMutation } from "../config/convex";

const workflow = new Hono<{
	Bindings: Env;
	Env: Env;
}>();

workflow.post("/workflow/create", async (c) => {
	const { CONVEX_URL, ENVIRONMENT } = c.env;
	const { method, url, status_code, body, created_at } = await c.req.json<{
		method: string;
		url: string;
		status_code: number;
		body: object | null;
		created_at: string;
	}>();

	const handler = serve<unknown, Env>(async (context) => {
		await context.run("add-create-to-database", async () => {
			await convexMutation(CONVEX_URL, "apiRequests:create", {
				method: method,
				url: url,
				status_code: status_code,
				body: body,
				created_at: created_at,
			});
		});
	});

	return await handler(c);
});

workflow.post("/workflow/verify", async (c) => {
	const { CONVEX_URL, ENVIRONMENT } = c.env;

	const { method, url, status_code, body, created_at } = await c.req.json<{
		method: string;
		url: string;
		status_code: number;
		body: object | null;
		created_at: string;
	}>();

	const handler = serve<unknown, Env>(async (context) => {
		await context.run("add-verify-to-database", async () => {
			await convexMutation(CONVEX_URL, "apiRequests:create", {
				method: method,
				url: url,
				status_code: status_code,
				body: body,
				created_at: created_at,
			});
		});
	});

	return await handler(c);
});

export default workflow;
