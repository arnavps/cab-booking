import { Providers } from '@/components/Providers'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
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
        <html lang="en" className="dark">
            <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-black text-white antialiased`}>
                <Providers>
                    <main className="min-h-screen">
                        {children}
                    </main>
                </Providers>
                <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            </body>
        </html>
    )
}
