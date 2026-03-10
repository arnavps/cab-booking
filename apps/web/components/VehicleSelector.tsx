'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CreditCard, ChevronRight, Info } from 'lucide-react';

interface VehicleOption {
    id: string;
    name: string;
    multiplier: number;
    eta: string;
    description: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
    { id: 'ubergo', name: 'UberGo', multiplier: 1, eta: '3 min', description: 'Affordable, compact rides' },
    { id: 'uberxl', name: 'UberXL', multiplier: 1.5, eta: '5 min', description: 'Comfortable SUVs for groups' },
    { id: 'black', name: 'Black', multiplier: 2.5, eta: '2 min', description: 'Premium luxury experience' },
];

interface VehicleSelectorProps {
    baseFare: number;
    onConfirm: (vehicleId: string, fare: number) => void;
}

const VehicleSelector = ({ baseFare, onConfirm }: VehicleSelectorProps) => {
    const [selectedId, setSelectedId] = useState<string>('ubergo');

    const selectedVehicle = VEHICLE_OPTIONS.find(v => v.id === selectedId)!;
    const currentFare = baseFare * selectedVehicle.multiplier;

    return (
        <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-8 right-8 z-50 w-full max-w-md overflow-hidden rounded-[40px] border border-white/10 bg-black/80 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
        >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between px-2">
                <div>
                    <h3 className="text-2xl font-black tracking-tight text-white">Choose your ride</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/30 mt-1">Available near you</p>
                </div>
                <button className="rounded-2xl bg-white/5 p-3 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                    <Info size={20} />
                </button>
            </div>

            {/* Vehicle List */}
            <div className="space-y-4">
                {VEHICLE_OPTIONS.map((item) => {
                    const isSelected = selectedId === item.id;
                    const fare = baseFare * item.multiplier;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className={`group relative flex w-full items-center justify-between rounded-[32px] border p-5 transition-all duration-500 ${
                                isSelected 
                                ? 'border-white/20 bg-white/10 ring-1 ring-white/20' 
                                : 'border-transparent bg-white/[0.03] hover:bg-white/5'
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`flex h-16 w-16 items-center justify-center rounded-[24px] transition-all duration-500 ${
                                    isSelected ? 'bg-white text-black scale-110 shadow-xl' : 'bg-white/5 text-white/30 group-hover:text-white'
                                }`}>
                                    <Car size={32} strokeWidth={isSelected ? 2.5 : 2} />
                                </div>
                                <div className="text-left">
                                    <h4 className={`text-lg font-black tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-white/30 font-bold tracking-wide mt-0.5">
                                        {item.eta} away • {item.description}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-xl font-black tracking-tighter ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                    ₹{fare.toFixed(2)}
                                </span>
                            </div>
                            
                            {isSelected && (
                                <motion.div 
                                    layoutId="glow"
                                    className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-50 pointer-events-none"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Payment & Action */}
            <div className="mt-10 space-y-5">
                {/* Payment Selector */}
                <div className="flex items-center justify-between rounded-[24px] bg-white/[0.03] px-6 py-5 border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-white/50">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <span className="block text-xs font-black uppercase tracking-[0.15em] text-white">Visa • 1234</span>
                            <span className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Personal Account</span>
                        </div>
                    </div>
                    <button className="text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl">
                        Change
                    </button>
                </div>

                {/* Confirm Button */}
                <motion.button
                    whileHover={{ scale: 1.01, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onConfirm(selectedId, currentFare)}
                    className="group relative flex w-full items-center justify-between overflow-hidden rounded-[28px] bg-white py-7 px-10 shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 text-base font-black uppercase tracking-[0.25em] text-black">
                        Book {selectedVehicle.name}
                    </span>
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black">
                        <ChevronRight size={22} className="text-white translate-x-0.5" />
                    </div>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default VehicleSelector;
