import express from "express";
import { chatWithBot } from "../controllers/chatbot.controller.js";
import { globalLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// Route to handle chat messages
// Protected by the global rate limiter to prevent spamming the Gemini API
router.post("/ask", globalLimiter, chatWithBot);

export default router;
