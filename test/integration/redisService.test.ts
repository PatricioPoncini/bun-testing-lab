import { describe, test, expect, beforeAll } from "bun:test";
import { RedisService } from "../../src/services/redisService";

describe("Redis Service – Integration Tests", () => {
  beforeAll(async () => {
    await RedisService.start();
    await RedisService.op().del("messages");
  });

  test("Should connect and return a working Redis instance", async () => {
    const pong = await RedisService.op().ping();
    expect(pong).toBe("PONG");
  });

  test("Should push a message into Redis list", async () => {
    const result = await RedisService.lpush("messages", "hello");
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThan(0);

    const stored = await RedisService.lrange("messages", 0, -1);
    expect(stored).toContain("hello");
  });

  test("Should push multiple messages and maintain order (LIFO)", async () => {
    await RedisService.op().del("messages");

    await RedisService.lpush("messages", "A");
    await RedisService.lpush("messages", "B");
    await RedisService.lpush("messages", "C");

    const stored = await RedisService.lrange("messages", 0, -1);
    expect(stored).toEqual(["C", "B", "A"]);
  });

  test("Should return empty array when key does not exist", async () => {
    await RedisService.op().del("unknown");

    const stored = await RedisService.lrange("unknown", 0, -1);
    expect(stored).toEqual([]);
  });

  test("Should delete the list successfully", async () => {
    await RedisService.lpush("messages", "to_delete");
    const del = await RedisService.op().del("messages");

    expect(del).toBe(1);

    const after = await RedisService.lrange("messages", 0, -1);
    expect(after).toEqual([]);
  });

  test("Should handle empty string pushes", async () => {
    await RedisService.op().del("messages");

    await RedisService.lpush("messages", "");
    const stored = await RedisService.lrange("messages", 0, -1);

    expect(stored).toEqual([""]);
  });

  test("Should throw an error when pushing without Redis started", async () => {
    await RedisService.stop();

    try {
      await RedisService.lpush("messages", "fail");
    } catch (err) {
      expect((err as Error).message.toLowerCase()).toContain(
        "the client is closed",
      );
    } finally {
      await RedisService.start();
    }
  });

  test("Should allow multiple concurrent pushes without losing data", async () => {
    await RedisService.op().del("messages");

    const messages = Array.from({ length: 50 }, (_, i) => `msg_${i}`);

    await Promise.all(messages.map((m) => RedisService.lpush("messages", m)));

    const stored = await RedisService.lrange("messages", 0, -1);

    messages.forEach((m) => {
      expect(stored).toContain(m);
    });
    expect(stored.length).toBe(50);
  });
});
