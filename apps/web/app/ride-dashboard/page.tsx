"use client";

import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import LocationSearch from '@/components/LocationSearch';
import RideSlidePanel from '@/components/RideSlidePanel';
import { useRideStore } from '@/store/useRideStore';

export default function RideDashboard() {
    const [pickupCoords, setPickupCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    const { status, fare, requestRide, updateStatus, resetRide } = useRideStore();

    const handlePickupSelect = (place: google.maps.places.PlaceResult) => {
        if (place.geometry?.location) {
            setPickupCoords({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            });
        }
    };

    const handleDropoffSelect = (place: google.maps.places.PlaceResult) => {
        if (place.geometry?.location) {
            setDropoffCoords({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            });
        }
    };

    // Route Logic & Fare Calculation
    useEffect(() => {
        if (pickupCoords && dropoffCoords) {
            const directionsService = new google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: pickupCoords,
                    destination: dropoffCoords,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        setDirections(result);

                        // Calculate Distance & Fare (e.g., $2.50 base + $1.50 per km)
                        const route = result.routes[0].legs[0];
                        if (route.distance?.value) {
                            const distanceKm = route.distance.value / 1000;
                            const estimatedFare = 2.50 + (distanceKm * 1.50);

                            requestRide(route.start_address, route.end_address, estimatedFare);
                            updateStatus('SEARCHING');
                        }
                    } else {
                        console.error("error fetching directions", result);
                    }
                }
            );
        }
    }, [pickupCoords, dropoffCoords]);

    return (
        <main className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Map Layer */}
            <MapComponent
                pickup={pickupCoords}
                dropoff={dropoffCoords}
                directions={directions}
            />

            {/* Foreground UI Components */}
            {status === 'IDLE' && (
                <LocationSearch
                    onPickupSelect={handlePickupSelect}
                    onDropoffSelect={handleDropoffSelect}
                />
            )}

            <RideSlidePanel
                status={status}
                fare={fare}
                driverDetails={null} // Will be populated by Socket.io in actual flow
                onCancel={() => {
                    resetRide();
                    setPickupCoords(null);
                    setDropoffCoords(null);
                    setDirections(null);
                }}
            />

            {/* Subtle Overlay Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/40 z-10" />
        </main>
    );
}
