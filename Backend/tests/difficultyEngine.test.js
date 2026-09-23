import { getBaselineDifficulty, calculateNextQuestionParams, extractTopics } from '../services/difficultyEngine.service.js';

describe('Difficulty Engine', () => {

    describe('Baseline Difficulty', () => {
        it('should return 30 (Easy) for fresher/junior', () => {
            expect(getBaselineDifficulty('Frontend Developer', 'Fresher')).toBe(30);
            expect(getBaselineDifficulty('Backend Developer', '1 year')).toBe(30);
        });

        it('should return 50 (Medium) for mid-level', () => {
            expect(getBaselineDifficulty('Fullstack Developer', '3 years')).toBe(50);
        });

        it('should return 70 (Hard) for senior/lead', () => {
            expect(getBaselineDifficulty('Senior Developer', '5+ years')).toBe(70);
            expect(getBaselineDifficulty('Tech Lead', '8 years')).toBe(70);
        });
    });

    describe('Topic Extraction', () => {
        it('should extract correct topics based on resume and role', () => {
            const topics = extractTopics('React Developer', 'I have experience with React, Node.js and SQL databases.');
            expect(topics).toContain('React.js');
            expect(topics).toContain('Node.js');
            expect(topics).toContain('Databases');
        });
    });

    describe('calculateNextQuestionParams', () => {
        it('should increase difficulty for strong performance', () => {
            const interview = {
                role: 'Frontend Developer',
                experience: '2 years',
                resumeText: 'React expert',
                question: [
                    { targetDifficulty: 50, finalScore: 9, topic: 'React.js' }
                ]
            };

            const params = calculateNextQuestionParams(interview, 0);
            expect(params.targetDifficultyScore).toBe(65); // 50 + 15
            expect(params.targetDifficultyLabel).toBe('Hard');
        });

        it('should decrease difficulty for weak performance', () => {
            const interview = {
                role: 'Frontend Developer',
                experience: '2 years',
                resumeText: 'React expert',
                question: [
                    { targetDifficulty: 50, finalScore: 2, topic: 'React.js' }
                ]
            };

            const params = calculateNextQuestionParams(interview, 0);
            expect(params.targetDifficultyScore).toBe(35); // 50 - 15
            expect(params.targetDifficultyLabel).toBe('Easy');
        });

        it('should slightly increase difficulty for mixed/moderate performance', () => {
            const interview = {
                role: 'Frontend Developer',
                experience: '2 years',
                resumeText: 'React expert',
                question: [
                    { targetDifficulty: 50, finalScore: 7, topic: 'React.js' }
                ]
            };

            const params = calculateNextQuestionParams(interview, 0);
            expect(params.targetDifficultyScore).toBe(55); // 50 + 5
            expect(params.targetDifficultyLabel).toBe('Medium');
        });

        it('should cap difficulty bounds', () => {
            const interview = {
                role: 'Frontend',
                experience: 'Senior',
                question: [
                    { targetDifficulty: 90, finalScore: 9, topic: 'React.js' }
                ]
            };

            const params = calculateNextQuestionParams(interview, 0);
            expect(params.targetDifficultyScore).toBe(95); // max 95
        });

        it('should pick a follow-up topic occasionally if performance is strong', () => {
            const interview = {
                role: 'Frontend Developer',
                experience: '2 years',
                resumeText: 'React expert',
                question: [
                    { targetDifficulty: 50, finalScore: 9, topic: 'React.js' }
                ]
            };

            // Force Math.random to > 0.6 for follow-up logic
            jest.spyOn(Math, 'random').mockReturnValue(0.8);

            const params = calculateNextQuestionParams(interview, 0);
            expect(params.targetTopic).toBe('React.js');
            expect(params.isFollowUp).toBe(true);
            
            Math.random.mockRestore();
        });
    });
});
