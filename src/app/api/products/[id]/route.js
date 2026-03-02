import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

function normalizeVariant(variant, productId, index) {
  return {
    id: variant?.id || `${productId}_v${index + 1}`,
    size: String(variant?.size || "").toUpperCase() || "M",
    color: variant?.color || "Black",
    stock: Math.max(0, Number(variant?.stock || 0)),
    sku: variant?.sku || `${productId}-${index + 1}`,
  };
}

function getProduct(store, id) {
  return store.products.find((item) => String(item.id || item._id) === String(id));
}

export async function GET(_, { params }) {
  const store = getStore();
  const product = getProduct(store, params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(req, { params }) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const product = getProduct(store, params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const variants = Array.isArray(body.variants) && body.variants.length
    ? body.variants.map((variant, idx) => normalizeVariant(variant, product.id || product._id, idx))
    : Array.isArray(product.variants)
      ? product.variants
      : [];

  const stock = variants.length
    ? variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0)
    : Math.max(0, Number(body.stock ?? product.stock ?? 0));

  Object.assign(product, {
    name: body.name ?? product.name,
    description: body.description ?? product.description,
    price: body.price !== undefined ? Math.max(0, Number(body.price || 0)) : product.price,
    stock,
    category: body.category ?? product.category,
    categoryId: body.categoryId ?? product.categoryId,
    collection: body.collection ?? product.collection,
    images: Array.isArray(body.images) ? body.images.filter(Boolean) : product.images,
    image: Array.isArray(body.images) && body.images.length ? body.images[0] : (product.images?.[0] || product.image),
    isNew: body.isNew !== undefined ? Boolean(body.isNew) : product.isNew,
    isBestSeller: body.isBestSeller !== undefined ? Boolean(body.isBestSeller) : product.isBestSeller,
    soldCount: body.soldCount !== undefined ? Number(body.soldCount || 0) : product.soldCount,
    viewCount: body.viewCount !== undefined ? Number(body.viewCount || 0) : product.viewCount,
    addedToCartCount: body.addedToCartCount !== undefined ? Number(body.addedToCartCount || 0) : product.addedToCartCount,
    rating: body.rating !== undefined ? Number(body.rating || 0) : product.rating,
    reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount || 0) : product.reviewCount,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : product.isActive,
    variants,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ product });
}

export async function DELETE(req, { params }) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const idx = store.products.findIndex((item) => String(item.id || item._id) === String(params.id));
  if (idx < 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const [removed] = store.products.splice(idx, 1);
  return NextResponse.json({ product: removed });
}
