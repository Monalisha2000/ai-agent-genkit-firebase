// functions/tools/productPricingTool.ts

import { z } from 'zod';
import { GenkitInstance } from '../utils/helperFunctions';

const ai = GenkitInstance.init();

// Input schema
export const ProductPricingInputSchema = z.object({
    pricePerUnit: z.number().describe('Price of a single unit'),
    quantity: z.number().describe('Number of units'),
});

// Output schema
export const ProductPricingOutputSchema = z.object({
    pricePerUnit: z.number(),
    quantity: z.number(),
    totalPrice: z.number(),
});

// Tool definition
export const productPricingTool = ai.defineTool(
    {
        name: 'productPricingTool',
        description: 'Calculates the total price for a product quantity.',
        inputSchema: ProductPricingInputSchema,
        outputSchema: ProductPricingOutputSchema,
    },
    async ({ pricePerUnit, quantity }) => {
        const totalPrice = parseFloat((pricePerUnit * quantity).toFixed(2));

        return {
            pricePerUnit,
            quantity,
            totalPrice,
        };
    }
);
