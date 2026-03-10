'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useJsApiLoader, GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, MapPin, Navigation, Info, Settings } from 'lucide-react';
import { useDriverStore } from '@/store/useDriverStore';
import RideRequestModal from '@/components/RideRequestModal';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

const center = {
    lat: 19.0760,
    lng: 72.8777,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    ],
};

export default function DriverDashboard() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries,
    });

    const { user } = useUser();
    const { isOnline, requests, currentRide, initSocket, toggleOnline, acceptRide, declineRide, arrived, finishRide } = useDriverStore();
    const [location, setLocation] = useState<google.maps.LatLngLiteral>(center);

    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    useEffect(() => {
        if (user) {
            console.log('Initializing Driver Socket for:', user.id);
            initSocket(user.id);
        }
    }, [user, initSocket]);

    useEffect(() => {
        if (currentRide && isLoaded) {
            const directionsService = new google.maps.DirectionsService();
            const destination = currentRide.pickupLat && currentRide.pickupLng 
                ? { lat: currentRide.pickupLat, lng: currentRide.pickupLng } 
                : currentRide.pickupLocation;

            directionsService.route(
                {
                    origin: location,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, dirStatus) => {
                    if (dirStatus === google.maps.DirectionsStatus.OK && result) {
                        setDirections(result);
                    } else {
                        console.error("Driver directions error:", dirStatus);
                    }
                }
            );
        } else {
            setDirections(null);
        }
    }, [currentRide, location, isLoaded]);

    if (!isLoaded) return <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
    </div>;

    const activeRequest = requests.length > 0 ? requests[0] : null;

    return (
        <main className="relative h-screen w-full overflow-hidden bg-black">
            {/* Map Layer */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={location}
                zoom={15}
                options={mapOptions}
            >
                <MarkerF 
                    position={location} 
                    icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="2">
                                <circle cx="12" cy="12" r="8" fill="#3b82f6" />
                                <circle cx="12" cy="12" r="3" fill="white" />
                            </svg>
                        `),
                        scaledSize: new google.maps.Size(40, 40),
                        anchor: new google.maps.Point(20, 20),
                    }}
                />
                
                {directions && (
                    <DirectionsRenderer 
                        directions={directions}
                        options={{
                            polylineOptions: {
                                strokeColor: "#ffffff",
                                strokeWeight: 6,
                            },
                        }}
                    />
                )}
            </GoogleMap>

            {/* Top Bar */}
            <div className="absolute top-8 left-8 right-8 z-50 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-4 pointer-events-auto">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
                        <img src={user?.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-white uppercase tracking-widest">Driver Portal</h1>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{user?.fullName || 'Active Driver'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 pointer-events-auto">
                    <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-black/50 border border-white/10 text-white/60 hover:text-white transition-all backdrop-blur-xl">
                        <Info size={20} />
                    </button>
                    <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-black/50 border border-white/10 text-white/60 hover:text-white transition-all backdrop-blur-xl">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Bottom Status Panel */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 px-6">
                <motion.div 
                    layout
                    className={`relative overflow-hidden rounded-[32px] border p-8 backdrop-blur-3xl transition-all duration-500 ${
                        isOnline || currentRide
                        ? 'bg-black/80 border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]' 
                        : 'bg-zinc-900 border-white/5'
                    }`}
                >
                    {!currentRide ? (
                        <div className="flex flex-col items-center gap-6">
                            <div className="text-center">
                                <h2 className={`text-2xl font-black uppercase italic tracking-tight transition-colors ${isOnline ? 'text-white' : 'text-zinc-600'}`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-1 leading-loose">
                                    {isOnline ? 'Ready to receive ride requests' : 'Tap below to start earning'}
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => user && toggleOnline(user.id)}
                                className={`group h-24 w-24 flex items-center justify-center rounded-full transition-all duration-500 ${
                                    isOnline 
                                    ? 'bg-zinc-800 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' 
                                    : 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)]'
                                }`}
                            >
                                <Power size={32} strokeWidth={3} className={isOnline ? 'animate-pulse' : ''} />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                                    {currentRide.status === 'ONGOING' ? 'In Progress' : (currentRide.riderName || 'Test Passenger')}
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-1 leading-loose">
                                    {currentRide.status === 'ONGOING' ? 'Navigate to Destination' : 'Navigate to Pickup point'}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-black">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-[8px] font-black uppercase tracking-widest text-white/30">
                                            {currentRide.status === 'ONGOING' ? 'Dropoff' : 'Pickup'}
                                        </span>
                                        <p className="text-xs font-bold text-white truncate w-48">
                                            {currentRide.status === 'ONGOING' ? currentRide.dropoffLocation : currentRide.pickupLocation}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {currentRide.status !== 'ONGOING' ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={arrived}
                                    className="w-full rounded-2xl bg-white py-5 text-sm font-black uppercase tracking-widest text-black shadow-xl"
                                >
                                    Start Trip
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={finishRide}
                                    className="w-full rounded-2xl bg-emerald-500 py-5 text-sm font-black uppercase tracking-widest text-black shadow-xl"
                                >
                                    Complete Trip
                                </motion.button>
                            )}
                        </div>
                    )}

                    {isOnline && (
                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                            <div className="text-center">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-white/20">Earnings Today</span>
                                <span className="text-lg font-black text-white">$124.50</span>
                            </div>
                            <div className="text-center border-l border-white/5">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-white/20">Rides Completed</span>
                                <span className="text-lg font-black text-white">8</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Modals & Overlays */}
            <AnimatePresence>
                {isOnline && activeRequest && (
                    <RideRequestModal 
                        request={activeRequest}
                        onAccept={(id) => user && acceptRide(id, user.id)}
                        onDecline={(id) => user && declineRide(id, user.id)}
                    />
                )}
            </AnimatePresence>

            {/* Background Aesthetic */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/60 z-10" />
        </main>
    );
}
