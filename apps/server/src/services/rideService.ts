export class RideService {
    static async createRide(data: any) {
        return { id: 'stub-ride-id', ...data };
    }

    static async updateRideStatus(rideId: string, status: string) {
        return { id: rideId, status };
    }

    static async getRide(rideId: string) {
        return { id: rideId, status: 'ACCEPTED' };
    }

    static async rateRide(rideId: string, rating: number, comment?: string) {
        return { id: rideId, rating };
    }

    static async getRideHistory(userId: string, role: 'PASSENGER' | 'DRIVER') {
        console.log(`STUB: Fetching history for ${userId} as ${role}`);
        return [];
    }
}
