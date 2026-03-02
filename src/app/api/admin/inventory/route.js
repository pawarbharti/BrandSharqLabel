import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

export async function GET(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const rows = (store.products || []).flatMap((product) => {
    const variants = Array.isArray(product.variants) ? product.variants : [];
    return variants.map((variant) => ({
      id: variant.id,
      productId: product.id || product._id,
      productName: product.name,
      category: product.category || "",
      collection: product.collection || "",
      size: variant.size || "",
      color: variant.color || "",
      sku: variant.sku || "",
      stock: Number(variant.stock || 0),
    }));
  });

  return NextResponse.json({ inventory: rows });
}

export async function PUT(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body?.variantId) {
    return NextResponse.json({ error: "variantId is required" }, { status: 400 });
  }

  const store = getStore();
  const product = (store.products || []).find((item) =>
    (item.variants || []).some((variant) => String(variant.id) === String(body.variantId))
  );
  if (!product) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });
  }

  const variant = (product.variants || []).find((item) => String(item.id) === String(body.variantId));
  variant.stock = Math.max(0, Number(body.stock || 0));
  product.stock = (product.variants || []).reduce((sum, item) => sum + Number(item.stock || 0), 0);
  product.updatedAt = new Date().toISOString();

  return NextResponse.json({ product, variant });
}
