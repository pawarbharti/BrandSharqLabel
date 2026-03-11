"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ProductCard from "../../components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { AppButton, AppInput } from "@/components/common";

const ITEMS_PER_PAGE = 8;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
];

const getProductId = (product) =>
  product?._id || product?.id || product?.productId;
const getProductName = (product) => product?.name || "";
const getProductPrice = (product) => Number(product?.price || 0);
const getProductCategory = (product) =>
  String(product?.category || "uncategorized").toLowerCase();
const getProductCollection = (product) =>
  String(product?.collection || "general").toLowerCase();
const getProductStock = (product) => Number(product?.stock ?? 999);
const getProductCreatedAt = (product) =>
  new Date(product?.createdAt || product?.updatedAt || 0).getTime() || 0;
const isNewProduct = (product) => Boolean(product?.isNew);

export default function ShopPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { products, loading, error } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(getProductCategory)));
    return unique.filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const collections = useMemo(() => {
    const unique = Array.from(new Set(products.map(getProductCollection)));
    return unique.filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch =
        !query ||
        getProductName(product).toLowerCase().includes(query) ||
        getProductCategory(product).includes(query) ||
        getProductCollection(product).includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        getProductCategory(product) === selectedCategory;

      const matchesCollection =
        selectedCollection === "all" ||
        getProductCollection(product) === selectedCollection;

      const stock = getProductStock(product);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && stock > 0) ||
        (stockFilter === "low-stock" && stock > 0 && stock < 10) ||
        (stockFilter === "out-of-stock" && stock <= 0);

      return (
        matchesSearch && matchesCategory && matchesCollection && matchesStock
      );
    });

    const sorted = [...filtered];
    switch (selectedSort) {
      case "price-asc":
        sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        break;
      case "name-asc":
        sorted.sort((a, b) =>
          getProductName(a).localeCompare(getProductName(b), undefined, {
            sensitivity: "base",
          }),
        );
        break;
      case "name-desc":
        sorted.sort((a, b) =>
          getProductName(b).localeCompare(getProductName(a), undefined, {
            sensitivity: "base",
          }),
        );
        break;
      case "newest":
        sorted.sort((a, b) => getProductCreatedAt(b) - getProductCreatedAt(a));
        break;
      case "featured":
      default:
        sorted.sort(
          (a, b) => Number(isNewProduct(b)) - Number(isNewProduct(a)),
        );
        break;
    }

    return sorted;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedCollection,
    selectedSort,
    stockFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    selectedCollection,
    selectedSort,
    stockFilter,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCollection("all");
    setSelectedSort("featured");
    setStockFilter("all");
    setCurrentPage(1);
  };

  return (
    <>
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
          color: (theme) => theme.palette.text.primary,
        }}
      > 
      <Box
    component="video"
    autoPlay
    muted
    loop
    playsInline
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: -2,
    }}
  >
    <source src="/shopvideo.mp4" type="video/mp4" />
  </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: (theme) =>
              `linear-gradient(to bottom, ${theme.palette.brand.overlayStrong}, ${theme.palette.brand.overlaySoft})`,
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
              color: "background.paper",
              textShadow: (theme) => theme.palette.brand.heroTextShadow,
            }}
          >
            SHARQ LABEL
          </Typography>

          <Typography
            sx={{
              letterSpacing: 6,
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.brand.gradientEnd
                  : theme.palette.primary.main,
              fontWeight: 300,
              mb: 3,
            }}
          >
            REFINED. FEARLESS. DISTINCT.
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              color: (theme) => theme.palette.text.secondary,
              lineHeight: 1.9,
              mb: 4,
            }}
          >
            Luxury is not what you wear. It is how you carry it.
          </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 3 }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            maxWidth: "850px",
            mx: "auto",
            fontStyle: "italic",
            color: (theme) => theme.palette.text.secondary,
            lineHeight: 1.8,
          }}
        >
          True luxury whispers. It does not shout.
        </Typography>
      </Container>

      <Divider
        sx={{
          width: "60%",
          mx: "auto",
          mb: 3,
          borderColor: (theme) => theme.palette.brand.border,
        }}
      />

      <Box
        sx={{
          bgcolor: "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              letterSpacing: 3,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Discover The Collection
          </Typography>

          <Box
            sx={{
              mb: 4,
              p: 2,
              border: (theme) => `1px solid ${theme.palette.brand.border}`,
              bgcolor: (theme) => theme.palette.background.paper,
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
                lg: "repeat(5, minmax(0, 1fr))",
              },
            }}
          >
            <AppInput
              label="Search products"
              placeholder="Search by name, category, collection"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Collection</InputLabel>
              <Select
                label="Collection"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                <MenuItem value="all">All Collections</MenuItem>
                {collections.map((collection) => (
                  <MenuItem key={collection} value={collection}>
                    {collection}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                label="Availability"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="in-stock">In Stock</MenuItem>
                <MenuItem value="low-stock">Low Stock (&lt;10)</MenuItem>
                <MenuItem value="out-of-stock">Out Of Stock</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                label="Sort By"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{ gridColumn: { xs: "1 / -1", lg: "auto" }, display: "flex" }}
            >
              <AppButton
                variant="outlined"
                onClick={resetFilters}
                sx={{ width: "100%", borderColor: "primary.main" }}
              >
                Reset Filters
              </AppButton>
            </Box>
          </Box>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.text.secondary }}>
              Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
              products
            </Typography>
            <Chip
              color="secondary"
              label={`Page ${currentPage} of ${totalPages}`}
              variant="outlined"
            />
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography sx={{ textAlign: "center", opacity: 0.8 }}>
              {error}
            </Typography>
          ) : filteredProducts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                No products found
              </Typography>
              <Typography sx={{ mb: 2, opacity: 0.8 }}>
                Try changing filters, search term, or sorting.
              </Typography>
              <AppButton variant="outlined" onClick={resetFilters}>
                Clear Filters
              </AppButton>
            </Box>
          ) : (
            <>
              <Grid container spacing={4}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={getProductId(product)}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <Pagination
                  color="primary"
                  page={currentPage}
                  count={totalPages}
                  onChange={(_, page) => setCurrentPage(page)}
                  shape="rounded"
                />
              </Box>
            </>
          )}
        </Container>
      </Box>

      <Box
        sx={{
          bgcolor: "background.default",
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
            color: "primary.main",
          }}
        >
          More Than Fashion
        </Typography>

        <Typography
          sx={{
            maxWidth: "850px",
            margin: "0 auto",
            lineHeight: 1.9,
            color: (theme) => theme.palette.text.secondary,
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
