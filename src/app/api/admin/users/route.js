import { NextResponse } from "next/server";
import { requireAdmin, sanitizeUser } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

export async function GET(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const users = Object.values(store.usersById || {}).map((user) => ({
    ...sanitizeUser(user),
    orders: store.ordersByUser[user.id] || [],
    ordersCount: (store.ordersByUser[user.id] || []).length,
  }));
  return NextResponse.json({ users });
}
