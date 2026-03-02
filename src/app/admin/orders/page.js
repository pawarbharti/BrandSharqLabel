"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
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

function currency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("Processing");
  const [trackingId, setTrackingId] = useState("");

  const load = async () => {
    const data = await adminApi.orders();
    setOrders(data?.orders || data?.data || data || []);
  };

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const data = await adminApi.orders();
        if (active) setOrders(data?.orders || data?.data || data || []);
      } catch (err) {
        if (active) setError(err.message || "Failed to load admin orders");
      }
    }
    run();
    return () => {
      active = false;
    };
  }, []);

  const updateOrder = async (id, payload, label) => {
    try {
      setError("");
      await adminApi.updateOrder(id, payload);
      setSuccess(label);
      await load();
      if (selectedOrder && String(selectedOrder.id || selectedOrder._id) === String(id)) {
        const detail = await adminApi.orderById(id);
        setSelectedOrder(detail?.order || detail?.data || detail);
      }
    } catch (err) {
      setError(err.message || "Failed to update order");
    }
  };

  const openDetails = async (id) => {
    try {
      const data = await adminApi.orderById(id);
      const order = data?.order || data?.data || data;
      setSelectedOrder(order);
      setStatus(order?.status || order?.orderStatus || "Processing");
      setTrackingId(order?.trackingId || "");
    } catch (err) {
      setError(err.message || "Failed to load order details");
    }
  };

  const printInvoice = (order) => {
    const lines = [
      "INVOICE",
      `Order ID: ${order.id || order._id}`,
      `Customer: ${order.userEmail || "-"}`,
      `Status: ${order.status || order.orderStatus || "-"}`,
      `Total: ${currency(order.totalAmount || order.total || 0)}`,
      "",
      "Items:",
      ...(order.items || []).map(
        (item) => `- ${item.name || item.productName || "Item"} x${item.quantity || item.qty || 1} @ ${currency(item.price || 0)}`
      ),
    ];

    const popup = window.open("", "_blank", "width=700,height=900");
    if (!popup) return;
    popup.document.write(`<pre style="font-family:monospace;padding:24px;">${lines.join("\n")}</pre>`);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  const exportOrders = async () => {
    try {
      const data = await adminApi.exportOrders();
      const payload = data?.orders || [];
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setSuccess("Orders exported");
    } catch (err) {
      setError(err.message || "Failed to export orders");
    }
  };

  return (
    <AdminGuard>
      <AdminShell title="Manage Orders">
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

        <Paper sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6">Orders</Typography>
            <Button variant="outlined" onClick={exportOrders}>
              Export Orders
            </Button>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const id = order._id || order.id;
                return (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{order.user?.email || order.userEmail || order.email || "-"}</TableCell>
                    <TableCell>{order.orderStatus || order.status || "-"}</TableCell>
                    <TableCell>{currency(order.totalAmount || order.total || 0)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" onClick={() => openDetails(id)}>
                          View
                        </Button>
                        <Button
                          size="small"
                          onClick={() => updateOrder(id, { action: "mark_shipped", trackingId: order.trackingId || "TRACK123" }, "Order marked as shipped")}
                        >
                          Mark Shipped
                        </Button>
                        <Button size="small" color="warning" onClick={() => updateOrder(id, { action: "refund" }, "Order refunded")}>
                          Refund
                        </Button>
                        <Button size="small" color="error" onClick={() => updateOrder(id, { action: "cancel" }, "Order cancelled")}>
                          Cancel
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} fullWidth maxWidth="md">
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            {selectedOrder ? (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Typography>Order ID: {selectedOrder.id || selectedOrder._id}</Typography>
                <Typography>Customer: {selectedOrder.userEmail || "-"}</Typography>
                <Typography>Total: {currency(selectedOrder.totalAmount || selectedOrder.total || 0)}</Typography>
                <Typography>Shipping Address: {selectedOrder.shippingAddress || selectedOrder.address || "-"}</Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 160 }}>
                    {["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled", "Refunded"].map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField label="Tracking ID" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
                  <Button
                    variant="contained"
                    onClick={() =>
                      updateOrder(
                        selectedOrder.id || selectedOrder._id,
                        { action: "update_status", status, orderStatus: status, trackingId },
                        "Order status updated"
                      )
                    }
                  >
                    Update Status
                  </Button>
                </Stack>

                <Box>
                  <Typography sx={{ mb: 1, fontWeight: 600 }}>Items</Typography>
                  <Stack spacing={0.8}>
                    {(selectedOrder.items || []).map((item, index) => (
                      <Typography key={`${item.productId || index}`} sx={{ opacity: 0.8 }}>
                        {item.name || item.productName || "Item"} | Qty {item.quantity || item.qty || 1} | Size {item.size || "-"} | Color {item.color || "-"}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => selectedOrder && printInvoice(selectedOrder)}>Print Invoice</Button>
            <Button onClick={() => setSelectedOrder(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </AdminShell>
    </AdminGuard>
  );
}
