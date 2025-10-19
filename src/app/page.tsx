"use client";

import HomePage from "@/components/HomePage";
import { useEffect } from "react";
import { hydrateFromIndexeddb } from "@/app/state/state";

export default function Main() {
    useEffect(() => {
        hydrateFromIndexeddb();
    }, []);

    return (
        <>
            <HomePage />
        </>
    );
}
