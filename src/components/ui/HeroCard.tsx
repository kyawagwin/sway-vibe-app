"use client";

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { Navigation, Heart, X } from "lucide-react";
import Image from "next/image";

export interface HeroCardData {
    id: string;
    imageUrl: string;
    headline: string;
    pitch: string;
}

interface HeroCardProps {
    data: HeroCardData;
    onSwipe: (direction: "left" | "right", item: HeroCardData) => void;
    index: number;
}

export function HeroCard({ data, onSwipe, index }: HeroCardProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();

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
                <div className="relative h-[55%] w-full shrink-0">
                    <Image
                        src={data.imageUrl}
                        alt={data.headline}
                        fill
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false} // Prevent native drag
                        sizes="(max-width: 768px) 100vw, 420px"
                        priority
                    />
                    {/* Soft vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Bottom 45%: Narrative Area */}
                <div className="flex-1 flex flex-col p-6 -mt-8 relative z-10">
                    <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
                        <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-2 drop-shadow-md pb-3 border-b border-white/10" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            {data.headline}
                        </h2>
                        <p className="text-white/90 text-[16px] sm:text-[18px] leading-relaxed font-serif mt-3 drop-shadow-sm" style={{ fontFamily: "Merriweather, serif" }}>
                            {data.pitch}
                        </p>
                    </div>

                    <div className="flex justify-center mt-4 shrink-0">
                        <button
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${data.id}`, '_blank')}
                            className="flex items-center gap-2 px-8 py-3.5 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-lg transition-transform transform active:scale-95 duration-200"
                        >
                            <Navigation className="w-5 h-5" />
                            <span className="font-semibold text-sm tracking-wide">SWAY NOW</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
