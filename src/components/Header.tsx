"use client";

import React from "react";
import Image from "next/image";
import { HomeIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useLocalState } from "@/app/state/state";

type HeaderProps = {
    dark?: boolean;
};

const Header = (props: HeaderProps) => {
    const userId = useLocalState((state) => state.userId);

    return (
        <header
            className={
                (props.dark
                    ? "bg-[#1C1C1C] text-white"
                    : "bg-white text-gray-800") +
                " w-full p-4 shadow-md flex items-center justify-between"
            }
        >
            <h1 className="text-2xl font-semibold ">AI Clothing Stylist</h1>

            {userId == null ? (
                <Link href={"/auth"}>
                    <button className="bg-[#1C1C1C] px-3 py-2 rounded-lg text-white cursor-pointer">
                        Login
                    </button>
                </Link>
            ) : (
                <div className={props.dark ? "text-white" : ""}>
                    <Link href="/">
                        <button
                            className={
                                "p-2 rounded transition " +
                                (props.dark
                                    ? "hover:bg-gray-800"
                                    : "hover:bg-gray-100")
                            }
                            aria-label="Home"
                        >
                            <HomeIcon className="w-8 h-8" />
                        </button>
                    </Link>

                    <Link href={"/gallery"}>
                        <button
                            className={
                                "p-2 rounded transition " +
                                (props.dark
                                    ? "hover:bg-gray-800"
                                    : "hover:bg-gray-100")
                            }
                            aria-label="Gallery"
                        >
                            <PhotoIcon className="w-8 h-8" />
                        </button>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
