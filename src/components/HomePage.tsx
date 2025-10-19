import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import { useLocalState } from "@/app/state/state";

export default function HomePage() {
    return (
        <div
            className="flex min-h-screen flex-col bg-cover"
            style={{ backgroundImage: "url('/mural.png')" }}
        >
            <Header dark={true} />

            <main className="flex flex-grow flex-col items-center justify-center p-8">
                <Link href="/workspace" className="">
                    <button className="bg-[#1C1C1C] px-20 py-6 rounded-lg text-white flex justify-center items-center flex-col cursor-pointer hover:bg-gray-800 transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="size-6"
                            style={{ width: 60, height: 60 }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <h2>Create</h2>
                    </button>
                </Link>
            </main>
            <Footer />
        </div>
    );
}
