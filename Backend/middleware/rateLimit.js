import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis.js';

/**
 * Senior fix: Rate limiters MUST use a shared Redis store in cluster/Docker mode.
 * Without this, each worker has its own in-memory counter — a user can bypass limits
 * by hitting different workers. Redis centralizes all counters across all workers.
 * Graceful degradation: if Redis is down, falls back to in-memory so app keeps running.
 */

const createRedisStore = (prefix) => {
    try {
        return new RedisStore({
            sendCommand: (...args) => redis.call(...args),
            prefix: `rl:${prefix}:`,
        });
    } catch (e) {
        console.error(`[RateLimit] Failed to create Redis store for "${prefix}". Falling back to memory store.`, e.message);
        return undefined; // express-rate-limit falls back to memory store when undefined
    }
};

// 1. Global Limiter: Protects the whole API from DDoS — shared across all cluster workers
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: "Too many requests. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('global'),
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json(options.message);
    },
});

// 2. AI Feature Limiter: Protects costly OpenRouter calls (20 per hour per IP)
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: { success: false, message: "You have reached the AI interview limit. Please try again in an hour." },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('ai'),
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json(options.message);
    },
});

// 3. Auth Limiter: Prevents brute-force on auth endpoints
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { success: false, message: "Too many login attempts. For your security, please try again in an hour." },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('auth'),
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json(options.message);
    },
});