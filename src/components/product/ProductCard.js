"use client";

import Link from "next/link";
import { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { WishlistContext } from "@/context/WishlistContext";
import { CartContext } from "@/context/CartContext";
import { AppButton, AppTooltip, useToast } from "@/components/common";
import { addRecentlyViewedId } from "@/lib/recentlyViewed";

const getProductId = (product) => product?._id || product?.id || product?.productId;
const getImage = (product, hovered) =>
  hovered && product?.images?.[1]
    ? product.images[1]
    : product?.images?.[0] || product?.image || "/homepic.jpeg";
const getName = (product) => product?.name || "Product";
const getCollection = (product) => product?.collection || "";
const getCategory = (product) => product?.category || "";
const getPrice = (product) => Number(product?.price || 0);
const getSpecs = (product) => product?.productSpecifications || {};
const getOriginalPrice = (product) => {
  const original = Number(product?.originalPrice || product?.mrp || 0);
  return original > getPrice(product) ? original : getPrice(product);
};
const getStock = (product) => Number(product?.stock ?? 0);

const getSizes = (product) => {
  if (Array.isArray(product?.variants) && product.variants.length) {
    return product.variants
      .map((variant) => ({
        label: String(variant?.size || "").toUpperCase(),
        available: Number(variant?.stock ?? 0) > 0,
      }))
      .filter((size) => Boolean(size.label));
  }

  if (Array.isArray(product?.sizes) && product.sizes.length) {
    return product.sizes.map((size) => ({
      label: String(size).toUpperCase(),
      available: true,
    }));
  }

  if (product?.size) {
    return [{ label: String(product.size).toUpperCase(), available: true }];
  }

  return [];
};

const discountPercent = (price, originalPrice) => {
  if (originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const stockLabel = (stock) => {
  if (stock <= 0) return { label: "Sold Out", color: "default" };
  if (stock <= 3) return { label: `Only ${stock} left`, color: "error" };
  if (stock < 10) return { label: "Low stock", color: "warning" };
  return { label: "In stock", color: "success" };
};

const currency = (value) => `Rs ${Math.round(value).toLocaleString("en-IN")}`;

export default function ProductCard({ product }) {
  const router = useRouter();
  const toast = useToast();
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const [hovered, setHovered] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const productId = getProductId(product);
  const isWishlisted = wishlist.some((item) => getProductId(item) === productId);

  const price = getPrice(product);
  const originalPrice = getOriginalPrice(product);
  const discount = discountPercent(price, originalPrice);
  const stock = getStock(product);
  const stockChip = stockLabel(stock);
  const sizes = getSizes(product);
  const specs = getSpecs(product);
  const specPreview = [specs?.fit, specs?.material].filter(Boolean).join(" | ");

  const badges = useMemo(() => {
    const list = [];
    if (product?.isNew) list.push({ label: "New", color: "secondary" });
    if (product?.isBestSeller || Number(product?.rating || 0) >= 4.7) {
      list.push({ label: "Best Seller", color: "warning" });
    }
    if (stock > 0 && stock <= 5) list.push({ label: "Limited", color: "error" });
    if (discount > 0) list.push({ label: `${discount}% Off`, color: "success" });
    if (stock <= 0) list.push({ label: "Sold Out", color: "default" });
    return list.slice(0, 2);
  }, [discount, product?.isBestSeller, product?.isNew, product?.rating, stock]);

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        toast.info(`${getName(product)} removed from wishlist.`);
      } else {
        await addToWishlist(product);
        toast.success(`${getName(product)} added to wishlist.`);
      }
    } catch (err) {
      if (err.message === "Unauthorized") {
        toast.info("Please login to update your wishlist.");
        router.push("/login");
        return;
      }
      toast.error(err.message || "Failed to update wishlist.");
    }
  };

  const addToBag = async (sizeValue) => {
    if (stock <= 0) {
      toast.error("This product is sold out.");
      return;
    }
    try {
      await addToCart({ ...product, size: sizeValue || selectedSize });
      toast.success(`${getName(product)} added to bag.`);
    } catch (err) {
      if (err.message === "Unauthorized") {
        toast.info("Please login to add items to bag.");
        router.push("/login");
        return;
      }
      toast.error(err.message || "Failed to add product to cart.");
    }
  };

  const onQuickAdd = async () => {
    const hasSizeOptions = sizes.length > 0;
    if (hasSizeOptions && !selectedSize) {
      setSizeModalOpen(true);
      return;
    }
    await addToBag(selectedSize);
  };

  return (
    <>
      <Card
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          position: "relative",
          maxWidth: 280,
          mx: "auto",
          borderRadius: "14px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          boxShadow: (theme) => theme.palette.brand.shadowCard,
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: (theme) => theme.palette.brand.shadowCardStrong,
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Box
            component={Link}
            href={`/shop/${encodeURIComponent(productId)}`}
            onClick={() => addRecentlyViewedId(productId)}
            sx={{ display: "block", textDecoration: "none" }}
          >
            <CardMedia
              component="img"
              image={getImage(product, hovered)}
              alt={getName(product)}
              sx={{
                width: "100%",
                aspectRatio: "4 / 4.8",
                objectFit: "cover",
                transition: "0.35s ease",
                transform: hovered ? "scale(1.03)" : "scale(1)",
              }}
            />
          </Box>

          {badges.length > 0 ? (
            <Stack
              direction="row"
              spacing={0.7}
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 2,
                flexWrap: "wrap",
              }}
            >
              {badges.map((badge) => (
                <Chip
                  key={badge.label}
                  size="small"
                  label={badge.label}
                  color={badge.color}
                  sx={{ fontSize: 11, height: 23 }}
                />
              ))}
            </Stack>
          ) : null}

          <AppTooltip title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}>
            <IconButton
              onClick={handleWishlistToggle}
              sx={(theme) => ({
                position: "absolute",
                top: 10,
                right: 10,
                bgcolor: theme.palette.brand.navGlass,
                zIndex: 3,
                transition: "all 0.2s ease",
                transform: isWishlisted ? "scale(1.08)" : "scale(1)",
                "&:hover": { bgcolor: theme.palette.background.paper },
              })}
            >
              {isWishlisted ? (
                <FavoriteIcon sx={{ color: "primary.main", fontSize: 20 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </AppTooltip>

          <Box
            sx={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 12,
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.23s ease",
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            <AppButton
              fullWidth
              startIcon={<ShoppingBagOutlinedIcon />}
              size="small"
              onClick={onQuickAdd}
              disabled={stock <= 0}
              sx={{
                borderRadius: 20,
                background: "primary.main",
                color: "primary.contrastText",
                "&:hover": { background: "primary.dark" },
              }}
            >
              {sizes.length > 0 && !selectedSize ? "Select Size" : "Quick Add"}
            </AppButton>
          </Box>
        </Box>

        <CardContent sx={{ p: 1.25 }}>
          {(getCollection(product) || getCategory(product)) && (
            <Typography sx={{ fontSize: 12, opacity: 0.65, mb: 0.4 }}>
              {getCollection(product) || getCategory(product)}
            </Typography>
          )}
          {specPreview ? (
            <Typography sx={{ fontSize: 11, opacity: 0.62, mb: 0.35 }}>
              {specPreview}
            </Typography>
          ) : null}

          <Typography
            component={Link}
            href={`/shop/${encodeURIComponent(productId)}`}
            onClick={() => addRecentlyViewedId(productId)}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 38,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
              mb: 0.45,
              fontSize: 14,
            }}
          >
            {getName(product)}
          </Typography>

          <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.8 }}>
            <Typography sx={{ fontWeight: 700 }}>{currency(price)}</Typography>
            {originalPrice > price ? (
              <Typography sx={{ textDecoration: "line-through", opacity: 0.6, fontSize: 14 }}>
                {currency(originalPrice)}
              </Typography>
            ) : null}
            {discount > 0 ? (
              <Typography sx={{ fontSize: 12, color: "success.main", fontWeight: 600 }}>
                -{discount}%
              </Typography>
            ) : null}
          </Stack>

          {sizes.length > 0 ? (
            <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap sx={{ mb: 0.9 }}>
              {sizes.slice(0, 6).map((size) => (
                <Chip
                  key={size.label}
                  label={size.label}
                  size="small"
                  onClick={() => (size.available ? setSelectedSize(size.label) : null)}
                  variant={selectedSize === size.label ? "filled" : "outlined"}
                  color={selectedSize === size.label ? "secondary" : "default"}
                  sx={{
                    height: 22,
                    fontSize: 11,
                    opacity: size.available ? 1 : 0.4,
                    textDecoration: size.available ? "none" : "line-through",
                  }}
                />
              ))}
            </Stack>
          ) : null}

          <Chip size="small" color={stockChip.color} label={stockChip.label} sx={{ fontSize: 11, height: 22 }} />
        </CardContent>
      </Card>

      <Dialog open={sizeModalOpen} onClose={() => setSizeModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Select Size</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ pt: 1 }}>
            {sizes.map((size) => (
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
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <AppButton variant="outlined" onClick={() => setSizeModalOpen(false)}>
            Cancel
          </AppButton>
          <AppButton
            onClick={async () => {
              if (!selectedSize) {
                toast.info("Select size first.");
                return;
              }
              await addToBag(selectedSize);
              setSizeModalOpen(false);
            }}
          >
            Add to Bag
          </AppButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
