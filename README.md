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

## 📁 Architecture

This project is a high-performance monorepo utilizing **Turborepo** for build caching and orchestration.

```
cab-booking/
├── apps/
│   ├── web/                    # Next.js 14 Frontend Application
│   │   ├── app/                # App Router logic, Pages, and Layouts
│   │   ├── components/         # Reusable React UI Components (Maps, Modals)
│   │   └── store/              # Zustand global state (Driver & Passenger)
│   └── server/                 # Node.js Express Backend API
│       ├── src/
│       │   ├── routes/         # REST API endpoints (Payments, History)
│       │   ├── services/       # Core business logic (Fares, Routing, Rides)
│       │   └── webhooks/       # Razorpay, Clerk & Stripe Webhooks
│       └── index.ts            # Entrypoint & Socket.io Event Definitions
├── packages/
│   ├── database/               # Shared Database Logic
│   │   └── prisma/             # Prisma ORM Schema (Postgres)
│   └── shared/                 # Shared Types & Validation (Future)
└── docs/                       # Monorepo Documentation
```

- **`apps/web`**: The main user-facing application built with Next.js (App Router), Tailwind CSS, and Framer Motion for high-fidelity interactive interfaces.
- **`apps/server`**: The real-time backend engine handling Socket.io live-tracking grids, driver matchmaking computations, and secure payment processing.
- **`packages/database`**: The unified data schema bridging frontend and backend type guarantees via Prisma and Supabase.

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

- [Project Structure & Component Map](docs/project_structure.md)
- [Deployment Guide](docs/deployment_guide.md)
- [Architecture & Patterns](docs/architecture_overview.md)

## 🛡️ License

MIT
