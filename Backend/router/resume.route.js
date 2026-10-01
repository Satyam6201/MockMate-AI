import express from "express";
import isAuth from "../middleware/isAuth.js";
import { buildResume, enhanceBulletWithAi, getUserResumes } from "../controllers/resume.controller.js";

const resumeRouter = express.Router();

resumeRouter.post("/build", isAuth, buildResume);
resumeRouter.post("/ai-enhance", isAuth, enhanceBulletWithAi);
resumeRouter.get("/my-resumes", isAuth, getUserResumes);

export default resumeRouter;
