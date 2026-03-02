import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAllOrders, getStore } from "@/lib/demoStore";

export async function GET(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const orders = getAllOrders().filter((order) =>
    status ? String(order.status || order.orderStatus || "").toLowerCase() === String(status).toLowerCase() : true
  );

  return NextResponse.json({ orders });
}

export async function POST(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "").toLowerCase();
  if (action !== "export") {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  const store = getStore();
  const allOrders = getAllOrders();
  store.metrics.lastUpdatedAt = new Date().toISOString();
  return NextResponse.json({
    exportedAt: store.metrics.lastUpdatedAt,
    count: allOrders.length,
    orders: allOrders,
  });
}
