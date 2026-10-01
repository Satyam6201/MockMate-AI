import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis.js';

const createRedisStore = (prefix) => {
    if (!redis) {
        return undefined;
    }
    try {
        return new RedisStore({
            sendCommand: (...args) => redis.call(...args),
            prefix: `rl:${prefix}:`,
        });
    } catch (e) {
        console.error(`[RateLimit] Failed to create Redis store for "${prefix}". Falling back to memory store.`, e.message);
        return undefined;
    }
};

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('global'),
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json(options.message);
    },
});

export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { success: false, message: "You have reached the AI interview limit. Please try again in an hour." },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('ai'),
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json(options.message);
    },
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many login attempts. For your security, please try again in an hour." },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('auth'),
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json(options.message);
    },
});