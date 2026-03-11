"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/api";

function currency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function statusColor(status) {
  const map = {
    Processing: "warning",
    Confirmed: "info",
    Shipped: "secondary",
    Delivered: "success",
    Cancelled: "error",
  };

  return map[status] || "default";
}

function StatCard({ label, value, icon }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: "100%",
        boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
      }}
    >
      {/* Title Row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            bgcolor: "primary.light",
            color: "primary.main",
            p: 0.7,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& svg": {
              fontSize: 18,
            },
          }}
        >
          {icon}
        </Box>

        <Typography sx={{ opacity: 0.75, fontSize: 14 }}>
          {label}
        </Typography>
      </Box>

      {/* Value */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mt: 1.2,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const data = await adminApi.dashboardStats();

        if (active) {
          setStats(data);
          setError("");
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <AdminGuard>
        <AdminShell title="Admin Dashboard">
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </AdminShell>
      </AdminGuard>
    );
  }

  if (!stats) {
    return (
      <AdminGuard>
        <AdminShell title="Admin Dashboard">
          <Alert severity="error">Dashboard data unavailable</Alert>
        </AdminShell>
      </AdminGuard>
    );
  }

  const { summary, orderStatus, recentOrders, lowStock } = stats;

  return (
    <AdminGuard>
      <AdminShell title="Admin Dashboard">
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{display:'flex', flexDirection:"row", gap:5, width:"100%"}}>
          <Box sx={{width:"50%"}}>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={8} md={3}>
                <StatCard
                  label="Revenue"
                  value={currency(summary.revenue)}
                  icon={<AttachMoneyIcon/>}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  label="Orders"
                  value={summary.orders}
                  icon={<ShoppingCartIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  label="Products"
                  value={summary.products}
                  icon={<InventoryIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  label="Users"
                  value={summary.users}
                  icon={<PeopleIcon />}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {/* ORDER STATUS */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Order Status
                  </Typography>

                  {orderStatus.length ? (
                    <Stack spacing={1}>
                      {orderStatus.map((item) => (
                        <Stack
                          key={item._id}
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography>{item._id}</Typography>
                          <Chip label={item.count} size="small" />
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Typography sx={{ opacity: 0.7 }}>
                      No order data yet
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* LOW STOCK */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Low Stock Products
                  </Typography>

                  {lowStock.length ? (
                    <Stack spacing={1}>
                      {lowStock.map((item) => (
                        <Stack
                          key={`${item._id}-${item.size}`}
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography>
                            {item.productName} ({item.size}/{item.color})
                          </Typography>

                          <Chip
                            size="small"
                            color="warning"
                            label={`Stock ${item.stock}`}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Typography sx={{ opacity: 0.7 }}>
                      All products sufficiently stocked
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{width:"50%"}}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Orders
                </Typography>

                {recentOrders.length ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order._id} hover>
                          <TableCell>{order._id}</TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={order.orderStatus}
                              color={statusColor(order.orderStatus)}
                            />
                          </TableCell>

                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </TableCell>

                          <TableCell>{currency(order.totalAmount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography sx={{ opacity: 0.7 }}>
                    No recent orders
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Box>
        </Box>
      </AdminShell>
    </AdminGuard>
  );
}
