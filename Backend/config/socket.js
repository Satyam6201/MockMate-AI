import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import Interview from "../model/interview.model.js";

let io;

export const initSocket = (httpServer) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080"
    ].filter(Boolean);

    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                if (
                    allowedOrigins.includes(origin) ||
                    origin.endsWith(".vercel.app") ||
                    origin.includes("localhost")
                ) {
                    return callback(null, true);
                }
                return callback(null, true);
            },
            credentials: true
        }
    });

    const redisUrl = process.env.REDIS_URL;
    const isLocalhostRedisInProd = process.env.NODE_ENV === "production" && redisUrl && redisUrl.includes("localhost");

    if (redisUrl && !isLocalhostRedisInProd) {
        try {
            const pubClient = new Redis(redisUrl, {
                maxRetriesPerRequest: 3,
                retryStrategy(times) {
                    if (times > 3) return null;
                    return Math.min(times * 300, 2000);
                }
            });
            const subClient = pubClient.duplicate();

            pubClient.on("error", (err) => {
                console.warn("[Socket Redis Pub Warning]:", err.message);
            });
            subClient.on("error", (err) => {
                console.warn("[Socket Redis Sub Warning]:", err.message);
            });

            Promise.all([
                new Promise((resolve) => pubClient.once('ready', resolve)),
                new Promise((resolve) => subClient.once('ready', resolve))
            ]).then(() => {
                io.adapter(createAdapter(pubClient, subClient));
            }).catch((err) => {
                console.warn("Redis unreachable for Socket.IO, using in-memory adapter:", err.message);
            });
        } catch (err) {
            console.warn("Failed to initialize Socket Redis adapter:", err.message);
        }
    }

    io.use((socket, next) => {
        try {
            const cookieHeader = socket.request.headers.cookie;
            if (!cookieHeader) {
                return next(new Error("Authentication error: No cookies found"));
            }

            const cookies = cookieHeader.split(';').reduce((res, c) => {
                const [key, val] = c.trim().split('=').map(decodeURIComponent);
                try {
                    return Object.assign(res, { [key]: JSON.parse(val) });
                } catch (e) {
                    return Object.assign(res, { [key]: val });
                }
            }, {});

            const token = cookies.token;
            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            socket.userId = decoded.userId;
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        const userRoom = `user:${socket.userId}`;
        socket.join(userRoom);

        socket.on("join_interview", async (data, callback) => {
            try {
                const { interviewId } = data;
                if (!interviewId) {
                    return callback && callback({ success: false, error: "Interview ID required" });
                }

                const interview = await Interview.findOne({ _id: interviewId, userId: socket.userId });
                if (!interview) {
                    return callback && callback({ success: false, error: "Unauthorized or Interview not found" });
                }

                const interviewRoom = `interview:${interviewId}`;
                socket.join(interviewRoom);
                
                if (callback) callback({ success: true, message: `Joined interview room: ${interviewId}` });
            } catch (error) {
                console.error("Socket join_interview Error:", error);
                if (callback) callback({ success: false, error: "Internal server error" });
            }
        });

        socket.on("disconnect", () => {});
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};