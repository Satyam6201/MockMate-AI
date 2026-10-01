import Payment from "../model/payment.model.js";
import User from "../model/user.model.js";
import stripe from "../services/stripe.service.js";
import { getIO } from "../config/socket.js";
import genToken from "../config/token.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;

        if (!planId || !amount || !credits) {
            return res.status(400).json({ message: "Invalid plan data" });
        }

        const clientOrigin = req.headers.origin 
            || (req.headers.referer ? new URL(req.headers.referer).origin : null)
            || process.env.FRONTEND_URL 
            || process.env.SITE_URL 
            || 'http://localhost:5173';

        const frontendUrl = clientOrigin.replace(/\/$/, '');

        if (process.env.STRIPE_MOCK === 'true') {
            const mockSessionId = 'mock_session_' + Date.now();
            await Payment.create({
                userId: req.userId,
                planId,
                amount,
                credits,
                stripeSessionId: mockSessionId,
                status: "created"
            });
            const mockUrl = `${frontendUrl}/payment-success?session_id=${mockSessionId}`;
            return res.json({ id: mockSessionId, url: mockUrl });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `MockMate AI - ${planId} Plan`,
                            description: `${credits} AI Platform Credits`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/payment`,
            client_reference_id: req.userId.toString(),
            metadata: {
                planId: planId.toString(),
                credits: credits.toString(),
                userId: req.userId.toString(),
            }
        });

        await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            stripeSessionId: session.id,
            status: "created"
        });

        return res.json({ id: session.id, url: session.url });
    } catch (error) {
        return res.status(500).json({ message: `Failed to create Stripe checkout session: ${error.message}` });
    }
};

export const verifySession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }
        
        if (process.env.STRIPE_MOCK === 'true' && sessionId.startsWith('mock_session_')) {
            const payment = await Payment.findOne({ stripeSessionId: sessionId });
            
            if (payment) {
                let user;
                if (payment.status !== 'paid') {
                    payment.status = "paid";
                    payment.stripePaymentIntentId = "mock_intent_" + Date.now();
                    await payment.save();

                    user = await User.findByIdAndUpdate(payment.userId, {
                        $inc: { credits: payment.credits }
                    }, { new: true });
                } else {
                    user = await User.findById(payment.userId);
                }

                if (user) {
                    const isProduction = process.env.NODE_ENV === "production";
                    const token = genToken(user._id);
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: isProduction ? "none" : "lax",
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                }
                
                return res.json({ success: true, message: "Payment verified", user });
            }
            return res.status(400).json({ message: "Payment not found" });
        }
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
            const payment = await Payment.findOne({ stripeSessionId: sessionId });
            
            if (payment) {
                let user;
                if (payment.status !== 'paid') {
                    payment.status = "paid";
                    payment.stripePaymentIntentId = session.payment_intent;
                    await payment.save();

                    user = await User.findByIdAndUpdate(payment.userId, {
                        $inc: { credits: payment.credits }
                    }, { new: true });
                } else {
                    user = await User.findById(payment.userId);
                }

                if (user) {
                    const isProduction = process.env.NODE_ENV === "production";
                    const token = genToken(user._id);
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: isProduction ? "none" : "lax",
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                }
                
                return res.json({ success: true, message: "Payment verified", user });
            }
        }
        
        return res.status(400).json({ message: "Payment not completed" });
    } catch (error) {
        return res.status(500).json({ message: `Error verifying session: ${error.message}` });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const sessionId = session.id;
        const paymentIntentId = session.payment_intent;

        try {
            const payment = await Payment.findOne({ stripeSessionId: sessionId });

            if (payment && payment.status !== "paid") {
                payment.status = "paid";
                payment.stripePaymentIntentId = paymentIntentId;
                await payment.save();

                await User.findByIdAndUpdate(payment.userId, {
                    $inc: { credits: payment.credits }
                });
                
                try {
                    const io = getIO();
                    io.to(`user:${payment.userId}`).emit("notification", {
                        title: "Payment successful ✓",
                        message: `+${payment.credits} Credits added`,
                        type: "success"
                    });
                    
                    io.to(`user:${payment.userId}`).emit("user:credits_updated", { creditsAdded: payment.credits });
                } catch (socketError) {
                    console.error("Socket error on webhook", socketError);
                }
            }
        } catch (error) {
            console.error('Error fulfilling order:', error);
            return res.status(500).end();
        }
    }

    res.send();
};