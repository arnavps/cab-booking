import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { clerkWebhookHandler } from "./webhooks/clerk";

dotenv.config();

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

// Socket.io Logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a specific ride room (for both passenger and driver)
    socket.on("join-ride", (rideId: string) => {
        socket.join(rideId);
        console.log(`Socket ${socket.id} joined room: ${rideId}`);
    });

    // Rider requests a new ride
    socket.on("request-ride", (rideData: any) => {
        console.log("New ride request received:", rideData.id);
        // Emit to all online/available drivers
        io.emit("new-ride-request", rideData);
    });

    // Driver accepts a ride
    socket.on("accept-ride", ({ rideId, driverId }: { rideId: string; driverId: string }) => {
        console.log(`Driver ${driverId} accepted ride ${rideId}`);
        // Notify everyone in the ride room (primarily the passenger)
        io.to(rideId).emit("ride-accepted", { driverId });
    });

    // Throttled Location Updates from Driver
    socket.on("update-location", ({ rideId, coords }: { rideId: string; coords: { lat: number; lng: number } }) => {
        // Forward location to the specific ride room (rider)
        // This is throttled on the client side (every 3s)
        io.to(rideId).emit("location-updated", coords);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// IMPORTANT: Clerk webhooks need the raw body for signature verification.
app.post(
    "/api/webhook/clerk",
    express.json({
        verify: (req: any, res, buf) => {
            req.rawBody = buf;
        },
    }),
    clerkWebhookHandler
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Uber Clone Real-Time Backend is running...");
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

