import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from environment variables');
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export class RazorpayService {
    /**
     * Creates a new Razorpay order.
     * @param amount Amount in INR (not paise, will be converted below)
     * @param receipt Optional receipt ID
     */
    static async createOrder(amount: number, receipt: string) {
        try {
            const options = {
                amount: Math.round(amount * 100), // Convert to paise
                currency: 'INR',
                receipt: receipt,
            };

            const order = await razorpay.orders.create(options);
            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            };
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw error;
        }
    }

    /**
     * Verifies the payment signature sent by the frontend.
     */
    static verifySignature(orderId: string, paymentId: string, signature: string) {
        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const body = orderId + '|' + paymentId;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        return expectedSignature === signature;
    }

    /**
     * Verifies the webhook signature.
     */
    static verifyWebhookSignature(body: string, signature: string) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        return expectedSignature === signature;
    }
}
