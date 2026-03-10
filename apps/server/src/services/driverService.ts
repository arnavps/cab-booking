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
