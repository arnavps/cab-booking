export class ReceiptService {
    static async generateReceipt(rideId: string) {
        console.log(`STUB: Generating receipt for ${rideId}`);
        return {
            rideId,
            amount: 100,
            pickup: 'Stub Pickup',
            dropoff: 'Stub Dropoff',
            driverName: 'Stub Driver',
            date: new Date(),
        };
    }
}
