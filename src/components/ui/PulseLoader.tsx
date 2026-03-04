"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function PulseLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/5 backdrop-blur-2xl">
            {/* Looping pulse aura behind loader */}
            <motion.div
                className="absolute w-48 h-48 bg-white/20 rounded-full blur-3xl -z-10"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 text-white/90"
            >
                <Loader2 className="w-12 h-12 animate-spin text-white drop-shadow-md" />
                <p className="font-serif text-lg tracking-wide drop-shadow-md" style={{ fontFamily: "Merriweather, serif" }}>
                    Gathering vibes...
                </p>
            </motion.div>
        </div>
    );
}
