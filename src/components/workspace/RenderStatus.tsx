import React, { useCallback, useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function RenderStatus({
    addItem,
    removeItem,
}: {
    addItem: React.RefObject<(() => void) | null>;
    removeItem: React.RefObject<(() => void) | null>;
}) {
    const [numItems, setNumItems] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((progress) => {
                const newP =
                    progress === 0
                        ? 0
                        : Math.min(
                              1,
                              progress *
                                  (1 + Math.random() * 0.05 * 100 ** -progress),
                          );
                console.log(progress, newP);
                return newP;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    addItem.current = useCallback(() => {
        setNumItems(numItems + 1);
        if (numItems === 0) {
            setProgress(0.1);
        } else {
            setProgress((progress) => progress / 2 + 0.001);
        }
    }, [numItems]);

    removeItem.current = useCallback(() => {
        setNumItems((numItems) => numItems - 1);
    }, []);

    if (numItems === 0) return null;

    return (
        <div className="fixed bottom-[25px] right-[50px]">
            <div
                className="max-w-xs relative bg-white border border-gray-200 rounded-xl shadow-lg"
                role="alert"
                tabIndex={-1}
                aria-labelledby="hs-toast-progress-label"
            >
                <div className="flex gap-x-3 p-4">
                    <div className="shrink-0">
                        <PhotoIcon />
                    </div>

                    <div className="grow me-5">
                        <h3
                            id="hs-toast-progress-label"
                            className="text-gray-800 font-medium text-sm"
                        >
                            Generating {numItems} images
                        </h3>

                        <div className="mt-2 flex flex-col gap-x-3">
                            <div
                                className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden"
                                role="progressbar"
                            >
                                <div
                                    className="absolute h-1 overflow-hidden text-xs text-white text-center whitespace-nowrap bg-neutral-200"
                                    style={{ width: `${progress * 100}%` }}
                                ></div>

                                <div
                                    className="absolute h-1 overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap z-10"
                                    style={{ width: `${progress * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
