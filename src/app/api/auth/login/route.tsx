import { getDb } from "@/lib/mongo";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password)
        return NextResponse.json(
            { error: "Missing email or password" },
            { status: 400 },
        );

    const db = await getDb("fashion-app");

    // find user by email
    const user = await db.collection("users").findOne({ email });
    if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    // check if the password matches (TODO: use hashed passwords)
    if (user.password !== password) {
        return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 },
        );
    }

    // avoid returning password
    // create a shallow copy without the password field
    const safeUser: Record<string, unknown> = { ...user };
    delete safeUser.password;
    return NextResponse.json(safeUser);
}
