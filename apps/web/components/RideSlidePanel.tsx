"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Star, CreditCard, X, ChevronUp, Clock, Info } from 'lucide-react';

interface RideSlidePanelProps {
    status: string;
    driverDetails: any | null;
    fare: number | null;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function RideSlidePanel({ status, driverDetails, fare, onCancel, onConfirm }: RideSlidePanelProps) {
    const isVisible = status !== 'IDLE';
    const isSearching = status === 'SEARCHING';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4"
                >
                    {/* Glassmorphism Panel Container */}
                    <div className="bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden max-w-lg mx-auto">
                        {/* Grab Handle */}
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-4" />

                        <div className="px-8 pb-10 space-y-8">
                            {/* Header: Status & Price */}
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">
                                        {status.replace("_", " ")}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white">
                                        {status === 'SEARCHING' ? 'Finding your ride...' : 
                                         status === 'ACCEPTED' ? 'Driver is on the way' :
                                         status === 'ARRIVING' ? 'Driver has arrived!' :
                                         status === 'ONGOING' ? 'Heading to destination' :
                                         'Your ride status'}
                                    </h3>
                                </div>
                                {fare && (
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-white">₹{fare.toFixed(2)}</span>
                                        <p className="text-xs text-gray-500">Estimated Fare</p>
                                    </div>
                                )}
                            </div>

                            {/* Searching Loader Animation (only when searching) */}
                            {status === 'SEARCHING' && (
                                <div className="flex gap-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="w-1/3 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                                    />
                                </div>
                            )}

                            {/* Driver Details (if accepted) */}
                            {driverDetails && (
                                <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-[2px]">
                                            <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center overflow-hidden">
                                                <User size={24} className="text-gray-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{driverDetails.name}</h4>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                <span>{driverDetails.rating}</span>
                                                <span className="mx-1">•</span>
                                                <span>{driverDetails.vehiclePlate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">White Tesla</p>
                                        <p className="text-xs text-gray-400">Model 3</p>
                                    </div>
                                </div>
                            )}

                            {/* Payment & Security */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                                    <CreditCard size={16} className="text-gray-400" />
                                    <span className="text-gray-300">•••• 4242</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                                    <ShieldCheck size={16} className="text-green-400" />
                                    <span className="text-gray-300">Safe Ride PIN</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-4 px-6 bg-white/5 border border-white/10 rounded-full font-bold text-sm text-gray-400 hover:bg-white/10 transition-colors"
                                >
                                    Cancel Ride
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isSearching}
                                    className={`flex-1 py-4 px-6 rounded-full font-bold text-sm shadow-xl transition-all active:scale-95 ${isSearching
                                            ? 'bg-white/10 text-gray-500 cursor-not-allowed shadow-none'
                                            : 'bg-white text-black shadow-white/5 hover:scale-105'
                                        }`}
                                >
                                    {isSearching ? 'Searching...' : status === 'ACCEPTED' ? 'Pay Now' : status === 'ARRIVING' || status === 'ONGOING' ? 'Ride in Progress' : 'Confirm Details'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
