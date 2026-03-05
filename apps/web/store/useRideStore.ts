import { create } from 'zustand';

export type RideStatus =
    | 'IDLE'
    | 'REQUESTING'
    | 'SEARCHING'
    | 'ACCEPTED'
    | 'ARRIVING'
    | 'STARTED'
    | 'FINISHED'
    | 'CANCELLED';

interface RideState {
    rideId: string | null;
    status: RideStatus;
    pickup: string | null;
    dropoff: string | null;
    driverDetails: any | null;
    fare: number | null;

    // Actions
    requestRide: (pickup: string, dropoff: string, fare: number) => void;
    setSearching: () => void;
    acceptRide: (rideId: string, driverDetails: any) => void;
    updateStatus: (status: RideStatus) => void;
    finishRide: () => void;
    resetRide: () => void;
}

export const useRideStore = create<RideState>((set) => ({
    rideId: null,
    status: 'IDLE',
    pickup: null,
    dropoff: null,
    driverDetails: null,
    fare: null,

    requestRide: (pickup, dropoff, fare) => set({
        status: 'REQUESTING',
        pickup,
        dropoff,
        fare
    }),

    setSearching: () => set({ status: 'SEARCHING' }),

    acceptRide: (rideId, driverDetails) => set({
        rideId,
        status: 'ACCEPTED',
        driverDetails
    }),

    updateStatus: (status) => set({ status }),

    finishRide: () => set({ status: 'FINISHED' }),

    resetRide: () => set({
        rideId: null,
        status: 'IDLE',
        pickup: null,
        dropoff: null,
        driverDetails: null,
        fare: null
    }),
}));
