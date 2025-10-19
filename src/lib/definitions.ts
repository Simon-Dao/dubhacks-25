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

export interface InlineImage {
  link: string;
  source: string;
  thumbnail: string;
  title: string;
}

export interface SerpApiResponse {
  inline_images?: InlineImage[];
  [key: string]: any;
}