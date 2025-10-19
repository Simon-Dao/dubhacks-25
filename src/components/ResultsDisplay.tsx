"use client";

import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useRef,
    useState,
} from "react";

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
import { ImageOnModel } from "@/lib/definitions";
import { renderToBlob } from "@/lib/imageRenderer";
import RenderedImageModal from "@/components/RenderedImageModal";

interface ResultsDisplayProps {
    originalImage: File;
    generatedClothing: { id: string; url: string; blob: Blob }[];
    products: Product[];
    droppedClothing: ImageOnModel[];
    setDroppedClothing: Dispatch<SetStateAction<ImageOnModel[]>>;
    onChangePhoto: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
    originalImage,
    generatedClothing,
    products,
    droppedClothing,
    setDroppedClothing,
    onChangePhoto,
}) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const activeClothing = activeId
        ? generatedClothing.find((item) => item.id === activeId)
        : null;

    const mainImageRef = useRef<HTMLDivElement>(null);

    const [isRendering, setIsRendering] = useState(false);

    const [renderedImage, setRenderedImage] = useState<string | null>(null);
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);

    const handleRender = async () => {
        if (isRendering) return;
        setIsRendering(true);

        try {
            const renderFormData = new FormData();

            renderFormData.append(
                "image",
                new File([originalImage!], "model.png", { type: "image/png" }),
            );

            const renderedCanvas = await renderToBlob(
                originalImage,
                droppedClothing,
            );
            setRenderedImage(URL.createObjectURL(renderedCanvas));
            setImageModalOpen(true);
            renderFormData.append(
                "image",
                new File([renderedCanvas!], "model-with-clothing.png", {
                    type: "image/png",
                }),
            );

            renderFormData.append(
                "prompt",
                "Given the original image of the model and images of clothing pasted onto them, modify the original image to make the model look like they're realistically wearing that clothing.",
            );

            const clothingResponse = await fetch("/api/generate-image", {
                method: "POST",
                body: renderFormData,
            });

            if (!clothingResponse.ok) {
                const data = await clothingResponse.json().catch(() => ({}));
                throw new Error(
                    data.error || `HTTP ${clothingResponse.status}`,
                );
            }

            const blob = await clothingResponse.blob();
            const dataURL = URL.createObjectURL(blob);

            setRenderedImage(dataURL);
            setImageModalOpen(true);
        } catch (error) {
            console.error("Failed to generate results:", error);
        } finally {
            setIsRendering(false);
        }
    };

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id.toString());
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

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
                const width =
                    (active.rect.current.translated.width /
                        droppableRect.width) *
                    100;

                if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
                    setDroppedClothing((prev) => [
                        ...prev,
                        { url: clothingUrl, x, y, width },
                    ]);
                }
            }
        }

        setActiveId(null);
    }

    return (
        <>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="w-full p-2 lg:p-8 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <MainImage
                            mainImageRef={mainImageRef}
                            originalImage={originalImage}
                            droppedClothing={droppedClothing}
                            onChangePhoto={onChangePhoto}
                            onRenderPhoto={handleRender}
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
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
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

            {renderedImage != null && (
                <RenderedImageModal
                    open={imageModalOpen}
                    onClose={() => setImageModalOpen(false)}
                    imageURL={renderedImage}
                />
            )}
        </>
    );
};

function MainImage(props: {
    originalImage: File;
    droppedClothing: { url: string; x: number; y: number; width: number }[];
    onChangePhoto: () => void;
    onRenderPhoto: () => void;
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

    const mainImageRef = useRef<HTMLImageElement>(null);

    return (
        <div className="lg:col-span-2 p-4 bg-gray-50 shadow-xl rounded-xl">
            {/* This element needs to have the same size as the parent of the images, since it's used for dnd calculation. */}
            <div
                ref={setNodeRefWrapped}
                className="max-h-[70vh] mx-auto"
                style={{
                    ...(mainImageRef.current
                        ? {
                              aspectRatio: `${mainImageRef.current.naturalWidth}/${mainImageRef.current.naturalHeight}`,
                          }
                        : {}),
                }}
            >
                <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                    <img
                        ref={mainImageRef}
                        className="w-full h-[70vh] object-contain"
                        src={
                            props.originalImage
                                ? URL.createObjectURL(props.originalImage)
                                : "https://placehold.co/800x800/e0e0e0/000000?text=Upload+Base+Image"
                        }
                        alt="Original user upload"
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
                                    width: `${clothing.width}%`,
                                    height: "auto",
                                }}
                                width={150}
                                height={150}
                            />
                        ))}
                </div>
            </div>

            <div className="flex justify-around mt-4">
                <button
                    onClick={props.onChangePhoto}
                    className="w-min sm:w-full max-w-xs px-4 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors active:scale-[0.98]"
                >
                    Change Base Photo
                </button>

                <button
                    onClick={props.onRenderPhoto}
                    className="w-min sm:w-full max-w-xs px-4 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors active:scale-[0.98]"
                >
                    Render
                </button>
            </div>
        </div>
    );
}

export default ResultsDisplay;
