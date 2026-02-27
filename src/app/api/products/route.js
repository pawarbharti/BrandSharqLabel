import { NextResponse } from "next/server";
import { getStore } from "@/lib/demoStore";

export async function GET() {
  const store = getStore();
  return NextResponse.json({ products: store.products });
}
