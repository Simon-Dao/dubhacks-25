"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImageUploader from "../components/ImageUploader";
import DrawingCanvas from "../components/DrawingCanvas";
import ResultsDisplay from "../components/ResultsDisplay";
import { Product } from "../components/ProductCard";

type AppState = "UPLOAD" | "DRAW" | "RESULTS";

export default function Home() {
    const [appState, setAppState] = useState<AppState>("UPLOAD");
    const [userImage, setUserImage] = useState<File | null>(null);
    const [generatedClothing, setGeneratedClothing] = useState<string | null>(
        null,
    );
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = (file: File) => {
        setUserImage(file);
        setAppState("DRAW");
    };

    const handleGenerate = async (drawingDataUrl: string) => {
        if (!userImage) return;

        setIsLoading(true);

        try {
            const clothingResponse = await fetch("/api/generate-clothing", {
                method: "POST",
                body: JSON.stringify({ drawing: drawingDataUrl }),
            });
            const { generatedClothingUrl } = await clothingResponse.json();
            setGeneratedClothing(generatedClothingUrl);

            const searchResponse = await fetch("/api/reverse-image-search", {
                method: "POST",
                body: JSON.stringify({ clothingImage: generatedClothingUrl }),
            });
            const { products } = await searchResponse.json();
            setProducts(products);

            setAppState("RESULTS");
        } catch (error) {
            console.error("Failed to generate results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-xl font-semibold text-gray-600">
                    Generating your new look...
                </div>
            );
        }

        switch (appState) {
            case "UPLOAD":
                return <ImageUploader onImageUpload={handleImageUpload} />;
            case "DRAW":
                return (
                    userImage && (
                        <DrawingCanvas
                            imageFile={userImage}
                            onGenerate={handleGenerate}
                        />
                    )
                );
            case "RESULTS":
                return (
                    userImage &&
                    generatedClothing && (
                        <ResultsDisplay
                            originalImage={userImage}
                            generatedClothingUrl={generatedClothing}
                            products={products}
                        />
                    )
                );
            default:
                return <ImageUploader onImageUpload={handleImageUpload} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow flex flex-col justify-center items-center p-8">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
}
