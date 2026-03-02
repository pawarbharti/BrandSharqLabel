"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { categoriesApi, productsApi } from "@/lib/api";

ModuleRegistry.registerModules([AllCommunityModule]);

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  collection: "",
  isNew: false,
  isBestSeller: false,
  categoryId: "",
  images: "",
  variants: '[{"size":"M","color":"Black","stock":10}]',
};

export default function AdminProductsPage() {
  const gridRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkPriceDelta, setBulkPriceDelta] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const loadProducts = async () => {
    const data = await productsApi.list({
      category: categoryFilter || undefined,
      collection: collectionFilter || undefined,
    });
    setProducts(data?.products || data?.data || data || []);
  };

  useEffect(() => {
    loadProducts().catch((err) =>
      setError(err.message || "Failed to load products")
    );
  }, [categoryFilter, collectionFilter]);

  useEffect(() => {
    categoriesApi
      .list()
      .then((data) =>
        setCategories(data?.categories || data?.data || data || [])
      )
      .catch(() => setCategories([]));
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const computeStock = (variants) =>
    variants.reduce(
      (sum, variant) =>
        sum + Math.max(0, Number(variant.stock || 0)),
      0
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const parsedVariants = JSON.parse(form.variants || "[]");

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price || 0),
        stock: computeStock(parsedVariants),
        category: form.category || "general",
        collection: form.collection || "General",
        isNew: Boolean(form.isNew),
        isBestSeller: Boolean(form.isBestSeller),
        categoryId: form.categoryId || undefined,
        images: form.images
          ? form.images.split(",").map((x) => x.trim())
          : [],
        variants: parsedVariants,
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
      category: product.category || "",
      collection: product.collection || "",
      isNew: Boolean(product.isNew),
      isBestSeller: Boolean(product.isBestSeller),
      categoryId: product.categoryId || "",
      images: Array.isArray(product.images)
        ? product.images.join(", ")
        : "",
      variants: JSON.stringify(product.variants || []),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    await productsApi.remove(id);
    setSuccess("Product deleted");
    await loadProducts();
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1.6,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      { field: "category", headerName: "Category", flex: 1 },
      { field: "collection", headerName: "Collection", flex: 1 },
      {
        field: "price",
        headerName: "Price",
        width: 120,
        valueFormatter: (p) => `₹${p.value || 0}`,
      },
      { field: "stock", headerName: "Stock", width: 100 },
      {
        headerName: "Flags",
        flex: 1,
        valueGetter: ({ data }) =>
          `${data?.isNew ? "New " : ""}${
            data?.isBestSeller ? "BestSeller" : ""
          }`.trim() || "-",
      },
      {
        headerName: "Actions",
        width: 150,
        cellRenderer: (params) => {
          const id = params.data?._id || params.data?.id;
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  color: "#1976d2",
                }}
                onClick={() => onEdit(params.data)}
              >
                Edit
              </button>
              <button
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  color: "#d32f2f",
                }}
                onClick={() => onDelete(id)}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <AdminGuard>
      <AdminShell title="Manage Products">
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* FORM */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {isEditing ? "Edit Product" : "Add Product"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
              }}
            >
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />

              <TextField
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />

              <TextField
                label="Category"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                required
              />

              <TextField
                label="Collection"
                value={form.collection}
                onChange={(e) => updateField("collection", e.target.value)}
                required
              />

              <TextField
                label="Description"
                multiline
                minRows={2}
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                sx={{ gridColumn: "1 / -1" }}
              />

              <TextField
                label="Images (comma separated)"
                value={form.images}
                onChange={(e) =>
                  updateField("images", e.target.value)
                }
                sx={{ gridColumn: "1 / -1" }}
              />

              <TextField
                label="Variants JSON"
                value={form.variants}
                onChange={(e) =>
                  updateField("variants", e.target.value)
                }
                multiline
                minRows={4}
                sx={{ gridColumn: "1 / -1" }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.isNew}
                    onChange={(e) =>
                      updateField("isNew", e.target.checked)
                    }
                  />
                }
                label="isNew"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.isBestSeller}
                    onChange={(e) =>
                      updateField("isBestSeller", e.target.checked)
                    }
                  />
                }
                label="isBestSeller"
              />

              <Stack
                direction="row"
                spacing={1}
                sx={{ gridColumn: "1 / -1" }}
              >
                <Button type="submit" variant="contained">
                  {isEditing ? "Update" : "Create"}
                </Button>
                {isEditing && (
                  <Button variant="outlined" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </Paper>

        {/* GRID */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Products List
          </Typography>

         <Paper sx={{ p: 3 }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    Products List
  </Typography>

  <Box
    className="ag-theme-quartz"
    sx={{
      width: "100%",
      height: 550,
      borderRadius: 2,
      overflow: "hidden",
      "--ag-font-size": "14px",
      "--ag-row-height": "52px",
      "--ag-header-height": "56px",
      "--ag-border-color": "rgba(0,0,0,0.08)",
      "--ag-header-background-color": "rgba(0,0,0,0.03)",
      "--ag-odd-row-background-color": "rgba(0,0,0,0.01)",
    }}
  >
    <AgGridReact
      ref={gridRef}
      rowData={products}
      columnDefs={columnDefs}
      rowSelection="multiple"
      rowHeight={52}
      headerHeight={56}
      getRowId={(params) =>
        String(params.data?._id || params.data?.id)
      }
      defaultColDef={{
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 120,
      }}
    />
  </Box>
</Paper>
        </Paper>
      </AdminShell>
    </AdminGuard>
  );
}