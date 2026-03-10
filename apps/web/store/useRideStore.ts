import { create } from 'zustand';

export type RideStatus =
    | 'IDLE'
    | 'REQUESTING'
    | 'SEARCHING'
    | 'ACCEPTED'
    | 'ARRIVING'
    | 'STARTED'
    | 'FINISHED'
    | 'PAID'
    | 'CANCELLED';

interface RideState {
    rideId: string | null;
    status: RideStatus;
    pickup: string | null;
    dropoff: string | null;
    driverDetails: any | null;
    fare: number | null;
    socket: any | null;
    razorpayOrderId: string | null;

    // Actions
    initSocket: () => void;
    requestRide: (pickup: string, dropoff: string, fare: number) => void;
    setSearching: () => void;
    acceptRide: (rideId: string, driverDetails: any) => void;
    updateStatus: (status: RideStatus) => void;
    processPayment: (amount: number) => Promise<void>;
    rateRide: (rideId: string, rating: number, comment: string) => Promise<void>;
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
    razorpayOrderId: null,

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

        socket.on('driver-arrived', () => {
            set({ status: 'ARRIVING' });
        });

        socket.on('ride-completed', () => {
            set({ status: 'FINISHED' });
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

    processPayment: async (amount: number) => {
        try {
            const { rideId } = get();
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, rideId }),
            });

            const order = await response.json();
            set({ razorpayOrderId: order.id });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Uber Clone',
                description: `Payment for Ride #${rideId}`,
                order_id: order.id,
                handler: async (response: any) => {
                    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response),
                    });

                    const result = await verifyRes.json();
                    if (result.status === 'success') {
                        set({ status: 'PAID' });
                        window.location.href = '/payment-success';
                    }
                },
                theme: { color: '#000000' },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment failed:', error);
        }
    },

    rateRide: async (rideId, rating, comment) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rides/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rideId, rating, comment }),
            });
            // Optionally update local state or just refresh history
        } catch (error) {
            console.error('Failed to submit rating:', error);
        }
    },

    finishRide: () => set({ status: 'FINISHED' }),

    resetRide: () => set({
        rideId: null,
        status: 'IDLE',
        pickup: null,
        dropoff: null,
        driverDetails: null,
        fare: null,
        razorpayOrderId: null
    }),
}));
