"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Chip, Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/api";

function currency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function StatCard({ label, value, helper }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography sx={{ opacity: 0.7 }}>{label}</Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>
        {value}
      </Typography>
      {helper ? (
        <Typography sx={{ mt: 0.5, opacity: 0.7, fontSize: 13 }}>{helper}</Typography>
      ) : null}
    </Paper>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadStats() {
      try {
        const data = await adminApi.dashboardStats();
        if (active) setStats(data?.stats || data?.data || data || {});
      } catch (err) {
        if (active) setError(err.message || "Failed to load dashboard stats");
      }
    }
    loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminGuard>
      <AdminShell title="Admin Dashboard">
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Revenue" value={currency(stats?.totalRevenue)} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Orders" value={stats?.totalOrders ?? "-"} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Products" value={stats?.totalProducts ?? "-"} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Low Stock Products"
              value={stats?.lowStockCount ?? "-"}
              helper="Stock <= 10"
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Monthly Sales
              </Typography>
              <Stack spacing={1.2}>
                {(stats?.salesChart || []).slice(-6).map((item) => {
                  const max = Math.max(...(stats?.salesChart || []).map((x) => Number(x.sales || 0)), 1);
                  const width = `${Math.max(8, (Number(item.sales || 0) / max) * 100)}%`;
                  return (
                    <Box key={`${item.month}-${item.sales}`}>
                      <Stack direction="row" justifyContent="space-between" sx={{ fontSize: 13 }}>
                        <Typography sx={{ fontSize: 13 }}>{item.month}</Typography>
                        <Typography sx={{ fontSize: 13 }}>{currency(item.sales)}</Typography>
                      </Stack>
                      <Box sx={{ mt: 0.5, bgcolor: "grey.200", borderRadius: 1, height: 10 }}>
                        <Box sx={{ width, bgcolor: "primary.main", borderRadius: 1, height: "100%" }} />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Visitors (Monthly)
              </Typography>
              <Stack spacing={1.2}>
                {(stats?.visitors || []).slice(-6).map((item) => (
                  <Stack direction="row" key={`v-${item.month}`} justifyContent="space-between">
                    <Typography>{item.month}</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{Number(item.visitors || 0).toLocaleString("en-IN")}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Top Selling Products
              </Typography>
              <Stack spacing={1}>
                {(stats?.topSellingProducts || []).map((product) => (
                  <Stack key={product.id || product._id} direction="row" justifyContent="space-between">
                    <Typography>{product.name}</Typography>
                    <Chip size="small" label={`Sold ${product.soldCount || 0}`} />
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Trending Products
              </Typography>
              <Stack spacing={1}>
                {(stats?.trendingProducts || []).map((product) => (
                  <Stack key={`tr-${product.id || product._id}`} direction="row" justifyContent="space-between">
                    <Typography>{product.name}</Typography>
                    <Chip size="small" color="secondary" label={`Views ${product.viewCount || 0}`} />
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Recent Orders
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(stats?.recentOrders || []).slice(0, 8).map((order) => (
                    <TableRow key={order.id || order._id}>
                      <TableCell>{order.id || order._id}</TableCell>
                      <TableCell>{order.status || order.orderStatus || "-"}</TableCell>
                      <TableCell>{order.userEmail || order.email || "-"}</TableCell>
                      <TableCell>{currency(order.totalAmount || order.total || 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </AdminShell>
    </AdminGuard>
  );
}
