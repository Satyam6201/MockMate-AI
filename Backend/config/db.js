import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            maxPoolSize: 200,
            minPoolSize: 20,
            socketTimeoutMS: 45000
        });
        console.log("Database is connected!");
    } catch (error) {
        console.log(`Error from the database ${error}`);
    }
}
export default db;