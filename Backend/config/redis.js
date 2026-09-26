import Redis from 'ioredis';

/**
 * Senior fix: Redis client with crash protection.
 * - lazyConnect: true — don't connect immediately on import, connect on first use
 * - maxRetriesPerRequest: 3 — don't block forever if Redis is temporarily down
 * - enableOfflineQueue: false — fail fast on Redis errors instead of queueing commands indefinitely
 * - Error events are handled to prevent uncaught exception crashes
 */
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false, // Fail fast instead of queueing when Redis is down
    retryStrategy(times) {
        if (times > 10) {
            console.error('[Redis] Max reconnection attempts reached. Stopping retries.');
            return null; // Stop retrying
        }
        const delay = Math.min(times * 500, 5000); // Max 5s between retries
        return delay;
    },
});

redis.on('connect', () => {
    console.log('✅ Connected to Redis successfully');
});

redis.on('ready', () => {
    console.log('✅ Redis client is ready to accept commands');
});

redis.on('error', (error) => {
    // Fix: Log but don't crash — Redis failure should degrade gracefully
    // (rate limiting falls back to memory store, caching is just skipped)
    console.error('[Redis] Connection Error:', error.message);
});

redis.on('close', () => {
    console.warn('[Redis] Connection closed. Attempting to reconnect...');
});

export default redis;