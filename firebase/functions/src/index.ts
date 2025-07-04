import { config } from 'dotenv';
import { GenkitInstance } from './utils/genkit_initialize';
import { currencyInfoFlow } from '../../../src/flows/currencyInfoFlow';

// Load environment variables - MUST BE AT THE VERY TOP
config();

// TEMPORARY DEBUGGING LINE:
console.log('API Key from .env (GEMINI_API_KEY):', process.env.GOOGLE_GENAI_API_KEY);
console.log('API Key from .env (GOOGLE_API_KEY):', process.env.GOOGLE_MAPS_API_KEY);

const ai = GenkitInstance.init();
console.log("ai----++++++", ai);
