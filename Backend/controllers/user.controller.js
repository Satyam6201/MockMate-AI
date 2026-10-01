import User from "../model/user.model.js";
import redis from "../config/redis.js";
import jwt from "jsonwebtoken";

export const getCurrentUser = async (req, res) => {
    try {
        const { token } = req.cookies || {};
        if (!token) {
            return res.status(200).json(null);
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch {
            return res.status(200).json(null);
        }

        if (!decoded?.userId) {
            return res.status(200).json(null);
        }

        const userId = decoded.userId;
        const cacheKey = `user:${userId}`;

        if (redis) {
            try {
                const cachedUser = await redis.get(cacheKey);
                if (cachedUser) {
                    return res.status(200).json(JSON.parse(cachedUser));
                }
            } catch (err) {
                console.warn("[Redis Cache Read Warning]:", err.message);
            }
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json(null);
        }

        if (redis) {
            try {
                await redis.set(cacheKey, JSON.stringify(user), 'EX', 600);
            } catch (err) {
                console.warn("[Redis Cache Write Warning]:", err.message);
            }
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(200).json(null);
    }
};