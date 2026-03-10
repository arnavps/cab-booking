process.env.CLERK_SECRET_KEY = 'sk_test_fake';
process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_fake';
process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fake';
process.env.CLERK_WEBHOOK_SECRET = 'whsec_fake';
process.env.DATABASE_URL = 'postgresql://fake@localhost:5432/fake';

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { stripeWebhookHandler } from "./payments/webhook";

dotenv.config();

// Clerk & FCM Dummy Fallbacks
process.env.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || 'sk_test_clerk';
process.env.CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY || 'pk_test_clerk';
process.env.FIREBASE_SERVICE_ACCOUNT_JSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST"],
    },
});

const port = process.env.PORT || 3001;

app.use(cors());

// Middleware to capture raw body for webhook verification
app.use(
    "/api/webhook",
    express.json({
        verify: (req: any, res, buf) => {
            req.rawBody = buf;
        },
    })
);

import { DriverService } from "./services/driverService";

// ... inside io.on("connection", ...)
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-ride", (rideId: string) => {
        socket.join(rideId);
        console.log(`Socket ${socket.id} joined room: ${rideId}`);
    });

    socket.on("toggle-online", async ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        console.log(`Received toggle-online for ${userId}: requested status ${isOnline}`);
        try {
            await DriverService.toggleAvailability(userId, isOnline);
            console.log(`Driver ${userId} successfully toggled to ${isOnline ? 'online' : 'offline'}`);
            socket.emit("online-confirmed", { isOnline });
        } catch (error) {
            console.error(`Error toggling online status for ${userId}:`, error);
            socket.emit("error", { message: "Failed to toggle online status" });
        }
    });

    socket.on("request-ride", (rideData: any) => {
        console.log("New ride request received:", rideData.id);
        // In a real app, we would only emit to nearby online drivers
        io.emit("new-ride-request", rideData);
    });

    socket.on("accept-ride", async ({ rideId, driverId }: { rideId: string; driverId: string }) => {
        try {
            const ride = await DriverService.acceptRide(rideId, driverId);
            console.log(`Driver ${driverId} accepted ride ${rideId}`);
            
            // Notify the specific ride room (passenger and accepted driver)
            io.to(rideId).emit("ride-accepted", { 
                driverId,
                rideStatus: 'ACCEPTED',
                passengerDetails: ride.passenger 
            });
            
            // Also notify others that this ride is no longer available
            io.emit("ride-taken", { rideId });
        } catch (error) {
            socket.emit("error", { message: "Failed to accept ride" });
        }
    });

    socket.on("decline-ride", ({ rideId, driverId }: { rideId: string; driverId: string }) => {
        console.log(`Driver ${driverId} declined ride ${rideId}`);
        // For now, just tell this driver it's removed
        socket.emit("ride-removed", { rideId });
        // In a more complex logic, we would broadcast to the NEXT nearest driver here
    });

    socket.on("driver-arrived", async ({ rideId }: { rideId: string }) => {
        try {
            await DriverService.arrived(rideId);
            io.to(rideId).emit("driver-arrived");
        } catch (error) {
            socket.emit("error", { message: "Failed to mark arrival" });
        }
    });

    socket.on("ride-completed", async ({ rideId }: { rideId: string }) => {
        try {
            await DriverService.completeRide(rideId);
            io.to(rideId).emit("ride-completed");
        } catch (error) {
            socket.emit("error", { message: "Failed to complete ride" });
        }
    });

    socket.on("update-location", ({ rideId, coords }: { rideId: string; coords: { lat: number; lng: number } }) => {
        io.to(rideId).emit("location-updated", coords);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

import paymentRoutes from "./routes/paymentRoutes";
import rideRoutes from "./routes/rideRoutes";
import { razorpayWebhookHandler } from "./webhooks/razorpay";
// import { PrismaClient } from '../node_modules/.prisma/client';

/*
const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
*/

// Webhook Routes
app.post("/api/webhook/clerk", clerkWebhookHandler);
app.post("/api/webhook/stripe", stripeWebhookHandler); // Keeping for legacy support
app.post("/api/webhook/razorpay", razorpayWebhookHandler);

app.use("/api/payments", paymentRoutes);
app.use("/api/rides", rideRoutes);

app.post("/api/user/update-fcm", async (req, res) => {
    try {
        const { userId, fcmToken } = req.body;
        if (!userId || !fcmToken) return res.status(400).json({ error: 'Missing fields' });
        
        /*
        await prismaClient.user.update({
            where: { id: userId },
            data: { fcmToken },
        });
        */
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update token' });
    }
});

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Uber Clone Multi-Service Backend is running...");
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


