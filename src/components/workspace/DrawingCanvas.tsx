"use client";

import React, { useRef, useEffect, useState } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import ButtonDown from "../../../public/templates/button-down.png";
import CroppedShirt from "../../../public/templates/cropped-shirt.png";
import Dress from "../../../public/templates/dress.png";
import Hoodie from "../../../public/templates/hoodie.png";
import Jacket from "../../../public/templates/jacket.png";
import Pants from "../../../public/templates/pants.png";
import Skirt from "../../../public/templates/skirt.png";
import Sneaker from "../../../public/templates/sneaker.png";
import TShirt from "../../../public/templates/t-shirt.png";
import TankTop from "../../../public/templates/tank.png";

interface DrawingCanvasProps {
    onGenerate: (drawingDataUrl: Blob | null) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onGenerate }) => {
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(10);

    const templates = [
        {
            name: "Button Down",
            img: ButtonDown,
        },
        {
            name: "Cropped Shirt",
            img: CroppedShirt,
        },
        {
            name: "Dress",
            img: Dress,
        },
        {
            name: "Hoodie",
            img: Hoodie,
        },
        {
            name: "Jacket",
            img: Jacket,
        },
        {
            name: "Pants",
            img: Pants,
        },
        {
            name: "Skirt",
            img: Skirt,
        },
        {
            name: "Sneaker",
            img: Sneaker,
        },
        {
            name: "T-Shirt",
            img: TShirt,
        },
        {
            name: "Tank Top",
            img: TankTop,
        },
        {
            name: "No Template",
            img: null,
        },
    ];
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

    useEffect(() => {
        const drawingCtx = drawingCanvasRef.current?.getContext("2d");
        if (selectedTemplate.img) {
            const img = new Image();
            img.src = selectedTemplate.img.src;
            img.onload = () => {
                if (drawingCanvasRef.current) {
                    const canvasWidth = 500;
                    const scale = canvasWidth / img.width;
                    const canvasHeight = img.height * scale;

                    drawingCanvasRef.current.width = canvasWidth;
                    drawingCanvasRef.current.height = canvasHeight;

                    drawingCtx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                }
            };
        } else {
            if (drawingCanvasRef.current) {
                const canvasWidth = 500;
                const canvasHeight = 500;

                drawingCanvasRef.current.width = canvasWidth;
                drawingCanvasRef.current.height = canvasHeight;
            }
        }
    }, [selectedTemplate]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const ctx = drawingCanvasRef.current?.getContext("2d");
        if (ctx) {
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const ctx = drawingCanvasRef.current?.getContext("2d");
        if (ctx) {
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            if (isErasing) {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = "#ffffff";
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = brushColor;
            }

            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        const ctx = drawingCanvasRef.current?.getContext("2d");
        if (ctx) {
            ctx.closePath();
            setIsDrawing(false);
        }
    };

    const handleGenerate = () => {
        drawingCanvasRef.current?.toBlob(onGenerate, "image/png");
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <Listbox value={selectedTemplate} onChange={setSelectedTemplate}>
                <div className="relative mt-2 p-2 min-w-[175px]">
                    <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-300/50 py-1.5 pr-2 pl-3 text-left outline-1 -outline-offset-1 outline-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 sm:text-sm/6">
                        <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                            <span className="block truncate">
                                {selectedTemplate.name}
                            </span>
                        </span>
                        <ChevronUpDownIcon
                            aria-hidden="true"
                            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-800 sm:size-4"
                        />
                    </ListboxButton>

                    <ListboxOptions
                        transition
                        className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-100 py-1 text-base outline-1 -outline-offset-1 outline-white/10 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                    >
                        {templates.map((template) => (
                            <ListboxOption
                                key={template.name}
                                value={template}
                                className="group relative cursor-default py-2 pr-9 pl-3 select-none data-focus:bg-indigo-500 data-focus:outline-hidden"
                            >
                                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                                    {template.name}
                                </span>

                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-400 group-not-data-selected:hidden group-data-focus:text-white">
                                    <CheckIcon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>

            <div className="w-[500px] h-[500px] border border-gray-300 rounded-lg overflow-hidden">
                <div className="relative w-full h-full">
                    <canvas
                        ref={drawingCanvasRef}
                        className="absolute top-0 left-0 w-full z-20 cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                </div>
            </div>
            <div className="flex gap-4 items-center p-2 bg-gray-100 rounded-lg">
                <div className="flex flex-col items-center">
                    <label htmlFor="brushColor" className="text-sm">
                        Color
                    </label>
                    <input
                        type="color"
                        id="brushColor"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                    />
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="brushSize" className="text-sm">
                        Size: {brushSize}
                    </label>
                    <input
                        type="range"
                        id="brushSize"
                        min="1"
                        max="50"
                        value={brushSize}
                        onChange={(e) =>
                            setBrushSize(parseInt(e.target.value, 10))
                        }
                    />
                </div>
                <button
                    onClick={() => setIsErasing(!isErasing)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        isErasing ? "bg-white-600 text-white" : "bg-gray-400 text-black"
                    }`}
                >
                <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.8698 2.66878L20.8384 7.6373C21.717 8.51598 21.717 9.9406 20.8384 10.8193L12.1566 19.4998L18.2544 19.5C18.6341 19.5 18.9479 19.7821 18.9976 20.1482L19.0044 20.25C19.0044 20.6297 18.7223 20.9435 18.3562 20.9931L18.2544 21L9.84443 21.0012C9.22822 21.0348 8.60082 20.8163 8.1301 20.3456L3.16157 15.377C2.28289 14.4984 2.28289 13.0737 3.16157 12.1951L12.6879 2.66878C13.5665 1.7901 14.9912 1.7901 15.8698 2.66878ZM5.70856 11.7678L4.22223 13.2557C3.92934 13.5486 3.92934 14.0235 4.22223 14.3164L9.19076 19.2849C9.33721 19.4314 9.52915 19.5046 9.72109 19.5046L9.74997 19.5L9.78846 19.5016C9.95737 19.4864 10.1221 19.4142 10.2514 19.2849L11.7376 17.7978L5.70856 11.7678ZM13.7485 3.72944L6.76956 10.7068L12.7986 16.7368L19.7777 9.75862C20.0706 9.46573 20.0706 8.99085 19.7777 8.69796L14.8092 3.72944C14.5163 3.43654 14.0414 3.43654 13.7485 3.72944Z" fill="#212121"/></svg>
                </button>
                <button
                    onClick={handleGenerate}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default DrawingCanvas;
