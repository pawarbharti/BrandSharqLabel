"use client";

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";

const orders = [
  {
    id: "ORD-1001",
    date: "12 Feb 2026",
    status: "Delivered",
    total: 3499,
    address: "Pune, India",
    items: [
      { name: "Black Premium Shirt", qty: 1 },
      { name: "Classic White Tee", qty: 2 },
    ],
  },
  {
    id: "ORD-1002",
    date: "20 Feb 2026",
    status: "On the Way",
    total: 1999,
    address: "Pune, India",
    items: [{ name: "Luxury Oversized Tee", qty: 1 }],
  },
];

export default function AccountPage() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>

      <Box sx={{ mt: 3, mb: 5 }}>
        <Typography>Name: Bharti Pawar</Typography>
        <Typography>Email: bharti@example.com</Typography>
        <Typography>Saved Address: Pune, India</Typography>
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
              <Typography variant="h6">
                Order ID: {order.id}
              </Typography>

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
              Placed on: {order.date}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ mb: 1, fontWeight: 500 }}>
              Items:
            </Typography>

            {order.items.map((item, index) => (
              <Typography key={index} sx={{ opacity: 0.8 }}>
                {item.name} (Qty: {item.qty})
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