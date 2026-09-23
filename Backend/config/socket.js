import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import cookie from "cookie"; // Might need to use the 'cookie' package or just parse manually
import Interview from "../model/interview.model.js";

let io;

export const initSocket = (httpServer) => {
    // We create an IO instance
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    // Redis Adapter for horizontal scaling (Cluster mode support)
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const pubClient = new Redis(redisUrl);
    const subClient = pubClient.duplicate();

    io.adapter(createAdapter(pubClient, subClient));

    // Middleware for authentication
    io.use((socket, next) => {
        try {
            const cookieHeader = socket.request.headers.cookie;
            if (!cookieHeader) {
                return next(new Error("Authentication error: No cookies found"));
            }

            // Simple cookie parse
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

    // Connection handling
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id} (User: ${socket.userId})`);

        // Automatically join the user to their private room
        const userRoom = `user:${socket.userId}`;
        socket.join(userRoom);

        socket.on("join_interview", async (data, callback) => {
            try {
                const { interviewId } = data;
                if (!interviewId) {
                    return callback && callback({ success: false, error: "Interview ID required" });
                }

                // Verify ownership (idempotent, doesn't matter if called multiple times)
                const interview = await Interview.findOne({ _id: interviewId, userId: socket.userId });
                
                if (!interview) {
                    return callback && callback({ success: false, error: "Unauthorized or Interview not found" });
                }

                const interviewRoom = `interview:${interviewId}`;
                socket.join(interviewRoom);
                
                // Successfully joined
                if (callback) callback({ success: true, message: `Joined interview room: ${interviewId}` });
                
            } catch (error) {
                console.error("Socket join_interview Error:", error);
                if (callback) callback({ success: false, error: "Internal server error" });
            }
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id} (User: ${socket.userId})`);
        });
    });

    return io;
};

// Export a getter so controllers can emit events without needing to pass io down everywhere
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};