'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRideStore } from '@/store/useRideStore';

export default function PaymentSuccess() {
    const router = useRouter();
    const { fare, resetRide } = useRideStore();

    const handleBackToHome = () => {
        resetRide();
        router.push('/ride-dashboard');
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
            >
                {/* Success Icon */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="mx-auto w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8"
                >
                    <CheckCircle className="text-emerald-500 w-12 h-12" />
                </motion.div>

                <h1 className="text-4xl font-black italic uppercase italic tracking-tighter text-white mb-2">
                    Payment Success
                </h1>
                <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                    Your ride has been confirmed and paid
                </p>

                {/* Amount Display */}
                <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/5">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">
                        Total Amount Paid
                    </span>
                    <span className="text-4xl font-black text-white">
                        ₹{fare?.toFixed(2) || '0.00'}
                    </span>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-white/30">Transaction ID</span>
                        <span className="text-white">TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl"
                    >
                        <Download size={18} />
                        Download Receipt
                    </motion.button>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/5 hover:bg-white/10 text-white/60 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border border-white/5"
                        >
                            <Share2 size={14} />
                            Share
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBackToHome}
                            className="bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                        >
                            Back Home
                            <ArrowRight size={14} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
