"use client";

import Link from "next/link";
import { Box, Typography, Grid } from "@mui/material";

function FooterLink({ href, children }) {
  return (
    <Typography
      component={Link}
      href={href}
      sx={{
        display: "block",
        mt: 1,
        textDecoration: "none",
        color: "text.secondary",
        fontSize: "16px",
        "&:hover": { color: "primary.main" },
      }}
    >
      {children}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      sx={(theme) => ({
        py: 6,
        mt: 8,
        bgcolor: "background.default",
        borderTop: `1px solid ${theme.palette.brand.border}`,
      })}
    >
      <Grid container spacing={4} justifyContent="center" px={4}>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ letterSpacing: 2, color: "primary.main" }}>
            SHARQ LABEL
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              letterSpacing: 4,
              color: "primary.main",
              fontWeight: 300,
              mt: 1,
            }}
          >
            BORN TO BE DIFFERENT
          </Typography>

          <Typography sx={{ mt: 2, color: "text.secondary" }}>
            Luxury Menswear | Premium Shirts and Tees
          </Typography>
        </Grid>

        <Grid item xs={6} md={2}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Shop</Typography>
          <FooterLink href="/shop">All Products</FooterLink>
          <FooterLink href="/shirts">Shirts</FooterLink>
          <FooterLink href="/tees">T-Shirts</FooterLink>
          <FooterLink href="/new-arrivals">New Arrivals</FooterLink>
        </Grid>

        <Grid item xs={6} md={2}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Company</Typography>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
        </Grid>

        <Grid item xs={6} md={2}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Policies</Typography>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink href="/terms">Terms and Conditions</FooterLink>
          <FooterLink href="/shipping">Shipping and Returns</FooterLink>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Contact Us</Typography>
          <Typography sx={{ mt: 1, color: "text.secondary", fontSize: "16px" }}>
            D-102, Ace Platinum, ZETA-1, Greater Noida
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary", fontSize: "16px" }}>
            7678294158
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary", fontSize: "16px" }}>
            info@sharqlabel.com
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography sx={{ color: "text.secondary", fontSize: "16px" }}>
          (c) 2026 Sharq Label. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
