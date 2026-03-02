import { NextResponse } from "next/server";
import { getStore } from "@/lib/demoStore";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  const session = getUserFromRequest(req);
  if (session?.token) {
    const store = getStore();
    delete store.sessions[session.token];
  }
  return NextResponse.json({ ok: true });
}
