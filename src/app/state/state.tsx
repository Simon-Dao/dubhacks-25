// store.ts
"use client";

import { create } from "zustand";

export type UUID = string;

export interface Item {
  id: UUID;
  name: string;
  imageSrc: Blob;
}

export interface Outfit {
  id: UUID;
  name: string;
  items: Item[];
  modelImageSrc: Blob;
}

interface StoreState {
  items: Item[];
  outfits: Outfit[];

  addItem: (item: Item) => void;
  removeItem: (id: UUID) => void;
  editItem: (item: Item) => void;

  addOutfit: (outfit: Outfit) => void;
  removeOutfit: (id: UUID) => void;
  editOutfit: (outfit: Outfit) => void;
}

export const useLocalState = create<StoreState>((set) => ({
  items: [],
  outfits: [],

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
      outfits: state.outfits.map((o) => (o.id === outfit.id ? outfit : o)),
    })),
}));
