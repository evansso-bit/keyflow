import { Hono } from "hono";
import type { Env } from "./types/api";
import create from "./routes/create";
import verify from "./routes/verify";
import { rateLimitMiddleware } from "./lib/ratelimit";

const app = new Hono<{
	Bindings: Env;
}>().basePath("/keys");

app.use("*", rateLimitMiddleware);

app.route("/", create);
app.route("/", verify);

export default app;
