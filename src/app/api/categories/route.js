import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/demoStore";

function toSlug(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const store = getStore();
  const categories = [...(store.categories || [])].sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
  return NextResponse.json({ categories });
}

export async function POST(req) {
  const session = requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body?.name) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const store = getStore();
  const slug = toSlug(body.slug || body.name);
  const id = `cat_${slug}_${Date.now()}`;
  const category = {
    id,
    _id: id,
    name: body.name,
    slug,
    description: body.description || "",
    image: body.image || "/homepic.jpeg",
    displayOrder: Number(body.displayOrder || store.categories.length + 1),
    isActive: body.isActive ?? true,
  };

  store.categories.push(category);
  return NextResponse.json({ category }, { status: 201 });
}
