# Deployment Guide

This guide outlines the steps to deploy the Uber Clone to production.

## Frontend (Vercel)
1. **Connect Repository**: Connect your GitHub repository to Vercel.
2. **Framework Preset**: Select "Next.js".
3. **Environment Variables**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - `DATABASE_URL` (Supabase connection string)
4. **Build & Deploy**: Vercel will automatically handle the build process.

## Backend (Railway)
1. **New Project**: Select "Deploy from GitHub repo".
2. **Environment Variables**:
   - `PORT=3001`
   - `DATABASE_URL`
   - `CLERK_WEBHOOK_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
3. **CORS Configuration**:
   - Ensure the `cors()` middleware in `index.ts` allows your Vercel URL.
   - Example: `app.use(cors({ origin: 'https://your-vercel-app.vercel.app' }))`.

## Supabase (Database)
1. **Migrations**: Run `npx prisma migrate deploy` locally or via a CI/CD pipeline to update the database schema.
2. **Connection**: Ensure the `DATABASE_URL` is using the transaction pooling mode if deploying to serverless environments.
