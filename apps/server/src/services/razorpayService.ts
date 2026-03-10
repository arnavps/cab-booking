export class RazorpayService {
    static async createOrder(amount: number, receipt: string) {
        console.log(`STUB: Creating Razorpay order for ${amount}`);
        return {
            id: 'order_stub_' + Math.random().toString(36).substring(7),
            amount: amount * 100,
            currency: 'INR',
        };
    }

    static verifySignature(orderId: string, paymentId: string, signature: string) {
        console.log('STUB: Verifying signature (assuming valid)');
        return true;
    }

    static verifyWebhookSignature(body: string, signature: string) {
        console.log('STUB: Verifying webhook signature (assuming valid)');
        return true;
    }
}
