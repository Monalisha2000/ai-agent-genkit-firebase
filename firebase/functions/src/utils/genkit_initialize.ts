import { config } from 'dotenv';
// import * as functions from 'firebase-functions';
import { genkit } from 'genkit'; // Assuming genkit() is the instance creator
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
config(); // Load .env



export class GenkitInstance {
    public static ai: any;

    public static init() {
        if (!this.ai) {
            this.ai = genkit({
                plugins: [
                    googleAI({ apiKey: process.env.GEMINI_API_KEY }),
                ],
                model: gemini20Flash
            });
        }
        return this.ai;
    }
}