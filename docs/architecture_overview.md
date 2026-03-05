# System Architecture & Design Patterns

## 🛠️ System Architecture

The Uber Clone is architected as a **Full-Stack Monorepo**, ensuring tight coupling between types and schemas while maintaining a clean separation of concerns.

### 1. Frontend (Next.js App Router)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for low-boilerplate global ride state.
- **Data Validation**: [Zod](https://zod.dev/) for client-side form validation and shared API contract reinforcement.
- **Routing**: Clerk-powered Middleware for role-based gating (Driver vs. Passenger).

### 2. Backend (Node/Express)
- **Real-Time Layer**: Socket.io for persistent, low-latency communication via ride-specific "Rooms".
- **Database Access**: Prisma ORM for type-safe queries and automated schema migrations.
- **Webhook Infrastructure**: Dedicated handlers for Clerk (User Sync) and Stripe (Payment Success).

---

## 🏗️ Design Patterns Used

### 1. **Factory Pattern** (Fare Engine)
The [FareEngine.ts](file:///c:/Users/Arnav%20Shirwadkar/Desktop/Mains/cab-booking/apps/server/src/utils/fareEngine.ts) acts as a calculation factory. It takes raw inputs (distance, duration, promo codes) and "produces" a final validated price. This encapsulates the complex logic of surge multipliers and percentage-vs-flat discounts, making it easy to extend with new pricing rules.

### 2. **Observer Pattern** (Socket.io)
The real-time notification system is a classic implementation of the Observer pattern.
- **Subject**: The ride request or driver's location.
- **Observers**: Connected socket clients joined to specific `rideId` rooms.
When the Subject's state changes (e.g., driver accepts ride), all Observers in the room are automatically notified without manual polling.

### 3. **Strategy Pattern** (Future Implementation)
The system is designed to support different routing strategies (Google Maps vs. OSRM) or payment gateways (Stripe vs. PayPal) by defining clear interfaces in the `packages/shared` layer.

---

## 🚀 Future Scalability

1. **Microservices Transition**: The monorepo structure allows `apps/server` to be easily split into separate services (Auth Service, Payment Service, Dispatch Service) as traffic grows.
2. **Database Indexing**: The Supabase/PostgreSQL schema is optimized with unique constraints on `clerkId` and `email` for fast lookups. Future secondary indexes on `pickupLocation` and `driverDetails.userId` are planned.
3. **Caching Layer**: Redis can be seamlessly integrated into the Socket.io server to persist driver locations and ride states during high-traffic surges.
4. **Geo-Sharding**: As the user base expands globally, driver matching can be sharded based on geographic regions to minimize latency and server load.
