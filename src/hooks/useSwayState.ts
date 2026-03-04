import useSWR from "swr";
import { useState, useCallback } from "react";
import type { WeatherState } from "@/components/ui/LiquidBackground";
import type { VibeType } from "@/components/ui/AtmosphericHeader";
import type { HeroCardData } from "@/components/ui/HeroCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSwayState() {
    const [vibe, setVibe] = useState<VibeType>("Solo");
    const [weatherState, setWeatherState] = useState<WeatherState>("Clear");
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data, error, isLoading, isValidating } = useSWR<{ items: HeroCardData[] }>(
        `/api/sway/vibe?vibe=${vibe}&weather=${weatherState}`,
        fetcher,
        {
            revalidateOnFocus: false, // Don't trigger harsh reloads on tab focus
            keepPreviousData: false,   // We want strict loading states on vibe change
        }
    );

    const handleVibeChange = useCallback((newVibe: VibeType) => {
        setVibe(newVibe);
        setCurrentIndex(0); // Reset stack on vibe change
    }, []);

    const handleSwipe = useCallback((direction: "left" | "right") => {
        if (data?.items) {
            // Cycle through the items
            setCurrentIndex((prev) => (prev + 1) % data.items.length);
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
        handleVibeChange,
        cycleWeather,
        currentItem: data?.items ? data.items[currentIndex] : null,
        nextItem: data?.items ? data.items[(currentIndex + 1) % data.items.length] : null,
        handleSwipe,
        isLoading: isLoading || isValidating,
        isOffline: !!error,
    };
}
