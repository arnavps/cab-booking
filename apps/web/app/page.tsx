import Link from 'next/link';
import { LayoutGrid, MapPin, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-black">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                        Announcing our next-gen ride platform.{' '}
                        <a href="#" className="font-semibold text-purple-400">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Read more <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-500">
                        Ride into the future of urban mobility
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-400">
                        Experience premium aesthetics, real-time tracking, and split-second dispatch. Whether you're driving or riding, we've got you covered.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/ride-dashboard"
                            className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105"
                        >
                            Request a Ride
                        </Link>
                        <Link href="/driver-portal" className="text-sm font-semibold leading-6 text-white hover:text-purple-400 transition-colors">
                            Become a Driver <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                            <MapPin size={24} />
                        </div>
                        <h3 className="font-bold text-white mb-2">Live Tracking</h3>
                        <p className="text-xs text-gray-400">Precise location updates every 3 seconds for ultimate peace of mind.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                            <Shield size={24} />
                        </div>
                        <h3 className="font-bold text-white mb-2">Safe Payments</h3>
                        <p className="text-xs text-gray-400">Industry-standard Stripe integration for secure, seamless transactions.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="font-bold text-white mb-2">Fast Dispatch</h3>
                        <p className="text-xs text-gray-400">Intelligent matching logic to get you moving in seconds.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
