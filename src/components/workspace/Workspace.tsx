"use client";

import React, { useRef, useState } from "react";
import { ImageOnModel } from "@/lib/definitions";
import ImageUploader from "@/components/ImageUploader";
import ResultsDisplay from "@/components/workspace/ResultsDisplay";
import Header from "@/components/Header";
import DrawingCanvas from "@/components/workspace/DrawingCanvas";
import Footer from "@/components/Footer";
import RenderStatus from "@/components/workspace/RenderStatus";

export default function Workspace() {
    const [userImage, setUserImage] = useState<File | null>(null);
    const [generatedClothing, setGeneratedClothing] = useState<
        { id: string; url: string; blob: Blob }[]
    >([]);
    const [droppedClothing, setDroppedClothing] = useState<ImageOnModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const addRenderItem = useRef<() => void>(null);
    const removeRenderItem = useRef<() => void>(null);

    const handleImageUpload = (file: File) => {
        setUserImage(file);
        setIsUploading(false);
    };

    const handleGenerate = async (drawingBlob: Blob | null) => {
        if (isLoading) return;
        setIsLoading(true);
        setIsDrawing(false);
        addRenderItem.current!();

        try {
            const generateClothingFormData = new FormData();
            generateClothingFormData.append(
                "image",
                new File([drawingBlob!], "drawing.png", { type: "image/png" }),
            );
            generateClothingFormData.append(
                "prompt",
                "Turn this sketch of a piece of clothing into a realistic image, smoothing out any scribbles into solid background colors, no background.",
            );

            const clothingResponse = await fetch("/api/generate-image", {
                method: "POST",
                body: generateClothingFormData,
            });

            if (!clothingResponse.ok) {
                const data = await clothingResponse.json().catch(() => ({}));
                throw new Error(
                    data.error || `HTTP ${clothingResponse.status}`,
                );
            }

            const blob = await clothingResponse.blob();

            setGeneratedClothing((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    url: URL.createObjectURL(blob),
                    blob,
                },
            ]);
        } catch (error) {
            console.error("Failed to generate results:", error);
        } finally {
            setIsLoading(false);
            removeRenderItem.current!();
        }
    };

    const renderMainContent = () => {
        if (!userImage) {
            return <ImageUploader onImageUpload={handleImageUpload} />;
        }

        return (
            <div className="w-full">
                <ResultsDisplay
                    originalImage={userImage}
                    generatedClothing={generatedClothing}
                    droppedClothing={droppedClothing}
                    setDroppedClothing={setDroppedClothing}
                    onChangePhoto={() => setIsUploading(true)}
                    openDrawingPanel={() => setIsDrawing(true)}
                    addRenderItem={addRenderItem}
                    removeRenderItem={removeRenderItem}
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow flex flex-col justify-center items-center p-8">
                {isDrawing ? (
                    <DrawingCanvas onGenerate={handleGenerate} />
                ) : (
                    renderMainContent()
                )}
                {isUploading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg">
                            <ImageUploader onImageUpload={handleImageUpload} />
                        </div>
                    </div>
                )}
            </main>
            <Footer />

            <RenderStatus
                addItem={addRenderItem}
                removeItem={removeRenderItem}
            />
        </div>
    );
}
