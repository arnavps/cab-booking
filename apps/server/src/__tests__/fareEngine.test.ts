import { FareEngine } from '../utils/fareEngine';

describe('FareEngine', () => {
    test('calculates base fare correctly', () => {
        const fare = FareEngine.calculateFare({
            distanceKm: 10,
            durationMin: 20,
        });
        // Calculation: 2.50 (base) + 10 * 1.50 (km) + 20 * 0.50 (min) = 2.5 + 15 + 10 = 27.50
        expect(fare).toBe(27.50);
    });

    test('applies surge pricing correctly', () => {
        const fare = FareEngine.calculateFare({
            distanceKm: 10,
            durationMin: 20,
            isHighDemand: true,
        });
        // Calculation: 27.50 * 1.4 = 38.50
        expect(fare).toBe(38.50);
    });

    test('applies percentage promo code correctly', () => {
        const fare = FareEngine.calculateFare({
            distanceKm: 10,
            durationMin: 20,
            promoCode: 'UBER_FRESH',
        });
        // Calculation: 27.50 - (27.50 * 0.20) = 27.50 - 5.50 = 22.00
        expect(fare).toBe(22.00);
    });

    test('applies flat promo code correctly', () => {
        const fare = FareEngine.calculateFare({
            distanceKm: 10,
            durationMin: 20,
            promoCode: 'SAVE5',
        });
        // Calculation: 27.50 - 5.00 = 22.50
        expect(fare).toBe(22.50);
    });

    test('validates promo codes correctly', () => {
        expect(FareEngine.validatePromo('UBER_FRESH')).toBe(true);
        expect(FareEngine.validatePromo('INVALID')).toBe(false);
    });
});
