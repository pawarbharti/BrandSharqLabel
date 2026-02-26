"use client";

import Link from "next/link";
import { Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const linkStyle = {
    display: "block",
    marginTop: "8px",
    textDecoration: "none",
    color: isDark ? "#ccc" : "#555",
    fontSize: "14px",
  };

  return (
    <Box
      sx={{
        py: 6,
        mt: 8,
        bgcolor: isDark ? "#121212" : "#f1ebe8",
        borderTop: "1px solid rgba(207,162,146,0.3)",
      }}
    >
      <Grid container spacing={4} justifyContent="center" px={4}>
        
        {/* Brand Section */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ letterSpacing: 2, color: "#df8b6f" }}>
            SHARQ LABEL
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              letterSpacing: 4,
              color: "#df8b6f",
              fontWeight: 300,
              mt: 1,
            }}
          >
            BORN TO BE DIFFERENT
          </Typography>

          <Typography sx={{ mt: 2, color: isDark ? "#ccc" : "#555" }}>
            Luxury Menswear | Premium Shirts & Tees
          </Typography>
        </Grid>

        {/* Shop Links */}
        <Grid item xs={6} md={2}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Shop
          </Typography>

          <Link href="/shop" style={linkStyle}>All Products</Link>
          <Link href="/shirts" style={linkStyle}>Shirts</Link>
          <Link href="/tees" style={linkStyle}>T-Shirts</Link>
          <Link href="/new-arrivals" style={linkStyle}>New Arrivals</Link>
        </Grid>

        {/* Company Links */}
        <Grid item xs={6} md={2}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Company
          </Typography>

          <Link href="/about" style={linkStyle}>About Us</Link>
          <Link href="/contact" style={linkStyle}>Contact</Link>
          <Link href="/faq" style={linkStyle}>FAQ</Link>
        </Grid>

        {/* Policies */}
        <Grid item xs={6} md={2}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Policies
          </Typography>

          <Link href="/privacy-policy" style={linkStyle}>Privacy Policy</Link>
          <Link href="/terms" style={linkStyle}>Terms & Conditions</Link>
          <Link href="/shipping" style={linkStyle}>Shipping & Returns</Link>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={6} md={3}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Contact Us
          </Typography>

          <Typography sx={{ mt: 1, color: isDark ? "#ccc" : "#555", fontSize: "14px" }}>
            📍 Pune, Maharashtra, India
          </Typography>

          <Typography sx={{ mt: 1, color: isDark ? "#ccc" : "#555", fontSize: "14px" }}>
            📞 +91 9876543210
          </Typography>

          <Typography sx={{ mt: 1, color: isDark ? "#ccc" : "#555", fontSize: "14px" }}>
            📧 support@sharqlabel.com
          </Typography>
        </Grid>

      </Grid>

      {/* Bottom Copyright */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography sx={{ color: isDark ? "#777" : "#888", fontSize: "14px" }}>
          © 2026 Sharq Label. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}