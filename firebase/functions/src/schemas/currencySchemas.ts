import { z } from 'zod';

// --- Schemas for currencyInfoFlow ---
export const CurrencyInputSchema = z.object({
    currencyName: z.string().describe('The name of the currency (e.g., "dollar", "euro", "rupee")'),
});

export const CurrencyInfoSchema = z.object({
    currency: z.string().describe('The name of the currency requested'),
    conversionRateUSD: z.number().optional().describe('Conversion rate to 1 USD, if applicable'),
    conversionRateINR: z.number().optional().describe('Conversion rate to 1 INR, if applicable'),
    usedInCountries: z.array(z.string()).optional().describe('Countries where this currency is primarily used'),
    message: z.string().describe('A message providing information or indicating if currency is not found'),
});
