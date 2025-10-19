// store.ts
"use client";

import { create } from "zustand";

// Keep UUID for backward compatibility but prefer using plain string for ids
export type UUID = string;

export interface Item {
    id: string;
    name: string;
    imageSrc: string;
}

export interface Outfit {
    id: string;
    name: string;
    itemIds: string[];
    imageSrc: Blob;
}

interface StoreState {
    items: Item[];
    outfits: Outfit[];

    userId: string | null;
    setUserId: (id: string | null) => void;

    addItem: (item: Item) => void;
    removeItem: (id: string) => void;
    editItem: (item: Item) => void;

    addOutfit: (outfit: Outfit) => void;
    removeOutfit: (id: string) => void;
    editOutfit: (outfit: Outfit) => void;
}

export const useLocalState = create<StoreState>((set) => ({
    items: [],
    outfits: [],
    userId: null,

    setUserId: (id) => set({ userId: id }),

    addItem: (item) =>
        set((state) => ({
            items: [...state.items, item],
        })),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),

    editItem: (item) =>
        set((state) => ({
            items: state.items.map((i) => (i.id === item.id ? item : i)),
        })),

    addOutfit: (outfit) =>
        set((state) => ({
            outfits: [...state.outfits, outfit],
        })),

    removeOutfit: (id) =>
        set((state) => ({
            outfits: state.outfits.filter((o) => o.id !== id),
        })),

    editOutfit: (outfit) =>
        set((state) => ({
            outfits: state.outfits.map((o) =>
                o.id === outfit.id ? outfit : o,
            ),
        })),
}));

export const hydrateFromMongo = async () => {
    if (useLocalState.getState().userId === null) return;

    const [itemsRes, outfitsRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/outfits"),
    ]);
    const [items, outfits] = await Promise.all([
        itemsRes.json(),
        outfitsRes.json(),
    ]);
    useLocalState.setState({ items, outfits });
};
