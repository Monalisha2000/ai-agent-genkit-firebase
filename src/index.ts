// import * as functions from 'firebase-functions';
import { genkit } from 'genkit'; // Assuming genkit() is the instance creator
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';
import { GenkitInstance } from './utils/helperFunctions';
import { currencyInfoFlow } from './flows/currencyInfoFlow';
import { neareststopssuggesion } from './flows/nearestStopFlow';

// Load environment variables - MUST BE AT THE VERY TOP
config();

// TEMPORARY DEBUGGING LINE:
console.log('API Key from .env (GEMINI_API_KEY):', process.env.GOOGLE_GENAI_API_KEY);
console.log('API Key from .env (GOOGLE_API_KEY):', process.env.GOOGLE_MAPS_API_KEY);


const ai = GenkitInstance.init();
console.log("ai--------->>>>>>>>>>>>>", ai);


export const currencyFlow = currencyInfoFlow;
export const neareststopssuggesionFlow = neareststopssuggesion
console.log("flows----", currencyFlow.name); // Should log names of both flows





















// // Initialize Genkit instance with Google AI plugin
// const ai = genkit({

//     plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
//     model: gemini20Flash
// });

// console.log("ai-------", ai);
