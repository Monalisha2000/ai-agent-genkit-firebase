import { z } from 'zod';

// --- Schemas for currencyInfoFlow ---
export const CurrencyInputSchema = z.object({
    // currencyName: z.string().describe('The name of the currency (e.g., "dollar", "euro", "rupee")'),
    prompt: z.string().describe('User prompt for currency conversion'),
});

export const ProductCurrencyFlowInputSchema = z.object({
    baseCurrency: z.string(),
    targetCurrencies: z.array(z.string()),
    baseValue: z.number().default(1), // usually 1
    productPrice: z.number(),         // price per unit in base currency
    quantity: z.number(),             // number of units
});

export const ProductCurrencyFlowOutputSchema = z.array(
    z.object({
        baseCurrency: z.string(),
        targetCurrency: z.string(),
        conversionRate: z.number(),
        productPriceInBaseCurrency: z.number(),
        quantity: z.number(),
        totalPriceInTargetCurrency: z.number(),
    })
);

export const CurrencyInfoSchema = z.object({
    currency: z.string().describe('The name of the currency requested'),
    conversionRateUSD: z.number().optional().describe('Conversion rate to 1 USD, if applicable'),
    exchangeRateToINR: z.number().optional().describe('Conversion rate to 1 INR, if applicable'),
    countriesUsed: z.array(z.string()).optional().describe('Countries where this currency is primarily used'),
    message: z.string().nullable(),
});

export const CurrencyConversionResultSchema = z.object({
    baseCurrency: z.string().describe('The base currency code used for conversion (e.g., EUR)'),
    targetCurrency: z.string().describe('The target currency code (e.g., INR)'),
    conversionRate: z.number().describe('Exchange rate from baseCurrency to targetCurrency'),
    conversionValue: z.number().describe('The amount in base currency to be converted'),
    outputValue: z.number().describe('The resulting amount in the target currency'),
    quantityOfProduct: z.number().nullable().describe('Product quantity'),
    priceOfProduct: z.number().nullable().describe('Product price after conversion from baseCurrency to targetCurrency')
});
export const CurrencyInfoArraySchema = z.array(CurrencyConversionResultSchema);
