"use client";

import HomePage from "@/components/HomePage";
import { useLocalState } from "./state/state";
import { useEffect } from "react";
import { hydrateFromMongo } from "./state/state";

export default function Main() {
    const userId = useLocalState((s) => s.userId);

    useEffect(() => {
        if (userId) hydrateFromMongo();
    }, [userId]); // runs only when userId becomes available

    useEffect(() => {
        if (!userId) {
            if (sessionStorage.getItem("userId")) {
                useLocalState
                    .getState()
                    .setUserId(localStorage.getItem("userId"));
            }
        }
    }, []);

    return (
        <>
            <HomePage />
        </>
    );
}
