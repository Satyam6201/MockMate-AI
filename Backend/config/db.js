import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            maxPoolSize: 200,   // Scale up to 200 active connections under load
            minPoolSize: 20,    // Keep 20 pre-warmed connections open at all times
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000, // Fail fast if MongoDB is unreachable (10s)
        });
        console.log("✅ Database connected successfully!");
    } catch (error) {
        // Fix: Previously swallowed the error — server would start with no DB connection,
        // causing silent failures on every request. Now we crash fast with a clear message.
        console.error("❌ FATAL: Database connection failed:", error.message);
        process.exit(1); // Exit with failure code so process manager (Docker, PM2) restarts
    }
}

export default db;