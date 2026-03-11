"use client";

import Link from "next/link";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { AppButton } from "@/components/common";
import { useProducts } from "@/hooks/useProducts";

const getProductId = (product) =>
  product?._id || product?.id || product?.productId;
const getName = (product) => product?.name || "Collection Piece";
const getPrice = (product) => Number(product?.price || 0);
const extractSizes = (product) => {
  if (Array.isArray(product?.sizes)) {
    return product.sizes.map((size) => String(size).toUpperCase());
  }
  if (product?.size) {
    return [String(product.size).toUpperCase()];
  }
  if (Array.isArray(product?.variants)) {
    return product.variants
      .map((variant) => variant?.size)
      .filter(Boolean)
      .map((size) => String(size).toUpperCase());
  }
  return [];
};

const priceMatch = (product, filter) => {
  const price = getPrice(product);
  if (filter === "under-3000") return price < 3000;
  if (filter === "3000-5000") return price >= 3000 && price <= 5000;
  if (filter === "above-5000") return price > 5000;
  return true;
};

const CRAFT_IMAGES = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
];

export default function CollectionPage() {
  const { products, loading, error } = useProducts();
  const [sizeFilter, setSizeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const sizeOptions = useMemo(() => {
    const allSizes = products.flatMap(extractSizes);
    return Array.from(new Set(allSizes)).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredCollection = useMemo(() => {
    return products.filter((product) => {
      const sizes = extractSizes(product);
      const matchesSize =
        sizeFilter === "all" ||
        sizes.length === 0 ||
        sizes.includes(sizeFilter);
      return matchesSize && priceMatch(product, priceFilter);
    });
  }, [products, sizeFilter, priceFilter]);

  const resetFilters = () => {
    setSizeFilter("all");
    setPriceFilter("all");
  };

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
      <Box
        sx={{
          minHeight: { xs: "65vh", md: "75vh" },
          backgroundImage: (theme) =>
            `linear-gradient(${theme.palette.brand.overlaySoft}, ${theme.palette.brand.overlayStrong}), url('/CollectionImage.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <Box sx={{ maxWidth: 720 }}>
            <Typography sx={{ letterSpacing: 4, color: "primary.main", mb: 1 }}>
              WINTER 2026
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: "background.paper",
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              Structured silhouettes. Muted dominance.
            </Typography>
            <Typography
              sx={{
                color: "background.paper",
                opacity: 0.9,
                mb: 4,
                maxWidth: 620,
              }}
            >
              A collection built on clean architecture, sharp restraint, and
              quiet confidence. Every piece is designed to hold space without
              asking for permission.
            </Typography>
            <AppButton component={Link} href="/shop" sx={{ px: 4 }}>
              Shop Now
            </AppButton>
          </Box>
        </Container>
      </Box>

           <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h4" sx={{ mb: 2, letterSpacing: 2 }}>
            The Collection Story
          </Typography>
          <Typography sx={{ opacity: 0.8, maxWidth: 780, mx: "auto" }}>
            A study in quiet confidence and precise structure. This collection
            refines everyday dressing with controlled silhouettes, textured
            fabrics, and a palette drawn from dusk cityscapes and architectural
            shadows.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Inspiration
                </Typography>
                <Typography sx={{ opacity: 0.8 }}>
                  Evening skylines, sculpted architecture, and the discipline of
                  clean lines.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Fabric
                </Typography>
                <Typography sx={{ opacity: 0.8 }}>
                  Structured cottons, compact twills, and brushed blends chosen
                  for weight and fall.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Mood
                </Typography>
                <Typography sx={{ opacity: 0.8 }}>
                  Composed, deliberate, and quietly assertive in every setting.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Vision
                </Typography>
                <Typography sx={{ opacity: 0.8 }}>
                  Build a lasting wardrobe through pieces that mature into
                  personal signatures.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ width: "70%", mx: "auto" }} />

      <Box sx={{ bgcolor: (theme) => theme.palette.brand.borderSoft, py: 6 }}>
        <Container>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Collection Pieces
              </Typography>
              <Typography sx={{ opacity: 0.75 }}>
                Showing all products in the collection.
              </Typography>
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Size</InputLabel>
                <Select
                  label="Size"
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Sizes</MenuItem>
                  {sizeOptions.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 170 }}>
                <InputLabel>Price</InputLabel>
                <Select
                  label="Price"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <MenuItem value="all">All Prices</MenuItem>
                  <MenuItem value="under-3000">Under Rs 3000</MenuItem>
                  <MenuItem value="3000-5000">Rs 3000 - Rs 5000</MenuItem>
                  <MenuItem value="above-5000">Above Rs 5000</MenuItem>
                </Select>
              </FormControl>

              <AppButton variant="outlined" onClick={resetFilters}>
                Reset
              </AppButton>
            </Stack>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography sx={{ textAlign: "center", opacity: 0.8 }}>{error}</Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredCollection.map((product, index) => (
                <Grid item xs={12} sm={6} md={3} key={getProductId(product)}>
                  <Box sx={{ mb: 1 }}>
                    {index === 0 ? (
                      <Chip
                        size="small"
                        color="secondary"
                        label="Statement Piece"
                      />
                    ) : index === 1 ? (
                      <Chip
                        size="small"
                        color="secondary"
                        label="Best Seller"
                      />
                    ) : index === 2 ? (
                      <Chip
                        size="small"
                        color="secondary"
                        label="Limited Piece"
                      />
                    ) : null}
                  </Box>
                  <ProductCard
                    product={product}
                    hideWishlist
                    hideQuickAdd
                    soldOutLabel="Out of Stock"
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Box sx={{ bgcolor: "background.default", py: { xs: 6, md: 8 } }}>
        <Container>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Behind The Craft
          </Typography>
          <Typography sx={{ opacity: 0.78, mb: 4 }}>
            Material precision, technical stitching, and finishing discipline.
          </Typography>
          <Grid container spacing={3} wrap="nowrap">
            {CRAFT_IMAGES.map((image, index) => (
              <Grid item xs={4} key={image}>
                <Card>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Craft detail ${index + 1}`}
                    sx={{ height: 260, objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {index === 0
                        ? "Fabric Close-Up"
                        : index === 1
                          ? "Tailoring Line"
                          : "Stitch Precision"}
                    </Typography>
                    <Typography sx={{ opacity: 0.75 }}>
                      {index === 0
                        ? "Dense texture chosen for structure."
                        : index === 1
                          ? "Engineered seams built for sharp silhouette."
                          : "Clean finishing for a refined final expression."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* <Container sx={{ py: { xs: 7, md: 10 }, textAlign: "center" }}>
        <Typography variant="h3" sx={{ mb: 1.5, letterSpacing: 1 }}>
          Discover Your Identity
        </Typography>
        <Typography sx={{ maxWidth: 760, mx: "auto", opacity: 0.78, mb: 3 }}>
          Move beyond trends. Build a wardrobe that speaks before you do.
        </Typography>
        <AppButton component={Link} href="/shop" sx={{ px: 4 }}>
          Explore Full Collection
        </AppButton>
      </Container> */}
    </Box>
  );
}
