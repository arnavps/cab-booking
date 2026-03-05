# Uber Clone - Full Stack Monorepo

A high-fidelity, real-time Uber clone built with modern web technologies. Focuses on premium aesthetics, secure payments, and real-time location tracking.

## 🚀 Tech Stack

- **Frontend**: [Next.js (App Router)](https://nextjs.org/)
- **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Real-time**: [Socket.io](https://socket.io/)
- **Database / ORM**: [Supabase (PostgreSQL)](https://supabase.com/) & [Prisma](https://www.prisma.io/)
- **Auth**: [Clerk](https://clerk.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Maps**: [Google Maps Platform](https://developers.google.com/maps)

## 📁 Architecture

This project uses a monorepo structure:
- **`apps/web`**: Next.js frontend with glassmorphism UI and maps integration.
- **`apps/server`**: Express backend for real-time logic and webhooks.
- **`packages/database`**: Shared Prisma schema and database migrations.
- **`packages/shared`**: Shared Zod schemas and TypeScript types.

## 🛠️ Key Features

- **Real-time Ride Tracking**: Driver/Passenger communication via Socket.io rooms.
- **Throttled Location Updates**: Optimized GPS streaming (3s intervals) for performance.
- **Fare Engine**: Dynamic pricing with surge multipliers and promo code support.
- **Secure Payments**: Stripe Payment Intents with signature-verified webhooks.
- **Premium UI**: Dark-mode-first design with smooth Framer Motion animations.
- **Role-based Redirection**: Automatic routing for Drivers vs Passengers via Clerk Middleware.

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm / pnpm / yarn
- Clerk, Stripe, and Google Maps API accounts.

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `apps/web/.env.local` and `apps/server/.env`.
3. Initialize the database:
   ```bash
   npx prisma generate --schema=packages/database/prisma/schema.prisma
   npx prisma db push --schema=packages/database/prisma/schema.prisma
   ```

## 📜 Documentation

- [Deployment Guide](docs/deployment_guide.md)
- [Architecture & Patterns](docs/architecture_overview.md)

## 🛡️ License

MIT
