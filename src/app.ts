import { Hono } from "hono";
import { messageRoutes } from "./routes/messages.ts";

const app = new Hono();

app.route("/messages", messageRoutes);

export default app;
