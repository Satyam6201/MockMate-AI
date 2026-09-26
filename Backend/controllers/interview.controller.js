import fs from 'fs';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from '../services/openRouter.services.js';
import User from '../model/user.model.js';
import Interview from '../model/interview.model.js';
import redis from '../config/redis.js';
import { getIO } from '../config/socket.js';

export const analyzeResume = async (req, res) => {
    try {
        const io = getIO();
        const userRoom = `user:${req.userId}`;

        if (!req.file) {
            return res.status(400).json({message: "Resume required"});
        }
        
        io.to(userRoom).emit("resume:stage", { stage: "UPLOAD_RECEIVED", progress: 10, message: "Resume uploaded ✓" });

        const filePath = req.file.path;
        const fileBuffer = await fs.promises.readFile(filePath);
        const uint8Array = new Uint8Array(fileBuffer);
        
        io.to(userRoom).emit("resume:stage", { stage: "TEXT_EXTRACTION_STARTED", progress: 30, message: "Extracting text..." });

        const pdf = await pdfjsLib.getDocument({data: uint8Array}).promise;

        let resumeText = "";

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            let page = await pdf.getPage(pageNum);
            let content = await page.getTextContent();

            const pageText = content.items.map(item => item.str).join(" ");
            resumeText += pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();
        
        io.to(userRoom).emit("resume:stage", { stage: "TEXT_EXTRACTION_COMPLETED", progress: 50, message: "Text extracted ✓" });
        io.to(userRoom).emit("resume:stage", { stage: "RESUME_ANALYSIS_STARTED", progress: 60, message: "Analyzing resume..." });

        const messages = [
            {
                role: "system",
                content: `Extract structured data from resume. 
                Return strictly JSON:
                {
                  "role" : "string",
                  "experience": "string",
                  "projects": ["project1", "project2"],
                  "skills": ["skill1", "skill2"]
                }`
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        io.to(userRoom).emit("resume:stage", { stage: "AI_CONTEXT_PREPARATION", progress: 75, message: "Preparing AI context..." });
        const aiResponse = await askAi(messages);

        // Fix: AI sometimes wraps response in markdown fences — strip before parsing
        const cleanAiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        let parsed;
        try {
            parsed = JSON.parse(cleanAiResponse);
        } catch (parseError) {
            console.error("[analyzeResume] AI returned non-JSON. Using fallback structure.");
            // Graceful degradation: return raw text with empty structured fields
            parsed = { role: "Software Engineer", experience: "Not specified", projects: [], skills: [] };
        }

        // Clean up uploaded file after processing
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore cleanup errors */ }

        io.to(userRoom).emit("resume:stage", { stage: "PROCESSING_COMPLETED", progress: 100, message: "Finalizing..." });
        setTimeout(() => {
             io.to(userRoom).emit("resume:completed", { message: "Ready" });
        }, 500);

        res.json({
            role: parsed.role || "Software Engineer",
            experience: parsed.experience || "Not specified",
            projects: Array.isArray(parsed.projects) ? parsed.projects : [],
            skills: Array.isArray(parsed.skills) ? parsed.skills : [],
            resumeText
        });

    } catch (error) {
        console.error("[analyzeResume] Error:", error.message);

        // Handle multer file type rejection
        if (error.message?.includes('INVALID_FILE_TYPE')) {
            return res.status(400).json({ message: "Only PDF files are allowed for resume upload." });
        }

        // Clean up file on any error
        if (req.file && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
        }

        // Emit failure so frontend doesn't hang on loading state
        try {
            const io = getIO();
            io.to(`user:${req.userId}`).emit("resume:error", { message: "Resume processing failed. Please try again." });
        } catch (e) { /* ignore socket errors during error handling */ }

        res.status(500).json({ message: error.message || "Failed to process resume" });
    }
}


import { getBaselineDifficulty, getDifficultyLabel, extractTopics } from '../services/difficultyEngine.service.js';
import { generateAdaptiveQuestion } from '../services/questionGenerator.service.js';

export const generateQuestion =  async (req, res) => {
    try {
        const io = getIO();
        const userRoom = `user:${req.userId}`;

        let { role, experience, mode, resumeText, projects, skills } = req.body;
        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if (!role || !experience || !mode) {
            return res.status(400).json({ message: "Role, Experience and Mode are required!" });
        }
        
        io.to(userRoom).emit("interview:generation_progress", { stage: "INTERVIEW_INITIALIZING", message: "Preparing your interview..." });

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({message: "User is Not Found"});
        }

        if (user.credits < 50) {
            return res.status(400).json({message: "Not enough credits! Please recharge your account (Minimum 50 required)."});
        }

        io.to(userRoom).emit("interview:generation_progress", { stage: "RESUME_CONTEXT_LOADING", message: "Resume context loaded ✓" });

        // Determine Q1 Difficulty
        const baselineScore = getBaselineDifficulty(role, experience);
        const baselineLabel = getDifficultyLabel(baselineScore);
        
        io.to(userRoom).emit("interview:generation_progress", { stage: "SKILL_ANALYSIS", message: "Candidate skills identified ✓" });

        // Determine Q1 Topic
        const topics = extractTopics(role, resumeText);
        const targetTopic = topics[0] || "General";

        io.to(userRoom).emit("interview:generation_progress", { stage: "QUESTION_GENERATION_STARTED", message: `Generating ${baselineLabel} technical questions...` });

        // Generate Q1
        const generatedQ = await generateAdaptiveQuestion({
            role, experience, mode, resumeText, projects, skills,
            targetDifficultyLabel: baselineLabel,
            targetTopic,
            questionType: "Conceptual", // First question is always Conceptual
            isFollowUp: false,
            previousQuestionsContext: []
        });
        
        io.to(userRoom).emit("interview:generation_progress", { stage: "QUESTION_GENERATION_COMPLETED", message: "Preparing interview session..." });

        const isCodingRound = mode === "Coding Round";

        // Fix: Create interview FIRST, then deduct credits atomically
        // This prevents losing credits if the DB save fails
        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText,
            totalQuestions: isCodingRound ? 3 : 10,
            question: [{
                question: generatedQ.question,
                topic: generatedQ.topic,
                difficulty: baselineLabel,
                targetDifficulty: baselineScore,
                questionType: isCodingRound ? "Coding" : "Conceptual",
                timeLimit: isCodingRound ? (baselineLabel === "Easy" || baselineLabel === "Beginner" ? 1800 : baselineLabel === "Medium" ? 2700 : 3600) : 60
            }] 
        });

        // Only deduct credits after interview is safely created (atomic $inc avoids race conditions)
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $inc: { credits: -50 } },
            { new: true }
        );
        
        io.to(userRoom).emit("interview:generation_progress", { stage: "INTERVIEW_READY", message: "Interview Ready!" });

        res.json({
            interviewId: interview._id,
            creditsLeft: updatedUser?.credits ?? (user.credits - 50),
            userName: user.name,
            questions: interview.question,
            totalQuestions: interview.totalQuestions
        });


    } catch (error) {
        return res.status(500).json({message: `Failed to create interview: ${error.message}`});
    }
}

import { calculateNextQuestionParams } from '../services/difficultyEngine.service.js';

export const submitAnswer = async (req, res) => {
    try {
        const io = getIO();
        const { interviewId, questionIndex, answer, timeTaken } = req.body;

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        const question = interview.question[questionIndex];
        if (!question) {
            return res.status(400).json({ message: "Question index out of bounds" });
        }
        
        io.to(`interview:${interviewId}`).emit("evaluation:started", { message: "AI is evaluating your answer..." });

        // Idempotency: Skip evaluation if already evaluated
        let parsed = null;
        if (question.answer !== undefined && question.feedback) {
            parsed = {
                feedback: question.feedback,
                confidence: question.confidence,
                communication: question.communication,
                correctness: question.correctness,
                finalScore: question.score
            };
        } else {
            if (!answer) {
                question.score = 0;
                question.feedback = "You did not submit an answer.";
                question.answer = "";
                await interview.save();
                parsed = { feedback: question.feedback, finalScore: 0, confidence: 0, communication: 0, correctness: 0 };
            } else if (timeTaken > question.timeLimit) {
                question.score = 0;
                question.feedback = "Your Time is Up";
                question.answer = answer;
                await interview.save();
                parsed = { feedback: question.feedback, finalScore: 0, confidence: 0, communication: 0, correctness: 0 };
            } else {
                io.to(`interview:${interviewId}`).emit("evaluation:processing", { message: "Analyzing technical correctness..." });
                const messages = [
                {
                    role: "system",
                    content: `
                        You are a professional human interviewer evaluating a candidate's answer in a real interview.
                        Evaluate naturally and fairly, like a real person would.
                        Score the answer in these areas (0 to 10):

                    1. Confidence – Does the answer/code seem confident and well-reasoned?
                    2. Communication – Is the language or code clear, readable, and easy to understand?
                    3. Correctness – Is the answer or code accurate, relevant, and fully functional?

                Rules:
                    - Be realistic and unbiased.
                    - If this is a coding question, prioritize logic, process, and readability. If the code is 100% correct and optimal, award full points (10/10) for Correctness. If the code is partially correct, contains bugs, or uses a brute-force approach, AWARD PARTIAL POINTS (e.g. 3-8) based on the candidate's logical process, problem-solving approach, and effort. DO NOT give a 0 if they attempted the logic.
                    - If the answer is weak or blank, score low.
                    - If the answer is strong and detailed, score high.
                    - Consider clarity, structure, and relevance.

                    Calculate:
                    finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

                    Feedback Rules:
                        - Write natural human feedback.
                        - 10 to 15 words only.
                        - Sound like real interview feedback.
                        - Can suggest improvement if needed.
                        - Do NOT repeat the question.
                        - Do NOT explain scoring.
                        - Keep tone professional and honest.

                    Return ONLY valid JSON in this format:

                {
                    "confidence": number,
                    "communication": number,
                    "correctness": number,
                    "finalScore": number,
                    "feedback": "short human feedback"
                }`
                },
                {
                    role: "user",
                    content: `Question: ${question.question}\nAnswer: ${answer}`
                }];

                const aiResponse = await askAi(messages);

                // Fix: AI sometimes returns markdown-wrapped JSON — strip before parsing
                const cleanAiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
                try {
                    parsed = JSON.parse(cleanAiResponse);
                    // Validate parsed scores are numbers in range 0-10
                    parsed.confidence = Math.min(10, Math.max(0, Number(parsed.confidence) || 5));
                    parsed.communication = Math.min(10, Math.max(0, Number(parsed.communication) || 5));
                    parsed.correctness = Math.min(10, Math.max(0, Number(parsed.correctness) || 5));
                    parsed.finalScore = Math.min(10, Math.max(0, Number(parsed.finalScore) || 5));
                    parsed.feedback = parsed.feedback || "Good effort. Keep practicing.";
                } catch (parseError) {
                    // AI returned non-JSON — graceful degradation: neutral score instead of crashing
                    console.error("[submitAnswer] AI returned non-JSON evaluation. Using fallback scores.");
                    parsed = {
                        confidence: 5, communication: 5, correctness: 5,
                        finalScore: 5,
                        feedback: "Unable to evaluate at this time. Neutral score applied."
                    };
                }

                question.answer = answer;
                question.confidence = parsed.confidence;
                question.communication = parsed.communication;
                question.correctness = parsed.correctness;

                question.score = parsed.finalScore;
                question.feedback = parsed.feedback;
                
                await interview.save();
            }
        }
        
        io.to(`interview:${interviewId}`).emit("evaluation:completed", { 
            score: parsed.finalScore,
            feedback: parsed.feedback,
            confidence: parsed.confidence,
            communication: parsed.communication,
            correctness: parsed.correctness
        });

        // Adaptive Generation: If we need more questions, generate the next one
        const totalExpected = interview.totalQuestions || 10;
        let nextQuestion = null;
        
        if (questionIndex + 1 < totalExpected) {
            // Check if next question is already generated (retry scenario)
            if (interview.question.length > questionIndex + 1) {
                nextQuestion = interview.question[questionIndex + 1];
            } else {
                io.to(`interview:${interviewId}`).emit("evaluation:processing", { message: "Determining next question difficulty..." });
                // Determine params using the Engine
                const nextParams = calculateNextQuestionParams(interview, questionIndex);
                
                io.to(`interview:${interviewId}`).emit("evaluation:processing", { message: "Generating next question..." });
                // Generate next question
                const generatedQ = await generateAdaptiveQuestion({
                    role: interview.role,
                    experience: interview.experience,
                    mode: interview.mode,
                    resumeText: interview.resumeText,
                    targetDifficultyLabel: nextParams.targetDifficultyLabel,
                    targetTopic: nextParams.targetTopic,
                    questionType: nextParams.questionType,
                    isFollowUp: nextParams.isFollowUp,
                    previousQuestionsContext: interview.question.map(q => ({ question: q.question }))
                });

                // Append and save
                nextQuestion = {
                    question: generatedQ.question,
                    topic: generatedQ.topic,
                    difficulty: nextParams.targetDifficultyLabel,
                    targetDifficulty: nextParams.targetDifficultyScore,
                    questionType: nextParams.questionType,
                    timeLimit: nextParams.timeLimit
                };
                
                interview.question.push(nextQuestion);
                await interview.save();
                
                // Fetch the pushed subdocument to return it with _id
                nextQuestion = interview.question[interview.question.length - 1];
            }
        }

        return res.status(200).json({
            feedback: parsed.feedback,
            nextQuestion
        });
    } catch (error) {
        return res.status(500).json({message: `Failed to submit answer: ${error.message}`});
    }
}

export const finishInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({message: "Failed to find Interview"});
        }

        const totalQuestions = interview.question.length;

        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.question.forEach((q) => {
            totalScore += q.score || 0;
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        })

        const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;
        
        interview.finalScore = finalScore;
        interview.status = "completed";

        await interview.save();

        return res.status(200).json({
            finalScore: Number(finalScore.toFixed(1)),
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.question.map((q) => ({
                question: q.question,
                score: q.score || 0,
                feedback: q.feedback || 0,
                communication: q.communication || 0,
                correctness: q.correctness || 0,
            })),
        })

    } catch (error) {
        return res.status(500).json({message: `Failed to finish Interview ${error}`});
    }
}

export const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({userId: req.userId})
        .sort({ createdAt: -1 }).select("role experience mode finalScore status createdAt");

        return res.status(200).json(interviews);
    } catch (error) {
        return res.status(500).json({ message: `failed to find currentUser Interview ${error}`});
    }
}

export const getInterviewReport = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const cacheKey = `interview_report:${interviewId}`;

        // 1. Check Redis Cache
        const cachedReport = await redis.get(cacheKey);
        if (cachedReport) {
            return res.json(JSON.parse(cachedReport));
        }

        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({ message: "interview not found"});
        }

        const totalQuestions = interview.question.length;

        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.question.forEach((q) => {
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        })

        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        const reportData = {
            finalScore: interview.finalScore,
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.question
        };

        // 2. Store in Redis Cache for 1 hour (3600 seconds)
        await redis.set(cacheKey, JSON.stringify(reportData), 'EX', 3600);

        return res.json(reportData);

    } catch (error) {
        return res.status(500).json({ message: `failed to find currentuser interview report ${error}`});
    }
}