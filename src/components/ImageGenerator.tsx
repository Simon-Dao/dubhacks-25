"use client";

import React, { useState } from "react";

const ImageGenerator: React.FC = () => {
    const [text, setText] = useState<string>("");
    const [imageSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const onSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        if (!text.trim()) return;

        setLoading(true);
        setError("");
        setImgSrc(null);

        try {
            const res = await fetch("/api/generate-image", {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${res.status}`);
            }

            const blob = await res.blob();
            setImgSrc(URL.createObjectURL(blob));
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Failed to generate image",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <label>
                Image
                <input
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg"
                    required
                />
            </label>

            <textarea
                onChange={(e) => setText(e.target.value)}
                name="prompt"
                id="text-area"
                value={text}
                placeholder="Describe your image..."
                rows={5}
                style={{ padding: 8, borderRadius: 6 }}
            />

            <button
                type="submit"
                className="bg-green-400"
                disabled={loading || !text.trim()}
                style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    cursor: loading || !text.trim() ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Generating..." : "Generate"}
            </button>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="Generated"
                    style={{ width: "100%", borderRadius: 12 }}
                />
            )}
        </form>
    );
};

export default ImageGenerator;
