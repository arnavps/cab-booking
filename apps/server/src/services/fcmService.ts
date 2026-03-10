import admin from 'firebase-admin';

// Initialize Firebase Admin (Using service account from env or file)
// For this demo, we'll try to initialize but gracefully handle if config is missing
try {
    if (!admin.apps.length) {
        // You would normally provide serviceAccount key here
        // admin.initializeApp({
        //     credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}')),
        // });
        console.log('Firebase Admin initialized (Simulated for Demo)');
    }
} catch (error) {
    console.warn('Firebase initialization failed. Notifications will be logged only.');
}

export class FCMService {
    /**
     * Sends a push notification to a specific user.
     */
    static async sendNotification(fcmToken: string, title: string, body: string, data: any = {}) {
        try {
            if (!fcmToken) return;

            const message = {
                notification: { title, body },
                data,
                token: fcmToken,
            };

            // In a real app with proper initialization:
            // await admin.messaging().send(message);
            
            console.log(`--- PUSH NOTIFICATION SENT ---`);
            console.log(`To Token: ${fcmToken}`);
            console.log(`Title: ${title}`);
            console.log(`Body: ${body}`);
            console.log(`Data:`, data);
            console.log(`-----------------------------`);
        } catch (error) {
            console.error('Error sending FCM notification:', error);
        }
    }

    /**
     * Helper for "Driver Arrived"
     */
    static async notifyDriverArrived(fcmToken: string, rideId: string) {
        await this.sendNotification(
            fcmToken, 
            'Your driver is here!', 
            'Look out for your ride. Your driver has arrived at the pickup location.',
            { rideId, type: 'DRIVER_ARRIVED' }
        );
    }

    /**
     * Helper for "Ride Completed"
     */
    static async notifyRideCompleted(fcmToken: string, rideId: string, fare: number) {
        await this.sendNotification(
            fcmToken, 
            'Ride Completed!', 
            `Thanks for riding with us. Your total fare is ₹${fare.toFixed(2)}.`,
            { rideId, type: 'RIDE_COMPLETED', fare: fare.toString() }
        );
    }
}
