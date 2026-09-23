import { askAi } from './openRouter.services.js';

const validateAiResponse = (responseString) => {
    try {
        const parsed = JSON.parse(responseString);
        if (!parsed.question || typeof parsed.question !== 'string') return null;
        if (!parsed.topic || typeof parsed.topic !== 'string') return null;
        
        // Strip markdown if AI accidentally includes it
        return {
            question: parsed.question.replace(/^["']|["']$/g, '').trim(),
            topic: parsed.topic.trim()
        };
    } catch (e) {
        console.error("Failed to parse AI question response:", e);
        return null;
    }
};

export const generateAdaptiveQuestion = async ({
    role,
    experience,
    mode,
    resumeText,
    projects,
    skills,
    targetDifficultyLabel,
    targetTopic,
    isFollowUp,
    questionType,
    previousQuestionsContext // array of previous questions to avoid duplicates
}) => {
    const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResume = resumeText?.trim() || "None";
    
    // Build contextual prompt to avoid duplicates
    let duplicatePrevention = "";
    if (previousQuestionsContext && previousQuestionsContext.length > 0) {
        duplicatePrevention = `
        DO NOT ask any of these exact or highly similar questions again:
        ${previousQuestionsContext.map((q, i) => `${i+1}. ${q.question}`).join("\n")}
        `;
    }

    const followUpInstruction = isFollowUp 
        ? `This should be a deep-dive FOLLOW-UP question related to the topic of: ${targetTopic}.` 
        : `Focus the question heavily on this topic: ${targetTopic}.`;

    let typeInstruction = "";
    if (questionType === "Coding") {
        typeInstruction = "This MUST be a coding problem. Ask the candidate to write a function or solve an algorithm. Give clear input/output requirements.";
    } else if (questionType === "Scenario-based") {
        typeInstruction = "This MUST be a scenario-based question. 'Imagine you are working on... how would you handle...'";
    } else {
        typeInstruction = "This MUST be a conceptual question about core principles or definitions.";
    }

    const userPrompt = `
        Role: ${role}
        Experience: ${experience}
        InterviewMode: ${mode}
        Target Difficulty: ${targetDifficultyLabel}
        Target Topic: ${targetTopic}
        Question Type: ${questionType}
        Projects: ${projectText}
        Skills: ${skillsText}
        Resume: ${safeResume}
    `;

    const messages = [
        {
            role: "system",
            content: `You are a strict, professional technical interviewer.
            Generate EXACTLY ONE interview question based on the candidate's context.

            Strict Rules:
            - The difficulty must match the requested Target Difficulty (${targetDifficultyLabel}).
            - ${typeInstruction}
            - ${followUpInstruction}
            ${duplicatePrevention}
            - Keep the question between 15 and 45 words.
            - It must be practical and realistic.
            
            Return ONLY valid JSON in this exact format, with no markdown formatting or backticks:
            {
                "question": "The interview question here",
                "topic": "The exact topic this evaluates"
            }
            `
        },
        {
            role: "user",
            content: userPrompt
        }
    ];

    try {
        const aiResponse = await askAi(messages);
        
        // Sometimes AI returns markdown like ```json ... ```
        const cleanResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const validated = validateAiResponse(cleanResponse);
        if (!validated) {
            throw new Error("AI returned invalid question format");
        }

        return { ...validated, questionType };
    } catch (error) {
        console.error("Error generating adaptive question:", error);
        throw error;
    }
};