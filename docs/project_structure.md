# Project Structure

This document outlines the detailed folder and file structure of the Cab Booking Monorepo, explaining the purpose of each component.

## Root Directory

The project is structured as a Turborepo monorepo.

*   **`apps/`**: Contains the runnable applications (frontend and backend).
*   **`packages/`**: Contains shared code, configurations, and database schemas used across the apps.
*   **`docs/`**: Documentation files (architecture, deployment, structure).
*   **`package.json`**: Root package file managing workspace dependencies and Turborepo scripts.
*   **`turbo.json`**: Configuration for Turborepo task runner caching and pipeline.

---

## 🖥️ `apps/web` (Frontend - Next.js)

This is the main user-facing application built with Next.js (App Router), Tailwind CSS, and Framer Motion.

### `app/` (Next.js App Router)
*   **`layout.tsx`**: Root layout defining the global HTML structure, fonts (Geist), and Clerk Authentication provider.
*   **`page.tsx`**: The main Landing Page showcasing the platform's premium aesthetic.
*   **`globals.css`**: Global Tailwind directives and custom CSS variables.
*   **`(auth)/`**: Route group for Clerk authentication pages (Sign In / Sign Up).
*   **`ride-dashboard/page.tsx`**: The primary Passenger interface for booking rides, entering pickup/dropoff on the map, and viewing ride status.
*   **`driver-dashboard/page.tsx`**: The primary Driver interface for receiving ride requests, accepting/declining, and navigating to passengers.
*   **`payment-success/page.tsx`**: Confirmation page redirected to after a successful Razorpay payment.
*   **`history/page.tsx`**: Dashboard for users to view past rides and download PDF receipts.
*   **`profile/page.tsx`**: User profile management page.

### `components/` (React Components)
*   **`MapComponent.tsx`**: Reusable Google Maps wrapper component displaying markers and route lines.
*   **`LocationSearch.tsx`**: Google Places Autocomplete input fields for selecting Pickup and Dropoff locations.
*   **`VehicleSelector.tsx`**: UI component for selecting different ride tiers (UberGo, UberXL, Black).
*   **`RideSlidePanel.tsx`**: The bottom sheet panel showing active ride status, driver details, and fare information.
*   **`RideRequestModal.tsx`**: The modal that pops up on the driver dashboard when a new ride request comes in.
*   **`RatingModal.tsx`**: The post-ride modal for rating the driver and leaving comments.
*   **`LandingPage.tsx`**: The heroic premium landing page component.

### `store/` (State Management - Zustand)
*   **`useRideStore.ts`**: Manages the passenger's ride state (location, fare, status, payment) and Socket.io events.
*   **`useDriverStore.ts`**: Manages the driver's state (online/offline status, active requests, current assigned ride) and Socket.io events.

---

## ⚙️ `apps/server` (Backend - Express.js)

The Node.js/Express backend handling real-time communications, webhooks, and database operations.

### `src/` (Source Code)
*   **`index.ts`**: The main entry point. Initializes Express, sets up Socket.io for real-time communication, connects routes, and starts the HTTP server.
*   **`routes/`**: API endpoint definitions.
    *   **`paymentRoutes.ts`**: Routes for creating Razorpay orders and verifying payments.
    *   **`rideRoutes.ts`**: Routes for fetching ride history and submitting ratings.
*   **`services/`**: Core business logic.
    *   **`driverService.ts`**: Handles driver availability, ride assignment, and status updates. Contains stubs for database interactions.
    *   **`rideService.ts`**: Logic for fetching ride history based on user roles.
    *   **`razorpayService.ts`**: Integration with the Razorpay API for payments.
    *   **`receiptService.ts`**: Logic for generating and emailing PDF receipts (stubbed).
    *   **`fcmService.ts`**: Firebase Cloud Messaging service for push notifications (stubbed).
*   **`utils/`**: Helper functions.
    *   **`fareEngine.ts`**: The algorithm for calculating dynamic ride fares based on distance, time, traffic, and surge pricing.
*   **`webhooks/`**: Handlers for external service webhooks.
    *   **`clerk.ts`**: Handles user creation/update events from Clerk Authentication.
    *   **`razorpay.ts`**: Handles successful payment webhooks from Razorpay.
    *   **`stripe.ts`**: Existing but superseded by Razorpay.
*   **`__tests__/`**: Jest unit test files (e.g., `fareEngine.test.ts`).

---

## 📦 `packages/` (Shared Code)

### `database`
*   **`prisma/schema.prisma`**: The core data model defining Users, Drivers, Rides, Vehicles, and Payments for the Supabase Postgres database.

### `shared` (Optional/Future)
*   Intended for shared TypeScript interfaces or Zod validation schemas used by both `apps/web` and `apps/server`.

---

## Environment Configuration

Both `apps/web` and `apps/server` require specific `.env` files to connect to services like Google Maps, Clerk Auth, Razorpay, and Supabase. See `README.md` and `docs/deployment_guide.md` for specific key requirements.
