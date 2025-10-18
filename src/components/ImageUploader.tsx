"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                setPreview(URL.createObjectURL(file));
                onImageUpload(file);
            }
        },
        [onImageUpload],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".png", ".gif", ".bmp", ".webp"] },
        multiple: false,
    });

    return (
        <div className="w-full max-w-lg mx-auto my-8">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors duration-300 ease-in-out min-h-[200px] flex justify-center items-center bg-gray-50 ${isDragActive ? "border-blue-600" : "border-gray-300 hover:border-blue-500"}`}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <img
                        src={preview}
                        alt="Image preview"
                        className="max-w-full max-h-80 rounded-lg"
                    />
                ) : (
                    <p className="text-gray-500">
                        {isDragActive
                            ? "Drop the image here ..."
                            : "Drag 'n' drop an image here, or click to select one"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
