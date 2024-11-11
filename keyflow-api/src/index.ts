import { Hono } from "hono";
import { rateLimitMiddleware } from "./lib/ratelimit";
import create from "./routes/create";
import verify from "./routes/verify";
import type { Bindings } from "./types/api";

const app = new Hono<{
	Bindings: Bindings;
}>().basePath("/keys");

app.use("*", rateLimitMiddleware);

app.route("/", create);
app.route("/", verify);

export default app;
