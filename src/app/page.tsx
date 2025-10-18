"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImageUploader from "../components/ImageUploader";
import DrawingCanvas from "../components/DrawingCanvas";
import ResultsDisplay from "../components/ResultsDisplay";
import { Product } from "../components/ProductCard";

export default function Home() {
    const [userImage, setUserImage] = useState<File | null>(null);
    const [generatedClothing, setGeneratedClothing] = useState<
        { id: string; url: string }[]
    >([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = (file: File) => {
        setUserImage(file);
        setIsUploading(false);
    };

    const handleGenerate = async (drawingDataUrl: string) => {
        setIsLoading(true);
        setIsDrawing(false);

        try {
            const clothingResponse = await fetch("/api/generate-image", {
                method: "POST",
                body: JSON.stringify({ drawing: drawingDataUrl }),
            });
            const { generatedClothingUrl } = await clothingResponse.json();
            setGeneratedClothing((prev) => [
                ...prev,
                { id: Date.now().toString(), url: generatedClothingUrl },
            ]);

            const searchResponse = await fetch("/api/reverse-image-search", {
                method: "POST",
                body: JSON.stringify({ clothingImage: generatedClothingUrl }),
            });
            const { products } = await searchResponse.json();
            setProducts(products);
        } catch (error) {
            console.error("Failed to generate results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMainContent = () => {
        if (!userImage) {
            return <ImageUploader onImageUpload={handleImageUpload} />;
        }

        return (
            <div className="w-full">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setIsDrawing(true)}
                        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Draw New Clothing
                    </button>
                </div>
                <ResultsDisplay
                    originalImage={userImage}
                    generatedClothing={generatedClothing}
                    products={products}
                    onChangePhoto={() => setIsUploading(true)}
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
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="text-xl font-semibold text-white">
                            Generating your new look...
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
