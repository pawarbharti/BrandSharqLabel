"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { useTheme } from "@mui/material/styles";
import ProductCard from "@/components/product/ProductCard";
import { AppButton } from "@/components/common";
import { useProducts } from "@/hooks/useProducts";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "trending", label: "Trending" },
  { value: "most-viewed", label: "Most Viewed" },
];

const getProductId = (product) => product?._id || product?.id || product?.productId;
const getName = (product) => product?.name || "New Arrival";
const getPrice = (product) => Number(product?.price || 0);
const getCreatedAt = (product) =>
  new Date(product?.createdAt || product?.updatedAt || Date.now()).getTime();
const getImage = (product) => product?.images?.[0] || product?.image || "/homepic.jpeg";
const getStock = (product) => Number(product?.stock ?? 999);

const isLimited = (product) => Boolean(product?.isLimited) || getStock(product) > 0 && getStock(product) < 8;

const isRecentlyDropped = (product) => {
  if (product?.isNew) return true;
  const created = getCreatedAt(product);
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - created <= thirtyDays;
};

const getMostViewedScore = (product) =>
  Number(product?.viewCount || product?.views || 0);

const getCartTrendScore = (product) =>
  Number(product?.addedToCartCount || product?.addedToCart || 0);

const hasRealCartTrendData = (product) => getCartTrendScore(product) > 0;
const hasRealViewData = (product) => getMostViewedScore(product) > 0;

const formatReleaseDate = (product) => {
  const date = new Date(getCreatedAt(product));
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function NewArrivalsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState("newest");

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 0,
  });

  useEffect(() => {
    const nextDropDate = new Date();
    nextDropDate.setDate(nextDropDate.getDate() + 2);
    nextDropDate.setHours(nextDropDate.getHours() + 14);

    const timer = setInterval(() => {
      const diff = nextDropDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft({ days, hours, minutes });
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const newProducts = useMemo(() => {
    const recent = products.filter(isRecentlyDropped);
    const fallback = [...products]
      .sort((a, b) => getCreatedAt(b) - getCreatedAt(a))
      .slice(0, 16);
    const source = recent.length > 0 ? recent : fallback;
    const sorted = [...source];

    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "trending":
        sorted.sort((a, b) => getCartTrendScore(b) - getCartTrendScore(a));
        break;
      case "most-viewed":
        sorted.sort((a, b) => getMostViewedScore(b) - getMostViewedScore(a));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => getCreatedAt(b) - getCreatedAt(a));
        break;
    }

    return sorted;
  }, [products, sortBy]);

  const primaryGrid = newProducts.slice(0, 8);
  const secondaryGrid = newProducts.slice(8);

  const trendingByCart = useMemo(() => {
    return [...products]
      .filter(hasRealCartTrendData)
      .sort((a, b) => getCartTrendScore(b) - getCartTrendScore(a))
      .slice(0, 8);
  }, [products]);

  const trendingByViews = useMemo(() => {
    return [...products]
      .filter(hasRealViewData)
      .sort((a, b) => getMostViewedScore(b) - getMostViewedScore(a))
      .slice(0, 8);
  }, [products]);

  const styleAnchor = primaryGrid[0];

  return (
    <>
      <Box
        sx={{
          minHeight: { xs: "60vh", md: "70vh" },
          backgroundImage: (theme) =>
            `linear-gradient(${theme.palette.brand.overlaySoft}, ${theme.palette.brand.overlayStrong}), url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          color: "background.paper",
        }}
      >
        <Container>
          <Box sx={{ maxWidth: 760 }}>
            <Typography sx={{ color: "primary.main", letterSpacing: 3, mb: 1 }}>
              Drop Date: 28 February 2026
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              NEW ARRIVALS
            </Typography>
            <Typography sx={{ fontSize: { xs: 18, md: 22 }, mb: 1.5 }}>
              The Latest Expressions of SHARQ
            </Typography>
            <Typography sx={{ opacity: 0.86, mb: 3.5 }}>
              Precision-led essentials crafted for the season shift. Built in
              limited runs with a deliberate editorial lens.
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <AppButton component={Link} href="/shop" sx={{ px: 4 }}>
                Shop the Drop
              </AppButton>
              <Chip
                label={`Next Drop In: ${String(timeLeft.days).padStart(2, "0")} Days ${String(
                  timeLeft.hours
                ).padStart(2, "0")} Hours`}
                sx={(theme) => ({ bgcolor: theme.palette.brand.navGlass, color: "background.paper" })}
              />
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 3 }}>
        <Card
          sx={{
            border: (theme) => `1px solid ${theme.palette.brand.border}`,
            bgcolor: "background.paper",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                Drop 02 - February Edit
              </Typography>
              <Typography sx={{ opacity: 0.8 }}>
                Limited Pieces. No Restocks. Updated weekly.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip color="error" label="Limited Stock" />
              <Chip variant="outlined" label="Updated Weekly" />
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Divider sx={{ width: "60%", mx: "auto", mb: 4 }} />

      <Box sx={{ bgcolor: "background.default", py: 5 }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Box>
              <Typography variant="h4" sx={{ mb: 0.5, letterSpacing: 2 }}>
                Just Dropped
              </Typography>
              <Typography sx={{ opacity: 0.8 }}>
                {newProducts.length} pieces from the latest release.
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography sx={{ textAlign: "center", opacity: 0.8 }}>{error}</Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {primaryGrid.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={getProductId(product)}>
                    <Box sx={{ position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          zIndex: 3,
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          pointerEvents: "none",
                        }}
                      >
                        <Chip size="small" label="NEW" color="secondary" />
                        {isLimited(product) ? (
                          <Chip size="small" label="Limited" color="error" />
                        ) : null}
                      </Box>
                      <ProductCard product={product} />
                    </Box>
                    <Typography sx={{ mt: 1, opacity: 0.75, fontSize: 13 }}>
                      Release: {formatReleaseDate(product)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              <Container sx={{ py: { xs: 6, md: 8 } }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  Styled This Way
                </Typography>
                <Typography sx={{ opacity: 0.78, mb: 3 }}>
                  Editorial inspiration from this drop.
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        image={
                          styleAnchor?.images?.[1] ||
                          styleAnchor?.images?.[0] ||
                          "https://images.unsplash.com/photo-1516257984-b1b4d707412e"
                        }
                        alt="Styled editorial look"
                        sx={{ height: { xs: 320, md: 520 }, objectFit: "cover" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: (theme) =>
                            `linear-gradient(to top, ${theme.palette.brand.overlayStrong}, ${theme.palette.brand.overlaySoft})`,
                          display: "flex",
                          alignItems: "end",
                          p: 3,
                        }}
                      >
                        <Box>
                          <Typography sx={{ color: "background.paper", fontWeight: 600, mb: 1 }}>
                            Editorial Look Tag
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {primaryGrid.slice(0, 3).map((product) => (
                              <Chip
                                key={getProductId(product)}
                                component={Link}
                                clickable
                                href="/shop"
                                label={getName(product)}
                                sx={(theme) => ({ bgcolor: theme.palette.brand.navGlass, color: "background.paper" })}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Look Direction
                        </Typography>
                        <Typography sx={{ opacity: 0.8, mb: 2 }}>
                          Pair sharp outer layers with grounded neutrals and elevated
                          accessories for a complete arrival-day silhouette.
                        </Typography>
                        <AppButton component={Link} href="/shop" fullWidth>
                          Shop the Look
                        </AppButton>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Container>

              {secondaryGrid.length > 0 ? (
                <Grid container spacing={3}>
                  {secondaryGrid.map((product) => (
                    <Grid item xs={12} sm={6} md={3} key={getProductId(product)}>
                      <Box sx={{ position: "relative" }}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            zIndex: 3,
                            display: "flex",
                            gap: 0.5,
                            pointerEvents: "none",
                          }}
                        >
                          <Chip size="small" label="NEW" color="secondary" />
                          {isLimited(product) ? (
                            <Chip size="small" label="Limited" color="error" />
                          ) : null}
                        </Box>
                        <ProductCard product={product} />
                      </Box>
                      <Typography sx={{ mt: 1, opacity: 0.75, fontSize: 13 }}>
                        Release: {formatReleaseDate(product)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              ) : null}
            </>
          )}
        </Container>
      </Box>

      <Box sx={{ py: 6, bgcolor: (theme) => theme.palette.brand.borderSoft }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 1 }}>
            Trending Now
          </Typography>
          <Typography sx={{ opacity: 0.78, mb: 3 }}>
            Most added to cart and most viewed.
          </Typography>

          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Most Added To Cart
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 1,
              mb: 4,
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "primary.main" },
            }}
          >
            {trendingByCart.length ? (
              trendingByCart.map((product) => (
                <Card key={`cart-${getProductId(product)}`} sx={{ minWidth: 260, flex: "0 0 auto" }}>
                  <CardActionArea component={Link} href={`/shop/${encodeURIComponent(getProductId(product))}`}>
                    <CardMedia component="img" height="220" image={getImage(product)} alt={getName(product)} />
                    <CardContent>
                      <Typography sx={{ fontWeight: 600 }}>{getName(product)}</Typography>
                      <Typography sx={{ opacity: 0.72, fontSize: 13 }}>
                        Added to cart: {getCartTrendScore(product)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
            ) : (
              <Typography sx={{ opacity: 0.7 }}>No cart trend data yet.</Typography>
            )}
          </Box>

          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Most Viewed
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 1,
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "primary.main" },
            }}
          >
            {trendingByViews.length ? (
              trendingByViews.map((product) => (
                <Card key={`view-${getProductId(product)}`} sx={{ minWidth: 260, flex: "0 0 auto" }}>
                  <CardActionArea component={Link} href={`/shop/${encodeURIComponent(getProductId(product))}`}>
                    <CardMedia component="img" height="220" image={getImage(product)} alt={getName(product)} />
                    <CardContent>
                      <Typography sx={{ fontWeight: 600 }}>{getName(product)}</Typography>
                      <Typography sx={{ opacity: 0.72, fontSize: 13 }}>
                        Views: {getMostViewedScore(product)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
            ) : (
              <Typography sx={{ opacity: 0.7 }}>No view data yet.</Typography>
            )}
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 6, textAlign: "center", px: 3, bgcolor: "background.default" }}>
        <Typography variant="h4" sx={{ mb: 1, letterSpacing: 2, color: "primary.main" }}>
          Designed To Lead
        </Typography>
        <Typography sx={{ maxWidth: 820, mx: "auto", opacity: 0.82 }}>
          Each drop is curated with intent. No excess. Just precision, presence, and
          identity.
        </Typography>
      </Box>
    </>
  );
}
