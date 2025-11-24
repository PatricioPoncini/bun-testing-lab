import { describe, test, expect, mock, afterEach } from "bun:test";
import { RedisService } from "../../src/services/redisService";

describe("RedisService - Unit tests", () => {
  afterEach(() => {
    (RedisService as any).client = null;
  });

  test("Should call lPush on the client", async () => {
    const fakeClient = {
      lPush: mock(async () => 1),
    };

    (RedisService as any).client = fakeClient;

    await RedisService.lpush("messages", "hello");

    expect(fakeClient.lPush).toHaveBeenCalled();
    expect(fakeClient.lPush).toHaveBeenCalledWith("messages", "hello");
  });

  test("Should call lRange on the client", async () => {
    const fakeClient = {
      lRange: mock(async () => ["hi"]),
    };

    (RedisService as any).client = fakeClient;

    const result = await RedisService.lrange("messages", 0, 1);

    expect(fakeClient.lRange).toHaveBeenCalled();
    expect(fakeClient.lRange).toHaveBeenCalledWith("messages", 0, 1);
    expect(result).toEqual(["hi"]);
  });

  test("Should return 15 items from 0 to 14", async () => {
    const fakeClient = {
      lRange: mock(async () =>
        Array.from({ length: 15 }, (_, i) => `msg-${i}`),
      ),
    };

    (RedisService as any).client = fakeClient;

    const range = await RedisService.lrange("messages", 0, 14);

    expect(fakeClient.lRange).toHaveBeenCalled();
    expect(fakeClient.lRange).toHaveBeenCalledWith("messages", 0, 14);
    expect(range).toHaveLength(15);
  });
});
