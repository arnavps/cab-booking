import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkWebhookHandler } from "./webhooks/clerk";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// IMPORTANT: Clerk webhooks need the raw body for signature verification.
// Use express.json({ verify: ... }) or use a raw body parser for this specific route.
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
    res.send("Uber Clone Backend API is running...");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
