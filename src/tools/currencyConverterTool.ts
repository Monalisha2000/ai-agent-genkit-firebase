import { z } from 'zod';
import axios from 'axios';
import { GenkitInstance } from "../utils/helperFunctions";


const ai = GenkitInstance.init();
console.log("ai----------->>>>", ai);

// Input schema
export const CurrencyToolInputSchema = z.object({
    baseCurrency: z.string(),
    targetCurrencies: z.array(z.string()),
    conversionValue: z.number()
});

// Output schema
export const CurrencyToolOutputSchema = z.array(
    z.object({
        baseCurrency: z.string(),
        targetCurrency: z.string(),
        conversionRate: z.number(),
        conversionValue: z.number(),
        outputValue: z.number()
    })
);

// Tool function
export const currencyConverterTool = ai.defineTool(
    {
        name: 'currencyConverterTool',
        description: 'Converts a given amount from one base currency to multiple target currencies using real-time exchange rates.',
        inputSchema: CurrencyToolInputSchema,
        outputSchema: CurrencyToolOutputSchema,
    },
    async ({ baseCurrency, targetCurrencies, conversionValue }) => {
        try {
            const response = await axios.get(
                'https://api.freecurrencyapi.com/v1/latest',
                {
                    params: {
                        apikey: process.env.FREE_CURRENCY_API_KEY, // put this in your .env file
                        base_currency: baseCurrency,
                        currencies: targetCurrencies.join(',')
                    }
                }
            );

            const rates = response.data.data;

            const result = Object.entries(rates).map(([targetCurrency, rate]) => {
                const rateNumber = Number(rate);
                return {
                    baseCurrency,
                    targetCurrency,
                    conversionRate: rateNumber,
                    conversionValue,
                    outputValue: parseFloat((rateNumber * conversionValue).toFixed(2)),
                };
            });

            return result;
        } catch (err) {
            console.error('Error fetching currency conversion:', err);
            throw {
                status: 'FAILED_PRECONDITION',
                message: 'Currency conversion failed.',
            };
        }
    }
);
