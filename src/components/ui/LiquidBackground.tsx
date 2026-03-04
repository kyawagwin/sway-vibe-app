"use client";

import { motion } from "framer-motion";

export type WeatherState = "Clear" | "Rain" | "Cloud" | "Night";

interface LiquidBackgroundProps {
    weatherState: WeatherState;
}

const colorMap: Record<WeatherState, string> = {
    Clear: "linear-gradient(135deg, #F39C12 0%, #FFB75E 100%)", // Solar Gold to Peach
    Rain: "linear-gradient(135deg, #708090 0%, #2C3E50 100%)",  // Slate Blue to Twilight Indigo
    Cloud: "linear-gradient(135deg, #BDC3C7 0%, #2C3E50 100%)", // Silver to Indigo
    Night: "linear-gradient(135deg, #141E30 0%, #243B55 100%)", // Deep Space Blue
};

export function LiquidBackground({ weatherState }: LiquidBackgroundProps) {
    return (
        <motion.div
            className="fixed inset-0 min-h-screen w-full -z-50 pointer-events-none"
            animate={{
                background: colorMap[weatherState] || colorMap["Clear"],
            }}
            transition={{
                duration: 1.2,
                ease: "easeInOut",
            }}
        />
    );
}
