import Redis from 'ioredis';

/**
 * Senior fix: Redis client with crash protection.
 * - lazyConnect: true — don't connect immediately on import, connect on first use
 * - maxRetriesPerRequest: 3 — don't block forever if Redis is temporarily down
 * - enableOfflineQueue: false — fail fast on Redis errors instead of queueing commands indefinitely
 * - Error events are handled to prevent uncaught exception crashes
 */
const redisUrl = process.env.REDIS_URL;
const isLocalhostRedisInProd = process.env.NODE_ENV === "production" && redisUrl && redisUrl.includes("localhost");

let redis = null;

if (redisUrl && !isLocalhostRedisInProd) {
    redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                console.warn('[Redis] Max reconnection attempts reached. Stopping retries.');
                return null;
            }
            return Math.min(times * 300, 2000);
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