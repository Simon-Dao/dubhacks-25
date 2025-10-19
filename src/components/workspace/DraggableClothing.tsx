"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

import Image from "next/image";
import { useLocalState } from "@/app/state/state";

interface DraggableClothingProps {
    id: string;
    url: string;
}

const DraggableClothing: React.FC<DraggableClothingProps> = ({ id, url }) => {
    const [saved, setSaved] = React.useState(false);

    const { attributes, listeners, setNodeRef } = useDraggable({
        id: id,
        data: { url },
    });

    async function onclick() {}

    return (
        <div>
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

            {/*<button
                className={
                    saved
                        ? "bg-green-600 "
                        : "bg-blue-600" +
                          " cursor-pointer p-1 mt-1 rounded-sm text-white"
                }
                onClick={onclick}
            >
                {saved ? "saved" : "save"}
            </button>*/}
        </div>
    );
};

export default DraggableClothing;
