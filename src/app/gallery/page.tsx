"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type Tab = "outfits" | "items";
type Selection =
    | { type: "outfit"; value: string }
    | { type: "item"; value: string }
    | null;

// Presentational subcomponents
const Outfit: React.FC<{
    src: string;
    outfit: string;
    onClick: () => void;
}> = ({ outfit, src, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative cursor-pointer rounded-xl border overflow-hidden w-[250px] h-[250px] m-2 bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900/40"
            aria-label={`Open outfit ${outfit}`}
        >
            <Image
                src={src}
                alt={outfit}
                width={250}
                height={250}
                className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-sm p-2 flex items-center justify-center">
                <span className="truncate px-2">{outfit}</span>
            </div>
        </button>
    );
};

const Item: React.FC<{ src: string; item: string; onClick: () => void }> = ({
    src,
    item,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative cursor-pointer rounded-xl border overflow-hidden w-[250px] h-[250px] m-2 bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900/40"
            aria-label={`Open item ${item}`}
        >
            <Image
                src={src}
                alt={item}
                width={250}
                height={250}
                className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-sm p-2 flex items-center justify-center">
                <span className="truncate px-2">{item}</span>
            </div>
        </button>
    );
};

// Lightweight modal
const Modal: React.FC<{
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}> = ({ open, title, children, onClose }) => {
    // close on Esc
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* panel */}
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="ml-3 inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/40"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <div className="mt-4 text-sm text-gray-700">{children}</div>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">
                        Buy Outfit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Gallery() {
    // temp data — keep as empty by default; populate from props or API later
    const [outfits] = useState<string[]>([
        "/mock-data/model (1).png",
        "/mock-data/model (4).png",
    ]);
    const [items] = useState<string[]>([
        "/mock-data/item1.png",
        "/mock-data/item2.png",
    ]);
    const [currentTab, setCurrentTab] = useState<Tab>("outfits");

    const [selection, setSelection] = useState<Selection>(null);

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
                                  <Outfit
                                      src={outfit}
                                      outfit={outfit}
                                      onClick={() =>
                                          setSelection({
                                              type: "outfit",
                                              value: outfit,
                                          })
                                      }
                                  />
                              </li>
                          ))
                        : items.map((item, index) => (
                              <li key={`item-${index}`}>
                                  <Item
                                      src={item}
                                      item={item}
                                      onClick={() =>
                                          setSelection({
                                              type: "item",
                                              value: item,
                                          })
                                      }
                                  />
                              </li>
                          ))}
                </ul>

                {/* Empty states */}
                {currentTab === "outfits" && outfits.length === 0 && (
                    <p className="mt-6 text-sm text-gray-500">
                        No outfits yet.
                    </p>
                )}
                {currentTab === "items" && items.length === 0 && (
                    <p className="mt-6 text-sm text-gray-500">No items yet.</p>
                )}
            </main>

            <Footer />

            {/* Modal */}
            <Modal
                open={!!selection}
                title={
                    selection
                        ? selection.type === "outfit"
                            ? "Outfit"
                            : "Item"
                        : "Details"
                }
                onClose={() => setSelection(null)}
            >
                {selection && (
                    <div className="space-y-3">
                        <p>
                            <span className="font-medium">Type:</span>{" "}
                            {selection.type}
                        </p>
                        <p>
                            <span className="font-medium">Value:</span>{" "}
                            {selection.value}
                        </p>

                        {/* example actions you can wire up later */}
                        <div className="mt-4 flex gap-2">
                            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                                View details
                            </button>
                            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                                Edit
                            </button>
                            <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
