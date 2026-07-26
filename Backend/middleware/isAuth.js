import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies;

        if (!token) {
            return res.status(400).json({ message: "Authentication token is missing. Please login to continue." });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!verifyToken) {
            return res.status(400).json({ message: "Invalid authentication token. Access denied." });
        }

        req.userId = verifyToken.userId;

        next();

    } catch (error) {
        return res.status(400).json({ message: `Authentication failed: ${error.message}` });
    }
}

export default isAuth;