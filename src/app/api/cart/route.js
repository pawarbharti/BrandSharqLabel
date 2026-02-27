import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { ensureUserCollections, getStore } from "@/lib/demoStore";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req) {
  const session = getUserFromRequest(req);
  if (!session) return unauthorized();

  ensureUserCollections(session.user.id);
  const store = getStore();
  return NextResponse.json({ cart: store.cartByUser[session.user.id] || [] });
}

export async function POST(req) {
  const session = getUserFromRequest(req);
  if (!session) return unauthorized();

  const body = await req.json().catch(() => ({}));
  if (!body?.product?.id) {
    return NextResponse.json({ error: "Product is required" }, { status: 400 });
  }

  ensureUserCollections(session.user.id);
  const store = getStore();
  const cart = store.cartByUser[session.user.id];

  const existing = cart.find((item) => item.id === body.product.id);
  if (existing) {
    existing.quantity += body.quantity || 1;
  } else {
    cart.push({
      id: body.product.id,
      name: body.product.name,
      price: body.product.price,
      image: body.product.image,
      quantity: body.quantity || 1,
    });
  }

  return NextResponse.json({ cart });
}

export async function DELETE(req) {
  const session = getUserFromRequest(req);
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Item id is required" }, { status: 400 });
  }

  ensureUserCollections(session.user.id);
  const store = getStore();
  store.cartByUser[session.user.id] = store.cartByUser[session.user.id].filter(
    (item) => String(item.id) !== String(id)
  );

  return NextResponse.json({ cart: store.cartByUser[session.user.id] });
}
