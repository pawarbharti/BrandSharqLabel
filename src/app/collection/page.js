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

const getProductId = (product) => product?._id || product?.id || product?.productId;
const getName = (product) => product?.name || "Collection Piece";
const getPrice = (product) => Number(product?.price || 0);
const getCategory = (product) =>
  String(product?.category || "general").toLowerCase();
const getCollection = (product) =>
  String(product?.collection || "").toLowerCase();
const getImage = (product) =>
  product?.images?.[0] || product?.image || "/homepic.jpeg";

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

const LOOKBOOK_FALLBACKS = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  "https://images.unsplash.com/photo-1464863979621-258859e62245",
];

const CRAFT_IMAGES = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
];

export default function CollectionPage() {
  const { products, loading, error } = useProducts();
  const [sizeFilter, setSizeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const signatureCollection = useMemo(() => {
    const signature = products.filter((product) =>
      getCollection(product).includes("signature")
    );
    return signature.length > 0 ? signature : products;
  }, [products]);

  const sizeOptions = useMemo(() => {
    const allSizes = signatureCollection.flatMap(extractSizes);
    return Array.from(new Set(allSizes)).sort((a, b) => a.localeCompare(b));
  }, [signatureCollection]);

  const filteredCollection = useMemo(() => {
    return signatureCollection.filter((product) => {
      const sizes = extractSizes(product);
      const matchesSize =
        sizeFilter === "all" || sizes.length === 0 || sizes.includes(sizeFilter);
      return matchesSize && priceMatch(product, priceFilter);
    });
  }, [signatureCollection, sizeFilter, priceFilter]);

  const highlightPieces = useMemo(
    () => filteredCollection.slice(0, 8),
    [filteredCollection]
  );
  const lookbookPieces = useMemo(
    () => filteredCollection.slice(0, 3),
    [filteredCollection]
  );

  const statementPiece = highlightPieces[0];
  const completeTheLook = useMemo(() => {
    if (!statementPiece) return [];
    const baseCategory = getCategory(statementPiece);
    const preferred = ["pants", "trouser", "jeans", "boots", "shoes", "accessory"];

    const recommendations = filteredCollection.filter((product) => {
      const id = getProductId(product);
      const category = getCategory(product);
      return id !== getProductId(statementPiece) && category !== baseCategory;
    });

    recommendations.sort((a, b) => {
      const aRank = preferred.findIndex((term) => getCategory(a).includes(term));
      const bRank = preferred.findIndex((term) => getCategory(b).includes(term));
      return (aRank === -1 ? 999 : aRank) - (bRank === -1 ? 999 : bRank);
    });

    return recommendations.slice(0, 3);
  }, [filteredCollection, statementPiece]);

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
            `linear-gradient(${theme.palette.brand.overlaySoft}, ${theme.palette.brand.overlayStrong}), url('https://images.unsplash.com/photo-1520975916090-3105956dac38')`,
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
              sx={{ color: "background.paper", fontWeight: 700, lineHeight: 1.1, mb: 2 }}
            >
              Structured silhouettes. Muted dominance.
            </Typography>
            <Typography sx={{ color: "background.paper", opacity: 0.9, mb: 4, maxWidth: 620 }}>
              A collection built on clean architecture, sharp restraint, and quiet
              confidence. Every piece is designed to hold space without asking for
              permission.
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
            Luxury lives in intention. This chapter explores disciplined tailoring,
            tactile fabrics, and a deliberate palette inspired by dusk architecture.
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
                  Modern brutalism, night streets, and controlled proportion.
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
                  Structured cotton, dense twill, and brushed blends with clean fall.
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
                  Composed, confident, and intentionally understated.
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
                  Build identity through pieces that age into signature staples.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ width: "70%", mx: "auto" }} />

      <Container sx={{ py: { xs: 6, md: 9 } }}>
        <Typography variant="h4" sx={{ mb: 1, letterSpacing: 2 }}>
          Lookbook
        </Typography>
        <Typography sx={{ opacity: 0.75, mb: 4 }}>
          Editorial frames. Click to open product.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography sx={{ opacity: 0.8 }}>{error}</Typography>
        ) : (
          <Grid container spacing={2}>
            {lookbookPieces.map((product, index) => (
              <Grid item xs={12} md={index === 0 ? 7 : 5} key={getProductId(product)}>
                <Card sx={{ height: index === 0 ? 520 : 255 }}>
                  <CardActionArea
                    component={Link}
                    href={`/shop/${encodeURIComponent(getProductId(product))}`}
                    sx={{ height: "100%", position: "relative" }}
                  >
                    <CardMedia
                      component="img"
                      image={getImage(product) || LOOKBOOK_FALLBACKS[index]}
                      alt={getName(product)}
                      sx={{ height: "100%", objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: (theme) =>
                          `linear-gradient(to top, ${theme.palette.brand.overlayStrong}, ${theme.palette.brand.overlaySoft})`,
                        display: "flex",
                        alignItems: "end",
                        p: 2.5,
                      }}
                    >
                      <Box>
                        <Chip
                          label={index === 0 ? "Editorial Lead" : "Lookbook"}
                          size="small"
                          sx={{ mb: 1, bgcolor: "primary.main", color: "primary.contrastText" }}
                        />
                        <Typography sx={{ color: "background.paper", fontWeight: 600 }}>
                          {getName(product)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

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
                Highlight Pieces
              </Typography>
              <Typography sx={{ opacity: 0.75 }}>
                Best sellers, statements, and limited drops.
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
          ) : (
            <Grid container spacing={3}>
              {highlightPieces.slice(0, 6).map((product, index) => (
                <Grid item xs={12} sm={6} md={3} key={getProductId(product)}>
                  <Box sx={{ mb: 1 }}>
                    {index === 0 ? (
                      <Chip size="small" color="secondary" label="Statement Piece" />
                    ) : index === 1 ? (
                      <Chip size="small" color="secondary" label="Best Seller" />
                    ) : index === 2 ? (
                      <Chip size="small" color="secondary" label="Limited Piece" />
                    ) : null}
                  </Box>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* <Container sx={{ py: { xs: 6, md: 9 } }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Complete The Look
        </Typography>
        <Typography sx={{ opacity: 0.78, mb: 4 }}>
          Pair your statement piece with layered essentials.
        </Typography>

        {statementPiece ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  image={getImage(statementPiece)}
                  alt={getName(statementPiece)}
                  sx={{ height: 360, objectFit: "cover" }}
                />
                <CardContent>
                  <Chip label="Anchor Piece" size="small" sx={{ mb: 1 }} />
                  <Typography variant="h6">{getName(statementPiece)}</Typography>
                  <Typography sx={{ opacity: 0.75 }}>
                    Build the rest of the look around this structure.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {completeTheLook.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={getProductId(product)}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Typography sx={{ opacity: 0.8 }}>
            No products available for this collection right now.
          </Typography>
        )}
      </Container> */}

      <Box sx={{ bgcolor: (theme) => theme.palette.brand.borderSoft, py: { xs: 6, md: 8 } }}>
        <Container>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Behind The Craft
          </Typography>
          <Typography sx={{ opacity: 0.78, mb: 4 }}>
            Material precision, technical stitching, and finishing discipline.
          </Typography>
          <Grid container spacing={3}>
            {CRAFT_IMAGES.map((image, index) => (
              <Grid item xs={12} md={4} key={image}>
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
                        ? "Dense texture chosen for structure and drape."
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
