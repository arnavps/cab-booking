import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

export const createPaymentIntent = async (amount: number, currency: string = 'usd', metadata: object = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amounts in cents
            currency,
            metadata: {
                ...metadata,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id,
        };
    } catch (error) {
        console.error('Error creating Stripe Payment Intent:', error);
        throw error;
    }
};
