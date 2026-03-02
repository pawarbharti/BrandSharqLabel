import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { computeDashboardStats } from "@/lib/adminMetrics";

export async function GET(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = computeDashboardStats();
  return NextResponse.json({ stats });
}
