"use client";

import { useEffect } from "react";
import { hydrateFromIndexeddb } from "@/app/state/state";

export default function DataLoader() {
    useEffect(() => {
        hydrateFromIndexeddb();
    }, []);

    return null;
}
