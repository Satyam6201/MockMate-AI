import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Authentication token is missing. Please login to continue." });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!verifyToken) {
            return res.status(401).json({ message: "Invalid authentication token. Access denied." });
        }

        req.userId = verifyToken.userId;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Session expired or invalid. Please login again." });
    }
};

export default isAuth;