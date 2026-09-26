import jwt from "jsonwebtoken";

const genToken = (userId) => {
    // Fix: Removed async/await (jwt.sign is synchronous) and removed try/catch that silently
    // returned undefined on failure. Errors now propagate to callers correctly.
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not configured in environment variables.");
    }

    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    );

    return token;
};

export default genToken;