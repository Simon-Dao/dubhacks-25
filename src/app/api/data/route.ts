import { getDb } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const db = await getDb("fashion-app");
  const query = userId ? { userId } : {};
  const items = await db.collection("items").find(query).toArray();

  return NextResponse.json(items);
}
