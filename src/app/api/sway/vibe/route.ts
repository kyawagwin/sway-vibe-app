import { NextResponse } from "next/server";
import type { WeatherState } from "@/components/ui/LiquidBackground";
import type { VibeType } from "@/components/ui/AtmosphericHeader";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

const searchQueries: Record<WeatherState, Record<VibeType, string[]>> = {
    Clear: {
        Solo: ["quiet botanical garden", "peaceful nature trail", "scenic overlook", "hidden sunlit cafe"],
        Family: ["large grassy park", "beach pavilion", "family friendly outdoor space", "zoo"],
        Group: ["rooftop terrace bar", "outdoor beer garden", "lively open air market", "sunlit patio restaurant"],
    },
    Rain: {
        Solo: ["quiet antiquarian bookshop", "cozy independent cafe", "reading room", "small art gallery"],
        Family: ["natural history museum", "interactive science center", "indoor aquarium", "large public library"],
        Group: ["underground arcade", "moody cocktail lounge", "indoor food hall", "bowling alley"],
    },
    Cloud: {
        Solo: ["overcast hiking trail", "brutalist architecture museum", "quiet foggy beach", "tea house"],
        Family: ["farmers market", "botanical garden conservatory", "spacious indoor playground"],
        Group: ["outdoor bazaar", "bustling street food market", "brewery with indoor outdoor seating"],
    },
    Night: {
        Solo: ["quiet observatory", "late night diner", "midnight cafe", "empty city park bench"],
        Family: ["lit up plaza fountain", "evening carnival", "family friendly dessert spot"],
        Group: ["neon lit ramen shop", "lively night market", "late night karaoke"],
    }
};

interface GooglePlace {
    id: string;
    displayName: { text: string };
    photos?: { name: string }[];
}

interface GeminiPitch {
    id: string;
    pitch: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const vibe = (searchParams.get("vibe") || "Solo") as VibeType;
        const weather = (searchParams.get("weather") || "Clear") as WeatherState;

        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");

        // 1. Pick a random search query
        const baseQueries = searchQueries[weather]?.[vibe] || searchQueries.Clear.Solo;
        const randomQuery = baseQueries[Math.floor(Math.random() * baseQueries.length)];
        const textQuery = lat && lng ? randomQuery : `${randomQuery} in New York`; // Defaulting to NY if no location

        // 2. Call Google Places API
        const placesReqBody: Record<string, unknown> = {
            textQuery,
            pageSize: 5 // Get up to 5 places
        };

        if (lat && lng) {
            placesReqBody.locationBias = {
                circle: {
                    center: {
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lng)
                    },
                    radius: 20000.0 // 20km radius
                }
            };
        }

        const placesRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
            method: "POST",
            headers: {
                "X-Goog-Api-Key": PLACES_API_KEY,
                "X-Goog-FieldMask": "places.id,places.displayName,places.photos",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(placesReqBody)
        });

        if (!placesRes.ok) {
            throw new Error(`Places API error: ${placesRes.status}`);
        }

        const placesData = await placesRes.json();
        const places: GooglePlace[] = placesData.places || [];

        // Filter places that actually have photos
        const placesWithPhotos = places.filter((p: GooglePlace) => p.photos && p.photos.length > 0);

        if (placesWithPhotos.length === 0) {
            throw new Error("No places with photos found");
        }

        // 3. Extract basic info
        const itemsDraft = placesWithPhotos.map((place: GooglePlace) => ({
            id: place.id,
            headline: place.displayName.text,
            // Point to our secure proxy endpoint instead of leaking the API key
            imageUrl: `/api/sway/image?name=${encodeURIComponent(place.photos![0].name)}`,
            pitch: "" // to be generated
        }));

        // 4. Generate pitches with Gemini in one go
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const placesListString = itemsDraft.map((item) => `- ${item.headline}`).join("\n");

        const prompt = `You are a sophisticated AI concierge for a minimalist travel app. 
The user is looking for a place matching vibe="${vibe}" and weather="${weather}".
Here is a list of places I found:
${placesListString}

For each place, write a 1-sentence poetic, immersive pitch that makes the user want to go there right now, given the weather and vibe.

Output exactly a JSON array of objects, with each object having "id" (matching the exact name provided) and "pitch". No markdown formatting, just pure JSON array string.`;

        const geminiRes = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        let responseText = geminiRes.response.text();
        // Harden parser against markdown backticks if Gemini ignores the prompt
        if (responseText.startsWith("```")) {
            responseText = responseText.replace(/```(json)?/g, "").trim();
        }

        const pitches: GeminiPitch[] = JSON.parse(responseText);

        // 5. Merge pitches back
        const finalItems = itemsDraft.map((item) => {
            const foundPitch = pitches.find((p: GeminiPitch) => p.id === item.headline);
            return {
                ...item,
                pitch: foundPitch?.pitch || "A quietly beautiful spot perfectly matching your energy right now."
            };
        });

        // 6. Return to client
        const shuffled = [...finalItems].sort(() => 0.5 - Math.random());

        return NextResponse.json(
            { items: shuffled },
            {
                headers: {
                    "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400", // Cache at edge for 1 hour
                },
                status: 200,
            }
        );

    } catch (error) {
        console.error("Live API Error:", error);

        // Fallback to exactly one mock place to prevent UI break
        return NextResponse.json({
            items: [{
                id: "fallback-" + Date.now(),
                imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80",
                headline: "The Reserve",
                pitch: "The algorithms are sleeping, but this hand-picked sanctuary is quietly waiting for you."
            }]
        }, { status: 200 });
    }
}
