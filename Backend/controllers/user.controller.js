import User from "../model/user.model.js";
import redis from "../config/redis.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
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
            return res.status(404).json({ message: "User not found" });
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
        return res.status(500).json({ message: `Failed to get User: ${error.message || error}` });
    }
};