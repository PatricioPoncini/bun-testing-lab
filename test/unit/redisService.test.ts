import { describe, it, expect, mock } from "bun:test"
import { RedisService } from "../../src/services/redisService"
import type {RedisClientType} from "redis";

describe("RedisService - unit", () => {
    it("should call lPush on the client", async () => {
        const fakeClient = {
            lPush: mock(async () => 1)
        }

        const redis = new RedisService(fakeClient as unknown as RedisClientType)

        await redis.lpush("messages", "hello")

        expect(fakeClient.lPush).toHaveBeenCalled()
        expect(fakeClient.lPush).toHaveBeenCalledWith("messages", "hello")
    })

    it("should call lrange on the client", async () => {
        const fakeClient = {
            lRange: mock(async () => ["hi"])
        }

        const redis = new RedisService(fakeClient as unknown as RedisClientType)

        const range = await redis.lrange("messages", 0, 1)

        expect(fakeClient.lRange).toHaveBeenCalled()
        expect(fakeClient.lRange).toHaveBeenCalledWith("messages", 0, 1)
        expect(range).toEqual(["hi"])
    })

    it("should return 15 elementos from 0 to 14", async () => {
        const fakeClient = {
            lRange: mock(async () => Array.from({ length: 15 }, (_, i) => `msg-${i}`))
        }

        const redis = new RedisService(fakeClient as unknown as RedisClientType)

        const range = await redis.lrange("messages", 0, 14)

        expect(fakeClient.lRange).toHaveBeenCalled()
        expect(fakeClient.lRange).toHaveBeenCalledWith("messages", 0, 14)
        expect(range).toHaveLength(15)
    })
})
