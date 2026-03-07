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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-8 right-8 z-50 w-full max-w-md overflow-hidden rounded-[40px] border border-white/10 bg-black/80 p-6 shadow-3xl backdrop-blur-2xl"
        >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between px-2">
                <h3 className="text-xl font-black tracking-tight text-white">Choose a ride</h3>
                <button className="rounded-full bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors">
                    <Info size={18} />
                </button>
            </div>

            {/* Vehicle List */}
            <div className="space-y-3">
                {VEHICLE_OPTIONS.map((item) => {
                    const isSelected = selectedId === item.id;
                    const fare = baseFare * item.multiplier;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className={`group relative flex w-full items-center justify-between rounded-3xl border p-4 transition-all duration-300 ${
                                isSelected 
                                ? 'border-white/20 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]' 
                                : 'border-transparent bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                                    isSelected ? 'bg-white text-black' : 'bg-white/5 text-white/40'
                                }`}>
                                    <Car size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-white tracking-tight">{item.name}</h4>
                                    <p className="text-xs text-white/40 font-medium tracking-wide">
                                        {item.eta} away • {item.description}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                    ${fare.toFixed(2)}
                                </span>
                                {isSelected && (
                                    <motion.div 
                                        layoutId="glow"
                                        className="absolute inset-0 rounded-3xl border-2 border-white/20 pointer-events-none"
                                    />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Payment & Action */}
            <div className="mt-8 space-y-4 px-2">
                {/* Payment Selector */}
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="text-white/40">
                            <CreditCard size={18} />
                        </div>
                        <span className="text-xs font-bold text-white tracking-widest uppercase">Visa ****1234</span>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        Change
                    </button>
                </div>

                {/* Confirm Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onConfirm(selectedId, currentFare)}
                    className="flex w-full items-center justify-between rounded-[24px] bg-white py-6 px-8 shadow-2xl transition-all hover:bg-zinc-100"
                >
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-black">
                        Confirm {selectedVehicle.name}
                    </span>
                    <ChevronRight size={20} className="text-black" />
                </motion.button>
            </div>
            
            <style jsx>{`
                .shadow-3xl {
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6);
                }
            `}</style>
        </motion.div>
    );
};

export default VehicleSelector;
