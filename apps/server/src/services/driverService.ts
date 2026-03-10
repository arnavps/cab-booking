import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DriverService {
    /**
     * Toggles driver availability status in the database.
     */
    static async toggleAvailability(userId: string, isAvailable: boolean) {
        try {
            return await prisma.driverDetails.update({
                where: { userId },
                data: { isAvailable },
            });
        } catch (error) {
            console.error('Error toggling driver availability:', error);
            throw error;
        }
    }

    /**
     * Updates ride status and assigns a driver.
     */
    static async acceptRide(rideId: string, driverId: string) {
        try {
            return await prisma.ride.update({
                where: { id: rideId },
                data: {
                    status: 'ACCEPTED',
                    driverId,
                },
                include: {
                    passenger: true,
                },
            });
        } catch (error) {
            console.error('Error accepting ride:', error);
            throw error;
        }
    }

    /**
     * Updates ride status to ONGOING when driver arrives/picks up.
     */
    static async arrived(rideId: string) {
        try {
            const ride = await prisma.ride.update({
                where: { id: rideId },
                data: { status: 'ONGOING' },
                include: { passenger: true },
            });

            if (ride.passenger.fcmToken) {
                const { FCMService } = require('./fcmService');
                await FCMService.notifyDriverArrived(ride.passenger.fcmToken, rideId);
            }

            return ride;
        } catch (error) {
            console.error('Error in arrived:', error);
            throw error;
        }
    }

    /**
     * Completes the ride and triggers receipt/notification.
     */
    static async completeRide(rideId: string) {
        try {
            const ride = await prisma.ride.update({
                where: { id: rideId },
                data: { status: 'COMPLETED' },
                include: { passenger: true, transaction: true },
            });

            if (ride.passenger.fcmToken) {
                const { FCMService } = require('./fcmService');
                await FCMService.notifyRideCompleted(ride.passenger.fcmToken, rideId, ride.fare);
            }

            return ride;
        } catch (error) {
            console.error('Error completing ride:', error);
            throw error;
        }
    }

    /**
     * Gets driver details by userId.
     */
    static async getDriverDetails(userId: string) {
        try {
            return await prisma.driverDetails.findUnique({
                where: { userId },
            });
        } catch (error) {
            console.error('Error fetching driver details:', error);
            throw error;
        }
    }
}
