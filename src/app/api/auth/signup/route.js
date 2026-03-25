import { NextResponse } from "next/server";
import { createUser, sanitizeUser } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = createUser({ name, email, password, phone });
    const store = getStore();
    const verificationCode = store.verificationCodesByEmail[user.email] || "";

    return NextResponse.json({ user: sanitizeUser(user), verificationCode }, { status: 201 });
  } catch (err) {
    const message = err.message || "Invalid request";
    const status = message === "User already exists" ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
