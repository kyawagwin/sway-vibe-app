import useSWR from "swr";
import { useState, useCallback, useEffect } from "react";
import type { WeatherState } from "@/components/ui/LiquidBackground";
import type { VibeType } from "@/components/ui/AtmosphericHeader";
import type { HeroCardData } from "@/components/ui/HeroCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSwayState() {
    const [vibe, setVibe] = useState<VibeType>("Solo");
    const [weatherState, setWeatherState] = useState<WeatherState>("Clear");
    const [temperature, setTemperature] = useState<number>(65);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeCount, setSwipeCount] = useState(0);
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [isWeatherResolved, setIsWeatherResolved] = useState<boolean>(false);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCoords({ lat, lng });

                    // Fetch real weather
                    try {
                        const weatherRes = await fetch(`/api/sway/weather?lat=${lat}&lng=${lng}`);
                        if (weatherRes.ok) {
                            const data = await weatherRes.json();
                            if (data.temperature) setTemperature(data.temperature);
                            if (data.weatherState) setWeatherState(data.weatherState);
                        }
                    } catch (e) {
                        console.error("Failed to fetch real weather:", e);
                    } finally {
                        setIsWeatherResolved(true);
                    }
                },
                (error) => {
                    console.warn("Geolocation denied or error:", error);
                    setIsWeatherResolved(true);
                }
            );
        } else {
            setIsWeatherResolved(true);
        }
    }, []);

    const params = new URLSearchParams({ vibe, weather: weatherState });
    if (coords) {
        params.append("lat", coords.lat.toString());
        params.append("lng", coords.lng.toString());
    }

    const { data, error, isLoading, isValidating } = useSWR<{ items: HeroCardData[] }>(
        isWeatherResolved ? `/api/sway/vibe?${params.toString()}` : null,
        fetcher,
        {
            revalidateOnFocus: false, // Don't trigger harsh reloads on tab focus
            keepPreviousData: true,   // Keep previous data to prevent layout shift during vibe change
        }
    );

    const handleVibeChange = useCallback((newVibe: VibeType) => {
        setVibe(newVibe);
        setCurrentIndex(0); // Reset stack on vibe change
    }, []);

    const handleSwipe = useCallback(() => {
        if (data?.items) {
            // Cycle through the items
            setCurrentIndex((prev) => (prev + 1) % data.items.length);
            setSwipeCount((prev) => prev + 1);
        }
    }, [data]);

    // Dev Mode Helper
    const cycleWeather = useCallback(() => {
        const states: WeatherState[] = ["Clear", "Rain", "Cloud", "Night"];
        const nextIdx = (states.indexOf(weatherState) + 1) % states.length;
        setWeatherState(states[nextIdx]);
    }, [weatherState]);

    return {
        vibe,
        weatherState,
        temperature,
        handleVibeChange,
        cycleWeather,
        currentItem: data?.items ? data.items[currentIndex] : null,
        nextItem: data?.items ? data.items[(currentIndex + 1) % data.items.length] : null,
        handleSwipe,
        swipeCount,
        isLoading: isLoading || isValidating,
        isOffline: !!error,
    };
}
