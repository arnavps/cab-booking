import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RideService {
    /**
     * Fetches ride history for a user, either as a passenger or a driver.
     */
    static async getRideHistory(userId: string, role: 'PASSENGER' | 'DRIVER') {
        try {
            const query = role === 'PASSENGER' 
                ? { passengerId: userId } 
                : { driverId: userId };

            return await prisma.ride.findMany({
                where: query,
                include: {
                    passenger: true,
                    driver: true,
                    transaction: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        } catch (error) {
            console.error('Error fetching ride history:', error);
            throw error;
        }
    }

    /**
     * Updates a ride with a rating and recalculates the driver's average rating.
     */
    static async rateRide(rideId: string, rating: number, comment: string) {
        try {
            // Update the ride with rating
            const ride = await prisma.ride.update({
                where: { id: rideId },
                data: {
                    rating,
                    ratingComment: comment,
                },
                include: {
                    driver: {
                        include: {
                            driverDetails: true
                        }
                    }
                }
            });

            if (ride.driver && ride.driver.driverDetails) {
                const driverId = ride.driver.id;
                
                // Fetch all rated rides for this driver
                const ratedRides = await prisma.ride.findMany({
                    where: {
                        driverId: driverId,
                        rating: { not: null },
                    },
                    select: { rating: true },
                });

                const totalRating = ratedRides.reduce((acc: number, r: { rating: number | null }) => acc + (r.rating || 0), 0);
                const averageRating = totalRating / ratedRides.length;

                // Update driver average rating
                await prisma.driverDetails.update({
                    where: { userId: driverId },
                    data: { rating: averageRating },
                });
            }

            return ride;
        } catch (error) {
            console.error('Error rating ride:', error);
            throw error;
        }
    }
}
