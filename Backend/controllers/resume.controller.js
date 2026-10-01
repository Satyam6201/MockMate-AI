import User from "../model/user.model.js";
import Resume from "../model/resume.model.js";
import redis from "../config/redis.js";
import { askAi } from "../services/openRouter.services.js";

// List of Pro templates that require 50 credits
const PRO_TEMPLATES = ["modern", "compact"];
const FREE_TEMPLATES = ["executive", "clean"];

/**
 * Controller: Build & Save Resume (Deducts 50 credits for Pro templates)
 */
export const buildResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeData, template = "modern", atsScore = 85 } = req.body;

        if (!resumeData || !resumeData.personalInfo) {
            return res.status(400).json({ success: false, message: "Resume data is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isPro = PRO_TEMPLATES.includes(template);

        // Credit check for Pro templates
        if (isPro) {
            if (user.credits < 50) {
                return res.status(403).json({
                    success: false,
                    insufficientCredits: true,
                    message: "Insufficient credits! 50 credits are required for Pro ATS templates. You can switch to our Free templates (Harvard Classic / Minimalist) or recharge credits.",
                    credits: user.credits,
                    requiredCredits: 50,
                    allowedFreeTemplates: FREE_TEMPLATES
                });
            }

            // Deduct 50 credits atomically
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $inc: { credits: -50 } },
                { new: true }
            );

            // Invalidate redis cache if available
            if (redis) {
                try {
                    await redis.del(`user:${userId}`);
                } catch (e) {
                    console.warn("[Redis Cache Invalidation Warning]:", e.message);
                }
            }

            // Save or update Resume record
            const savedResume = await Resume.create({
                userId,
                template,
                isProTemplate: true,
                personalInfo: resumeData.personalInfo,
                skills: resumeData.skills,
                experience: resumeData.experience,
                projects: resumeData.projects,
                education: resumeData.education,
                certifications: resumeData.certifications,
                atsScore
            });

            return res.status(200).json({
                success: true,
                message: "Resume saved successfully! 50 credits deducted for Pro template.",
                isProTemplate: true,
                creditsLeft: updatedUser.credits,
                resume: savedResume
            });
        }

        // Free Template Path (0 Credits deducted)
        const savedResume = await Resume.create({
            userId,
            template,
            isProTemplate: false,
            personalInfo: resumeData.personalInfo,
            skills: resumeData.skills,
            experience: resumeData.experience,
            projects: resumeData.projects,
            education: resumeData.education,
            certifications: resumeData.certifications,
            atsScore
        });

        return res.status(200).json({
            success: true,
            message: "Free ATS template saved successfully!",
            isProTemplate: false,
            creditsLeft: user.credits,
            resume: savedResume
        });

    } catch (error) {
        console.error("[Build Resume Error]:", error);
        return res.status(500).json({
            success: false,
            message: `Failed to build resume: ${error.message || error}`
        });
    }
};

/**
 * Controller: AI Bullet Point Enhancer
 */
export const enhanceBulletWithAi = async (req, res) => {
    try {
        const { bulletText, role = "Software Engineer" } = req.body;

        if (!bulletText || !bulletText.trim()) {
            return res.status(400).json({ success: false, message: "Bullet point text is required." });
        }

        try {
            const prompt = `You are a Principal Technical Recruiter and ATS Resume Optimization Specialist.
Transform the following basic resume bullet point into 3 distinct, high-impact, ATS-optimized bullet points for a ${role} position.
Requirements for each suggestion:
1. Start with a strong power action verb (e.g., Architected, Engineered, Spearheaded, Optimized, Automated, Delivered).
2. Include quantifiable metrics and measurable business/technical impact (e.g., % improvement, latency reduction, user scale, uptime).
3. Mention modern tech stack tools appropriately.
4. Output strictly valid JSON array of 3 strings: ["...", "...", "..."] without any markdown wrap or extra commentary.

Original bullet point: "${bulletText}"`;

            const aiResponse = await askAi([
                { role: "system", content: "You are an expert ATS resume writer. Output ONLY a valid JSON array of 3 strings." },
                { role: "user", content: prompt }
            ]);

            // Clean markdown code blocks if present
            const cleanContent = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const suggestions = JSON.parse(cleanContent);

            return res.status(200).json({
                success: true,
                suggestions: Array.isArray(suggestions) ? suggestions : [
                    `Architected high-throughput solutions based on ${bulletText.toLowerCase()}, improving system latency by 35%.`,
                    `Spearheaded the deployment of ${bulletText.toLowerCase()} across production microservices, boosting reliability to 99.9%.`,
                    `Engineered scalable workflows for ${bulletText.toLowerCase()}, cutting manual overhead by 40% across engineering sprints.`
                ]
            });

        } catch (aiError) {
            console.warn("[AI Enhancement fallback]:", aiError.message);
            // Fallback smart algorithmic suggestions
            const clean = bulletText.trim().toLowerCase();
            return res.status(200).json({
                success: true,
                suggestions: [
                    `Architected high-performance services around ${clean}, improving processing efficiency by 35% and reducing response latency.`,
                    `Spearheaded the integration of automated pipelines for ${clean}, delivering a 45% reduction in release cycle lead time.`,
                    `Engineered robust and fault-tolerant infrastructure for ${clean}, supporting 10k+ daily concurrent users with 99.98% uptime.`
                ]
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Failed to enhance bullet: ${error.message || error}`
        });
    }
};

/**
 * Controller: Get User Saved Resumes
 */
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;
        const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).limit(10);
        return res.status(200).json({ success: true, resumes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch resumes." });
    }
};
