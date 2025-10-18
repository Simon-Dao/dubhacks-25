"use client";

import React, { useRef, useEffect, useState } from "react";

interface DrawingCanvasProps {
    imageFile: File;
    onGenerate: (drawingDataUrl: string) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
    imageFile,
    onGenerate,
}) => {
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(10);

    useEffect(() => {
        const backgroundCtx = backgroundCanvasRef.current?.getContext("2d");
        const drawingCtx = drawingCanvasRef.current?.getContext("2d");
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = () => {
            if (backgroundCanvasRef.current && drawingCanvasRef.current) {
                const canvasWidth = 500;
                const scale = canvasWidth / img.width;
                const canvasHeight = img.height * scale;

                backgroundCanvasRef.current.width = canvasWidth;
                backgroundCanvasRef.current.height = canvasHeight;
                drawingCanvasRef.current.width = canvasWidth;
                drawingCanvasRef.current.height = canvasHeight;

                backgroundCtx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            }
        };
    }, [imageFile]);

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
        const drawingDataUrl = drawingCanvasRef.current?.toDataURL() || "";
        onGenerate(drawingDataUrl);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-[500px] h-[500px] border border-gray-300 rounded-lg overflow-hidden">
                <div className="relative w-full h-full">
                    <canvas
                        ref={backgroundCanvasRef}
                        className="absolute top-0 left-0 w-full z-10"
                    />
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
