// store.ts
"use client";

import { create } from "zustand";
import { IDBPDatabase, openDB } from "idb";

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
    dbPromise: Promise<IDBPDatabase>;

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
    dbPromise: (typeof window !== "undefined"
        ? openDB("main", 2, {
              upgrade(db) {
                  db.createObjectStore("main");
              },
          })
        : null)!,

    setUserId: (id) => set({ userId: id }),

    addItem: (item) =>
        set((state) => {
            (async () => {
                await (
                    await state.dbPromise
                ).put("main", [...state.items, item], "items");
            })();
            return { items: [...state.items, item] };
        }),

    removeItem: (id) =>
        set((state) => {
            const newItems = state.items.filter((i) => i.id !== id);
            (async () => {
                await (await state.dbPromise).put("main", newItems, "items");
            })();
            return { items: newItems };
        }),

    editItem: (item) =>
        set((state) => {
            const newItems = state.items.map((i) =>
                i.id === item.id ? item : i,
            );
            (async () => {
                await (await state.dbPromise).put("main", newItems, "items");
            })();
            return { items: newItems };
        }),

    addOutfit: (outfit) =>
        set((state) => {
            (async () => {
                await (
                    await state.dbPromise
                ).put("main", [...state.outfits, outfit], "outfits");
            })();
            return { outfits: [...state.outfits, outfit] };
        }),

    removeOutfit: (id) =>
        set((state) => {
            const newOutfits = state.outfits.filter((o) => o.id !== id);
            (async () => {
                await (
                    await state.dbPromise
                ).put("main", newOutfits, "outfits");
            })();
            return { outfits: newOutfits };
        }),

    editOutfit: (outfit) =>
        set((state) => {
            const newOutfits = state.outfits.map((o) =>
                o.id === outfit.id ? outfit : o,
            );
            (async () => {
                await (
                    await state.dbPromise
                ).put("main", newOutfits, "outfits");
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
    const db = (await useLocalState.getState().dbPromise)
        .transaction("main")
        .objectStore("main");

    const [items, outfits] = await Promise.all([
        db.get("items"),
        db.get("outfits"),
    ]);

    useLocalState.setState({ items: items ?? [], outfits: outfits ?? [] });
};
