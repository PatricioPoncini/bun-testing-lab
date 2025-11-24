import { Hono } from 'hono'
import { redis } from '../services/redisService'

export const messageRoutes = new Hono()

messageRoutes.post('/', async (c) => {
    const body = await c.req.json()
    await redis.lPush('messages', body.text)
    return c.json({ ok: true })
})

messageRoutes.get('/', async (c) => {
    const msgs = await redis.lRange('messages', 0, 10)
    return c.json(msgs)
})
