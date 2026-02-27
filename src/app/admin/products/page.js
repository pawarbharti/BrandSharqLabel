"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { productsApi } from "@/lib/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  images: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const loadProducts = async () => {
    const data = await productsApi.list();
    setProducts(data?.products || data?.data || data || []);
  };

  useEffect(() => {
    loadProducts().catch((err) => setError(err.message || "Failed to load products"));
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        categoryId: form.categoryId || undefined,
        images: form.images
          ? form.images.split(",").map((x) => x.trim()).filter(Boolean)
          : [],
      };

      if (isEditing) {
        await productsApi.update(editingId, payload);
        setSuccess("Product updated");
      } else {
        await productsApi.create(payload);
        setSuccess("Product created");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
    }
  };

  const onEdit = (product) => {
    setEditingId(product._id || product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      categoryId: product.categoryId || product.category?._id || "",
      images: Array.isArray(product.images) ? product.images.join(", ") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    try {
      await productsApi.remove(id);
      setSuccess("Product deleted");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <AdminGuard>
      <AdminShell title="Manage Products">
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {isEditing ? "Edit Product" : "Add Product"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                multiline
                minRows={2}
              />
              <TextField
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
              <TextField
                label="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                required
              />
              <TextField
                label="Category ID"
                value={form.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
              />
              <TextField
                label="Images (comma separated URLs)"
                value={form.images}
                onChange={(e) => updateField("images", e.target.value)}
              />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained">
                  {isEditing ? "Update Product" : "Create Product"}
                </Button>
                {isEditing ? (
                  <Button onClick={resetForm} variant="outlined">
                    Cancel
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Product List
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const id = product._id || product.id;
                return (
                  <TableRow key={id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock ?? "-"}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" onClick={() => onEdit(product)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => onDelete(id)}>
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </AdminShell>
    </AdminGuard>
  );
}
