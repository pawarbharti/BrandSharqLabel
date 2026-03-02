"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
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
import { categoriesApi } from "@/lib/api";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  displayOrder: "",
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    const data = await categoriesApi.list();
    setCategories(data?.categories || data?.data || data || []);
  };

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const data = await categoriesApi.list();
        if (active) setCategories(data?.categories || data?.data || data || []);
      } catch (err) {
        if (active) setError(err.message || "Failed to load categories");
      }
    }
    run();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await categoriesApi.update(editingId, form);
        setSuccess("Category updated");
      } else {
        await categoriesApi.create(form);
        setSuccess("Category created");
      }
      setForm(initialForm);
      setEditingId("");
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to save category");
    }
  };

  const onEdit = (category) => {
    setEditingId(category._id || category.id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      displayOrder: category.displayOrder ?? "",
      isActive: category.isActive ?? true,
    });
  };

  const onToggleActive = async (category) => {
    try {
      const id = category._id || category.id;
      await categoriesApi.update(id, {
        ...category,
        isActive: !category.isActive,
      });
      setSuccess(`Category ${category.isActive ? "deactivated" : "activated"}`);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to update category");
    }
  };

  const onDelete = async (id) => {
    try {
      await categoriesApi.remove(id);
      setSuccess("Category deleted");
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  return (
    <AdminGuard>
      <AdminShell title="Manage Categories">
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

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingId ? "Edit Category" : "Add Category"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <TextField
                label="Slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                required
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                multiline
                minRows={2}
              />
              <TextField
                label="Category Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
              />
              <TextField
                label="Display Order"
                type="number"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, displayOrder: e.target.value }))
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                  />
                }
                label="Active"
              />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained">
                  {editingId ? "Update Category" : "Create Category"}
                </Button>
                {editingId ? (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingId("");
                      setForm(initialForm);
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Category List
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Order</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map((category) => {
                const id = category._id || category.id;

                return (
                  <TableRow key={id}>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {category.name}
                    </TableCell>

                    <TableCell>{category.slug}</TableCell>

                    <TableCell sx={{ maxWidth: 240 }}>
                      {category.description || "-"}
                    </TableCell>

                    <TableCell>{category.displayOrder ?? "-"}</TableCell>

                    {/* ACTIVE SWITCH */}
                    <TableCell align="center">
                      <Switch
                        checked={Boolean(category.isActive)}
                        onChange={async () => {
                          try {
                            // Optimistic UI update
                            setCategories((prev) =>
                              prev.map((item) =>
                                (item._id || item.id) === id
                                  ? { ...item, isActive: !item.isActive }
                                  : item,
                              ),
                            );

                            await categoriesApi.update(id, {
                              ...category,
                              isActive: !category.isActive,
                            });

                            setSuccess(
                              `Category ${
                                category.isActive ? "deactivated" : "activated"
                              }`,
                            );
                          } catch (err) {
                            setError(
                              err.message || "Failed to update category",
                            );
                            await loadCategories(); // rollback if error
                          }
                        }}
                      />
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onEdit(category)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => onDelete(id)}
                        >
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
