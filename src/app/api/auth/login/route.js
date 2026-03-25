import { NextResponse } from "next/server";
import { createSession, loginUser, sanitizeUser, setSessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = loginUser({ email, password });
    const token = createSession(user.id);
    const response = NextResponse.json({ user: sanitizeUser(user) });
    return setSessionCookie(response, token);
  } catch (err) {
    const message = err.message || "Invalid request";
    const status = message === "Invalid email or password" || message.includes("verify your email") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
