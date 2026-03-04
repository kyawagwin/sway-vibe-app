import { NextResponse } from "next/server";
import type { WeatherState } from "@/components/ui/LiquidBackground";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");

        if (!lat || !lng) {
            return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
        }

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum)) {
            return NextResponse.json({ error: "Invalid coordinates format" }, { status: 400 });
        }

        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lngNum}&units=imperial&appid=${apiKey}`);

        if (!res.ok) {
            throw new Error(`OpenWeatherMap error: ${res.status}`);
        }

        const data = await res.json();
        const temperature = data.main.temp;
        const condition = data.weather[0].main; // Rain, Clouds, Clear, etc.
        const icon = data.weather[0].icon;

        let weatherState: WeatherState = "Clear";
        if (icon.endsWith('n')) {
            weatherState = "Night";
        } else if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") {
            weatherState = "Rain";
        } else if (condition === "Clouds") {
            weatherState = "Cloud";
        } else {
            weatherState = "Clear";
        }

        return NextResponse.json({ temperature, weatherState }, {
            headers: {
                "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("Weather API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
