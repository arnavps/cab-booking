/**
 * Fare Engine Utility
 * Handles dynamic pricing logic including surge multipliers and promo codes.
 */

interface FareConfig {
    baseFare: number;
    perKmRate: number;
    perMinuteRate: number;
}

const DEFAULT_CONFIG: FareConfig = {
    baseFare: 2.50,
    perKmRate: 1.50,
    perMinuteRate: 0.50,
};

interface FareRequest {
    distanceKm: number;
    durationMin: number;
    promoCode?: string;
    isHighDemand?: boolean;
}

export class FareEngine {
    private static promoCodes: Record<string, number> = {
        'UBER_FRESH': 0.20, // 20% off
        'SAVE5': 5.00,      // $5 flat off
    };

    static calculateFare(request: FareRequest): number {
        const { distanceKm, durationMin, promoCode, isHighDemand } = request;

        // 1. Calculate Base Price
        let total = DEFAULT_CONFIG.baseFare +
            (distanceKm * DEFAULT_CONFIG.perKmRate) +
            (durationMin * DEFAULT_CONFIG.perMinuteRate);

        // 2. Apply Surge Pricing (if high demand)
        if (isHighDemand) {
            const surgeMultiplier = 1.4; // 40% increase
            total *= surgeMultiplier;
        }

        // 3. Apply Promo Code
        if (promoCode && this.promoCodes[promoCode]) {
            const discount = this.promoCodes[promoCode];
            if (discount < 1) {
                // Percentage discount
                total -= (total * discount);
            } else {
                // Flat discount
                total = Math.max(0, total - discount);
            }
        }

        return parseFloat(total.toFixed(2));
    }

    static validatePromo(code: string): boolean {
        return !!this.promoCodes[code];
    }
}
