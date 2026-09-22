import rateLimit from 'express-rate-limit';

// 1. Global Limiter: Protects the whole website from basic spam/DDoS
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window (15 minutes)
    message: {
        message: "You have made too many requests. Please take a break and try again in 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 2. AI Feature Limiter: Protects costly AI features (like generating questions or evaluating answers)
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 AI generations per hour
    message: {
        message: "You have reached the limit for AI interviews. Please try again in an hour."
    }
});

// 3. Auth Limiter: Protects login/signup from brute-force guessing
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login/signup attempts per hour
    message: {
        message: "Too many login attempts. For your security, please try again in an hour."
    }
});