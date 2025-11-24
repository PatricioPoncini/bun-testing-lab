import { createClient } from 'redis'

export class RedisService {
    private static client: ReturnType<typeof createClient> | null = null;

    static async start() {
        const c = createClient({ url: "redis://localhost:6379" });
        await c.connect();
        this.client = c;
        console.log('\x1b[32m 💾 Redis connected successfully \x1b[0m');
    }

    static async stop() {
        if (this.client?.isOpen) {
            await this.client.quit();
            console.log('\x1b[31m 🔴 Redis stopped \x1b[0m');
        }
    }

    static op() {
        if (!this.client) {
            throw new Error("RedisService not initialized")
        }
        return this.client
    }

    static lpush(key: string, value: string) {
        return this.client!.lPush(key, value);
    }

    static lrange(key: string, start: number, stop: number) {
        return this.client!.lRange(key, start, stop);
    }
}