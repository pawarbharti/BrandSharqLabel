import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

function locateOrder(store, id) {
  for (const [userId, orders] of Object.entries(store.ordersByUser || {})) {
    const index = (orders || []).findIndex((item) => String(item.id || item._id) === String(id));
    if (index >= 0) {
      return { userId, index, order: orders[index] };
    }
  }
  return null;
}

export async function GET(req, { params }) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const found = locateOrder(store, params.id);
  if (!found) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: found.order });
}

export async function PUT(req, { params }) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const found = locateOrder(store, params.id);
  if (!found) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "update").toLowerCase();

  if (action === "mark_shipped") {
    found.order.status = "Shipped";
    found.order.orderStatus = "Shipped";
    found.order.trackingId = body.trackingId || found.order.trackingId || "";
  } else if (action === "refund") {
    found.order.status = "Refunded";
    found.order.orderStatus = "Refunded";
    found.order.isRefunded = true;
  } else if (action === "cancel") {
    found.order.status = "Cancelled";
    found.order.orderStatus = "Cancelled";
    found.order.isCancelled = true;
  } else if (action === "update_status") {
    const nextStatus = body.status || found.order.status || "Processing";
    found.order.status = nextStatus;
    found.order.orderStatus = nextStatus;
    if (body.trackingId) found.order.trackingId = body.trackingId;
  } else {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  found.order.updatedAt = new Date().toISOString();
  return NextResponse.json({ order: found.order });
}
