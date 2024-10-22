import { Hono } from "hono";
import type { Env } from "./types/api";
import create from "./routes/create";
import verify from "./routes/verify";
import workflow from "./routes/workflow";

const app = new Hono<{
	Bindings: Env;
	Env: Env;
}>().basePath("/keys");

app.route("/", create);
app.route("/", verify);
app.route("/workflow", workflow);

export default app;
