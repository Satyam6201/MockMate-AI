import express from "express";
import isAuth from "../middleware/isAuth.js";
import { buildResume, enhanceBulletWithAi, getUserResumes } from "../controllers/resume.controller.js";

const resumeRouter = express.Router();

// Build / Save resume (deducts 50 credits if Pro template is chosen)
resumeRouter.post("/build", isAuth, buildResume);

// AI bullet enhancer
resumeRouter.post("/ai-enhance", isAuth, enhanceBulletWithAi);

// Get user saved resumes
resumeRouter.get("/my-resumes", isAuth, getUserResumes);

export default resumeRouter;
