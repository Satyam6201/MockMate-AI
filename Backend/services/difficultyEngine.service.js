/**
 * Difficulty Engine Service
 * 
 * A pure, deterministic business logic layer to decide the next question's
 * difficulty and topic based on the candidate's profile and recent performance.
 */

// Difficulty bands
const DIFFICULTY_BANDS = {
    BEGINNER: { min: 0, max: 20, label: "Beginner" },
    EASY: { min: 21, max: 40, label: "Easy" },
    MEDIUM: { min: 41, max: 60, label: "Medium" },
    HARD: { min: 61, max: 80, label: "Hard" },
    EXPERT: { min: 81, max: 100, label: "Expert" }
};

/**
 * Maps an internal score (0-100) to a human-readable difficulty label.
 */
export const getDifficultyLabel = (score) => {
    if (score <= 20) return "Beginner";
    if (score <= 40) return "Easy";
    if (score <= 60) return "Medium";
    if (score <= 80) return "Hard";
    return "Expert";
};

/**
 * Determines the baseline difficulty based on role and experience.
 */
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

/**
 * Extracts possible topics from the resume or role.
 */
export const extractTopics = (role, resumeText) => {
    // Basic fallback topics based on role
    const defaultTopics = ["Core Fundamentals", "Problem Solving", "Scenario Based"];
    
    // In a real scenario, this would parse the resume skills array or JD.
    // For now, if resume text contains certain keywords, we can prioritize them.
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
    
    // Consider up to the last 2 questions to prevent wild swings
    const windowStart = Math.max(0, currentQuestionIndex - 1);
    for (let i = windowStart; i <= currentQuestionIndex; i++) {
        const q = questions[i];
        if (q && q.finalScore !== undefined) {
            recentScoreSum += q.finalScore;
            recentCount++;
        }
    }

    const avgRecentScore = recentCount > 0 ? (recentScoreSum / recentCount) : 5; // 0-10 scale

    // 2. Adjust Difficulty
    const currentQ = questions[currentQuestionIndex];
    let currentDifficultyScore = currentQ?.targetDifficulty || getBaselineDifficulty(interview.role, interview.experience);
    
    // Engine rules:
    // avg score > 8 => +15 difficulty
    // avg score 6-8 => +5 difficulty (slight push)
    // avg score 4-5 => no change
    // avg score < 4 => -15 difficulty
    
    let nextDifficultyScore = currentDifficultyScore;
    if (avgRecentScore >= 8) {
        nextDifficultyScore += 15;
    } else if (avgRecentScore >= 6) {
        nextDifficultyScore += 5;
    } else if (avgRecentScore < 4) {
        nextDifficultyScore -= 15;
    }

    // Clamp between 10 and 95
    nextDifficultyScore = Math.max(10, Math.min(95, nextDifficultyScore));
    
    // 3. Topic Selection & Follow-up logic
    // Track asked topics to ensure coverage
    const askedTopics = new Set(questions.map(q => q.topic).filter(Boolean));
    const allTopics = extractTopics(interview.role, interview.resumeText);
    
    let targetTopic = "General";
    let isFollowUp = false;

    // Follow-up logic: If they did well (score >= 7) on a specific topic, 
    // there's a 40% chance we dive deeper into the SAME topic as a follow-up.
    if (currentQ && avgRecentScore >= 7 && Math.random() > 0.6) {
        targetTopic = currentQ.topic || "Advanced Concepts";
        isFollowUp = true;
    } else {
        // Otherwise, find an unasked topic
        const unaskedTopics = allTopics.filter(t => !askedTopics.has(t));
        if (unaskedTopics.length > 0) {
            targetTopic = unaskedTopics[Math.floor(Math.random() * unaskedTopics.length)];
        } else {
            // If all topics asked, just pick a random one
            targetTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
        }
    }

    return {
        targetDifficultyScore: nextDifficultyScore,
        targetDifficultyLabel: getDifficultyLabel(nextDifficultyScore),
        targetTopic,
        isFollowUp
    };
};
