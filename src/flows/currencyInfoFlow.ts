import { CurrencyInfoArraySchema, CurrencyInfoSchema, CurrencyInputSchema, ProductCurrencyFlowInputSchema, ProductCurrencyFlowOutputSchema } from "../schemas/currencySchemas";
import { currencyConverterTool } from "../tools/currencyConverterTool";
import { productPricingTool } from "../tools/productPricingTool";
import { GenkitInstance } from "../utils/helperFunctions";


const ai = GenkitInstance.init();
console.log("ai----------->>>>", ai);


export const currencyInfoFlow = ai.defineFlow(
    {
        name: 'currencyInfoFlow',
        inputSchema: ProductCurrencyFlowInputSchema, // Input is an object with currencyName
        outputSchema: CurrencyInfoArraySchema, // Output is a structured object
    },
    async (input) => {
        const promptText = `
            You are a financial assistant who works with realtime information using tools.

            Please analyze the following currency conversion request:

            - Base Currency: "${input.baseCurrency}"
            - Target Currencies: ${input.targetCurrencies.join(', ')}
            - Base Value: ${input.baseValue}
            - Product Price in Base Currency: ${input.productPrice}
            - Quantity: ${input.quantity}

            Your task:
            1. For each target currency:
            - Calculate the exchange rate from the base currency (using real-time data).
            - Compute the total cost for the product in the target currency:
                total = productPrice × quantity × exchangeRate.
            2. Return a JSON array where each item includes:
            - baseCurrency
            - targetCurrency
            - conversionRate
            - productPriceInBaseCurrency
            - quantity
            - totalPriceInTargetCurrency


            If an exchange rate is unavailable, skip that targetCurrency and mention it in a log message internally. 

            Please use the tools for proper data generation.
            `;

        // const promptText = `
        //   You are a helpful financial assistant.

        //         User provided the currency: "${input.currencyName}"

        //         Your task:
        //         - Provide the approximate exchange rate from this currency to INR.
        //         - List major countries where it's officially used.
        //         - Give a short note about the currency (e.g., its role, popularity).
        //         - Mention that exchange rates change daily and this is an estimate.

        //         ✅ Output your response as a JSON object with the following fields:
        //         - currency: string
        //         - exchangeRateToINR: string (e.g., "1 EUR ≈ 90 INR")
        //         - countriesUsed: array of strings
        //         - message: string

        //         If the currency is not supported, return:
        //         - currency: null
        //         - exchangeRateToINR: null
        //         - countriesUsed: null
        //         - message: "Sorry, we currently support only major currencies like USD, EUR, and INR."

        //         Be honest, clear, and concise.
        //         `;

        const { output } = await ai.generate({
            prompt: promptText,
            output: { schema: ProductCurrencyFlowOutputSchema },
            tools: [currencyConverterTool, productPricingTool]
        });
        console.log("output-------", output);

        const { output: finalOutput } = await ai.generate({
            prompt: `generate the final output based on the output schema`,
            output: { schema: CurrencyInfoArraySchema },
        });

        if (!finalOutput) {
            throw {
                status: 'FAILED_PRECONDITION',
                message: 'Failed to generate currency info output.',
            };
        }

        return finalOutput;
    }
);
