import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real application, you would perform a reverse image search.
    // For this stub, we'll return a mock list of products.
    const mockProducts = [
        {
            id: 1,
            name: "Classic White T-Shirt",
            price: "$25.00",
            imageUrl: "/product1.png", // Placeholder product image
            storeUrl: "#",
        },
        {
            id: 2,
            name: "Modern Fit Denim Jeans",
            price: "$79.99",
            imageUrl: "/product2.png", // Placeholder product image
            storeUrl: "#",
        },
        {
            id: 3,
            name: "Casual Blue Hoodie",
            price: "$45.50",
            imageUrl: "/product3.png", // Placeholder product image
            storeUrl: "#",
        },
    ];

    return NextResponse.json({ products: mockProducts });
}
