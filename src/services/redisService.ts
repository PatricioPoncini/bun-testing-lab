import { createClient } from 'redis'
import type { RedisLike } from "../types/redisTypes.ts";

export class RedisService {
    constructor(private client: RedisLike) {}

    async lpush(key: string, value: string) {
        console.log(`[Redis] LPUSH -> key="${key}", value="${value}"`);
        try {
            const result = await this.client.lPush(key, value);
            console.log(`[Redis] LPUSH result ->`, result);
            return result;
        } catch (err) {
            console.error(`[Redis] LPUSH error:`, err);
            throw err;
        }
    }

    async lrange(key: string, start: number, stop: number) {
        console.log(`[Redis] LRANGE -> key="${key}", start=${start}, stop=${stop}`);
        try {
            const result = await this.client.lRange(key, start, stop);
            console.log(`[Redis] LRANGE result ->`, result);
            return result;
        } catch (err) {
            console.error(`[Redis] LRANGE error:`, err);
            throw err;
        }
    }
}

export const redisClient = createClient({
    url: 'redis://localhost:6379' // TODO: Podría pasarse esto a un .env
})

redisClient.on('error', (err) => {
    console.error('[Redis] Connection error:', err);
});

await redisClient.connect();

console.log('[Redis] Client connected successfully.');

export const redis = new RedisService(redisClient);
