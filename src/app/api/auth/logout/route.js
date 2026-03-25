import { NextResponse } from "next/server";
import { clearSession, clearSessionCookie, getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  const session = getUserFromRequest(req);
  if (session?.token) {
    clearSession(session.token);
  }
  const response = NextResponse.json({ ok: true });
  return clearSessionCookie(response);
}
