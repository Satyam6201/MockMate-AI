import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            // Fix: 401 Unauthorized is the correct HTTP status for missing auth tokens (not 400)
            return res.status(401).json({ message: "Authentication token is missing. Please login to continue." });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!verifyToken) {
            return res.status(401).json({ message: "Invalid authentication token. Access denied." });
        }

        req.userId = verifyToken.userId;
        next();

    } catch (error) {
        // jwt.verify throws JsonWebTokenError / TokenExpiredError — always 401
        return res.status(401).json({ message: "Session expired or invalid. Please login again." });
    }
}

export default isAuth;