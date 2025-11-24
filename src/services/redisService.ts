import { createClient } from 'redis'

export const redis = createClient({
    url: 'redis://localhost:6379'
})

redis.on('ready', () => {
    console.log('💾  Redis connection established and ready to receive commands')
})

redis.on('error', (err) => {
    console.error('🔴  Redis error:', err)
})

redis.on('end', () => {
    console.log('🟡  Redis connection closed')
})

await redis.connect()
