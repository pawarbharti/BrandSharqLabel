import { NextResponse } from "next/server";
import { sanitizeUser, verifyEmailCode } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const user = verifyEmailCode({ email, code });
    return NextResponse.json({ user: sanitizeUser(user), verified: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Email verification failed" },
      { status: 400 }
    );
  }
}
