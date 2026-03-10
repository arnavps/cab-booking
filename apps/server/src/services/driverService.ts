export class DriverService {
    static async toggleAvailability(userId: string, isOnline: boolean) {
        console.log(`STUB: Toggling availability for ${userId} to ${isOnline}`);
        return { userId, isOnline };
    }

    static async getDriver(userId: string) {
        return { userId, isOnline: true };
    }

    static async updateLocation(userId: string, lat: number, lng: number) {
        return { userId, lat, lng };
    }

    static async getNearbyDrivers(lat: number, lng: number, radiusKm: number = 5) {
        return [];
    }

    static async acceptRide(rideId: string, driverId: string): Promise<any> {
        return { 
            id: rideId, 
            driverId, 
            passenger: { name: 'Test Passenger' },
            pickupLocation: 'Mumbai Central',
            dropoffLocation: 'Bandra',
            pickupLat: 18.9690,
            pickupLng: 72.8205
        };
    }

    static async arrived(rideId: string) {
        return { id: rideId, status: 'ARRIVED' };
    }

    static async completeRide(rideId: string) {
        return { id: rideId, status: 'COMPLETED' };
    }
}
