import { NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json(
        { error: "Reset token and password are required" },
        { status: 400 }
      );
    }

    resetPasswordWithToken({ token, password });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to reset password" },
      { status: 400 }
    );
  }
}
