"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";

interface OfflineFallbackCardProps {
    onRetry: () => void;
}

export function OfflineFallbackCard({ onRetry }: OfflineFallbackCardProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center p-6 w-full max-w-[450px] mx-auto z-40">
            <motion.div
                initial={{ scale: 0.95, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="w-full aspect-[4/5] max-h-[750px] bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[20px] shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center"
            >
                <div className="mb-6 p-4 bg-white/5 rounded-full border border-white/10">
                    <WifiOff className="w-12 h-12 text-slate-300" />
                </div>

                <h2 className="text-white text-2xl font-bold tracking-tight mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Lost the Signal
                </h2>

                <p className="text-slate-300 text-[18px] leading-relaxed font-serif mb-8" style={{ fontFamily: "Merriweather, serif" }}>
                    We need a connection to curate your perfect weekend vibe.
                </p>

                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full shadow-lg transition-all active:scale-95 duration-200"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-semibold text-sm tracking-wide">Try Again</span>
                </button>
            </motion.div>
        </div>
    );
}
