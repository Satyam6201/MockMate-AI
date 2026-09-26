import Payment from "../model/payment.model.js";
import User from "../model/user.model.js";
import stripe from "../services/stripe.service.js";
import { getIO } from "../config/socket.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;

        if (!planId || !amount || !credits) {
            return res.status(400).json({ message: "invalid plan data" });
        }

        // Mock mode handling if STRIPE_MOCK is true
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
            const mockUrl = `http://localhost:5173/payment-success?session_id=${mockSessionId}`;
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
                            description: `${credits} AI Interview Credits`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // Fix: Use FRONTEND_URL env var instead of hardcoded localhost:5173
            // This allows the app to work in production and Docker deployments
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment`,
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
        return res.status(500).json({ message: `failed to create Stripe checkout session: ${error.message}` });
    }
};

export const verifySession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        if (process.env.STRIPE_MOCK === 'true' && sessionId.startsWith('mock_session_')) {
            const payment = await Payment.findOne({ stripeSessionId: sessionId });
            
            if (payment && payment.status !== 'paid') {
                payment.status = "paid";
                payment.stripePaymentIntentId = "mock_intent_" + Date.now();
                await payment.save();

                // Add credits to user
                const updatedUser = await User.findByIdAndUpdate(payment.userId, {
                    $inc: { credits: payment.credits }
                }, {new: true});
                
                return res.json({ success: true, message: "Mock Payment verified", user: updatedUser });
            } else if (payment && payment.status === 'paid') {
                const user = await User.findById(payment.userId);
                return res.json({ success: true, message: "Mock Payment already processed", user });
            }
            return res.status(400).json({ message: "Payment not completed" });
        }
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
            const payment = await Payment.findOne({ stripeSessionId: sessionId });
            
            if (payment && payment.status !== 'paid') {
                payment.status = "paid";
                payment.stripePaymentIntentId = session.payment_intent;
                await payment.save();

                // Add credits to user
                const updatedUser = await User.findByIdAndUpdate(payment.userId, {
                    $inc: { credits: payment.credits }
                }, {new: true});
                
                return res.json({ success: true, message: "Payment verified", user: updatedUser });
            } else if (payment && payment.status === 'paid') {
                const user = await User.findById(payment.userId);
                return res.json({ success: true, message: "Payment already processed", user });
            }
        }
        
        return res.status(400).json({ message: "Payment not completed" });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying session" });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // req.body must be the raw buffer here
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
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

                // Add credits to user
                await User.findByIdAndUpdate(payment.userId, {
                    $inc: { credits: payment.credits }
                });
                
                try {
                    const io = getIO();
                    io.to(`user:${payment.userId}`).emit("notification", {
                        title: "Payment successful ✓",
                        message: `+${payment.credits} Interview Credits added`,
                        type: "success"
                    });
                    
                    io.to(`user:${payment.userId}`).emit("user:credits_updated", { creditsAdded: payment.credits });
                } catch (socketError) {
                    console.error("Socket error on webhook", socketError);
                }

                console.log(`Payment successful for user ${payment.userId}. Credits added: ${payment.credits}`);
            }
        } catch (error) {
            console.error('Error fulfilling order:', error);
            return res.status(500).end();
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
};