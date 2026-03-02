"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminShell({ title, children }) {
  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4 }}>
        {links.map((item) => (
          <Button key={item.href} component={Link} href={item.href} variant="outlined">
            {item.label}
          </Button>
        ))}
      </Box>

      {children}
    </Container>
  );
}
