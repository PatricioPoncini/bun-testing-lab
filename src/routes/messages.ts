import { Hono } from "hono";
import { RedisService } from "../services/redisService.ts";

export const messageRoutes = new Hono();

messageRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json().catch(() => null);

    if (!body?.text || typeof body.text !== "string") {
      return c.json({ error: "Invalid body: expected { text: string }" }, 400);
    }

    await RedisService.lpush("messages", body.text);

    return c.json({ ok: true });
  } catch (err) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

messageRoutes.get("/", async (c) => {
  try {
    const messages = await RedisService.lrange("messages", 0, 9);
    return c.json({ count: messages.length, messages });
  } catch (err) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
