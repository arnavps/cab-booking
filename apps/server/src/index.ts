import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { stripeWebhookHandler } from "./payments/webhook";

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

// Middleware to capture raw body for webhook verification
app.use(
    "/api/webhook",
    express.json({
        verify: (req: any, res, buf) => {
            req.rawBody = buf;
        },
    })
);

// Socket.io Logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-ride", (rideId: string) => {
        socket.join(rideId);
        console.log(`Socket ${socket.id} joined room: ${rideId}`);
    });

    socket.on("request-ride", (rideData: any) => {
        console.log("New ride request received:", rideData.id);
        io.emit("new-ride-request", rideData);
    });

    socket.on("accept-ride", ({ rideId, driverId }: { rideId: string; driverId: string }) => {
        console.log(`Driver ${driverId} accepted ride ${rideId}`);
        io.to(rideId).emit("ride-accepted", { driverId });
    });

    socket.on("update-location", ({ rideId, coords }: { rideId: string; coords: { lat: number; lng: number } }) => {
        io.to(rideId).emit("location-updated", coords);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Webhook Routes
app.post("/api/webhook/clerk", clerkWebhookHandler);
app.post("/api/webhook/stripe", stripeWebhookHandler);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Uber Clone Multi-Service Backend is running...");
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


