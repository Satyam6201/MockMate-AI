import fs from 'fs';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from '../services/openRouter.services.js';
import User from '../model/user.model.js';
import Interview from '../model/interview.model.js';
import redis from '../config/redis.js';

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "Resume required"});
        }

        const filePath = req.file.path;
        const fileBuffer = await fs.promises.readFile(filePath);
        const uint8Array = new Uint8Array(fileBuffer);

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

        const aiResponse = await askAi(messages);
        const parsed = JSON.parse(aiResponse);
        fs.unlinkSync(filePath);

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        });

    } catch (error) {
        console.log(error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({message: error.message});
    }
}

import { getBaselineDifficulty, getDifficultyLabel, extractTopics } from '../services/difficultyEngine.service.js';
import { generateAdaptiveQuestion } from '../services/questionGenerator.service.js';

export const generateQuestion =  async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body;
        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if (!role || !experience || !mode) {
            return res.status(400).json({ message: "Role, Experience and Mode are required!" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({message: "User is Not Found"});
        }

        if (user.credits < 50) {
            return res.status(400).json({message: "Not enough credits. Minimum 50 required"})
        }

        // Determine Q1 Difficulty
        const baselineScore = getBaselineDifficulty(role, experience);
        const baselineLabel = getDifficultyLabel(baselineScore);
        
        // Determine Q1 Topic
        const topics = extractTopics(role, resumeText);
        const targetTopic = topics[0] || "General";

        // Generate Q1
        const generatedQ = await generateAdaptiveQuestion({
            role, experience, mode, resumeText, projects, skills,
            targetDifficultyLabel: baselineLabel,
            targetTopic,
            isFollowUp: false,
            previousQuestionsContext: []
        });

        user.credits -= 50;
        await user.save();

        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText,
            totalQuestions: 5,
            question: [{
                question: generatedQ.question,
                topic: generatedQ.topic,
                difficulty: baselineLabel,
                targetDifficulty: baselineScore,
                timeLimit: 60
            }] 
        });

        res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
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
        const { interviewId, questionIndex, answer, timeTaken } = req.body;

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        const question = interview.question[questionIndex];
        if (!question) {
            return res.status(400).json({ message: "Question index out of bounds" });
        }

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
                parsed = { feedback: question.feedback };
            } else if (timeTaken > question.timeLimit) {
                question.score = 0;
                question.feedback = "Your Time is Up";
                question.answer = answer;
                await interview.save();
                parsed = { feedback: question.feedback };
            } else {
                const messages = [
                {
                    role: "system",
                    content: `
                        You are a professional human interviewer evaluating a candidate's answer in a real interview.
                        Evaluate naturally and fairly, like a real person would.
                        Score the answer in these areas (0 to 10):

                        1. Confidence – Does the answer sound clear, confident, and well-presented?
                        2. Communication – Is the language simple, clear, and easy to understand?
                        3. Correctness – Is the answer accurate, relevant, and complete?

                    Rules:
                        - Be realistic and unbiased.
                        - Do not give random high scores.
                        - If the answer is weak, score low.
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
                parsed = JSON.parse(aiResponse);

                question.answer = answer;
                question.confidence = parsed.confidence;
                question.communication = parsed.communication;
                question.correctness = parsed.correctness;
                question.score = parsed.finalScore;
                question.feedback = parsed.feedback;
                
                await interview.save();
            }
        }

        // Adaptive Generation: If we need more questions, generate the next one
        const totalExpected = interview.totalQuestions || 5;
        let nextQuestion = null;
        
        if (questionIndex + 1 < totalExpected) {
            // Check if next question is already generated (retry scenario)
            if (interview.question.length > questionIndex + 1) {
                nextQuestion = interview.question[questionIndex + 1];
            } else {
                // Determine params using the Engine
                const nextParams = calculateNextQuestionParams(interview, questionIndex);
                
                // Generate next question
                const generatedQ = await generateAdaptiveQuestion({
                    role: interview.role,
                    experience: interview.experience,
                    mode: interview.mode,
                    resumeText: interview.resumeText,
                    targetDifficultyLabel: nextParams.targetDifficultyLabel,
                    targetTopic: nextParams.targetTopic,
                    isFollowUp: nextParams.isFollowUp,
                    previousQuestionsContext: interview.question.map(q => ({ question: q.question }))
                });

                // Append and save
                nextQuestion = {
                    question: generatedQ.question,
                    topic: generatedQ.topic,
                    difficulty: nextParams.targetDifficultyLabel,
                    targetDifficulty: nextParams.targetDifficultyScore,
                    timeLimit: 90
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