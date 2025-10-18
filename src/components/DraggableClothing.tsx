"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

import Image from "next/image";

interface DraggableClothingProps {
    id: string;
    url: string;
}

const DraggableClothing: React.FC<DraggableClothingProps> = ({ id, url }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: id,
        data: { url },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="cursor-move border border-gray-300 rounded-lg overflow-hidden"
        >
            <Image
                src={url}
                alt="Generated clothing"
                width={150}
                height={150}
                className="w-full h-auto"
            />
        </div>
    );
};

export default DraggableClothing;
