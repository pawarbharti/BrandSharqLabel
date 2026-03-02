import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

export async function PUT(req, { params }) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const store = getStore();
  const review = (store.reviews || []).find((item) => String(item.id) === String(params.id));
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (body.action === "approve") {
    review.status = "approved";
  } else if (body.action === "hide_abusive") {
    review.status = "hidden";
    review.isAbusive = true;
  } else if (body.action === "feature") {
    review.isFeatured = body.value !== undefined ? Boolean(body.value) : true;
    if (review.status === "pending") review.status = "approved";
  } else {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  return NextResponse.json({ review });
}

export async function DELETE(req, { params }) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const idx = (store.reviews || []).findIndex((item) => String(item.id) === String(params.id));
  if (idx < 0) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  store.reviews.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
