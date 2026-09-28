import Redis from 'ioredis';

/**
 * Senior fix: Redis client with crash protection.
 * - lazyConnect: true — don't connect immediately on import, connect on first use
 * - maxRetriesPerRequest: 3 — don't block forever if Redis is temporarily down
 * - enableOfflineQueue: false — fail fast on Redis errors instead of queueing commands indefinitely
 * - Error events are handled to prevent uncaught exception crashes
 */
const redisUrl = process.env.REDIS_URL;

let redis = null;

if (redisUrl) {
    redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
        retryStrategy(times) {
            if (times > 10) {
                console.error('[Redis] Max reconnection attempts reached. Stopping retries.');
                return null;
            }
            const delay = Math.min(times * 500, 5000);
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
        console.error('[Redis] Connection Error:', error.message);
    });

    redis.on('close', () => {
        console.warn('[Redis] Connection closed. Attempting to reconnect...');
    });
} else {
    console.log('ℹ️ Redis URL not set. Using in-memory fallback for rate limiting.');
}

export default redis;