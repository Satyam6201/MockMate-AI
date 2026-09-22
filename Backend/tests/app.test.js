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
    
    it('Should return 404 for an unknown API endpoint', async () => {
        const res = await request(app).get('/api/this-route-does-not-exist');
        
        // Assertions
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('success', false);
        expect(res.body.message).toContain('not found');
    });

    it('Should contain security headers from Helmet', async () => {
        const res = await request(app).get('/api/this-route-does-not-exist');
        
        // Helmet usually sets X-DNS-Prefetch-Control, X-Frame-Options, Strict-Transport-Security, etc.
        expect(res.headers).toHaveProperty('x-dns-prefetch-control');
        expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
    });

});

describe('Authentication Route Basics', () => {
    
    it('Should throw 400 if logging in with missing credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({}); // Empty body

        // Note: Assuming your auth controller returns 400 for bad input
        expect(res.statusCode).toBeGreaterThanOrEqual(400); 
        expect(res.statusCode).toBeLessThan(500); 
    });

});
