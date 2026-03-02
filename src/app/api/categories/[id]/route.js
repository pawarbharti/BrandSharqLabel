import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

function getCategory(store, id) {
  return store.categories.find((item) => String(item.id || item._id) === String(id));
}

export async function PUT(req, { params }) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const category = getCategory(store, params.id);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  Object.assign(category, {
    name: body.name ?? category.name,
    slug: body.slug ?? category.slug,
    description: body.description ?? category.description,
    image: body.image ?? category.image,
    displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : category.displayOrder,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : category.isActive,
  });

  return NextResponse.json({ category });
}

export async function DELETE(req, { params }) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  const idx = store.categories.findIndex((item) => String(item.id || item._id) === String(params.id));
  if (idx < 0) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const [removed] = store.categories.splice(idx, 1);
  return NextResponse.json({ category: removed });
}
