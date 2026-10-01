import jwt from "jsonwebtoken";

const genToken = (userId) => {
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