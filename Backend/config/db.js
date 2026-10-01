import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            maxPoolSize: 200,
            minPoolSize: 20,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

export default db;