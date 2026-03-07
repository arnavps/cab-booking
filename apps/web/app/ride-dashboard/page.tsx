"use client";

import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import LocationSearch from '@/components/LocationSearch';
import RideSlidePanel from '@/components/RideSlidePanel';
import { useRideStore } from '@/store/useRideStore';
import { useJsApiLoader } from '@react-google-maps/api';

import VehicleSelector from '@/components/VehicleSelector';

export default function RideDashboard() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ['places'],
    });

    const [pickupCoords, setPickupCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [baseFare, setBaseFare] = useState<number>(0);

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

    // Route Logic & Base Fare Calculation
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

                        const route = result.routes[0].legs[0];
                        if (route.distance?.value) {
                            const distanceKm = route.distance.value / 1000;
                            // Calculate base fare: ₹50 base + ₹15 per km
                            const calculatedBaseFare = 50 + (distanceKm * 15);
                            setBaseFare(calculatedBaseFare);
                        }
                    } else {
                        console.error("error fetching directions", result);
                    }
                }
            );
        }
    }, [pickupCoords, dropoffCoords]);

    const handleVehicleConfirm = (vehicleId: string, finalFare: number) => {
        if (directions) {
            const route = directions.routes[0].legs[0];
            requestRide(route.start_address, route.end_address, finalFare);
            updateStatus('SEARCHING');
        }
    };

    if (!isLoaded) {
        return <div className="h-screen w-full bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>;
    }

    return (
        <main className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Map Layer */}
            <MapComponent
                pickup={pickupCoords}
                dropoff={dropoffCoords}
                directions={directions}
            />

            {/* Foreground UI Components */}
            {status === 'IDLE' && !directions && (
                <LocationSearch
                    onPickupSelect={handlePickupSelect}
                    onDropoffSelect={handleDropoffSelect}
                />
            )}

            {status === 'IDLE' && directions && (
                <VehicleSelector 
                    baseFare={baseFare} 
                    onConfirm={handleVehicleConfirm} 
                />
            )}

            {/* Searching for Driver Overlay */}
            {status === 'SEARCHING' && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="relative mb-8">
                        {/* Circular Ripples */}
                        <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/20 opacity-75" style={{ animationDuration: '3s' }} />
                        <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/20 opacity-75" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-purple-600 shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center animate-pulse">
                                <span className="text-black font-black text-3xl">U</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">Finding your ride</h2>
                    <p className="text-white/40 text-sm font-medium tracking-[0.2em] uppercase">Connecting with nearby drivers...</p>
                    
                    <button 
                        onClick={resetRide}
                        className="mt-12 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                        Cancel Request
                    </button>
                </div>
            )}

            {/* Slide up panel for confirmed rides/drivers */}
            {(['ACCEPTED', 'ARRIVING', 'STARTED'] as string[]).includes(status) && (
                <RideSlidePanel
                    status={status}
                    fare={fare}
                    driverDetails={null}
                    onConfirm={() => {}}
                    onCancel={() => {
                        resetRide();
                        setPickupCoords(null);
                        setDropoffCoords(null);
                        setDirections(null);
                    }}
                />
            )}

            {/* Subtle Overlay Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/40 z-10" />
        </main>
    );
}
