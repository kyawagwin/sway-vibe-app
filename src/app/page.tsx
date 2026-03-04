"use client";

import { useState, useEffect } from "react";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { AtmosphericHeader } from "@/components/ui/AtmosphericHeader";
import { HeroCard } from "@/components/ui/HeroCard";
import { PulseLoader } from "@/components/ui/PulseLoader";
import { OfflineFallbackCard } from "@/components/ui/OfflineFallbackCard";
import { useSwayState } from "@/hooks/useSwayState";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const {
    vibe,
    weatherState,
    handleVibeChange,
    cycleWeather,
    currentItem,
    handleSwipe,
    isLoading,
    isOffline,
  } = useSwayState();

  const [temperature] = useState(() => Math.round(Math.random() * 30 + 50));

  return (
    <main className="relative min-h-screen w-full overflow-hidden text-slate-900 font-sans">
      {/* 1. Underlying Liquid Morph Background */}
      <LiquidBackground weatherState={weatherState} />

      {/* 2. Glass Header layer */}
      <AtmosphericHeader
        weatherState={weatherState}
        temperature={temperature} // Mock temperature now handled purely via state
        currentVibe={vibe}
        onVibeChange={handleVibeChange}
      />

      {/* 3. Content Layer (Cards, Loaders, Offline Fallback) */}
      <div className="relative pt-24 h-screen w-full flex items-center justify-center pointer-events-none">
        {/* pointer-events-auto re-enables interaction only on the card area */}
        <div className="relative w-full h-full max-h-[800px] pointer-events-auto">
          <AnimatePresence mode="wait">
            {isOffline ? (
              <motion.div
                key="offline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <OfflineFallbackCard onRetry={() => window.location.reload()} />
              </motion.div>
            ) : isLoading || !currentItem ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PulseLoader />
              </motion.div>
            ) : (
              <HeroCard
                key={currentItem.id} // Re-render animation when item swaps
                data={currentItem}
                index={0}
                onSwipe={handleSwipe}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dev Mode Only: Weather Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={cycleWeather}
          title="Dev Mode: Force Weather State"
          className="p-3 bg-black/60 hover:bg-black text-white rounded-full shadow-2xl backdrop-blur-md text-xs font-mono uppercase tracking-widest border border-white/10 transition-colors"
        >
          {weatherState}
        </button>
      </div>
    </main>
  );
}
