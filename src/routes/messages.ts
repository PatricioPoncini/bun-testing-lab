import { Hono } from 'hono'
import { redis } from '../services/redisService'

export const messageRoutes = new Hono()

messageRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json().catch(() => null)

        if (!body?.text || typeof body.text !== 'string') {
            console.warn('[HTTP] Invalid payload received')
            return c.json({ error: 'Invalid body: expected { text: string }' }, 400)
        }

        await redis.lpush('messages', body.text)

        console.log('[HTTP] Message stored successfully')
        return c.json({ ok: true })
    } catch (err) {
        console.error('[HTTP] Error in POST /messages:', err)
        return c.json({ error: 'Internal server error' }, 500)
    }
})

messageRoutes.get('/', async (c) => {
    try {
        const messages = await redis.lrange('messages', 0, 9)
        return c.json({ count: messages.length, messages })
    } catch (err) {
        console.error('[HTTP] Error in GET /messages:', err)
        return c.json({ error: 'Internal server error' }, 500)
    }
})
