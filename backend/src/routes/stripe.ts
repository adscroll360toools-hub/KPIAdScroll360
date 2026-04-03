import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../context';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia',
});

const router = Router();

// Endpoint to create a checkout session
router.post('/create-checkout', authenticate, requireRole(['COMPANY_ADMIN']), async (req, res) => {
    const { planType } = req.body; // PRO or ENTERPRISE
    const { companyId } = req.user!;

    if (!companyId) return res.status(403).json({ error: 'No company attached' });

    try {
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        if (!company) return res.status(404).json({ error: 'Company not found' });

        let priceId = '';
        if (planType === 'PRO') priceId = 'price_pro_placeholder_id';
        else if (planType === 'ENTERPRISE') priceId = 'price_ent_placeholder_id';
        else return res.status(400).json({ error: 'Invalid plan type' });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            client_reference_id: companyId,
            success_url: `${process.env.FRONTEND_URL}/dashboard?upgrade=success`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing?upgrade=canceled`,
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Webhook endpoint to receive background events from Stripe (IMPORTANT: raw body parser required)
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Explicitly cast req.body as any generic payload buffer logic handles it correctly below.
        event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const companyId = session.client_reference_id;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (companyId) {
            // Fetch subscription from stripe to determine plan directly or infer from session
            await prisma.company.update({
                where: { id: companyId },
                data: {
                    stripeSubscriptionId: subscriptionId,
                    stripeCustomerId: customerId,
                    plan: 'PRO', // Alternatively fetch line item to set dynamically
                },
            });
        }
    } else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.company.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: { plan: 'BASIC' },
        });
    }

    res.json({ received: true });
});

export default router;
