import { NextResponse } from "next/server";
import { getUserFromRequest, requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

export async function GET(_, { params }) {
  const store = getStore();
  const reviews = (store.reviews || []).filter((review) => String(review.productId) === String(params.id));
  return NextResponse.json({ reviews });
}

export async function DELETE(req, { params }) {
  const session = getUserFromRequest(req);
  const adminSession = requireAdmin(req);
  if (!session && !adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const index = (store.reviews || []).findIndex((review) => String(review.id) === String(params.id));
  if (index < 0) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const review = store.reviews[index];
  const canDelete = Boolean(adminSession) || String(review.userId) === String(session?.user?.id);
  if (!canDelete) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  store.reviews.splice(index, 1);
  return NextResponse.json({ ok: true });
}
