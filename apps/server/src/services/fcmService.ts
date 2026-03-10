export class FCMService {
    static async sendNotification(token: string, title: string, body: string, data: any = {}) {
        console.log(`STUB: Sending push notification to ${token}: ${title} - ${body}`);
        return { success: true };
    }

    static async notifyDriverArrived(token: string, rideId: string) {
        return this.sendNotification(token, 'Driver Arrived', 'Driver is here', { rideId });
    }

    static async notifyRideCompleted(token: string, rideId: string, fare: number) {
        return this.sendNotification(token, 'Ride Completed', `Total: ${fare}`, { rideId });
    }
}
