import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ReceiptData {
    rideId: string;
    amount: number;
    pickup: string;
    dropoff: string;
    driverName: string;
    date: Date;
}

export class ReceiptService {
    /**
     * Generates a ride receipt and stores it in the database.
     * In a real app, this would also trigger an email (e.g., via SendGrid or Resend).
     */
    static async generateReceipt(rideId: string): Promise<ReceiptData | null> {
        try {
            const ride = await prisma.ride.findUnique({
                where: { id: rideId },
                include: {
                    passenger: true,
                    driver: true,
                    transaction: true,
                },
            });

            if (!ride || !ride.transaction) {
                throw new Error('Ride or Transaction not found for receipt generation');
            }

            const receipt: ReceiptData = {
                rideId: ride.id,
                amount: ride.transaction.amount,
                pickup: ride.pickupLocation,
                dropoff: ride.dropoffLocation,
                driverName: ride.driver?.name || 'Uber Clone Driver',
                date: new Date(),
            };

            console.log('--- RIDE RECEIPT GENERATED ---');
            console.log(`Ride ID: ${receipt.rideId}`);
            console.log(`Amount: $${receipt.amount}`);
            console.log(`From: ${receipt.pickup}`);
            console.log(`To: ${receipt.dropoff}`);
            console.log(`Driver: ${receipt.driverName}`);
            console.log('------------------------------');

            return receipt;
        } catch (error) {
            console.error('Error generating receipt:', error);
            return null;
        }
    }
}
