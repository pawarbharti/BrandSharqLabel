import { NextResponse } from "next/server";
import { createSession, createUser, sanitizeUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = createUser({ name, email, password });
    const token = createSession(user.id);

    return NextResponse.json(
      { user: sanitizeUser(user), token },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Invalid request" },
      { status: 400 }
    );
  }
}
