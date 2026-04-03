import { Router } from 'express';
import { prisma } from '../context';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {} as any);

const router = Router();

// Endpoint to create a checkout session
router.post('/create-checkout', authenticate, requireRole(['COMPANY_ADMIN']), async (req, res) => {
    const { planType } = req.body;
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

// Webhook endpoint to receive background events from Stripe
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session: any = event.data.object;
        const companyId = session.client_reference_id;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (companyId) {
            await prisma.company.update({
                where: { id: companyId },
                data: {
                    stripeSubscriptionId: subscriptionId,
                    stripeCustomerId: customerId,
                    plan: 'PRO',
                },
            });
        }
    } else if (event.type === 'customer.subscription.deleted') {
        const subscription: any = event.data.object;
        await prisma.company.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: { plan: 'BASIC' },
        });
    }

    res.json({ received: true });
});

export default router;
