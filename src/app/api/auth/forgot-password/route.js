import { NextResponse } from "next/server";
import { issuePasswordResetToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const token = issuePasswordResetToken(email);
    const payload = {
      ok: true,
      message: "If this email exists, reset instructions have been sent.",
    };

    if (process.env.NODE_ENV !== "production" && token) {
      payload.demoResetToken = token;
    }

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to send reset instructions" },
      { status: 400 }
    );
  }
}
