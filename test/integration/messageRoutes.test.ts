import { describe, it, expect, afterAll, beforeAll } from "bun:test";
import { messageRoutes } from "../../src/routes/messages";
import { RedisService } from "../../src/services/redisService.ts";
import type {ErrorResponse, GetMessagesResponse} from "../utils/types.ts";

describe("Message Routes – Integration Tests", () => {
  beforeAll(async () => {
    await RedisService.start();
    await RedisService.op().del("messages");
  });

  afterAll(async () => {
    await RedisService.stop();
  });

  describe("Success cases", () => {
    it("GET /messages → returns an empty list when no messages exist", async () => {
      const req = new Request("http://localhost/messages");
      const res = await messageRoutes.request("/", req);

      const data = (await res.json()) as GetMessagesResponse;
      expect(data.messages.length).toBe(0);
      expect(data.count).toBe(0);
    });

    it("POST /messages → stores a new message successfully", async () => {
      const req = new Request("http://localhost/messages", {
        method: "POST",
        body: JSON.stringify({ text: "hi" }),
      });

      const res = await messageRoutes.request("/", req);
      expect(res.status).toBe(200);
    });

    it("GET /messages → returns the previously stored message", async () => {
      const req = new Request("http://localhost/messages");
      const res = await messageRoutes.request("/", req);

      const data = (await res.json()) as GetMessagesResponse;
      expect(data.messages.length).toBeGreaterThan(0);
      expect(data.count).toBe(1);
    });

    it("POST /messages → returns only the first 10 messages after inserting 15", async () => {
      for (let i = 0; i < 15; i++) {
        const req = new Request("http://localhost/messages", {
          method: "POST",
          body: JSON.stringify({ text: `msg-${i}` }),
        });

        const res = await messageRoutes.request("/", req);
        expect(res.status).toBe(200);
      }

      const getReq = new Request("http://localhost/messages");
      const getRes = await messageRoutes.request("/", getReq);

      const data = (await getRes.json()) as {
        count: number;
        messages: string[];
      };

      expect(getRes.status).toBe(200);
      expect(data.messages.length).toBe(10);
      expect(data.count).toBe(10);
    });
  });

  describe("Error cases", () => {
    it("POST /messages → returns 400 when body is missing", async () => {
      const req = new Request("http://localhost/messages", {
        method: "POST",
      });

      const res = await messageRoutes.request("/", req);
      const data = (await res.json()) as ErrorResponse;

      expect(res.status).toBe(400);
      expect(data.error).toEqual("Invalid body: expected { text: string }");
    });

    it("POST /messages → returns 400 when text is not a string", async () => {
      const req = new Request("http://localhost/messages", {
        method: "POST",
        body: JSON.stringify({ text: 10 }),
      });

      const res = await messageRoutes.request("/", req);
      const data = (await res.json()) as ErrorResponse;

      expect(res.status).toBe(400);
      expect(data.error).toEqual("Invalid body: expected { text: string }");
    });
  });
});
