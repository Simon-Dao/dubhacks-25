"use client"

import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Local component types
type Tab = "outfits" | "items";

// Presentational subcomponents
const Outfit: React.FC<{ outfit: string }> = ({ outfit }) => {
  return <div className="rounded-xl border p-10 m-2 bg-white shadow-sm">{outfit}</div>;
};

const Item: React.FC<{ item: string }> = ({ item }) => {
  return <div className="rounded-xl border p-3 bg-white shadow-sm">{item}</div>;
};

export default function Gallery() {
  // temp data — keep as empty by default; populate from props or API later
  const [outfits, setOutfits] = useState<string[]>(["a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a"]);
  const [items, setItems] = useState<string[]>(["b"]);

  const [currentTab, setCurrentTab] = useState<Tab>("outfits");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex flex-grow flex-col items-center p-8">
        {/* Tab selector */}
        <div className="mb-6 inline-flex rounded-2xl border bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setCurrentTab("outfits")}
            className={
              "px-4 py-2 rounded-xl text-sm font-medium transition " +
              (currentTab === "outfits"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100")
            }
            aria-selected={currentTab === "outfits"}
            role="tab"
          >
            Outfits
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab("items")}
            className={
              "px-4 py-2 rounded-xl text-sm font-medium transition " +
              (currentTab === "items"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100")
            }
            aria-selected={currentTab === "items"}
            role="tab"
          >
            Items
          </button>
        </div>

        {/* Content list */}
        <ul className="flex flex-wrap w-full max-w-[800px] overflow-x-scroll">
          {currentTab === "outfits"
            ? outfits.map((outfit, index) => (
                <li key={`outfit-${index}`}>
                  <Outfit outfit={outfit} />
                </li>
              ))
            : items.map((item, index) => (
                <li key={`item-${index}`}>
                  <Item item={item} />
                </li>
              ))}
        </ul>

        {/* Empty state */}
        {currentTab === "outfits" && outfits.length === 0 && (
          <p className="mt-6 text-sm text-gray-500">No outfits yet.</p>
        )}
        {currentTab === "items" && items.length === 0 && (
          <p className="mt-6 text-sm text-gray-500">No items yet.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}