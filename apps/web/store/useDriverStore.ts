import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface DriverState {
    isOnline: boolean;
    currentRide: any | null;
    requests: any[];
    socket: Socket | null;

    toggleOnline: (userId: string) => void;
    addRequest: (request: any) => void;
    removeRequest: (rideId: string) => void;
    acceptRide: (rideId: string, driverId: string) => void;
    declineRide: (rideId: string, driverId: string) => void;
    finishRide: () => void;
    initSocket: (userId: string) => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
    isOnline: false,
    currentRide: null,
    requests: [],
    socket: null,

    initSocket: (userId) => {
        if (get().socket) return;

        const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001');

        socket.on('connect', () => {
            console.log('Driver connected to socket');
        });

        socket.on('new-ride-request', (request) => {
            if (get().isOnline) {
                set((state) => ({ requests: [...state.requests, request] }));
            }
        });

        socket.on('ride-accepted', (rideData) => {
            set({ currentRide: rideData });
        });

        socket.on('online-confirmed', ({ isOnline }) => {
            set({ isOnline });
        });

        set({ socket });
    },

    toggleOnline: (userId) => {
        const { socket, isOnline } = get();
        if (socket) {
            socket.emit('toggle-online', { userId, isOnline: !isOnline });
        }
    },

    addRequest: (request) => set((state) => ({ requests: [...state.requests, request] })),

    removeRequest: (rideId) => set((state) => ({ 
        requests: state.requests.filter(r => r.id !== rideId) 
    })),

    finishRide: () => set({ currentRide: null }),

    acceptRide: (rideId, driverId) => {
        const { socket } = get();
        if (socket) {
            socket.emit('accept-ride', { rideId, driverId });
            set((state) => ({ 
                requests: state.requests.filter(r => r.id !== rideId),
            }));
        }
    },


    declineRide: (rideId, driverId) => {
        const { socket } = get();
        if (socket) {
            socket.emit('decline-ride', { rideId, driverId });
            set((state) => ({ 
                requests: state.requests.filter(r => r.id !== rideId) 
            }));
        }
    }
}));
