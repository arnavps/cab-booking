'use client';

import Link from 'next/link';
import { LayoutGrid, MapPin, Shield, Zap, ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="relative isolate min-h-screen bg-black overflow-hidden">
            {/* Background Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="mb-8 flex justify-center">
                        <div className="glass px-4 py-1.5 rounded-full text-sm font-medium text-purple-400 flex items-center gap-2 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            Announcing our next-gen ride platform.
                            <Link href="#" className="font-bold border-l border-white/10 pl-2 hover:text-white transition-colors">
                                Read more <ArrowRight className="inline-block w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>

                    <h1 className="text-5xl font-black tracking-tighter text-white sm:text-8xl mb-8 leading-[1.1]">
                        Ride into the <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-300">
                            future of urban mobility
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-400 mb-12">
                        Experience premium aesthetics, real-time tracking, and split-second dispatch.
                        The most sophisticated ride engine ever built.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/ride-dashboard"
                            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Request a Ride <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link
                            href="/driver-portal"
                            className="glass px-8 py-4 rounded-full font-bold text-white hover:bg-white/10 transition-all border-white/10"
                        >
                            Become a Driver
                        </Link>
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-32 grid grid-cols-1 gap-6 sm:grid-cols-3"
                >
                    <div className="glass p-8 rounded-3xl group hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
                            <MapPin size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Live Tracking</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Precise location updates every 3 seconds powered by ultra-low latency websockets.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-3xl group hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                            <Shield size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Safe Payments</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Enterprise-grade Stripe integration with signature-verified webhooks for maximum security.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-3xl group hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform shadow-inner">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Fast Dispatch</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Intelligent matching algorithms that find your perfect ride in under 200ms.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10" />
        </div>
    );
}
