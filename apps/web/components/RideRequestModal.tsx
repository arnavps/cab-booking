'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, DollarSign, X, Check } from 'lucide-react';

interface RideRequestModalProps {
    request: any;
    onAccept: (rideId: string) => void;
    onDecline: (rideId: string) => void;
}

const RideRequestModal = ({ request, onAccept, onDecline }: RideRequestModalProps) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-md overflow-hidden rounded-[40px] border border-white/10 bg-black/80 p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black shadow-xl animate-bounce">
                        <Navigation size={32} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">New Ride Request</h2>
                    <p className="text-xs font-bold tracking-[0.2em] text-white/30 mt-1 uppercase">Immediate pickup required</p>
                </div>

                {/* Info Card */}
                <div className="space-y-6 rounded-[32px] bg-white/[0.03] p-6 border border-white/5 mb-8">
                    {/* Pickup */}
                    <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                            <Navigation size={16} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Pickup</span>
                            <p className="text-sm font-bold text-white leading-tight mt-0.5">{request.pickupLocation}</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="ml-4 h-6 w-px border-l border-dashed border-white/10" />

                    {/* Dropoff */}
                    <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
                            <MapPin size={16} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Drop-off</span>
                            <p className="text-sm font-bold text-white leading-tight mt-0.5">{request.dropoffLocation}</p>
                        </div>
                    </div>

                    {/* Earnings */}
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-500">
                                <DollarSign size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/40">Est. Earnings</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            ${request.fare.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onDecline(request.id)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 py-5 px-4 text-sm font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                    >
                        <X size={18} />
                        Decline
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAccept(request.id)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-white py-5 px-4 text-sm font-black uppercase tracking-widest text-black shadow-xl transition-all"
                    >
                        <Check size={18} />
                        Accept
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default RideRequestModal;
