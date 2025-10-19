"use client";
import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocalState } from "../state/state";
import { useRouter } from "next/navigation";

function Auth() {
    const [tab, setTab] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const router = useRouter();

    const userId = useLocalState((s) => s.userId);

    const handleSignup = async () => {
        const res = await fetch("/api/auth/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Signup failed");

        //once the account is made, just log them in
        useLocalState.getState().setUserId(email);
        sessionStorage.setItem("userId", email);
        router.push("/");

        return data;
    };

    const handleLogin = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        useLocalState.getState().setUserId(data.email);
        sessionStorage.setItem("userId", data.email);
        router.push("/");

        if (!res.ok) {
            console.error("Login error response:", res.status, data);
            throw new Error(data?.error || "Login failed");
        }
        return data;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        try {
            const data =
                tab === "signup" ? await handleSignup() : await handleLogin();
            setMessage(
                data?.message ||
                    (tab === "signup"
                        ? "Account created"
                        : "Signed in successfully"),
            );
        } catch (err) {
            setMessage((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <main className="flex flex-grow items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-center">
                        Welcome
                    </h2>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Create an account or sign in to continue
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setTab("login")}
                            className={`py-2 rounded-md font-medium ${
                                tab === "login"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setTab("signup")}
                            className={`py-2 rounded-md font-medium ${
                                tab === "signup"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                        {tab === "signup" && (
                            <div>
                                <label className="block text-sm text-gray-600">
                                    Full name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                                    placeholder="Your name"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-gray-600">
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-md text-white font-semibold ${
                                loading
                                    ? "bg-indigo-300"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                            {loading
                                ? "Please wait..."
                                : tab === "login"
                                  ? "Sign in"
                                  : "Create account"}
                        </button>
                    </form>

                    {message && (
                        <div className="mt-4 text-center text-sm text-gray-700">
                            {message}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Auth;
