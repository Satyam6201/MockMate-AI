import express from 'express';
import { 
    analyzeResume, 
    finishInterview, 
    generateQuestion, 
    getInterviewReport, 
    getMyInterviews, 
    submitAnswer 
} from '../controllers/interview.controller.js';
import isAuth from '../middleware/isAuth.js';
import { upload } from '../middleware/multer.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, aiLimiter, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions", isAuth, aiLimiter, generateQuestion);
interviewRouter.post("/submit-answer", isAuth, aiLimiter, submitAnswer);
interviewRouter.post("/finish", isAuth, finishInterview);
interviewRouter.get("/get-interview", isAuth, getMyInterviews);
interviewRouter.get("/report/:id", isAuth, getInterviewReport);

export default interviewRouter;