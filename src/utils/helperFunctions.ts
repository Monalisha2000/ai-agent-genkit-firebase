import { genkit } from 'genkit';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';

export class GenkitInstance {
    // Use ReturnType<typeof genkit> to get the correct type
    public static ai: ReturnType<typeof genkit> | null = null;

    public static init(): ReturnType<typeof genkit> {
        if (!this.ai) {
            this.ai = genkit({
                plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY! })],
                model: gemini20Flash,
            });
        }
        return this.ai;
    }
}
