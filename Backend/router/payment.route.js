import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { createCheckoutSession, verifySession } from '../controllers/payment.controller.js';

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", isAuth, createCheckoutSession);
paymentRouter.post("/verify-session", isAuth, verifySession);

export default paymentRouter;