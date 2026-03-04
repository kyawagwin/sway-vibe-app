"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { Navigation, Heart, X, Compass, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface HeroCardData {
    id: string;
    imageUrl: string;
    imageUrls?: string[];
    headline: string;
    pitch: string;
    targetLat: number;
    targetLng: number;
    rating?: number;
    isOpen?: boolean;
}

interface HeroCardProps {
    data: HeroCardData;
    onSwipe: (direction: "left" | "right", item: HeroCardData) => void;
    onZenWalk?: (item: HeroCardData) => void;
    index: number;
}

export function HeroCard({ data, onSwipe, onZenWalk, index }: HeroCardProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const photos = data.imageUrls && data.imageUrls.length > 0 ? data.imageUrls : [data.imageUrl];

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    // Physics mapping
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const mainOpacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Swipe Intent Overlays mapping
    const saveOpacity = useTransform(x, [0, 100], [0, 1]);
    const discardOpacity = useTransform(x, [0, -100], [0, 1]);

    const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
        const swipeThreshold = 100;

        // Determine if it was a valid swipe
        if (offset.x > swipeThreshold || velocity.x > 500) {
            await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
            onSwipe("right", data);
        } else if (offset.x < -swipeThreshold || velocity.x < -500) {
            await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
            onSwipe("left", data);
        } else {
            // Snap back if not swiped far enough
            controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center p-4 w-full max-w-[420px] mx-auto z-30"
            style={{
                zIndex: 100 - index, // Ensure current card is on top
            }}
        >
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={handleDragEnd}
                animate={controls}
                initial={{ scale: 0.95, y: 50, opacity: 0 }}
                whileInView={{ scale: 1, y: 0, opacity: 1 }}
                style={{ x, rotate, opacity: mainOpacity }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full h-[75vh] min-h-[500px] max-h-[700px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Visual Feedback Overlays */}
                <motion.div
                    style={{ opacity: saveOpacity }}
                    className="absolute inset-0 bg-green-500/20 z-20 pointer-events-none flex items-center justify-center backdrop-blur-sm"
                >
                    <div className="bg-green-500/80 p-6 rounded-full text-white shadow-xl transform rotate-12">
                        <Heart className="w-16 h-16 fill-current" />
                    </div>
                </motion.div>

                <motion.div
                    style={{ opacity: discardOpacity }}
                    className="absolute inset-0 bg-red-500/20 z-20 pointer-events-none flex items-center justify-center backdrop-blur-sm"
                >
                    <div className="bg-red-500/80 p-6 rounded-full text-white shadow-xl transform -rotate-12">
                        <X className="w-16 h-16" strokeWidth={3} />
                    </div>
                </motion.div>

                {/* Top 55%: Image Area */}
                <div className="relative h-[55%] w-full shrink-0 group">
                    <Image
                        src={photos[currentImageIndex]}
                        alt={`${data.headline} photo ${currentImageIndex + 1}`}
                        fill
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                        draggable={false} // Prevent native drag
                        sizes="(max-width: 768px) 100vw, 420px"
                        priority={currentImageIndex === 0}
                    />

                    {/* Image Navigation Controls */}
                    {photos.length > 1 && (
                        <>
                            {/* Left tap zone */}
                            <div
                                className="absolute top-0 left-0 w-1/4 h-full z-10 cursor-pointer flex items-center justify-start px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={prevImage}
                            >
                                <div className="p-1 bg-black/40 rounded-full text-white backdrop-blur-md">
                                    <ChevronLeft className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Right tap zone */}
                            <div
                                className="absolute top-0 right-0 w-1/4 h-full z-10 cursor-pointer flex items-center justify-end px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={nextImage}
                            >
                                <div className="p-1 bg-black/40 rounded-full text-white backdrop-blur-md">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Dot Indicators */}
                            <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 z-10">
                                {photos.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Soft vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Bottom 45%: Narrative Area */}
                <div className="flex-1 flex flex-col p-6 -mt-8 relative z-10">
                    <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
                        <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-2 drop-shadow-md pt-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            {data.headline}
                        </h2>

                        {/* Meta info block */}
                        {(data.rating !== undefined || data.isOpen !== undefined) && (
                            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-white/10 text-sm font-medium">
                                {data.rating !== undefined && (
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-white/90">{data.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                {data.isOpen !== undefined && (
                                    <div className={`flex items-center gap-1.5 ${data.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                                        <Clock className="w-4 h-4" />
                                        <span className="text-white/90">{data.isOpen ? 'Open Now' : 'Closed'}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {!data.rating && !data.isOpen && <div className="border-b border-white/10 mb-3" />}

                        <p className="text-white/90 text-[16px] sm:text-[18px] leading-relaxed font-serif mt-2 drop-shadow-sm" style={{ fontFamily: "Merriweather, serif" }}>
                            {data.pitch}
                        </p>
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-4 shrink-0">
                        <button
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${data.id}`, '_blank')}
                            className="flex-1 flex justify-center items-center gap-2 py-3.5 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-lg transition-transform transform active:scale-95 duration-200"
                        >
                            <Navigation className="w-5 h-5" />
                            <span className="font-semibold text-sm tracking-wide">SWAY NOW</span>
                        </button>

                        {data.targetLat && data.targetLng && onZenWalk && (
                            <button
                                onClick={() => onZenWalk(data)}
                                className="p-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full shadow-lg backdrop-blur-md transition-transform transform active:scale-95 duration-200"
                                title="Zen Walk"
                            >
                                <Compass className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
