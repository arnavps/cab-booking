'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, X } from 'lucide-react';

interface RatingModalProps {
    isOpen: boolean;
    rideId: string;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

export default function RatingModal({ isOpen, rideId, onClose, onSubmit }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comment);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Abstract Background Element */}
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[80px] rounded-full" />

                        <div className="relative z-10 text-center">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">
                                Rate Your Ride
                            </h2>
                            <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] mb-10">
                                How was your experience with the driver?
                            </p>

                            {/* Stars */}
                            <div className="flex justify-center gap-3 mb-10">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="relative p-1"
                                    >
                                        <Star 
                                            size={40} 
                                            className={`transition-colors ${
                                                (hover || rating) >= star 
                                                ? 'text-yellow-500 fill-yellow-500' 
                                                : 'text-white/10'
                                            }`} 
                                        />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Comment Box */}
                            <div className="relative mb-10">
                                <div className="absolute top-4 left-4 text-white/20">
                                    <MessageSquare size={18} />
                                </div>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Leave a comment (optional)..."
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 pl-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all min-h-[120px] resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={rating === 0}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                                    rating > 0 
                                    ? 'bg-white text-black shadow-xl' 
                                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                                }`}
                            >
                                <Send size={18} />
                                Submit Rating
                            </motion.button>

                            <button 
                                onClick={onClose}
                                className="mt-6 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                            >
                                Skip for now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
