import User from "../model/user.model.js";
import redis from "../config/redis.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const cacheKey = `user:${userId}`;

        // 1. Check if user data exists in Redis cache
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

        // 2. If not in cache, fetch from database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({message: "User is Not Found!"});
        }

        // 3. Store the user data in Redis cache for 10 minutes (600 seconds)
        if (redis) {
            try {
                await redis.set(cacheKey, JSON.stringify(user), 'EX', 600);
            } catch (err) {
                console.warn("[Redis Cache Write Warning]:", err.message);
            }
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message: `Failed to get User ${error.message || error}`});
    }
}