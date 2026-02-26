"use client";

import { Container, Grid, Typography } from "@mui/material";
import { products } from "../../data/products";
import ProductCard from "../../components/product/ProductCard";

export default function NewArrivalsPage() {
  const newProducts = products.filter((p) => p.isNew);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        New Arrivals
      </Typography>

      <Grid container spacing={4}>
        {newProducts.map((product) => (
          <Grid item xs={12} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}