import { ImageOnModel } from "@/lib/definitions";

export const renderToBlob = (
    originalImage: File,
    droppedClothing: ImageOnModel[],
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const originalImageUrl = URL.createObjectURL(originalImage);
        const img = new Image();

        img.onload = async () => {
            const canvas = new OffscreenCanvas(img.width, img.height);
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                return reject(new Error("Failed to get canvas context"));
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(originalImageUrl);

            // Render in-order, to show the same image
            // when cloths overlap.
            const droppedClothingImgs = (await Promise.all(
                droppedClothing.map(
                    (img) =>
                        new Promise((resolve, reject) => {
                            const clothingImg = new Image();
                            clothingImg.crossOrigin = "anonymous";

                            clothingImg.onload = () => {
                                resolve({ ...img, clothingImg });
                            };

                            clothingImg.onerror = () => {
                                reject(
                                    new Error("Failed to load clothing image"),
                                );
                            };

                            clothingImg.src = img.url;
                        }),
                ),
            )) as (ImageOnModel & { clothingImg: HTMLImageElement })[];

            for (const clothing of droppedClothingImgs) {
                const x = (clothing.x / 100) * canvas.width;
                const y = (clothing.y / 100) * canvas.height;
                const width = (clothing.width / 100) * canvas.width;
                const height =
                    (width / clothing.clothingImg.width) *
                    clothing.clothingImg.height;
                ctx.drawImage(clothing.clothingImg, x, y, width, height);
            }

            canvas
                .convertToBlob({
                    type: "image/png",
                })
                .then(resolve)
                .catch(reject);
        };

        img.onerror = () => {
            reject(new Error("Failed to load original image"));
        };

        img.src = originalImageUrl;
    });
};
