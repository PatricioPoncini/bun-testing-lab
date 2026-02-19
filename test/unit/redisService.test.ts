import {describe, test, expect, mock, spyOn, afterEach, beforeEach, type Mock, vi} from "bun:test";
import {type IRedisClient, RedisService} from "../../src/services/redisService";

describe("RedisService - Unit tests", () => {
  const fakeClient: IRedisClient = {
    lPush: async () => 1,
    lRange: async () => ["msg-mock"],
    del: async () => 1,
    ping: async () => "PONG",
    connect: async () => {},
    quit: async () => {},
    isOpen: true,
  };

  let opSpy: Mock<() => IRedisClient>;

  beforeEach(() => {
    opSpy = spyOn(RedisService, "op").mockReturnValue(fakeClient);
  });

  afterEach(() => {
    opSpy.mockRestore();
  });

  test("Should call lPush on the client", async () => {
    const lPushSpy = spyOn(fakeClient, "lPush");

    await RedisService.lpush("messages", "hello");

    expect(lPushSpy).toHaveBeenCalledWith("messages", "hello");
  });

  test("Should return mocked items from lRange", async () => {
    const range = await RedisService.lrange("messages", 0, 1);

    expect(range).toEqual(["msg-mock"]);
    expect(range).toHaveLength(1);
  });

  test("Should propagate errors when lPush fails", async () => {
    const errorSpy = spyOn(fakeClient, "lPush").mockRejectedValue(new Error("Redis Connection Lost"));

    expect(RedisService.lpush("key", "val")).rejects.toThrow("Redis Connection Lost");

    errorSpy.mockRestore();
  });

  test("stop() should NOT call quit if the client is already closed", async () => {
    const quitSpy = spyOn(fakeClient, "quit");
    fakeClient.isOpen = false;

    await RedisService.stop();

    expect(quitSpy).not.toHaveBeenCalled();
    fakeClient.isOpen = true;
  });

  test("op() should throw an error if client is null", () => {
    opSpy.mockRestore();

    expect(() => RedisService.op()).toThrow("RedisService not initialized");

    opSpy = spyOn(RedisService, "op").mockReturnValue(fakeClient);
  });

  test("Should call del with correct parameters", async () => {
    const delSpy = spyOn(fakeClient, "del");

    await RedisService.op().del("my-key");

    expect(delSpy).toHaveBeenCalledWith("my-key");
  });

  test("Should return PONG when calling ping", async () => {
    const pingSpy = spyOn(fakeClient, "ping").mockResolvedValue("PONG");

    const result = await RedisService.op().ping();

    expect(result).toBe("PONG");
    expect(pingSpy).toHaveBeenCalled();
  });
});
