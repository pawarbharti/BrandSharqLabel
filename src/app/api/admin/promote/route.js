import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

export async function POST(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body?.userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const store = getStore();
  const user = store.usersById[body.userId];
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.role = "admin";
  return NextResponse.json({ user: { id: user.id, role: user.role } });
}
