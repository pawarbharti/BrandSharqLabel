"use client";

import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import ProductListTab from "@/components/admin/products/ProductListTab";
import { categoriesApi, productsApi } from "@/lib/api";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    const data = await productsApi.list({
      category: categoryFilter || undefined,
      collection: collectionFilter || undefined,
    });
    setProducts(data?.products || data?.data || data || []);
  };

  useEffect(() => {
    loadProducts().catch((err) =>
      setError(err.message || "Failed to load products"),
    );
  }, [categoryFilter, collectionFilter]);

  useEffect(() => {
    categoriesApi
      .list()
      .then((data) =>
        setCategories(data?.categories || data?.data || data || []),
      )
      .catch((err) => setError(err.message || "Failed to load categories"));
  }, []);

  const handleDelete = async (id) => {
    try {
      await productsApi.remove(id);
      setSuccess("Product deleted");
      setError("");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <AdminGuard>
      <AdminShell title="Products">
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        ) : null}

        <ProductListTab
          products={products}
          categories={categories}
          categoryFilter={categoryFilter}
          collectionFilter={collectionFilter}
          onCategoryFilterChange={setCategoryFilter}
          onCollectionFilterChange={setCollectionFilter}
          onAddProduct={() => router.push("/admin/products/new")}
          onEditProduct={(product) =>
            router.push(`/admin/products/${product._id || product.id}`)
          }
          onDeleteProduct={handleDelete}
        />
      </AdminShell>
    </AdminGuard>
  );
}
