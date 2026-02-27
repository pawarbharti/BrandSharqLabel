"use client";

import { useEffect, useState } from "react";
import { Alert, Grid, Paper, Typography } from "@mui/material";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/api";

function StatCard({ label, value }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography sx={{ opacity: 0.7 }}>{label}</Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>
        {value}
      </Typography>
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
          <Grid item xs={12} md={4}>
            <StatCard label="Users" value={stats?.usersCount ?? "-"} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard label="Orders" value={stats?.ordersCount ?? "-"} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard label="Revenue" value={stats?.revenue ?? "-"} />
          </Grid>
        </Grid>
      </AdminShell>
    </AdminGuard>
  );
}
