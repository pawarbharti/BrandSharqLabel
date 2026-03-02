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
  const user = store.usersById[params.id];
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (body.action === "block") {
    user.isBlocked = body.value !== undefined ? Boolean(body.value) : true;
  } else if (body.action === "reset_password") {
    user.password = body.newPassword || "password123";
  } else if (body.action === "set_role") {
    user.role = body.role || user.role || "user";
  } else {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      role: user.role || "user",
      isBlocked: Boolean(user.isBlocked),
    },
  });
}
