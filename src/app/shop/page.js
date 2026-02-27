"use client";

import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import ProductCard from "../../components/product/ProductCard";
import { useTheme } from "@mui/material/styles";
import { useProducts } from "@/hooks/useProducts";

export default function ShopPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { products, loading, error } = useProducts();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          width: "100%",
          height: "50vh",
          backgroundImage: "url('/shop-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "#fff",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.6))",
          }}
        />

        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            px: 3,
            maxWidth: "900px",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              letterSpacing: 4,
              fontWeight: 700,
              mb: 2,
              color: "#ffffff",
              textShadow: "0 6px 25px rgba(0,0,0,0.9)",
            }}
          >
            SHARQ LABEL
          </Typography>

          <Typography
            sx={{
              letterSpacing: 6,
              color: "#df8b6f",
              fontWeight: 300,
              mb: 3,
            }}
          >
            REFINED. FEARLESS. DISTINCT.
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              opacity: 0.9,
              lineHeight: 1.9,
              mb: 4,
            }}
          >
            Luxury is not what you wear. It is how you carry it.
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#df8b6f",
              color: "#131A23",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              letterSpacing: 1,
              "&:hover": {
                backgroundColor: "#df8b6f",
              },
            }}
          >
            Explore Collection
          </Button>
        </Box>
      </Box>

      {/* ===== EDITORIAL QUOTE SECTION ===== */}
      <Container sx={{ py: 3 }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            maxWidth: "850px",
            mx: "auto",
            fontStyle: "italic",
            opacity: 0.8,
            lineHeight: 1.8,
          }}
        >
          “True luxury whispers. It does not shout.”
        </Typography>
      </Container>

      <Divider sx={{ width: "60%", mx: "auto", mb: 3 }} />

      {/* ===== PRODUCTS SECTION ===== */}
      <Box
        sx={{
          bgcolor: isDark ? "#121212" : "#f1ebe8",
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{
              mb: 6,
              letterSpacing: 3,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Discover The Collection
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography sx={{ textAlign: "center", opacity: 0.8 }}>
              {error}
            </Typography>
          ) : (
            <Grid container spacing={5}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* ===== BRAND STATEMENT SECTION ===== */}
      <Box
        sx={{
          bgcolor: isDark ? "#121212" : "#f1ebe8",
          py: 5,
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 600,
            letterSpacing: 3,
            color: "#df8b6f",
          }}
        >
          More Than Fashion
        </Typography>

        <Typography
          sx={{
            maxWidth: "850px",
            margin: "0 auto",
            lineHeight: 1.9,
            opacity: 0.85,
          }}
        >
          SHARQ LABEL represents individuality, confidence, and modern elegance.
          Every stitch reflects intention. Every silhouette commands presence.
          This is not clothing. This is identity.
        </Typography>
      </Box>
    </>
  );
}
