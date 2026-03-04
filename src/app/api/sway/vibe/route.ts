import { NextResponse } from "next/server";
import type { WeatherState } from "@/components/ui/LiquidBackground";
import type { VibeType } from "@/components/ui/AtmosphericHeader";

export const runtime = "edge";

const mockPlaces = {
    Clear: {
        Solo: [
            { id: "c-s-1", imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80", headline: "The Highline Path", pitch: "A sun-drenched sanctuary away from the noise. Perfect for clearing your head and feeling the breeze." },
            { id: "c-s-2", imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80", headline: "Hidden Botanical Gardens", pitch: "Lose yourself among the ancient oaks. A solitary afternoon with nothing but the distant hum of bees." }
        ],
        Family: [
            { id: "c-f-1", imageUrl: "https://images.unsplash.com/photo-1473221326025-9183b464bb7e?w=800&q=80", headline: "Riverside Park", pitch: "Wide open grass and endless sky. Let the kids run wild while you soak up the perfect afternoon sun." },
            { id: "c-f-2", imageUrl: "https://images.unsplash.com/photo-1533222481259-ce20eda1e20b?w=800&q=80", headline: "The Beach Pavilion", pitch: "Sandcastles and sea spray under a cloudless sky. Memories waiting to be made by the glittering water." }
        ],
        Group: [
            { id: "c-g-1", imageUrl: "https://images.unsplash.com/photo-1533143708019-ea5cfa80213e?w=800&q=80", headline: "Rooftop Terrace Open", pitch: "Cold drinks, warm breeze, and the city stretched out below. The afternoon was made for this company." },
            { id: "c-g-2", imageUrl: "https://images.unsplash.com/photo-1511895426328-1b6b55fcb512?w=800&q=80", headline: "Lakeside Beer Garden", pitch: "Laughter carrying over the water as the sun begins to dip. Grab a giant pretzel and enjoy the golden hour." }
        ]
    },
    Rain: {
        Solo: [
            { id: "r-s-1", imageUrl: "https://images.unsplash.com/photo-1544716278-e513176f20b5?w=800&q=80", headline: "The Antiquarian Bookshop", pitch: "The smell of old paper and rain hitting the glass. A quiet corner to lose yourself in another world." },
            { id: "r-s-2", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", headline: "Analog Coffee Roasters", pitch: "Watch the world wash away outside while nursing a perfect pour-over. Solitude has never felt so warm." }
        ],
        Family: [
            { id: "r-f-1", imageUrl: "https://images.unsplash.com/photo-1518998053401-a41411304587?w=800&q=80", headline: "Natural History Museum", pitch: "Dodge the downpour among dinosaur bones and ancient mysteries. An afternoon of discovery that ignores the weather entirely." },
            { id: "r-f-2", imageUrl: "https://images.unsplash.com/photo-1560185011-ea7fedf76711?w=800&q=80", headline: "The Grand Library", pitch: "Vast halls and endless stories to keep the gloom at bay. A cozy, grand shelter for curious minds." }
        ],
        Group: [
            { id: "r-g-1", imageUrl: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80", headline: "The Underground Arcade", pitch: "Neon lights and vintage cabinets cutting through the gray afternoon. Let the steady drum of rain fade behind the 8-bit noise." },
            { id: "r-g-2", imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80", headline: "The Velvet Lounge", pitch: "Deep leather booths and excellent cocktails. The perfect moody shelter to wait out the storm with your favorite people." }
        ]
    },
    Cloud: {
        Solo: [
            { id: "cl-s-1", imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80", headline: "Overlook Trail", pitch: "An overcast sky makes the greens pop. A thoughtful, silent hike with sharp, clean air." },
        ],
        Family: [
            { id: "cl-f-1", imageUrl: "https://images.unsplash.com/photo-1555026909-0091aa4c0e35?w=800&q=80", headline: "The Farmer's Market", pitch: "Beat the heat under a gray sky. Let them pick out fresh berries before the crowds arrive." },
        ],
        Group: [
            { id: "cl-g-1", imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80", headline: "The Outdoor Bazaar", pitch: "Perfect weather for wandering between stalls. Grab some street food and see where the afternoon goes." },
        ]
    },
    Night: {
        Solo: [
            { id: "n-s-1", imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", headline: "The Observatory", pitch: "Just you and the cosmos tonight. A quiet, humbling perspective away from the city lights." },
        ],
        Family: [
            { id: "n-f-1", imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80", headline: "The Plaza Fountain", pitch: "Watch their eyes light up at the water show. A magical end to a long day." },
        ],
        Group: [
            { id: "n-g-1", imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80", headline: "Midnight Diner", pitch: "Neon signs and late-night ramen. The night is young and the stories are just getting good." },
        ]
    }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vibe = (searchParams.get("vibe") || "Solo") as VibeType;
    const weather = (searchParams.get("weather") || "Clear") as WeatherState;

    // Add artificial delay to simulate API calls to Places & Gemini and trigger the PulseLoader
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const items = mockPlaces[weather][vibe];

    if (!items || items.length === 0) {
        // Fallback
        return NextResponse.json({
            items: [{
                id: "fallback",
                imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80",
                headline: "Somewhere Special",
                pitch: "The stars have aligned for a perfect moment, regardless of the weather."
            }]
        });
    }

    // To simulate "infinite" swiping, we shuffle and duplicate the array if there are only a few items
    const shuffled = [...items].sort(() => 0.5 - Math.random());

    return NextResponse.json(
        { items: shuffled },
        {
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
            },
            status: 200,
        }
    );
}
