"use client";

import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import LocationSearch from '@/components/LocationSearch';
import RideSlidePanel from '@/components/RideSlidePanel';
import { useRideStore } from '@/store/useRideStore';
import { useJsApiLoader } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import VehicleSelector from '@/components/VehicleSelector';
import RatingModal from '@/components/RatingModal';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export default function RideDashboard() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries,
    });

    const [pickupCoords, setPickupCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [baseFare, setBaseFare] = useState<number>(0);
    const router = useRouter();

    const { status, fare, requestRide, updateStatus, resetRide, initSocket } = useRideStore();

    useEffect(() => {
        initSocket();
    }, [initSocket]);

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
        if (pickupCoords && dropoffCoords && isLoaded) {
            console.log("Fetching driving directions for:", { 
                origin: pickupCoords, 
                destination: dropoffCoords 
            });
            const directionsService = new google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: pickupCoords,
                    destination: dropoffCoords,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, dirStatus) => {
                    if (dirStatus === google.maps.DirectionsStatus.OK && result) {
                        setDirections(result);

                        const route = result.routes[0].legs[0];
                        if (route.distance?.value) {
                            const distanceKm = route.distance.value / 1000;
                            // Calculate base fare: ₹50 base + ₹15 per km
                            const calculatedBaseFare = 50 + (distanceKm * 15);
                            setBaseFare(calculatedBaseFare);
                        }
                    } else {
                        console.error("error fetching directions. Status:", dirStatus, "Origin:", pickupCoords, "Destination:", dropoffCoords);
                    }
                }
            );
        }
    }, [pickupCoords, dropoffCoords, isLoaded]);

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
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl">
                    <div className="relative mb-16">
                        {/* Multiple Layered Ripples */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 2.2, opacity: 0 }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 1,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 rounded-full bg-white/10"
                            />
                        ))}
                        
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1.1 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                            className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-[0_0_80px_rgba(255,255,255,0.15)] ring-1 ring-white/20"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-black">
                                <span className="text-white font-black text-4xl italic tracking-tighter">U</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="text-center space-y-4 px-8 max-w-sm">
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-black tracking-tight text-white uppercase italic"
                        >
                            Searching
                        </motion.h2>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase leading-loose"
                        >
                            Matching you with the best driver for your premium ride...
                        </motion.p>
                    </div>
                    
                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        onClick={resetRide}
                        className="absolute bottom-16 text-[11px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl border border-white/5"
                    >
                        Cancel Request
                    </motion.button>
                </div>
            )}

            {/* Slide up panel for confirmed rides/drivers */}
            {(['ACCEPTED', 'ARRIVING', 'STARTED'] as string[]).includes(status) && (
                <RideSlidePanel
                    status={status}
                    fare={fare}
                    driverDetails={useRideStore.getState().driverDetails}
                    onConfirm={() => {
                        if (status === 'ACCEPTED' && fare) {
                            useRideStore.getState().processPayment(fare);
                        }
                    }}
                    onCancel={() => {
                        resetRide();
                        setPickupCoords(null);
                        setDropoffCoords(null);
                        setDirections(null);
                    }}
                />
            )}

            {/* Rating Modal */}
            <RatingModal 
                isOpen={status === 'FINISHED'}
                rideId={useRideStore.getState().rideId || ''}
                onClose={() => {
                    resetRide();
                    router.push('/');
                }}
                onSubmit={(rating, comment) => {
                    if (useRideStore.getState().rideId) {
                        useRideStore.getState().rateRide(useRideStore.getState().rideId!, rating, comment);
                    }
                    resetRide();
                    router.push('/');
                }}
            />

            {/* Subtle Overlay Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/40 z-10" />
        </main>
    );
}
