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

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#0f1419" : "rgba(207,162,146,0.05)",
        minHeight: "100vh",
        py: 10,
        px: { xs: 2, md: 8 },
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          mb: 8,
          letterSpacing: 4,
          fontWeight: 600,
          textAlign: "center",
          color: "#df8b6f",
        }}
      >
        YOUR CART
      </Typography>

      <Box sx={{ maxWidth: "1300px", mx: "auto" }}>
        <Grid container spacing={6}>
          
          {/* CART ITEMS */}
          <Grid item xs={12} md={8}>
            {cart.map((item, index) => (
              <Box key={item.id} sx={{ mb: 5 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 4,
                    p: 4,
                    bgcolor: isDark ? "#161c22" : "#ffffff",
                    borderRadius: 3,
                    border: "1px solid rgba(207,162,146,0.15)",
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 180,
                      height: 220,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography sx={{ opacity: 0.6, mb: 2 }}>
                      Quantity: {item.quantity}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#CFA292",
                      }}
                    >
                      ₹{item.price}
                    </Typography>

                    <Button
                      sx={{
                        mt: 3,
                        px: 3,
                        py: 0.8,
                        fontSize: "12px",
                        letterSpacing: 1,
                        border: "1px solid rgba(207,162,146,0.5)",
                        color: "#CFA292",
                        "&:hover": {
                          bgcolor: "rgba(207,162,146,0.1)",
                        },
                      }}
                    >
                      REMOVE
                    </Button>
                  </Box>
                </Box>

                {index !== cart.length - 1 && (
                  <Divider sx={{ mt: 5, opacity: 0.3 }} />
                )}
              </Box>
            ))}
          </Grid>

          {/* ORDER SUMMARY */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 5,
                bgcolor: isDark ? "#161c22" : "#ffffff",
                borderRadius: 3,
                border: "1px solid rgba(207,162,146,0.15)",
                position: "sticky",
                top: 100,
              }}
            >
              <Typography
                sx={{
                  mb: 4,
                  fontWeight: 600,
                  letterSpacing: 2,
                }}
              >
                ORDER SUMMARY
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography sx={{ opacity: 0.7 }}>Subtotal</Typography>
                <Typography>₹{subtotal}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography sx={{ opacity: 0.7 }}>Shipping</Typography>
                <Typography>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
                <Typography sx={{ fontWeight: 600 }}>Total</Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#CFA292",
                    fontSize: "18px",
                  }}
                >
                  ₹{total}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#CFA292",
                  color: "#131A23",
                  py: 1.6,
                  fontWeight: 600,
                  letterSpacing: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#df8b6f",
                  },
                }}
              >
                PROCEED TO CHECKOUT
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}