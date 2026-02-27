import { NextResponse } from "next/server";
import { createSession, loginUser, sanitizeUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = loginUser({ email, password });
    const token = createSession(user.id);

    return NextResponse.json({ user: sanitizeUser(user), token });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Invalid request" },
      { status: 400 }
    );
  }
}
