import { NextResponse } from "next/server";
import { getUserFromRequest, sanitizeUser } from "@/lib/auth";

export async function GET(req) {
  const session = getUserFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user: sanitizeUser(session.user) });
}
