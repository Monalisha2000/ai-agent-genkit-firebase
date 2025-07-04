import { CurrencyInfoSchema, CurrencyInputSchema } from "../schemas/currencySchemas";
import { GenkitInstance } from "../utils/genkit_initialize";

const ai = GenkitInstance.init();
console.log("ai----------->>>>", ai);




export const currencyInfoFlow = ai.defineFlow(
    {
        name: 'currencyInfoFlow',
        inputSchema: CurrencyInputSchema, // Input is an object with currencyName
        outputSchema: CurrencyInfoSchema, // Output is a structured object
    },
    async (input) => {
        const promptText = `
            You are a helpful assistant providing currency information.
            Provide information for the following currencies:
            - US Dollar (USD): 1 USD = 80 Indian Rupees (INR). Used primarily in the United States.
            - Euro (EUR): 1 EUR = 90 Indian Rupees (INR). Used in the Eurozone countries (e.g., Germany, France, Italy).
            - Indian Rupee (INR): 1 INR = 0.0125 US Dollars (USD). Used primarily in India.

            For the currency "${input.currencyName}", provide the relevant conversion rates and where it is used from the list above.
            If the currency is not explicitly listed (only US Dollar, Euro, Indian Rupee are supported), set relevant fields to null/undefined and provide a message.

            Your response MUST be a JSON object strictly conforming to this schema:
            ${JSON.stringify(CurrencyInfoSchema.shape, null, 2)}
        `;

        const { output } = await ai.generate({
            prompt: promptText,
            output: { schema: CurrencyInfoSchema }, // Request structured output
        });

        if (!output) {
            throw {
                status: 'FAILED_PRECONDITION',
                message: 'Failed to generate currency info output conforming to schema.',
            };
        }

        return output;
    }
);