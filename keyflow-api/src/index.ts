import { Hono } from "hono";
import type { Env } from "./types/api";
import create from "./routes/create";
import verify from "./routes/verify";

const app = new Hono<{
	Bindings: Env;
	Env: Env;
}>().basePath("/keys");

app.route("/", create);
app.route("/", verify);

export default app;
