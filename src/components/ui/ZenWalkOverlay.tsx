"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation2, Zap } from "lucide-react";
import { useCompass } from "@/hooks/useCompass";

interface ZenWalkOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    targetLat: number;
    targetLng: number;
    headline: string;
}

export function ZenWalkOverlay({ isOpen, onClose, targetLat, targetLng, headline }: ZenWalkOverlayProps) {
    const {
        distance,
        relativeArrowRotation,
        permissionGranted,
        requestPermission,
        error
    } = useCompass(targetLat, targetLng);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-white overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 shrink-0 mt-8 z-10">
                        <div>
                            <h2 className="text-xl font-bold font-sans tracking-tight text-white/50 uppercase">Zen Walk</h2>
                            <p className="text-xl font-serif text-white">{headline}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 relative">

                        {/* Ambient glow behind compass */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

                        {!permissionGranted ? (
                            <div className="flex flex-col items-center text-center space-y-6 z-10 max-w-xs">
                                <div className="p-6 bg-white/5 rounded-full border border-white/10">
                                    <Zap className="w-12 h-12 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Initialize compass</h3>
                                    <p className="text-white/60 text-sm">
                                        We need access to your device&apos;s location and orientation sensors to point the way.
                                    </p>
                                </div>
                                <button
                                    onClick={requestPermission}
                                    className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Activate Sensors
                                </button>
                                {error && (
                                    <p className="text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                        {error}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center z-10 w-full">
                                {/* The Magic Arrow */}
                                <motion.div
                                    animate={{
                                        rotate: relativeArrowRotation || 0
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 40,   // Low stiffness for heavy, slow movement
                                        damping: 20,     // High damping to prevent jitter
                                        mass: 2          // Give it weight
                                    }}
                                    className="relative flex items-center justify-center w-64 h-64 mb-12"
                                >
                                    {/* Calibration warning if heading isn't ready */}
                                    {relativeArrowRotation === null && (
                                        <p className="absolute text-xs tracking-widest text-indigo-400/50 animate-pulse uppercase">
                                            Calibrating...
                                        </p>
                                    )}
                                    <Navigation2
                                        className={`w-48 h-48 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-opacity duration-1000 ${relativeArrowRotation === null ? 'opacity-20' : 'opacity-100'}`}
                                        strokeWidth={1}
                                    />
                                </motion.div>

                                {/* Distance Readout */}
                                <div className="text-center space-y-2">
                                    {distance !== null ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-5xl font-bold font-sans tracking-tighter tabular-nums"
                                        >
                                            {distance > 1000
                                                ? `${(distance / 1000).toFixed(1)} km`
                                                : `${Math.round(distance)} m`
                                            }
                                        </motion.div>
                                    ) : (
                                        <div className="text-5xl font-bold text-white/20">-- m</div>
                                    )}

                                    <p className="text-white/50 text-sm tracking-wide">
                                        as the crow flies
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
