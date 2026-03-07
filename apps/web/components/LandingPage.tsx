'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Navigation, User, Home, Shield, Info, LayoutGrid } from 'lucide-react'
import { UserButton, Show, SignInButton } from '@clerk/nextjs'

const LandingPage = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans selection:bg-white selection:text-black">
            {/* 1. Background & Atmosphere */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/bg-img.png"
                    alt="City at night"
                    className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* 2. The Curved Floating Navbar */}
            <header className="fixed top-8 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-6">
                <nav className="flex items-center justify-between rounded-full border border-white/20 bg-white/10 px-8 py-4 shadow-2xl backdrop-blur-lg">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                            <span className="text-xl font-black text-black">U</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">UberClone</span>
                    </Link>

                    {/* Links */}
                    <div className="hidden items-center gap-8 md:flex">
                        {['Home', 'Services', 'Ride'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-medium tracking-wide text-white/70 transition-colors hover:text-white"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Area */}
                    <div className="flex items-center gap-4">
                        <Show when="signed-in">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-9 h-9 border border-white/20"
                                    }
                                }}
                            />
                        </Show>
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95">
                                    Sign In
                                </button>
                            </SignInButton>
                        </Show>
                    </div>
                </nav>
            </header>

            {/* 3. Layout & Components */}
            <main className="relative z-10 flex h-screen w-full flex-col justify-between p-8 md:p-12 lg:p-16">
                {/* Hero / Central Space */}
                <div className="flex-1" />

                {/* Bottom Row Wrapper */}
                <div className="flex w-full items-end justify-between">
                    {/* Bottom-Left (Small Glass Card) - Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Available Drivers</span>
                                <span className="text-2xl font-black text-white">14</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Center-Right (MICRORITM Pill) */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative rounded-full border border-white/20 bg-black/60 px-8 py-3 text-[10px] font-bold tracking-[0.2em] text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all hover:bg-black/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            MICRORITM
                            <div className="absolute inset-0 -z-10 rounded-full bg-white/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                        </motion.button>
                    </div>

                    {/* Bottom-Right (The Main Booking Card) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-[480px] rounded-[40px] border border-white/10 bg-white/5 p-10 shadow-3xl backdrop-blur-xl md:p-12"
                    >
                        <h2 className="mb-8 text-3xl font-black tracking-tighter text-white md:text-4xl">
                            Ready to go?<br />
                            <span className="text-white/40 font-light">Book your ride.</span>
                        </h2>

                        <div className="space-y-4">
                            {/* Pickup Input */}
                            <div className="group relative flex items-center">
                                <MapPin className="absolute left-6 h-5 w-5 text-white/30 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Pickup location"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 pl-16 pr-6 text-sm font-medium text-white outline-none transition-all focus:border-white/30 focus:bg-white/10"
                                />
                            </div>

                            {/* Destination Input */}
                            <div className="group relative flex items-center">
                                <Navigation className="absolute left-6 h-5 w-5 text-white/30 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Where to?"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 pl-16 pr-6 text-sm font-medium text-white outline-none transition-all focus:border-white/30 focus:bg-white/10"
                                />
                            </div>

                            {/* Request Button */}
                            <Link href="/ride-dashboard" className="block w-full">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-4 w-full rounded-2xl bg-white py-5 text-sm font-black uppercase tracking-widest text-black shadow-xl transition-all hover:bg-zinc-100"
                                >
                                    Request Now
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Global Aesthetics Adjustments */}
            <style jsx global>{`
                body {
                    background-color: black;
                }
                .shadow-3xl {
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6);
                }
            `}</style>
        </div>
    )
}

export default LandingPage
