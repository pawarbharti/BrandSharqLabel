"use client";

import { useEffect, useState } from "react";
import {
  Alert,
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
import { adminApi } from "@/lib/api";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const data = await adminApi.inventory();
    setInventory(data?.inventory || data?.data || data || []);
  };

  useEffect(() => {
    load().catch((err) =>
      setError(err.message || "Failed to load inventory")
    );
  }, []);

  const handleChange = (variantId, value) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === variantId
          ? { ...item, stock: Number(value) }
          : item
      )
    );
  };

  const updateStock = async (variantId) => {
    try {
      const variant = inventory.find((i) => i.id === variantId);
      if (!variant) return;

      await adminApi.updateInventory({
        variantId,
        stock: Number(variant.stock),
      });

      setSuccess("Inventory updated");

      // Reload to sync product total stock
      await load();
    } catch (err) {
      setError(err.message || "Failed to update inventory");
    }
  };

  return (
    <AdminGuard>
      <AdminShell title="Inventory Management">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Variant Inventory
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Collection</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Save</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inventory.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.category || "-"}</TableCell>
                  <TableCell>{row.collection || "-"}</TableCell>
                  <TableCell>{row.size || "-"}</TableCell>
                  <TableCell>{row.color || "-"}</TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={row.stock}
                      onChange={(e) =>
                        handleChange(row.id, e.target.value)
                      }
                      sx={{ width: 100 }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => updateStock(row.id)}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </AdminShell>
    </AdminGuard>
  );
}