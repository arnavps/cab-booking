import { Webhook } from "svix";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const clerkWebhookHandler = async (req: Request, res: Response) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
    }

    // Get the headers
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: "Error occurred -- no svix headers" });
    }

    // Get the body
    const payload = req.body;
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return res.status(400).json({ error: "Error occurred -- verification failed" });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses[0]?.email_address;

        try {
            await prisma.user.create({
                data: {
                    clerkId: id,
                    email: email,
                    name: `${first_name} ${last_name}`,
                    role: 'PASSENGER', // Default role
                },
            });
            console.log(`User ${id} synced to database`);
        } catch (error) {
            console.error("Error creating user in Supabase:", error);
            return res.status(500).json({ error: "Database sync failed" });
        }
    }

    return res.status(200).json({ success: true });
};
