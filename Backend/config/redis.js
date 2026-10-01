import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
const isLocalhostRedisInProd = process.env.NODE_ENV === "production" && redisUrl && redisUrl.includes("localhost");

let redis = null;

if (redisUrl && !isLocalhostRedisInProd) {
    redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                console.warn('[Redis] Max reconnection attempts reached.');
                return null;
            }
            return Math.min(times * 300, 2000);
        },
    });

    redis.on('connect', () => {
        console.log('Connected to Redis');
    });

    redis.on('error', (error) => {
        console.error('[Redis] Connection Error:', error.message);
    });
}

export default redis;