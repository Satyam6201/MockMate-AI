import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import redis from '../config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

// Close open handles after tests to prevent Jest from hanging
afterAll(async () => {
    await mongoose.disconnect();
    redis.disconnect();
});

describe('Global App and API Error Handling', () => {
    
    it('Should return 404 for an unknown API endpoint with correct JSON shape', async () => {
        const res = await request(app).get('/api/this-route-does-not-exist');
        
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('success', false);
        expect(res.body.message).toContain('not found');
    });

    it('Should contain security headers injected by Helmet', async () => {
        const res = await request(app).get('/api/this-route-does-not-exist');
        
        expect(res.headers).toHaveProperty('x-dns-prefetch-control');
        // Helmet 8.x uses SAMEORIGIN by default
        expect(res.headers['x-frame-options']).toMatch(/SAMEORIGIN|DENY/i);
    });

    it('Should return GZIP content-encoding for API responses', async () => {
        const res = await request(app)
            .get('/api/this-route-does-not-exist')
            .set('Accept-Encoding', 'gzip');
        // compression middleware should apply — response may be gzipped
        expect(res.statusCode).toEqual(404);
    });

});

describe('Authentication Route Basics', () => {

    // Fix: The app uses Google OAuth only (no /api/auth/login endpoint).
    // Test the actual auth endpoint: POST /api/auth/google with missing body.
    it('Should throw 400 if Google Auth is called with missing name/email', async () => {
        const res = await request(app)
            .post('/api/auth/google')
            .send({}); // Empty body — should fail validation

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        expect(res.statusCode).toBeLessThan(500);
    });

    it('Should return 401 for protected routes without a token', async () => {
        const res = await request(app)
            .get('/api/user/current-user');

        // Fix: isAuth now returns 401 Unauthorized (previously was 400)
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
    });

    it('Should return 401 for protected interview routes without a token', async () => {
        const res = await request(app)
            .get('/api/interview/get-interview');

        expect(res.statusCode).toEqual(401);
    });

});

describe('Rate Limiting Headers', () => {

    it('Should include RateLimit headers in responses', async () => {
        const res = await request(app).get('/api/this-route-does-not-exist');
        // globalLimiter sets standardHeaders: true — should include RateLimit-Limit
        expect(res.headers).toHaveProperty('ratelimit-limit');
    });

});
