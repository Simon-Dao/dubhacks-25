import { getDb } from "@/lib/mongo";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const db = await getDb("fashion-app");

  // Check if user already exists
  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  // Create new user (TODO: hash password for real app)
  const newUser = { name, email, password, items: [], outfits: []};
  const result = await db.collection("users").insertOne(newUser);

  return NextResponse.json({
    message: "User created successfully",
    userId: result.insertedId,
  });
}
