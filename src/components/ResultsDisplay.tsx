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
        <div className="w-[90%] lg:w-[50%] p-2 lg:p-8 mx-auto">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Your New Look</h2>
                <div className="w-[80%] lg:w-[50%] flex flex-row mx-auto border border-gray-300 rounded-lg overflow-hidden">
                    <img
                        className="object-contain flex-1 min-w-0"
                        src={URL.createObjectURL(originalImage)}
                        alt="Original user upload"
                    />
                    <img
                        className="object-contain flex-1 min-w-0"
                        src={generatedClothingUrl}
                        alt="AI Generated Clothing"
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
