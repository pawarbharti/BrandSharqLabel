import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

export async function POST(req) {
  const session = getUserFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body?.productId || !body?.text) {
    return NextResponse.json({ error: "productId and text are required" }, { status: 400 });
  }

  const store = getStore();
  const review = {
    id: `rev_${Date.now()}`,
    productId: String(body.productId),
    userId: session.user.id,
    userName: body.name || session.user.name || "User",
    rating: Math.max(1, Math.min(5, Number(body.rating || 5))),
    text: body.text,
    status: "pending",
    isFeatured: false,
    isAbusive: false,
    createdAt: new Date().toISOString(),
  };
  store.reviews.push(review);

  return NextResponse.json({ review }, { status: 201 });
}
