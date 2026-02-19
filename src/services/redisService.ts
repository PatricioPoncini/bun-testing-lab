import { createClient } from "redis";

export interface IRedisClient {
  lPush(key: string, value: string): Promise<number>;
  lRange(key: string, start: number, stop: number): Promise<string[]>;
  del(key: string | string[]): Promise<number>;
  ping(): Promise<string>;
  connect(): Promise<any>;
  quit(): Promise<any>;
  isOpen: boolean;
}

export class RedisService {
  private static client: IRedisClient | null = null;

  static async start() {
    const rc = createClient({ url: "redis://localhost:6379" });
    await rc.connect();
    this.client = rc as unknown as IRedisClient;
    console.log("\x1b[32m 💾 Redis connected successfully \x1b[0m");
  }

  static async stop() {
    if (this.client?.isOpen) {
      await this.client.quit();
      console.log("\x1b[31m 🔴 Redis stopped \x1b[0m");
    }
  }

  static op() {
    if (!this.client) {
      throw new Error("RedisService not initialized");
    }
    return this.client;
  }

  static lpush(key: string, value: string) {
    return this.op().lPush(key, value);
  }

  static lrange(key: string, start: number, stop: number) {
    return this.op().lRange(key, start, stop);
  }
}
