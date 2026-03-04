"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

export interface HeroCardData {
    id: string;
    imageUrl: string;
    headline: string;
    pitch: string;
}

interface HeroCardProps {
    data: HeroCardData;
    onSwipe: (direction: "left" | "right") => void;
    index: number;
}

export function HeroCard({ data, onSwipe, index }: HeroCardProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Physics mapping
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    const handleDragEnd = async (e: any, { offset, velocity }: any) => {
        const swipeThreshold = 100;

        // Determine if it was a valid swipe
        if (offset.x > swipeThreshold || velocity.x > 500) {
            await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
            onSwipe("right");
        } else if (offset.x < -swipeThreshold || velocity.x < -500) {
            await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
            onSwipe("left");
        } else {
            // Snap back if not swiped far enough
            controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center p-6 w-full max-w-[450px] mx-auto z-30"
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
                style={{ x, rotate, opacity }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full aspect-[4/5] max-h-[750px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[20px] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Top 60%: Image Area */}
                <div className="relative h-[65%] w-full">
                    <img
                        src={data.imageUrl}
                        alt={data.headline}
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable="false" // Prevent native drag
                    />
                    {/* Soft vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Bottom 40%: Narrative Area */}
                <div className="flex-1 flex flex-col justify-between p-6 -mt-8 relative z-10">
                    <div>
                        <h2 className="text-white text-2xl font-bold tracking-tight mb-2 drop-shadow-md pb-4 border-b border-white/10" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            {data.headline}
                        </h2>
                        <p className="text-white/90 text-[18px] leading-relaxed font-serif mt-4 drop-shadow-sm h-[400]" style={{ fontFamily: "Merriweather, serif" }}>
                            {data.pitch}
                        </p>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-lg transition-transform transform active:scale-95 duration-200">
                            <Navigation className="w-4 h-4" />
                            <span className="font-semibold text-sm">Sway Now</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
