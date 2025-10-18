"use client";

import React, { useCallback, useRef, useState } from "react";

import ProductCard, { Product } from "./ProductCard";
import {
    DndContext,
    useDroppable,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";

import DraggableClothing from "./DraggableClothing";
import Image from "next/image";

interface ResultsDisplayProps {
    originalImage: File;
    generatedClothing: { id: string; url: string }[];
    products: Product[];
    onChangePhoto: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
    originalImage,
    generatedClothing,
    products,
    onChangePhoto,
}) => {
    const [droppedClothing, setDroppedClothing] = useState<
        { url: string; x: number; y: number }[]
    >([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const activeClothing = activeId
        ? generatedClothing.find((item) => item.id === activeId)
        : null;

    const mainImageRef = useRef<HTMLDivElement>(null);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id.toString());
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta } = event;

        if (
            active?.rect?.current?.translated &&
            over &&
            over.id === "main-image" &&
            mainImageRef.current
        ) {
            const droppableRect = mainImageRef.current.getBoundingClientRect();
            const clothingUrl = active.data.current?.url;

            if (clothingUrl) {
                const x =
                    ((active.rect.current.translated.left -
                        droppableRect.left) /
                        droppableRect.width) *
                    100;
                const y =
                    ((active.rect.current.translated.top - droppableRect.top) /
                        droppableRect.height) *
                    100;

                if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
                    setDroppedClothing((prev) => [
                        ...prev,
                        { url: clothingUrl, x, y },
                    ]);
                }
            }
        }

        setActiveId(null);
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="w-full p-2 lg:p-8 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <MainImage
                        mainImageRef={mainImageRef}
                        originalImage={originalImage}
                        droppedClothing={droppedClothing}
                        onChangePhoto={onChangePhoto}
                    />
                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            Generated Clothing
                        </h2>
                        <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                            {generatedClothing.map((item) => (
                                <DraggableClothing
                                    key={item.id}
                                    id={item.id}
                                    url={item.url}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Shop Similar Styles
                    </h2>
                    <div className="flex justify-center gap-8 flex-wrap">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
            <DragOverlay>
                {activeId ? (
                    <DraggableClothing
                        id={activeId}
                        url={activeClothing?.url ?? ""}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

function MainImage(props: {
    originalImage: File;
    droppedClothing: { url: string; x: number; y: number }[];
    onChangePhoto: () => void;
    mainImageRef: React.RefObject<HTMLDivElement | null>;
}) {
    const { setNodeRef } = useDroppable({
        id: "main-image",
    });

    const setNodeRefWrapped = useCallback(
        (ref: HTMLDivElement | null) => {
            setNodeRef(ref);
            props.mainImageRef.current = ref;
        },
        [setNodeRef, props.mainImageRef],
    );

    return (
        <div
            className="lg:col-span-2 p-4 bg-gray-50 shadow-xl rounded-xl"
            ref={setNodeRefWrapped}
        >
            <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                <Image
                    className="w-full h-auto object-contain"
                    src={
                        props.originalImage
                            ? URL.createObjectURL(props.originalImage)
                            : "https://placehold.co/800x800/e0e0e0/000000?text=Upload+Base+Image"
                    }
                    alt="Original user upload"
                    width={800}
                    height={800}
                />

                {props.droppedClothing &&
                    props.droppedClothing.map((clothing, index) => (
                        <Image
                            key={index}
                            src={clothing.url}
                            alt="Dropped clothing"
                            className="absolute object-contain pointer-events-none"
                            style={{
                                left: `${clothing.x}%`,
                                top: `${clothing.y}%`,
                                width: "20%",
                                height: "auto",
                            }}
                            width={150}
                            height={150}
                        />
                    ))}
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={props.onChangePhoto}
                    className="w-full max-w-xs px-4 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors active:scale-[0.98]"
                >
                    Change Base Photo
                </button>
            </div>
        </div>
    );
}

export default ResultsDisplay;
