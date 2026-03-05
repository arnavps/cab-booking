"use client";

import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { MapPin, Search, Navigation } from 'lucide-react';

interface LocationSearchProps {
    onPickupSelect: (place: google.maps.places.PlaceResult) => void;
    onDropoffSelect: (place: google.maps.places.PlaceResult) => void;
}

export default function LocationSearch({ onPickupSelect, onDropoffSelect }: LocationSearchProps) {
    const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [dropoffAutocomplete, setDropoffAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    const onPickupLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setPickupAutocomplete(autocomplete);
    };

    const onDropoffLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setDropoffAutocomplete(autocomplete);
    };

    const onPickupPlaceChanged = () => {
        if (pickupAutocomplete !== null) {
            onPickupSelect(pickupAutocomplete.getPlace());
        }
    };

    const onDropoffPlaceChanged = () => {
        if (dropoffAutocomplete !== null) {
            onDropoffSelect(dropoffAutocomplete.getPlace());
        }
    };

    return (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-lg z-20 space-y-4">
            {/* Container with Glassmorphism */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-[32px] shadow-2xl shadow-black/40">
                <div className="space-y-4">
                    {/* Pickup Input */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors">
                            <Navigation size={18} />
                        </div>
                        <Autocomplete onLoad={onPickupLoad} onPlaceChanged={onPickupPlaceChanged}>
                            <input
                                type="text"
                                placeholder="Where from?"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                            />
                        </Autocomplete>
                    </div>

                    {/* Vertical Divider Line */}
                    <div className="absolute left-[33px] top-[74px] w-[2px] h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full opacity-50" />

                    {/* Dropoff Input */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                            <MapPin size={18} />
                        </div>
                        <Autocomplete onLoad={onDropoffLoad} onPlaceChanged={onDropoffPlaceChanged}>
                            <input
                                type="text"
                                placeholder="Where to?"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
                            />
                        </Autocomplete>
                    </div>
                </div>
            </div>
        </div>
    );
}
