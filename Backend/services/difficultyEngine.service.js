// Difficulty bands
const DIFFICULTY_BANDS = {
    BEGINNER: { min: 0, max: 20, label: "Beginner" },
    EASY: { min: 21, max: 40, label: "Easy" },
    MEDIUM: { min: 41, max: 60, label: "Medium" },
    HARD: { min: 61, max: 80, label: "Hard" },
    EXPERT: { min: 81, max: 100, label: "Expert" }
};

export const getDifficultyLabel = (score) => {
    if (score <= 20) return "Beginner";
    if (score <= 40) return "Easy";
    if (score <= 60) return "Medium";
    if (score <= 80) return "Hard";
    return "Expert";
};

export const getBaselineDifficulty = (role, experience) => {
    let baseScore = 40; // Default Easy/Medium

    const expLower = experience.toLowerCase();
    if (expLower.includes('senior') || expLower.includes('lead') || expLower.includes('5+') || expLower.includes('8+')) {
        baseScore = 70; // Hard
    } else if (expLower.includes('mid') || expLower.includes('3') || expLower.includes('4')) {
        baseScore = 50; // Medium
    } else if (expLower.includes('fresher') || expLower.includes('junior') || expLower.includes('0') || expLower.includes('1')) {
        baseScore = 30; // Easy
    }

    return baseScore;
};


export const extractTopics = (role, resumeText) => {
    // Basic fallback topics based on role
    const defaultTopics = ["Core Fundamentals", "Problem Solving", "Scenario Based"];
    
    const detectedTopics = new Set();
    const text = (role + " " + (resumeText || "")).toLowerCase();

    if (text.includes("react")) detectedTopics.add("React.js");
    if (text.includes("node")) detectedTopics.add("Node.js");
    if (text.includes("sql") || text.includes("database")) detectedTopics.add("Databases");
    if (text.includes("system design") || text.includes("architecture")) detectedTopics.add("System Design");
    if (text.includes("aws") || text.includes("cloud")) detectedTopics.add("Cloud Architecture");
    if (text.includes("javascript")) detectedTopics.add("JavaScript");

    if (detectedTopics.size > 0) {
        return Array.from(detectedTopics);
    }

    return defaultTopics;
};

/**
 * Calculates the parameters for the next question.
 * 
 * @param {Object} interview - The full interview document
 * @param {Number} currentQuestionIndex - The index of the question just answered
 * @returns {Object} - { targetDifficultyScore, targetDifficultyLabel, targetTopic, isFollowUp }
 */
export const calculateNextQuestionParams = (interview, currentQuestionIndex) => {
    const questions = interview.question;
    
    // 1. Calculate historical performance
    let recentScoreSum = 0;
    let recentCount = 0;
    
    const windowStart = Math.max(0, currentQuestionIndex - 1);
    for (let i = windowStart; i <= currentQuestionIndex; i++) {
        const q = questions[i];
        if (q && q.finalScore !== undefined) {
            recentScoreSum += q.finalScore;
            recentCount++;
        }
    }
    const avgRecentScore = recentCount > 0 ? (recentScoreSum / recentCount) : 5;

    // 2. Structured Progression: 5 Easy, 3 Medium, 2 Hard
    // We blend the structured progression with the candidate's actual performance.
    let baseScore;
    let questionType;
    let timeLimit = 60; // default 60s
    
    // Using currentQuestionIndex + 1 because this calculates for the *next* question
    // Example: if currentQuestionIndex is 0 (they just answered Q1), we are calculating for Q2 (index 1).
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < 5) {
        baseScore = 30; // Easy
        questionType = Math.random() > 0.5 ? "Conceptual" : "Scenario-based";
    } else if (nextIndex < 8) {
        baseScore = 50; // Medium
        questionType = "Scenario-based";
        timeLimit = 90;
    } else {
        baseScore = 70; // Hard
        questionType = "Coding"; // Hard questions include coding
        timeLimit = 180; // 3 minutes for coding
    }

    // Adjust slightly based on performance, but keep them roughly in their phase band
    let nextDifficultyScore = baseScore;
    if (avgRecentScore >= 8) {
        nextDifficultyScore += 10;
    } else if (avgRecentScore < 4) {
        nextDifficultyScore -= 10;
    }
    nextDifficultyScore = Math.max(10, Math.min(95, nextDifficultyScore));
    
    // 3. Topic Selection & Follow-up logic
    const askedTopics = new Set(questions.map(q => q.topic).filter(Boolean));
    const allTopics = extractTopics(interview.role, interview.resumeText);
    
    let targetTopic = "General";
    let isFollowUp = false;

    if (questions[currentQuestionIndex] && avgRecentScore >= 7 && Math.random() > 0.6 && questionType !== "Coding") {
        targetTopic = questions[currentQuestionIndex].topic || "Advanced Concepts";
        isFollowUp = true;
    } else {
        const unaskedTopics = allTopics.filter(t => !askedTopics.has(t));
        if (unaskedTopics.length > 0) {
            targetTopic = unaskedTopics[Math.floor(Math.random() * unaskedTopics.length)];
        } else {
            targetTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
        }
    }

    return {
        targetDifficultyScore: nextDifficultyScore,
        targetDifficultyLabel: getDifficultyLabel(nextDifficultyScore),
        targetTopic,
        isFollowUp,
        questionType,
        timeLimit
    };
};