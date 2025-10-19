// store.ts
"use client";

import { create } from "zustand";
import { openDB } from "idb";

// Keep UUID for backward compatibility but prefer using plain string for ids
export type UUID = string;

export interface Item {
    id: string;
    name: string;
    imageSrc: Blob;
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
        set((state) => {
            (async () => {
                const db = await openDB("main");
                await db.put("main", [...state.items, item], "items");
            })();
            return { items: [...state.items, item] };
        }),

    removeItem: (id) =>
        set((state) => {
            const newItems = state.items.filter((i) => i.id !== id);
            (async () => {
                const db = await openDB("main");
                await db.put("main", newItems, "items");
            })();
            return { items: newItems };
        }),

    editItem: (item) =>
        set((state) => {
            const newItems = state.items.map((i) =>
                i.id === item.id ? item : i,
            );
            (async () => {
                const db = await openDB("main");
                await db.put("main", newItems, "items");
            })();
            return { items: newItems };
        }),

    addOutfit: (outfit) =>
        set((state) => {
            (async () => {
                const db = await openDB("main");
                await db.put("main", [...state.outfits, outfit], "outfits");
            })();
            return { outfits: [...state.outfits, outfit] };
        }),

    removeOutfit: (id) =>
        set((state) => {
            const newOutfits = state.outfits.filter((o) => o.id !== id);
            (async () => {
                const db = await openDB("main");
                await db.put("main", newOutfits, "outfits");
            })();
            return { outfits: newOutfits };
        }),

    editOutfit: (outfit) =>
        set((state) => {
            const newOutfits = state.outfits.map((o) =>
                o.id === outfit.id ? outfit : o,
            );
            (async () => {
                const db = await openDB("main");
                await db.put("main", newOutfits, "outfits");
            })();
            return { outfits: newOutfits };
        }),
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

export const hydrateFromIndexeddb = async () => {
    const db = (
        await openDB("main", 2, {
            upgrade(db) {
                db.createObjectStore("main");
            },
        })
    )
        .transaction("main")
        .objectStore("main");

    const [items, outfits] = await Promise.all([
        db.get("items"),
        db.get("outfits"),
    ]);
    console.log(items, outfits);
    useLocalState.setState({ items: items ?? [], outfits: outfits ?? [] });
};
