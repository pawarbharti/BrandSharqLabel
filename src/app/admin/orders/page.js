"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await adminApi.orders();
        if (active) setOrders(data?.orders || data?.data || data || []);
      } catch (err) {
        if (active) setError(err.message || "Failed to load admin orders");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminGuard>
      <AdminShell title="Manage Orders">
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Orders
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id || order.id}>
                  <TableCell>{order._id || order.id}</TableCell>
                  <TableCell>{order.user?.email || order.email || "-"}</TableCell>
                  <TableCell>{order.orderStatus || order.status || "-"}</TableCell>
                  <TableCell>{order.totalAmount || order.total || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </AdminShell>
    </AdminGuard>
  );
}
