// Product
export interface Product {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
    storeUrl: string;
}

export interface Project {
    id: number;
    name: string;
    imageUrl: string;
}

export interface ImageOnModel {
    url: string;

    /** Percentage (0-100) on model. Top-left. */
    x: number;

    /** Percentage (0-100) on model. Top-left. */
    y: number;

    /** Percentage (0-100) on model. */
    width: number;
}
