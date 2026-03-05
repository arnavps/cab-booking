import Stripe from 'stripe';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ReceiptService } from '../services/receiptService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

const prisma = new PrismaClient();

export const stripeWebhookHandler = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            (req as any).rawBody, // We need the raw body from Express
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const rideId = paymentIntent.metadata.rideId;

            if (rideId) {
                console.log(`Payment confirmed for Ride: ${rideId}`);

                // Update database: Transaction -> COMPLETED, Ride -> COMPLETED
                await prisma.transaction.update({
                    where: { rideId: rideId },
                    data: { status: 'COMPLETED' },
                });

                await prisma.ride.update({
                    where: { id: rideId },
                    data: { status: 'COMPLETED' },
                });

                // Generate Receipt
                await ReceiptService.generateReceipt(rideId);
            }
            break;

        case 'payment_intent.payment_failed':
            console.log('Payment failed');
            // Update DB to FAILED if needed
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};
