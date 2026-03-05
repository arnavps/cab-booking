"use client";

import React, { useState } from 'react';
import { User, Camera, ShieldCheck, CreditCard, Bell, LogOut, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
    const [isVerifying, setIsVerifying] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Profile Settings
                    </h1>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium">
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        <User size={40} className="text-gray-400" />
                                    </div>
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full hover:scale-110 transition-transform">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold">Arnav Shirwadkar</h2>
                                <p className="text-gray-400 text-sm">Passenger • Member since 2026</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {[
                                { icon: <User size={18} />, label: "Personal Information", active: true },
                                { icon: <Bell size={18} />, label: "Notifications", active: false },
                                { icon: <ShieldCheck size={18} />, label: "Privacy & Security", active: false },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${item.active ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={item.active ? 'text-purple-400' : 'text-gray-400'}>{item.icon}</span>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-500" />
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Payment Verification Card */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CreditCard size={80} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Payment Verification</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-6 max-w-md">
                                    Verify your default payment method to enable seamless rides and priority booking. Rest assured, your data is encrypted.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsVerifying(true)}
                                        className="px-6 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors text-sm"
                                    >
                                        {isVerifying ? 'Verifying...' : 'Verify Now'}
                                    </button>
                                    <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-colors text-sm">
                                        Manage Cards
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Personal Info Grid */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <h3 className="text-lg font-semibold mb-6">Personal Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Arnav Shirwadkar"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="arnav@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
