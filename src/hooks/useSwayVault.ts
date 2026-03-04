import { useState, useEffect, useCallback } from "react";
import type { HeroCardData } from "@/components/ui/HeroCard";

const VAULT_STORAGE_KEY = "sway_vault_items";
const MAX_VAULT_SIZE = 50;

export function useSwayVault() {
    const [savedItems, setSavedItems] = useState<HeroCardData[]>([]);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [hasNewItem, setHasNewItem] = useState(false);

    // Load initial state purely on the client to avoid SSR hydration mismatches
    useEffect(() => {
        try {
            const stored = localStorage.getItem(VAULT_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setTimeout(() => setSavedItems(parsed), 0);
            }
        } catch (e) {
            console.error("Failed to parse vault items", e);
        }
    }, []);

    // Sync to local storage whenever items change
    useEffect(() => {
        localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(savedItems));
    }, [savedItems]);

    const saveItem = useCallback((item: HeroCardData) => {
        setSavedItems((prev) => {
            // Prevent duplicates
            if (prev.some((p) => p.id === item.id)) return prev;
            // Enforce soft cap
            const newVault = [item, ...prev].slice(0, MAX_VAULT_SIZE);
            return newVault;
        });
        setHasNewItem(true);
    }, []);

    const removeItem = useCallback((id: string) => {
        setSavedItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const toggleVault = useCallback(() => {
        setIsVaultOpen((prev) => !prev);
        if (!isVaultOpen) {
            setHasNewItem(false); // Clear notification dot when opening
        }
    }, [isVaultOpen]);

    const closeVault = useCallback(() => setIsVaultOpen(false), []);

    return {
        savedItems,
        saveItem,
        removeItem,
        isVaultOpen,
        toggleVault,
        closeVault,
        hasNewItem
    };
}
