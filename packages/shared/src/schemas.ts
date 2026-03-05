import { z } from 'zod';

// Roles Enum
export const RoleSchema = z.enum(['PASSENGER', 'DRIVER', 'ADMIN']);

// Ride Status Enum
export const RideStatusSchema = z.enum([
    'PENDING',
    'ACCEPTED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED',
]);

// Transaction Status Enum
export const TransactionStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED']);

// User Schema
export const UserSchema = z.object({
    id: z.string().uuid().optional(),
    clerkId: z.string().min(1, "Clerk ID is required"),
    email: z.string().email("Invalid email address"),
    name: z.string().nullable().optional(),
    role: RoleSchema.default('PASSENGER'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

// Driver Details Schema
export const DriverDetailsSchema = z.object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    licenseNumber: z.string().min(5, "License number is too short"),
    vehicleType: z.string().min(1, "Vehicle type is required"),
    vehiclePlate: z.string().min(1, "Vehicle plate is required"),
    rating: z.number().min(0).max(5).default(5.0),
    isAvailable: z.boolean().default(true),
});

// Ride Schema
export const RideSchema = z.object({
    id: z.string().uuid().optional(),
    passengerId: z.string().uuid(),
    driverId: z.string().uuid().nullable().optional(),
    status: RideStatusSchema.default('PENDING'),
    pickupLocation: z.string().min(1, "Pickup location is required"),
    dropoffLocation: z.string().min(1, "Dropoff location is required"),
    fare: z.number().positive("Fare must be positive"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

// Transaction Schema
export const TransactionSchema = z.object({
    id: z.string().uuid().optional(),
    rideId: z.string().uuid(),
    amount: z.number().positive("Amount must be positive"),
    status: TransactionStatusSchema.default('PENDING'),
    paymentMethod: z.string().min(1, "Payment method is required"),
    createdAt: z.date().optional(),
});

// Inferred Types
export type UserType = z.infer<typeof UserSchema>;
export type DriverDetailsType = z.infer<typeof DriverDetailsSchema>;
export type RideType = z.infer<typeof RideSchema>;
export type TransactionType = z.infer<typeof TransactionSchema>;
