import { Router } from 'express';
import { RazorpayService } from '../services/razorpayService';

const router = Router();

router.post('/create-order', async (req, res) => {
    try {
        const { amount, rideId } = req.body;

        if (!amount || !rideId) {
            return res.status(400).json({ error: 'Amount and rideId are required' });
        }

        const order = await RazorpayService.createOrder(amount, `receipt_${rideId}`);
        res.status(200).json(order);
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const isValid = RazorpayService.verifySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (isValid) {
            // Update DB logic would go here or handled by webhook
            res.status(200).json({ status: 'success' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Razorpay verification failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
