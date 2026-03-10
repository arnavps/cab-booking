'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, CreditCard, Star, ChevronLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { jsPDF } from 'jspdf';

export default function HistoryPage() {
    const router = useRouter();
    const { user } = useUser();
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            // In a real app, you'd determine the role from the user metadata or current view
            const role = 'PASSENGER'; 
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rides/history?userId=${user?.id}&role=${role}`);
            const data = await response.json();
            setRides(data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateReceipt = (ride: any) => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text('RIDE RECEIPT', 20, 30);
        
        doc.setFontSize(12);
        doc.text(`Ride ID: ${ride.id}`, 20, 50);
        doc.text(`Date: ${new Date(ride.createdAt).toLocaleDateString()}`, 20, 60);
        
        doc.line(20, 70, 190, 70);
        
        doc.text('Pickup:', 20, 80);
        doc.text(ride.pickupLocation, 40, 80);
        
        doc.text('Dropoff:', 20, 90);
        doc.text(ride.dropoffLocation, 40, 90);
        
        doc.line(20, 100, 190, 100);
        
        doc.text('Fare Breakdown:', 20, 110);
        doc.text(`Base Fare: ₹${(ride.fare * 0.8).toFixed(2)}`, 30, 120);
        doc.text(`GST (5%): ₹${(ride.fare * 0.05).toFixed(2)}`, 30, 130);
        doc.text(`Platform Fee: ₹${(ride.fare * 0.15).toFixed(2)}`, 30, 140);
        
        doc.setFontSize(16);
        doc.text(`Total Paid: ₹${ride.fare.toFixed(2)}`, 20, 160);
        
        doc.setFontSize(10);
        doc.text('Thank you for riding with Uber Clone!', 20, 180);
        
        doc.save(`receipt_${ride.id}.pdf`);
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 pb-24">
            {/* Header */}
            <div className="max-w-4xl mx-auto flex items-center gap-4 mb-10">
                <button 
                    onClick={() => router.back()}
                    className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Your Trips</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-4">
                    {rides.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/10">
                            <Clock size={48} className="mx-auto text-white/20 mb-4" />
                            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No trips found yet</p>
                        </div>
                    ) : (
                        rides.map((ride, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={ride.id}
                                className="bg-white/5 border border-white/10 rounded-[32px] p-6 hover:bg-white/[0.07] transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <Clock size={18} className="text-white/60" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                                                {new Date(ride.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-sm font-black text-white">{ride.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Fare</p>
                                        <p className="text-xl font-black text-white">₹{ride.fare.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-sm text-white/60 truncate">{ride.pickupLocation}</p>
                                    </div>
                                    <div className="ml-[3px] border-l border-dashed border-white/20 h-4" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        <p className="text-sm text-white truncate">{ride.dropoffLocation}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        {ride.rating ? (
                                            <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                <span className="text-xs font-bold text-yellow-500">{ride.rating}</span>
                                            </div>
                                        ) : (
                                            <button className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                                                Rate Ride
                                            </button>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => generateReceipt(ride)}
                                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                                    >
                                        <Download size={14} />
                                        Receipt
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}
