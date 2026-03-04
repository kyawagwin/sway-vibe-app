"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Trash2, Navigation } from "lucide-react";
import Image from "next/image";
import type { HeroCardData } from "@/components/ui/HeroCard";

interface VaultOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    savedItems: HeroCardData[];
    onRemoveItem: (id: string) => void;
}

export function VaultOverlay({ isOpen, onClose, savedItems, onRemoveItem }: VaultOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-3xl text-white overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 mt-8">
                        <div>
                            <h2 className="text-2xl font-bold font-sans tracking-tight">The Vault</h2>
                            <p className="text-sm text-white/50">{savedItems.length} saved vibes</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
                        {savedItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                                <MapPin className="w-12 h-12 opacity-50" />
                                <p>Swipe right to save your vibes here.</p>
                            </div>
                        ) : (
                            savedItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative flex items-stretch gap-4 p-3 bg-white/5 border border-white/10 rounded-[20px] overflow-hidden"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative w-24 sm:w-32 rounded-[12px] overflow-hidden shrink-0">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.headline}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 py-1 pr-2 flex flex-col justify-center min-w-0">
                                        <h3 className="font-bold text-lg truncate font-sans">{item.headline}</h3>
                                        <p className="text-sm text-white/70 line-clamp-2 leading-snug mt-1 font-serif opacity-90">
                                            {item.pitch}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 mt-3">
                                            <button
                                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${item.id}`, '_blank')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full text-xs font-semibold transition-colors"
                                            >
                                                <Navigation className="w-3.5 h-3.5" />
                                                <span>Map</span>
                                            </button>
                                            <button
                                                onClick={() => onRemoveItem(item.id)}
                                                className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
