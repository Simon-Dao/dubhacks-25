"use client";

import React from "react";
import Image from "next/image";

export interface Product {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
    storeUrl: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white max-w-[220px]">
            <div className="w-full h-[200px] relative">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-md font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.price}</p>
                <a
                    href={product.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Buy Now
                </a>
            </div>
        </div>
    );
};

export default ProductCard;
