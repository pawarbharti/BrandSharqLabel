"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ProductCard from "@/components/product/ProductCard";
import { AppButton } from "@/components/common";
import { useProducts } from "@/hooks/useProducts";

const getProductId = (product) => product?._id || product?.id || product?.productId;
const toText = (value) => String(value || "").toLowerCase();

export default function CategoryListingPage({
  title,
  subtitle,
  keywords = [],
}) {
  const { products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    const normalizedKeywords = keywords.map((item) => toText(item)).filter(Boolean);
    return products.filter((product) => {
      const category = toText(product?.category);
      const collection = toText(product?.collection);
      const name = toText(product?.name);
      return normalizedKeywords.some(
        (keyword) =>
          category.includes(keyword) ||
          collection.includes(keyword) ||
          name.includes(keyword),
      );
    });
  }, [products, keywords]);

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "background.default", minHeight: "70vh" }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" sx={{ letterSpacing: 2, mb: 1 }}>
            {title}
          </Typography>
          <Typography sx={{ opacity: 0.78 }}>{subtitle}</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography sx={{ textAlign: "center", opacity: 0.8 }}>{error}</Typography>
        ) : filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No matching products found.
            </Typography>
            <Typography sx={{ opacity: 0.75, mb: 2.5 }}>
              Browse the full catalog to discover all available pieces.
            </Typography>
            <Stack direction="row" justifyContent="center">
              <AppButton component={Link} href="/shop">
                View All Products
              </AppButton>
            </Stack>
          </Box>
        ) : (
          <>
            <Typography sx={{ mb: 2.5, opacity: 0.75 }}>
              Showing {filteredProducts.length} products
            </Typography>
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={getProductId(product)}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}
