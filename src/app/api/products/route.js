import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

function nextProductId(store) {
  return `prod_${store.products.length + 1}_${Date.now()}`;
}

function normalizeVariant(variant, productId, index) {
  return {
    id: variant?.id || `${productId}_v${index + 1}`,
    size: String(variant?.size || "").toUpperCase() || "M",
    color: variant?.color || "Black",
    stock: Math.max(0, Number(variant?.stock || 0)),
    sku: variant?.sku || `${productId}-${index + 1}`,
  };
}

export async function GET(req) {
  const store = getStore();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const collection = searchParams.get("collection");

  const filtered = store.products.filter((product) => {
    const categoryOk = category ? String(product.category || "").toLowerCase() === String(category).toLowerCase() : true;
    const collectionOk = collection ? String(product.collection || "").toLowerCase() === String(collection).toLowerCase() : true;
    return categoryOk && collectionOk;
  });

  return NextResponse.json({ products: filtered });
}

export async function POST(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body?.name) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }

  const store = getStore();
  const id = nextProductId(store);
  const variants = Array.isArray(body.variants) && body.variants.length
    ? body.variants.map((variant, idx) => normalizeVariant(variant, id, idx))
    : [{ id: `${id}_v1`, size: "M", color: "Black", stock: Math.max(0, Number(body.stock || 0)), sku: `${id}-1` }];

  const stock = variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0);

  const product = {
    id,
    _id: id,
    name: body.name,
    description: body.description || "",
    price: Math.max(0, Number(body.price || 0)),
    stock,
    category: body.category || "general",
    categoryId: body.categoryId || "",
    collection: body.collection || "General",
    images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
    image: Array.isArray(body.images) && body.images.length ? body.images[0] : "/homepic.jpeg",
    isNew: Boolean(body.isNew),
    isBestSeller: Boolean(body.isBestSeller),
    soldCount: Number(body.soldCount || 0),
    viewCount: Number(body.viewCount || 0),
    addedToCartCount: Number(body.addedToCartCount || 0),
    rating: Number(body.rating || 0),
    reviewCount: Number(body.reviewCount || 0),
    isActive: body.isActive ?? true,
    variants,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.products.unshift(product);
  return NextResponse.json({ product }, { status: 201 });
}
