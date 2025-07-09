import googleAI, { gemini20Flash } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';
// import dotenv from 'dotenv';
import { GenkitInstance } from '../utils/helperFunctions';
// dotenv.config();



const ai = GenkitInstance.init();
console.log("ai----------->>>>", ai);



const outputSchema = ai.defineSchema(
    'outputSchema',
    z.object({
        trip_name: z.string().describe("A valid name that suits this tour plan."),
        trip_configuration: z.array(z.string()).describe("An array of strings that includes major details about the trip (e.g., duration, trip type, whether pets or children are included)"), // ✅ corrected
        destination_google_map_info: z.array(z.string()).describe("An array of strings containing destination Google Map links. Make sure to choose the accurate location that is widely recognized. For example, if someone inputs a hotel name, do not use the hotel name as the main location — instead, use the broader location where the hotel is situated or a nearby popular place. (e.g., if the user inputs Digha Beach, you should consider Digha. If the user inputs Nanababar Ghat, you should consider Kalibari.)"),
        destination_description: z.string().describe("A string with a minimum of 40 words describing the destination. Make sure to mention whether the location is comfortable for children and pets if they are included; otherwise, you may skip this detail"),
        attraction_description: z.string().describe(" A string with a minimum of 40 words summarizing the key attractions of the destination. Be sure to mention if the attractions are family-friendly and suitable for pets and children (if included)"),
        attractions_description: z.array(z.object({
            name: z.string().describe("Name of the attraction"),
            description: z.string().describe("A brief description of the attraction"),
            image: z.string().describe("A valid image URL of the attraction")
        })).describe("An array of objects containing nearby attractions compatible with the trip_configuration"),
        restaurants_description: z.array(z.object({ // ✅ corrected
            name: z.string().describe("Name of the restaurant"),
            description: z.string().describe(" A brief description of the restaurant"),
            image: z.string().describe("A valid image URL of the restaurant")
        })).describe("An array of objects containing nearby restaurants compatible with the trip_configuration."),
        hotels_description: z.array(z.object({
            name: z.string().describe("Name of the hotel"),
            description: z.string().describe("A brief description of the hotel."),
            image: z.string().describe("A valid image URL of the hotel")
        })).describe("An array of objects containing nearby hotels compatible with the trip_configuration")
    })
)

export const neareststopssuggesion = ai.defineFlow(
    {
        name: "stopssuggesionFlows",
        inputSchema: z.object({
            destination: z.object({
                destination_name: z.string(),
                destination_state: z.string(),
                destination_country: z.string(),
                destination_lat: z.number(),
                destination_lon: z.number()
            }),
            duration: z.object({
                start_date: z.date(),
                end_date: z.date()
            }),
            trip_type: z.string(),
            pet_included: z.boolean(),
            children_included: z.boolean(),
            attractions: z.array(z.string())
        }),
        outputSchema: outputSchema
    },
    async (input) => {

        console.log('input', input);
        const neareststopssuggesionprompt = ai.prompt('neareststopssuggesionprompt');
        const { output } = await neareststopssuggesionprompt();
        console.log('input', JSON.stringify(output));
        if (!output) {
            throw new Error("No output")
        }
        return output
    }
)



// export const get_acuret_destination_baced_oninput_destination = ai.defineTool(
//   {
//     name: "get_acuret_destination_baced_oninput_destination",
//     description: "Get an accurate known destination for given coordinates using Google Maps.",
//     inputSchema: z.object({
//       cordinates: z.object({
//         lat: z.number(),
//         lon: z.number()
//       })
//     }),
//     outputSchema: z.string()
//   },
//   async ({ cordinates }) => {
//     const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
//     if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is not set");

//     const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
//       params: {
//         latlng: `${cordinates.lat},${cordinates.lon}`,
//         key: apiKey
//       }
//     });

//     const parsed = GeocodingResponseSchema.safeParse(res.data);
//     if (!parsed.success) {
//       console.error("Invalid response format:", parsed.error.format());
//       throw new Error("Failed to parse geocoding data");
//     }

//     const components = parsed.data.results?.[0]?.address_components || [];
//     const locality = components.find(c => c.types.includes('locality'))?.long_name;
//     const district = components.find(c => c.types.includes('administrative_area_level_2'))?.long_name;

//     return `User input destination coordinates as lat: ${cordinates.lat}, lon: ${cordinates.lon}, but we'll use ${locality || district || 'Unknown Location'} instead.`;
//   }
// )