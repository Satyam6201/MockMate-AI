import { jest } from '@jest/globals';
import { getBaselineDifficulty, calculateNextQuestionParams, extractTopics, getDifficultyLabel } from '../services/difficultyEngine.service.js';

describe('Difficulty Engine', () => {

    describe('Difficulty Labels', () => {
        it('should correctly map score ranges to labels', () => {
            expect(getDifficultyLabel(10)).toBe('Beginner');
            expect(getDifficultyLabel(30)).toBe('Easy');
            expect(getDifficultyLabel(50)).toBe('Medium');
            expect(getDifficultyLabel(70)).toBe('Hard');
            expect(getDifficultyLabel(90)).toBe('Expert');
        });
    });

    describe('Baseline Difficulty', () => {
        it('should return 30 (Easy) for fresher/junior/intern', () => {
            expect(getBaselineDifficulty('Frontend Developer', 'Fresher')).toBe(30);
            expect(getBaselineDifficulty('Backend Developer', '1 year')).toBe(30);
            expect(getBaselineDifficulty('Junior Engineer', '0-1 year')).toBe(30);
        });

        it('should return 50 (Medium) for mid-level', () => {
            expect(getBaselineDifficulty('Fullstack Developer', '3 years')).toBe(50);
            expect(getBaselineDifficulty('Software Engineer', '4 years')).toBe(50);
        });

        it('should return 70 (Hard) for senior/lead/architect', () => {
            expect(getBaselineDifficulty('Senior Developer', '5+ years')).toBe(70);
            expect(getBaselineDifficulty('Tech Lead', '8 years')).toBe(70);
            expect(getBaselineDifficulty('Solutions Architect', '6 years')).toBe(70);
        });
    });

    describe('Topic Extraction', () => {
        it('should extract correct topics based on resume and role', () => {
            const topics = extractTopics('React Developer', 'I have experience with React, Node.js and SQL databases.');
            expect(topics).toContain('React.js');
            expect(topics).toContain('Node.js');
            expect(topics).toContain('Databases');
        });

        it('should return default fallback topics if no match is found', () => {
            const topics = extractTopics('General', '');
            expect(topics.length).toBeGreaterThan(0);
            expect(topics).toContain('Core Fundamentals');
        });
    });

    describe('calculateNextQuestionParams', () => {
        it('should adapt difficulty upward for strong performance in early phase', () => {
            const interview = {
                role: 'Frontend Developer',
                experience: '2 years',
                mode: 'Technical',
                resumeText: 'React expert',
                question: [
                    { targetDifficulty: 30, finalScore: 9, topic: 'React.js' }
                ]
            };

            const params = calculateNextQuestionParams(interview, 0);
            // nextIndex = 1 (< 5) -> baseScore = 30. High score (9 >= 8) -> 30 + 10 = 40
            expect(params.targetDifficultyScore).toBe(40);
            expect(params.targetDifficultyLabel).toBe('Easy');
        });

        it('should adapt difficulty downward for weak performance in early phase', () => {
            const interview = {
                role: 'Frontend Developer',
                experience: '2 years',
                mode: 'Technical',
                resumeText: 'React expert',
                question: [
                    { targetDifficulty: 30, finalScore: 2, topic: 'React.js' }
                ]
            };

            const params = calculateNextQuestionParams(interview, 0);
            // nextIndex = 1 (< 5) -> baseScore = 30. Low score (2 < 4) -> 30 - 10 = 20
            expect(params.targetDifficultyScore).toBe(20);
            expect(params.targetDifficultyLabel).toBe('Beginner');
        });

        it('should transition to Hard coding phase in late questions (Q8+)', () => {
            const interview = {
                role: 'Backend Developer',
                experience: '3 years',
                mode: 'Technical',
                resumeText: 'Node.js and microservices',
                question: Array(8).fill({ targetDifficulty: 50, finalScore: 8, topic: 'Node.js' })
            };

            const params = calculateNextQuestionParams(interview, 7);
            // nextIndex = 8 (>= 8) -> baseScore = 70. High score -> 70 + 10 = 80
            expect(params.targetDifficultyScore).toBe(80);
            expect(params.targetDifficultyLabel).toBe('Hard');
            expect(params.questionType).toBe('Coding');
        });

        it('should configure coding round times appropriately', () => {
            const interview = {
                role: 'Software Engineer',
                experience: '4 years',
                mode: 'Coding Round',
                resumeText: 'DSA expert',
                question: [
                    { targetDifficulty: 50, finalScore: 9, topic: 'Algorithms' }
                ]
            };

            const params = calculateNextQuestionParams(interview, 0);
            expect(params.questionType).toBe('Coding');
            expect(params.timeLimit).toBeGreaterThanOrEqual(1800); // at least 30 minutes
        });

        it('should pick a follow-up topic when candidate answers strongly', () => {
            const interview = {
                role: 'Frontend Developer',
                experience: '2 years',
                mode: 'Technical',
                resumeText: 'React expert',
                question: [
                    { targetDifficulty: 30, finalScore: 9, topic: 'React.js' }
                ]
            };

            const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.9);

            const params = calculateNextQuestionParams(interview, 0);
            expect(params.isFollowUp).toBe(true);
            expect(params.targetTopic).toBe('React.js');

            randomSpy.mockRestore();
        });
    });
});
