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

const initialForm = { name: "", slug: "", isActive: true };

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
    loadCategories().catch((err) => setError(err.message || "Failed to load categories"));
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
      isActive: category.isActive ?? true,
    });
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
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingId ? "Edit Category" : "Add Category"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <TextField
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isActive: e.target.checked }))
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

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Category List
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => {
                const id = category._id || category.id;
                return (
                  <TableRow key={id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.isActive ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" onClick={() => onEdit(category)}>
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
