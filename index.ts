import { Hono } from 'hono'
import { serve } from 'bun'
import { redis } from './src/services/redisService'
import { messageRoutes } from './src/routes/messages'

const app = new Hono()

app.route('/messages', messageRoutes)

const server = serve({
    port: 3000,
    fetch: app.fetch,
})

console.log('🚀  Server running on http://localhost:3000')

let isShuttingDown = false

const shutdown = async () => {
    if (isShuttingDown) return
    isShuttingDown = true

    console.log('\n🛑  Shutting down server gracefully...')

    try {
        if (redis?.isOpen) {
            await redis.quit()
        } else {
            console.log('ℹ Redis was already closed')
        }
    } catch (err) {
        console.error('Error closing Redis:', err)
    }

    process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
