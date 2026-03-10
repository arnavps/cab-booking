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
    socket: any | null;

    // Actions
    initSocket: () => void;
    requestRide: (pickup: string, dropoff: string, fare: number) => void;
    setSearching: () => void;
    acceptRide: (rideId: string, driverDetails: any) => void;
    updateStatus: (status: RideStatus) => void;
    finishRide: () => void;
    resetRide: () => void;
}

export const useRideStore = create<RideState>((set, get) => ({
    rideId: null,
    status: 'IDLE',
    pickup: null,
    dropoff: null,
    driverDetails: null,
    fare: null,
    socket: null,

    initSocket: () => {
        if (get().socket) return;
        const { io } = require('socket.io-client');
        const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001');

        socket.on('ride-accepted', (data: any) => {
            set({ 
                status: 'ACCEPTED', 
                driverDetails: data.passengerDetails || { name: 'Driver Found' } 
            });
        });

        set({ socket });
    },

    requestRide: (pickup, dropoff, fare) => {
        const { socket } = get();
        const rideId = Math.random().toString(36).substr(2, 9);
        if (socket) {
            socket.emit('request-ride', { pickup, dropoff, fare, id: rideId });
            socket.emit('join-ride', rideId);
        }
        set({
            rideId,
            status: 'REQUESTING',
            pickup,
            dropoff,
            fare
        });
    },

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
