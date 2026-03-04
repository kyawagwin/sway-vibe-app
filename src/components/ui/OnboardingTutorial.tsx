"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, HandMetal, Sparkles, Navigation, Bookmark } from "lucide-react";
import { useState } from "react";

interface OnboardingTutorialProps {
    isOpen: boolean;
    onClose: () => void;
}

export function OnboardingTutorial({ isOpen, onClose }: OnboardingTutorialProps) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome to Sway",
            desc: "Discover places that match your exact vibe and weather. Let's show you around.",
            icon: <Sparkles className="w-12 h-12 text-yellow-300" />
        },
        {
            title: "Swipe to Navigate",
            desc: "Swipe RIGHT to stash a place in your Vault. Swipe LEFT to skip and see the next spot.",
            icon: <HandMetal className="w-12 h-12 text-blue-300" />
        },
        {
            title: "Your Vault",
            desc: "Tap the bookmark icon at the top to view all your saved vibes.",
            icon: <Bookmark className="w-12 h-12 text-green-400" />
        },
        {
            title: "Sway Now",
            desc: "When you're ready, tap 'Sway Now' to open maps, or use the Compass for an AR Zen Walk.",
            icon: <Navigation className="w-12 h-12 text-purple-400" />
        }
    ];

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1);
        else {
            setStep(0); // Reset for next time
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-white/10 border border-white/20 rounded-3xl p-6 text-white shadow-2xl flex flex-col items-center text-center overflow-hidden"
                    >
                        <button
                            onClick={() => {
                                setStep(0);
                                onClose();
                            }}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="my-8 flex justify-center items-center w-24 h-24 rounded-full bg-white/5 border border-white/10 shadow-inner">
                            {steps[step].icon}
                        </div>

                        <h3 className="text-2xl font-bold font-sans tracking-tight mb-3 drop-shadow-sm">
                            {steps[step].title}
                        </h3>

                        <p className="text-white/80 font-serif leading-relaxed mb-8">
                            {steps[step].desc}
                        </p>

                        <div className="flex items-center gap-2 mb-8">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextStep}
                            className="w-full py-3.5 bg-white text-slate-900 font-bold rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {step === steps.length - 1 ? "Let's Go" : "Next"}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
