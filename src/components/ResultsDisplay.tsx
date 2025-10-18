"use client";

import React from "react";
import Image from "next/image";
import ProductCard, { Product } from "./ProductCard";

interface ResultsDisplayProps {
    originalImage: File;
    generatedClothingUrl: string;
    products: Product[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
    originalImage,
    generatedClothingUrl,
    products,
}) => {
    return (
        <div className="w-full p-8">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Your New Look</h2>
                <div className="relative w-[500px] h-[500px] mx-auto border border-gray-300 rounded-lg overflow-hidden">
                    <Image
                        src={URL.createObjectURL(originalImage)}
                        alt="Original user upload"
                        layout="fill"
                        objectFit="cover"
                    />
                    <Image
                        src={generatedClothingUrl}
                        alt="AI Generated Clothing"
                        layout="fill"
                        objectFit="contain"
                        className="z-10"
                    />
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Shop Similar Styles</h2>
                <div className="flex justify-center gap-8 flex-wrap">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
