import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import authRouter from "./router/auth.route.js";
import userRouter from "./router/user.route.js";
import interviewRouter from "./router/interview.router.js";
import paymentRouter from "./router/payment.route.js";
import chatbotRouter from "./router/chatbot.route.js";
import { stripeWebhook } from "./controllers/payment.controller.js";
import { globalLimiter } from "./middleware/rateLimit.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Stripe webhook must use raw body parser
app.post("/api/payment/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use(cookieParser());

// --- SECURITY MIDDLEWARES ---
app.use(helmet());
app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    if (req.query) mongoSanitize.sanitize(req.query);
    next();
});

// Apply global rate limiting to all requests
app.use(globalLimiter);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/chatbot", chatbotRouter);

// Global 404 Handler for undefined API routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `API endpoint ${req.originalUrl} not found.`
    });
});

// Global Error Handler for unhandled exceptions
app.use((err, req, res, next) => {
    console.error(`[Express Error]:`, err.message || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export default app;