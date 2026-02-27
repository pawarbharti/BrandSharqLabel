import { NextResponse } from "next/server";
import { getUserFromRequest, sanitizeUser } from "@/lib/auth";
import { ensureUserCollections, getStore } from "@/lib/demoStore";

export async function GET(req) {
  const session = getUserFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  ensureUserCollections(session.user.id);
  const store = getStore();

  return NextResponse.json({
    user: sanitizeUser(session.user),
    orders: store.ordersByUser[session.user.id] || [],
  });
}
