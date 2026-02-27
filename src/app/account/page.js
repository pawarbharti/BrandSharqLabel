"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { getAccountApi } from "@/lib/api";

export default function AccountPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAccountApi();
        if (active) {
          const profile = data.profile?.user || data.profile?.data || data.profile;
          const orderList =
            data.orders?.orders || data.orders?.data || data.orders || [];
          setUser(profile || null);
          setOrders(Array.isArray(orderList) ? orderList : []);
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load account");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAccount();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <Container sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          My Account
        </Typography>
        <Typography sx={{ mb: 2 }}>Please sign in to view your account.</Typography>
        <Button component={Link} href="/login" variant="contained">
          Go to Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>

      <Box sx={{ mt: 3, mb: 5 }}>
        <Typography>Name: {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
      </Box>

      <Typography variant="h5" sx={{ mb: 3 }}>
        My Orders
      </Typography>

      {orders.map((order) => (
        <Card
          key={order.id}
          sx={{
            mb: 4,
            border: "1px solid rgba(207,162,146,0.3)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Order ID: {order.id}</Typography>

              <Chip
                label={order.status}
                sx={{
                  backgroundColor:
                    order.status === "Delivered"
                      ? "rgba(46, 125, 50, 0.2)"
                      : order.status === "On the Way"
                      ? "rgba(255, 152, 0, 0.2)"
                      : "rgba(207,162,146,0.3)",
                }}
              />
            </Box>

            <Typography sx={{ mt: 1, opacity: 0.7 }}>
              Placed on: {new Date(order.date).toLocaleDateString()}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ mb: 1, fontWeight: 500 }}>Items:</Typography>

            {(order.items || []).map((item, index) => (
              <Typography key={index} sx={{ opacity: 0.8 }}>
                {item.name || item.productName || item.product?.name || "Item"} (Qty:{" "}
                {item.qty || item.quantity || 1})
              </Typography>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography>Total: ₹{order.total}</Typography>
            <Typography sx={{ opacity: 0.7 }}>
              Delivery Address: {order.address}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
