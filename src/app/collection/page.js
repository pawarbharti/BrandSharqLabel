"use client";

import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import ProductCard from "../../components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function CollectionPage() {
  const { products, loading, error } = useProducts();
  const signature = products.filter((p) => p.collection === "Signature");

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
      
      {/* 🖤 Luxury Hero Section */}
      <Box
        sx={{
          height: "60vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1520975916090-3105956dac38')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(0,0,0,0.5)",
            p: 5,
          }}
        >
          <Typography
            variant="h3"
            sx={{ letterSpacing: 3, fontWeight: 700 , color:"#ffffff"}}
          >
            SIGNATURE COLLECTION
          </Typography>

          <Typography
            sx={{
              mt: 2,
              letterSpacing: 4,
              color: "rgba(207,162,146,0.8)",
            }}
          >
            Crafted for the Bold. Designed for the Different.
          </Typography>
        </Box>
      </Box>

      {/* ✨ Quote Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            maxWidth: 800,
            mx: "auto",
            fontStyle: "italic",
            opacity: 0.8,
          }}
        >
          “Luxury is not about logos. It is about presence, confidence,
          and the courage to stand apart.”
        </Typography>
      </Container>

      <Divider sx={{ width: "60%", mx: "auto", mb: 6 }} />

      {/* 🛍 Product Grid */}
      <Container sx={{ pb: 10 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography sx={{ textAlign: "center", opacity: 0.8 }}>
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {signature.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* 📷 Editorial Image Section */}
      <Box
        sx={{
          height: "50vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

    </Box>
  );
}
