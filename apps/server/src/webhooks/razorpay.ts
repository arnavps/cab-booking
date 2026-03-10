import { Request, Response } from 'express';
import { RazorpayService } from '../services/razorpayService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const razorpayWebhookHandler = async (req: Request, res: Response) => {
    try {
        const signature = req.headers['x-razorpay-signature'] as string;
        const body = JSON.stringify(req.body);

        const isValid = RazorpayService.verifyWebhookSignature(body, signature);

        if (!isValid) {
            return res.status(400).send('Invalid signature');
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        if (event === 'payment.captured') {
            const rideId = payload.notes?.rideId || payload.description?.split('_')[1];

            if (rideId) {
                await prisma.ride.update({
                    where: { id: rideId },
                    data: { status: 'PAID' as any },
                });

                console.log(`Payment captured for ride: ${rideId}`);
            }
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Razorpay Webhook Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
