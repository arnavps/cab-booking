"use client";

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface Coords {
    lat: number;
    lng: number;
}

export const useLocationTracker = (
    socket: Socket | null,
    rideId: string | null,
    isDriver: boolean
) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!socket || !rideId || !isDriver) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Start Throttled Location Updates (Every 3 Seconds)
        intervalRef.current = setInterval(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const coords: Coords = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        console.log("Emitting throttled location update:", coords);
                        socket.emit("update-location", {
                            rideId,
                            coords,
                        });
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                    }
                );
            }
        }, 3000); // 3-second interval

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [socket, rideId, isDriver]);
};
