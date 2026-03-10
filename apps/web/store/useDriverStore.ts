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
    arrived: () => void;
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

        // Event from server when driver accepts a ride
        socket.on('ride-accepted', (rideData) => {
            set({ currentRide: rideData });
        });

        // Event from server when rider assigns a ride to this driver
        socket.on('ride-assigned', (rideData) => {
            set({ currentRide: rideData });
            // Optionally clear requests or handle UI state
            set({ requests: [] }); 
        });

        socket.on('online-confirmed', ({ isOnline }) => {
            set({ isOnline });
        });

        set({ socket });
    },

    toggleOnline: (userId) => {
        const { socket, isOnline } = get();
        console.log('Toggle Online Clicked. Current state:', isOnline, 'Socket:', !!socket);
        if (socket) {
            console.log('Emitting toggle-online for:', userId, 'New status:', !isOnline);
            socket.emit('toggle-online', { userId, isOnline: !isOnline });
        } else {
            console.error('No socket available to emit toggle-online');
        }
    },

    addRequest: (request) => set((state) => ({ requests: [...state.requests, request] })),

    removeRequest: (rideId) => set((state) => ({ 
        requests: state.requests.filter(r => r.id !== rideId) 
    })),

    arrived: () => {
        const { socket, currentRide } = get();
        if (socket && currentRide) {
            socket.emit('driver-arrived', { rideId: currentRide.id });
            set({ currentRide: { ...currentRide, status: 'ONGOING' } });
        }
    },

    finishRide: () => {
        const { socket, currentRide } = get();
        if (socket && currentRide) {
            socket.emit('ride-completed', { rideId: currentRide.id });
        }
        set({ currentRide: null }); // Removed status: 'IDLE' as it's not in DriverState
    },

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
