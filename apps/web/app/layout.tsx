import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Uber Clone | Premium Ride Sharing',
    description: 'High-fidelity Uber clone built with Next.js, Clerk, and Stripe.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="en" className="dark">
                <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-black text-white antialiased`}>
                    {/* Global Premium Header */}
                    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-black font-black text-xl">U</span>
                            </div>
                            <span className="font-bold tracking-tight text-xl">Uber Clone</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Show when="signed-out">
                                <SignInButton mode="modal">
                                    <button className="text-sm font-medium hover:text-purple-400 transition-colors">Sign In</button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </Show>
                            <Show when="signed-in">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-10 h-10 border border-white/20"
                                        }
                                    }}
                                />
                            </Show>

                        </div>
                    </header>

                    <main className="min-h-screen pt-16">
                        {children}
                    </main>
                </body>
            </html>
        </ClerkProvider>
    )
}
