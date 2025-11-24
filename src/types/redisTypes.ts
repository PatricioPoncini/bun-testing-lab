export interface RedisLike {
    lPush(key: string, value: string): Promise<number>
    lRange(key: string, start: number, stop: number): Promise<string[]>
}
