import { Router } from 'express';
import { RideService } from '../services/rideService';

const router = Router();

/**
 * GET /api/rides/history?userId=...&role=...
 */
router.get('/history', async (req, res) => {
    try {
        const { userId, role } = req.query;

        if (!userId || !role) {
            return res.status(400).json({ error: 'userId and role are required' });
        }

        const rides = await RideService.getRideHistory(userId as string, role as 'PASSENGER' | 'DRIVER');
        res.status(200).json(rides);
    } catch (error) {
        console.error('Failed to fetch ride history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * POST /api/rides/rate
 */
router.post('/rate', async (req, res) => {
    try {
        const { rideId, rating, comment } = req.body;

        if (!rideId || rating === undefined) {
            return res.status(400).json({ error: 'rideId and rating are required' });
        }

        const ride = await RideService.rateRide(rideId, rating, comment);
        res.status(200).json(ride);
    } catch (error) {
        console.error('Failed to rate ride:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
