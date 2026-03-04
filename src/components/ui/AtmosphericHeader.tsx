"use client";

import { motion } from "framer-motion";
import { Cloud, CloudRain, Moon, Sun, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeatherState } from "./LiquidBackground";

export type VibeType = "Solo" | "Family" | "Group";

interface AtmosphericHeaderProps {
    weatherState: WeatherState;
    temperature: number;
    currentVibe: VibeType;
    onVibeChange: (vibe: VibeType) => void;
    onToggleVault: () => void;
    hasNewItem: boolean;
}

const WeatherIcon = ({ state }: { state: WeatherState }) => {
    switch (state) {
        case "Clear":
            return <Sun className="w-5 h-5 text-yellow-300 drop-shadow-md" />;
        case "Rain":
            return <CloudRain className="w-5 h-5 text-blue-200 drop-shadow-md" />;
        case "Night":
            return <Moon className="w-5 h-5 text-indigo-200 drop-shadow-md" />;
        case "Cloud":
        default:
            return <Cloud className="w-5 h-5 text-gray-200 drop-shadow-md" />;
    }
};

export function AtmosphericHeader({
    weatherState,
    temperature,
    currentVibe,
    onVibeChange,
    onToggleVault,
    hasNewItem
}: AtmosphericHeaderProps) {
    const vibes: VibeType[] = ["Solo", "Family", "Group"];

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 inset-x-0 z-40 px-6 py-4 flex items-center justify-between"
        >
            {/* Weather Readout */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg select-none">
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                    <WeatherIcon state={weatherState} />
                </motion.div>
                <span className="text-white/90 font-medium text-sm drop-shadow-md">
                    {Math.round(temperature)}°
                </span>
            </div>

            <div className="flex items-center gap-3">
                {/* Vibe Toggle */}
                <div className="flex p-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg">
                    {vibes.map((vibe) => (
                        <button
                            key={vibe}
                            onClick={() => onVibeChange(vibe)}
                            className={cn(
                                "relative px-4 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 outline-none",
                                currentVibe === vibe
                                    ? "text-slate-800 shadow-sm"
                                    : "text-white/70 hover:text-white"
                            )}
                        >
                            {currentVibe === vibe && (
                                <motion.div
                                    layoutId="vibe-pill"
                                    className="absolute inset-0 bg-white/90 rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 drop-shadow-sm">{vibe}</span>
                        </button>
                    ))}
                </div>

                {/* Vault Toggle Button */}
                <button
                    onClick={onToggleVault}
                    className="relative p-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg hover:bg-white/20 transition-colors"
                >
                    <Bookmark className="w-5 h-5 text-white drop-shadow-md" />
                    {hasNewItem && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse" />
                    )}
                </button>
            </div>
        </motion.header>
    );
}
