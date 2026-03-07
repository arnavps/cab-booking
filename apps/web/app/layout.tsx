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
                    <main className="min-h-screen">
                        {children}
                    </main>
                </body>
            </html>
        </ClerkProvider>
    )
}
