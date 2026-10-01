import express from "express";
import { chatWithBot } from "../controllers/chatbot.controller.js";
import { globalLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/ask", globalLimiter, chatWithBot);

export default router;
