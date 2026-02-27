"use client";

import {
  Container,
  Grid,
  Typography, CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import ProductCard from "../../components/product/ProductCard";
import { useTheme } from "@mui/material/styles";
import { useProducts } from "@/hooks/useProducts";

export default function NewArrivalsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
const { products } = useProducts();
  const newProducts = products.filter((p) => p.isNew);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          height: "50vh",
          backgroundImage: "url('/new-arrivals-hero.jpg')",
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
            NEW ARRIVALS
          </Typography>

          <Typography
            sx={{
              letterSpacing: 5,
              color: "#df8b6f",
              fontWeight: 300,
            }}
          >
            THE LATEST EXPRESSION OF REFINEMENT
          </Typography>
        </Box>
      </Box>

      {/* ===== EDITORIAL QUOTE ===== */}
      <Container sx={{ py: 5 }}>
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
          “The future of style is written in the details.”
        </Typography>
      </Container>

      <Divider sx={{ width: "60%", mx: "auto", mb: 8 }} />

      {/* ===== PRODUCTS SECTION ===== */}
      <Box
        sx={{
          bgcolor: isDark ? "#121212" : "#f1ebe8",
          py: 10,
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
            Just Dropped
          </Typography>

          <Grid container spacing={2}>
            {newProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== BOTTOM BRAND STATEMENT ===== */}
      <Box
        sx={{
          bgcolor: isDark ? "#121212" : "#f1ebe8",
          py: 2,
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 600,
            letterSpacing: 3,
            color: "#df8b6f",
          }}
        >
          Designed To Lead
        </Typography>

        <Typography
          sx={{
            maxWidth: "850px",
            margin: "0 auto",
            lineHeight: 1.9,
            opacity: 0.85,
          }}
        >
          Each arrival is curated, not rushed.  
          Each release reflects intention.  
          Because style is not seasonal — it is personal.
        </Typography>
      </Box>
    </>
  );
}
