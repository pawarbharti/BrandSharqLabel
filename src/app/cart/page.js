"use client";

import { useTheme } from "@mui/material/styles";
import {
  Typography,
  Button,
  Box,
  Grid,
  Divider,
} from "@mui/material";

export default function CartPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const cart = [
    {
      id: 1,
      name: "Midnight Structured Blazer",
      price: 7499,
      image: "/product1.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Signature Slim Trousers",
      price: 4999,
      image: "/product2.jpg",
      quantity: 1,
    },
  ];

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#0e141b" : "#f1ebe8",
        minHeight: "100vh",
        py: 12,
        px: { xs: 2, md: 8 },
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          mb: 10,
          letterSpacing: 4,
          fontWeight: 600,
          textAlign: "center",
          color: "#E6C2B6",
        }}
      >
        YOUR CART
      </Typography>

      {/* CENTERED WRAPPER */}
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <Grid container spacing={8} justifyContent="center">
          {/* CART ITEMS */}
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  gap: 5,
                  mb: 6,
                  p: 5,
                  bgcolor: isDark ? "#121a22" : "#ffffff",
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 220,
                    height: 260,
                    objectFit: "cover",
                    borderRadius: 3,
                  }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 600,
                      mb: 2,
                      color: isDark ? "#fff" : "#131A23",
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography sx={{ opacity: 0.6, mb: 3 }}>
                    Quantity: {item.quantity}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#E6C2B6",
                      mb: 3,
                    }}
                  >
                    ₹{item.price}
                  </Typography>

                  <Button
                    sx={{
                      px: 4,
                      py: 1,
                      border: "1px solid #CFA292",
                      color: "#CFA292",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#CFA292",
                        color: "#131A23",
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Grid>

          {/* SUMMARY */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 6,
                bgcolor: isDark ? "#121a22" : "#ffffff",
                borderRadius: 4,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                position: "sticky",
                top: 120,
              }}
            >
              <Typography
                sx={{
                  mb: 4,
                  fontWeight: 600,
                  letterSpacing: 2,
                  fontSize: "18px",
                  color: isDark ? "#fff" : "#131A23",
                }}
              >
                ORDER SUMMARY
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography>Subtotal</Typography>
                <Typography>₹{subtotal}</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#E6C2B6",
                  color: "#131A23",
                  py: 1.8,
                  fontWeight: 600,
                  borderRadius: 3,
                  "&:hover": {
                    backgroundColor: "#d8b2a4",
                  },
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}