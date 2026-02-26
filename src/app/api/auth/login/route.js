import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // Demo: accept any credentials and return a fake token/user
    const user = { id: `user_${Date.now()}`, name: "Demo User", email };
    const token = `demo-token-${Date.now()}`;

    return NextResponse.json({ user, token });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
