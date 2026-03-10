import { Request, Response } from 'express';
import { RazorpayService } from '../services/razorpayService';

export const razorpayWebhookHandler = async (req: Request, res: Response) => {
    try {
        const signature = req.headers['x-razorpay-signature'] as string;
        const body = JSON.stringify(req.body);

        const isValid = RazorpayService.verifyWebhookSignature(body, signature);

        if (!isValid) {
            return res.status(400).send('Invalid signature');
        }

        const event = req.body.event;
        console.log(`STUB: Razorpay Event ${event} received`);
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Razorpay Webhook Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
