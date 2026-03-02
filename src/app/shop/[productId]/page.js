"use client";

import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { AppButton, AppInput, useToast } from "@/components/common";
import { CartContext } from "@/context/CartContext";
import { WishlistContext } from "@/context/WishlistContext";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import { addRecentlyViewedId, getRecentlyViewedIds } from "@/lib/recentlyViewed";
import { getProductByIdApi, reviewsApi } from "@/lib/api";

const getProductId = (product) => String(product?._id || product?.id || product?.productId || "");
const getImageList = (product) => {
  if (Array.isArray(product?.images) && product.images.length) return product.images;
  if (product?.image) return [product.image];
  return ["/homepic.jpeg"];
};
const getPrice = (product) => Number(product?.price || 0);
const getOriginalPrice = (product) => {
  const original = Number(product?.originalPrice || product?.mrp || 0);
  return original > getPrice(product) ? original : getPrice(product);
};
const getStock = (product) => Number(product?.stock ?? 0);
const getName = (product) => product?.name || "Product";
const getCollection = (product) => product?.collection || "Black Edition";
const getCategory = (product) => product?.category || "Fashion";
const getSpecs = (product) => product?.productSpecifications || {};
const currency = (value) => `Rs ${Math.round(value).toLocaleString("en-IN")}`;
const discount = (price, original) =>
  original > price ? Math.round(((original - price) / original) * 100) : 0;

const getSizes = (product) => {
  if (Array.isArray(product?.variants) && product.variants.length) {
    return product.variants
      .map((variant) => ({
        label: String(variant?.size || "").toUpperCase(),
        available: Number(variant?.stock ?? 0) > 0,
      }))
      .filter((item) => Boolean(item.label));
  }
  if (Array.isArray(product?.sizes) && product.sizes.length) {
    return product.sizes.map((size) => ({ label: String(size).toUpperCase(), available: true }));
  }
  return ["XS", "S", "M", "L", "XL"].map((size) => ({ label: size, available: true }));
};

const getColors = (product) => {
  if (Array.isArray(product?.colors) && product.colors.length) return product.colors;
  if (Array.isArray(product?.variants) && product.variants.length) {
    const options = Array.from(new Set(product.variants.map((variant) => variant?.color).filter(Boolean)));
    if (options.length) return options;
  }
  return ["Black", "Stone", "Navy"];
};

const CRAFT_IMAGES = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
];

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { products } = useProducts();
  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const productId = String(params?.productId || "");
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 4, text: "" });
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadProductById() {
      if (!productId) return;
      setProductLoading(true);
      setProductError("");
      try {
        const data = await getProductByIdApi(productId);
        if (!active) return;
        const resolved = data?.product || data?.data || data || null;
        setProduct(resolved);
      } catch (err) {
        if (!active) return;
        setProductError(err.message || "Failed to load product.");
      } finally {
        if (active) setProductLoading(false);
      }
    }
    loadProductById();
    return () => {
      active = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    const sizes = getSizes(product);
    const colors = getColors(product);
    if (!selectedSize && sizes.length) {
      const firstAvailable = sizes.find((size) => size.available)?.label || sizes[0].label;
      setSelectedSize(firstAvailable);
    }
    if (!selectedColor && colors.length) {
      setSelectedColor(String(colors[0]));
    }
  }, [product, selectedColor, selectedSize]);

  useEffect(() => {
    if (!productId) return;
    const next = addRecentlyViewedId(productId);
    setRecentlyViewed(next);
  }, [productId]);

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewedIds());
  }, []);

  useEffect(() => {
    let active = true;
    async function loadReviews() {
      if (!productId) return;
      try {
        const data = await reviewsApi.listByProduct(productId);
        if (!active) return;
        const list = data?.reviews || data?.data || data || [];
        setReviews(Array.isArray(list) ? list : []);
      } catch (err) {
        if (active) {
          setReviews([]);
        }
      }
    }
    loadReviews();
    return () => {
      active = false;
    };
  }, [productId]);

  const isWishlisted = wishlist.some((item) => getProductId(item) === productId);

  const images = product ? getImageList(product) : [];
  const activeImage = images[selectedImageIndex] || images[0];
  const price = getPrice(product || {});
  const original = getOriginalPrice(product || {});
  const off = discount(price, original);
  const stock = getStock(product || {});
  const specs = getSpecs(product || {});
  const specPairs = [
    { label: "Fit", value: specs?.fit || "-" },
    { label: "Material", value: specs?.material || "-" },
    { label: "Pattern", value: specs?.pattern || "-" },
    { label: "Neckline", value: specs?.neckline || "-" },
    { label: "Sleeve Type", value: specs?.sleeveType || "-" },
    { label: "Closure", value: specs?.closure || "-" },
    { label: "Country of Origin", value: specs?.countryOfOrigin || "-" },
    { label: "Fabric GSM", value: specs?.fabricWeightGsm ? String(specs.fabricWeightGsm) : "-" },
  ];

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => getProductId(item) !== productId)
      .filter((item) => item?.category === product?.category || item?.collection === product?.collection)
      .slice(0, 4);
  }, [product, productId, products]);

  const recentlyViewedProducts = useMemo(() => {
    if (!products.length) return [];
    return recentlyViewed
      .filter((id) => id !== productId)
      .map((id) => products.find((item) => getProductId(item) === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [productId, products, recentlyViewed]);

  const averageRating = useMemo(() => {
    const apiRating = Number(product?.rating || 0);
    const combined = [...reviews];
    if (!combined.length) return apiRating || 4.3;
    const sum = combined.reduce((acc, review) => acc + Number(review.rating || 0), 0);
    return sum / combined.length;
  }, [product?.rating, reviews]);

  const reviewCount = Math.max(Number(product?.reviewCount || 0), reviews.length);

  if (productLoading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Loading product...</Typography>
      </Container>
    );
  }

  if (productError || !product) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography sx={{ mb: 2 }}>{productError || "Product not found."}</Typography>
        <AppButton component={Link} href="/shop">
          Back to Shop
        </AppButton>
      </Container>
    );
  }

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        toast.info("Removed from wishlist.");
      } else {
        await addToWishlist(product);
        toast.success("Saved to wishlist.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update wishlist.");
    }
  };

  const addToBag = async (buyNow = false) => {
    if (stock <= 0) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (!selectedSize) {
      toast.info("Please select a size.");
      return;
    }

    try {
      await addToCart({ ...product, quantity, size: selectedSize, color: selectedColor });
      toast.success("Added to bag.");
      if (buyNow) router.push("/cart");
    } catch (err) {
      if (err.message === "Unauthorized") {
        toast.info("Please login to continue.");
        router.push("/login");
        return;
      }
      toast.error(err.message || "Failed to add to bag.");
    }
  };

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.text) {
      toast.info("Please enter your name and review.");
      return;
    }
    try {
      await reviewsApi.create({
        productId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.text,
        title: "",
      });
      const data = await reviewsApi.listByProduct(productId);
      const list = data?.reviews || data?.data || data || [];
      setReviews(Array.isArray(list) ? list : []);
      setReviewForm({ name: "", rating: 4, text: "" });
      toast.success("Review submitted.");
    } catch (err) {
      if (err.message === "Unauthorized") {
        toast.info("Please login to submit a review.");
        router.push("/login");
        return;
      }
      toast.error(err.message || "Failed to submit review.");
    }
  };

  const stockText =
    stock <= 0 ? "Out of stock" : stock <= 3 ? `Only ${stock} left` : "In stock";

  const modelInfo = "Model is 6'1 wearing size M";
  const estimatedDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  })();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Grid container spacing={1.2}>
            <Grid item xs={12} md={2}>
              <Stack direction={{ xs: "row", md: "column" }} spacing={1} sx={{ overflowX: "auto" }}>
                {images.map((image, idx) => (
                  <Box
                    key={`${image}-${idx}`}
                    component="img"
                    src={image}
                    alt={`${getName(product)}-${idx + 1}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    sx={{
                      width: { xs: 72, md: "100%" },
                      height: { xs: 92, md: 104 },
                      objectFit: "cover",
                      borderRadius: 1.5,
                      border: (theme) =>
                        selectedImageIndex === idx
                          ? `2px solid ${theme.palette.primary.main}`
                          : `1px solid ${theme.palette.brand.borderSoft}`,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={10}>
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.brand.borderSoft}`,
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  src={activeImage}
                  alt={getName(product)}
                  sx={{
                    width: "100%",
                    aspectRatio: "4 / 5",
                    objectFit: "cover",
                    transition: "transform 0.35s ease",
                    "&:hover": { transform: "scale(1.16)" },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={1.3}>
            <Typography sx={{ fontSize: 13, opacity: 0.66 }}>
              {getCollection(product)} | {getCategory(product)}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              {getName(product)}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: 26, fontWeight: 700 }}>{currency(price)}</Typography>
              {original > price ? (
                <Typography sx={{ textDecoration: "line-through", opacity: 0.6 }}>
                  {currency(original)}
                </Typography>
              ) : null}
              {off > 0 ? <Chip label={`-${off}%`} color="success" size="small" /> : null}
            </Stack>
            <Typography sx={{ fontSize: 13, opacity: 0.72 }}>
              EMI from {currency(Math.max(1, price / 3))}/month
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.72 }}>
              {specs?.fit || "Regular fit"} | {specs?.material || "Premium fabric blend"}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.8 }}>Size</Typography>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                {getSizes(product).map((size) => (
                  <Chip
                    key={size.label}
                    label={size.label}
                    clickable={size.available}
                    onClick={() => (size.available ? setSelectedSize(size.label) : null)}
                    variant={selectedSize === size.label ? "filled" : "outlined"}
                    color={selectedSize === size.label ? "secondary" : "default"}
                    sx={{
                      opacity: size.available ? 1 : 0.35,
                      textDecoration: size.available ? "none" : "line-through",
                    }}
                  />
                ))}
              </Stack>
              <Typography sx={{ fontSize: 12, opacity: 0.66, mt: 0.7 }}>
                Size guide | {modelInfo}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.8 }}>Color</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {getColors(product).map((color) => (
                  <Chip
                    key={String(color)}
                    label={String(color)}
                    onClick={() => setSelectedColor(String(color))}
                    variant={selectedColor === String(color) ? "filled" : "outlined"}
                    color={selectedColor === String(color) ? "secondary" : "default"}
                  />
                ))}
              </Stack>
            </Box>

            <Chip
              size="small"
              color={stock <= 0 ? "default" : stock <= 3 ? "error" : "success"}
              label={stockText}
              sx={{ alignSelf: "start" }}
            />

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <AppButton variant="outlined" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </AppButton>
              <Typography sx={{ minWidth: 20, textAlign: "center" }}>{quantity}</Typography>
              <AppButton variant="outlined" onClick={() => setQuantity((q) => q + 1)}>
                +
              </AppButton>
            </Stack>

            <Stack direction="row" spacing={1}>
              <AppButton fullWidth onClick={() => addToBag(false)}>
                Add to Bag
              </AppButton>
              <AppButton fullWidth variant="outlined" onClick={() => addToBag(true)}>
                Buy Now
              </AppButton>
              <IconButton
                onClick={toggleWishlist}
                sx={(theme) => ({ border: `1px solid ${theme.palette.brand.border}` })}
              >
                {isWishlisted ? <FavoriteIcon sx={{ color: "primary.main" }} /> : <FavoriteBorderIcon />}
              </IconButton>
            </Stack>

            <Card sx={(theme) => ({ border: `1px solid ${theme.palette.brand.borderSoft}` })}>
              <CardContent sx={{ py: 1.5 }}>
                <Stack spacing={0.8}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalShippingOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontSize: 14 }}>Free shipping over Rs 1999</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AutorenewOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontSize: 14 }}>7-day returns</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PaymentsOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontSize: 14 }}>COD available | Delivery by {estimatedDate}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Product Description</Typography>
        <Typography sx={{ opacity: 0.82, mb: 1.5 }}>
          {product?.description ||
            "Crafted with deliberate structure and a clean silhouette, this piece is designed for elevated everyday dressing with long-term wardrobe value."}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><Card><CardContent><Typography sx={{ fontWeight: 600 }}>Fabric</Typography><Typography sx={{ opacity: 0.78 }}>{specs?.material || "Premium blended weave with soft finish."}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={3}><Card><CardContent><Typography sx={{ fontWeight: 600 }}>Care</Typography><Typography sx={{ opacity: 0.78 }}>{Array.isArray(specs?.careInstructions) && specs.careInstructions.length ? specs.careInstructions[0] : "Dry clean preferred. Cool iron if needed."}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={3}><Card><CardContent><Typography sx={{ fontWeight: 600 }}>Fit</Typography><Typography sx={{ opacity: 0.78 }}>{specs?.fit || "Structured regular fit with clean shoulder line."}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} md={3}><Card><CardContent><Typography sx={{ fontWeight: 600 }}>Occasion</Typography><Typography sx={{ opacity: 0.78 }}>{Array.isArray(specs?.occasion) && specs.occasion.length ? specs.occasion.join(", ") : "Evening, smart casual, and formal styling."}</Typography></CardContent></Card></Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Product Specifications</Typography>
        <Grid container spacing={1.4}>
          {specPairs.map((spec) => (
            <Grid item xs={12} sm={6} md={3} key={spec.label}>
              <Card>
                <CardContent sx={{ py: 1.3 }}>
                  <Typography sx={{ fontSize: 12, opacity: 0.68 }}>{spec.label}</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{spec.value || "-"}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {specs?.sizeAndFit ? (
          <Card sx={{ mt: 1.6 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 600, mb: 0.7 }}>Size & Fit</Typography>
              <Typography sx={{ opacity: 0.8 }}>
                Model Height: {specs.sizeAndFit.modelHeight || "-"} | Wearing: {specs.sizeAndFit.modelWearing || "-"}
              </Typography>
              <Typography sx={{ opacity: 0.8 }}>
                {specs.sizeAndFit.fitNote || "-"}
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        {specs?.measurementsCm ? (
          <Card sx={{ mt: 1.6 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Size Guide (cm)</Typography>
              <Grid container spacing={1}>
                {Object.entries(specs.measurementsCm).map(([sizeKey, values]) => (
                  <Grid item xs={12} md={6} key={sizeKey}>
                    <Box
                      sx={(theme) => ({
                        p: 1,
                        border: `1px solid ${theme.palette.brand.borderSoft}`,
                        borderRadius: 1.2,
                      })}
                    >
                      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{sizeKey}</Typography>
                      <Typography sx={{ fontSize: 13, opacity: 0.8 }}>
                        Chest: {values?.chest ?? "-"}, Length: {values?.length ?? "-"}, Shoulder: {values?.shoulder ?? "-"}, Sleeve: {values?.sleeve ?? "-"}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        ) : null}
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Craft & Detail</Typography>
        <Typography sx={{ opacity: 0.8, mb: 2 }}>
          Close-up detailing on stitch precision, button finishing, and fabric quality.
        </Typography>
        <Grid container spacing={2}>
          {CRAFT_IMAGES.map((img) => (
            <Grid item xs={12} md={4} key={img}>
              <Card>
                <CardMedia component="img" image={img} sx={{ height: 260, objectFit: "cover" }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Reviews</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Rating value={averageRating} precision={0.1} readOnly />
          <Typography sx={{ opacity: 0.8 }}>
            {averageRating.toFixed(1)} ({reviewCount} reviews)
          </Typography>
        </Stack>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={1.2}>
              <Grid item xs={12} sm={4}>
                <AppInput
                  size="small"
                  label="Name"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm((p) => ({ ...p, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <AppInput
                  select
                  size="small"
                  label="Rating"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </AppInput>
              </Grid>
              <Grid item xs={12} sm={5}>
                <AppInput
                  size="small"
                  label="Write a review"
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm((p) => ({ ...p, text: e.target.value }))}
                />
              </Grid>
            </Grid>
            <AppButton sx={{ mt: 1.5 }} onClick={submitReview}>
              Submit Review
            </AppButton>
          </CardContent>
        </Card>

        <Stack spacing={1.2}>
          {reviews.slice(0, 4).map((review, idx) => (
            <Card key={review.id || review._id || idx}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontWeight: 600 }}>{review.name || review.userName || "User"}</Typography>
                  <Typography sx={{ opacity: 0.7, fontSize: 13 }}>
                    {new Date(review.createdAt || Date.now()).toLocaleDateString("en-IN")}
                  </Typography>
                </Stack>
                <Rating value={review.rating} readOnly size="small" />
                <Typography sx={{ opacity: 0.82 }}>{review.comment || review.text || "-"}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {relatedProducts.length > 0 ? (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Related Products / Complete the Look</Typography>
          <Grid container spacing={2.2}>
            {relatedProducts.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={getProductId(item)}>
                <ProductCard product={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}

      {recentlyViewedProducts.length > 0 ? (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Recently Viewed</Typography>
          <Grid container spacing={2.2}>
            {recentlyViewedProducts.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={`recent-${getProductId(item)}`}>
                <ProductCard product={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}
    </Container>
  );
}
