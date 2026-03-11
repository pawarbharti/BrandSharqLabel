"use client";

import Link from "next/link";
import { useContext, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartContext } from "@/context/CartContext";
import { WishlistContext } from "@/context/WishlistContext";
import { AppButton, AppInput, useToast } from "@/components/common";

const FREE_SHIPPING_THRESHOLD = 1999;
const GST_RATE = 0.12;
const STANDARD_SHIPPING = 120;

const getProductId = (item) => item?.id || item?._id || item?.productId;
const currency = (value) => `Rs ${Math.round(value).toLocaleString("en-IN")}`;

const getOriginalPrice = (item) => {
  const original = Number(item?.originalPrice || 0);
  if (original > Number(item?.price || 0)) return original;
  return Number(item?.price || 0);
};

const getItemSize = (item) => item?.size || item?.variant?.size || "Free Size";
const getItemColor = (item) => item?.color || item?.variant?.color || "Default";
const getItemCategory = (item) => item?.category || "General";
const getItemCollection = (item) => item?.collection || "";
const getItemDescription = (item) =>
  item?.description || "Refined essential crafted for modern everyday wear.";

const estimatedDeliveryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 4);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function CartPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const toast = useToast();
  const { cart, removeFromCart, updateCartQuantity } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [couponCode, setCouponCode] = useState("");
  const [couponValue, setCouponValue] = useState(0);
  const [couponLabel, setCouponLabel] = useState("");

  const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const compareSubtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + getOriginalPrice(item) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const productDiscount = Math.max(0, compareSubtotal - subtotal);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const gst = Math.max(0, Math.round((subtotal - couponValue) * GST_RATE));
  const total = Math.max(0, subtotal - couponValue + shipping + gst);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.info("Enter a promo code first.");
      return;
    }

    if (code === "SHARQ10") {
      const amount = Math.round(subtotal * 0.1);
      setCouponValue(amount);
      setCouponLabel("SHARQ10 (10% OFF)");
      toast.success("Coupon applied.");
      return;
    }

    if (code === "WELCOME250") {
      const amount = Math.min(250, subtotal);
      setCouponValue(amount);
      setCouponLabel("WELCOME250 (Rs 250 OFF)");
      toast.success("Coupon applied.");
      return;
    }

    setCouponValue(0);
    setCouponLabel("");
    toast.error("Invalid coupon code.");
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      toast.info("Item removed from bag.");
    } catch (err) {
      toast.error(err.message || "Failed to remove item.");
    }
  };

  const handleMoveToWishlist = async (item) => {
    try {
      await addToWishlist(item);
      await removeFromCart(getProductId(item));
      toast.success("Moved to wishlist.");
    } catch (err) {
      toast.error(err.message || "Failed to move item.");
    }
  };

  const changeQuantity = async (item, delta) => {
    const current = Number(item.quantity || 1);
    const next = current + delta;

    // If quantity would go to 0 or below, remove the item instead.
    if (next <= 0) {
      await handleRemove(getProductId(item));
      return;
    }

    try {
      await updateCartQuantity(getProductId(item), next);
    } catch (err) {
      toast.error(err.message || "Failed to update quantity.");
    }
  };

  if (!cart.length) {
    return (
      <Container sx={{ py: 12, textAlign: "center", minHeight: "70vh" }}>
        <Box
          sx={{
            mx: "auto",
            width: 120,
            height: 120,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: (theme) => theme.palette.brand.borderSoft,
            mb: 3,
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 56, color: "primary.main" }} />
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Your bag is empty
        </Typography>
        <Typography sx={{ opacity: 0.75, mb: 3 }}>
          Add pieces to start building your look.
        </Typography>
        <AppButton component={Link} href="/collection" sx={{ px: 4 }}>
          Explore Collection
        </AppButton>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "start", md: "center" }}
          spacing={1}
          sx={{ mb: 5 }}
        >
          <Box>
            <Typography variant="h4" sx={{ letterSpacing: 2, fontWeight: 700 }}>
              SHOPPING BAG
            </Typography>
            <Typography sx={{ opacity: 0.72 }}>
              {itemCount} {itemCount > 1 ? "Items" : "Item"}
            </Typography>
          </Box>
          <AppButton component={Link} href="/shop" variant="outlined">
            Continue Shopping
          </AppButton>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={2.5}>
              {cart.map((item) => {
                const itemPrice = Number(item.price || 0);
                const originalPrice = getOriginalPrice(item);
                const lineTotal = itemPrice * Number(item.quantity || 1);
                const lineOriginal = originalPrice * Number(item.quantity || 1);
                const lineDiscount = Math.max(0, lineOriginal - lineTotal);

                return (
                  <Card
                    key={getProductId(item)}
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.brand.border}`,
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={4} md={3}>
                          <Box
                            component="img"
                            src={item.image || "/homepic.jpeg"}
                            alt={item.name}
                            sx={{
                              width: "100%",
                              height: { xs: 220, sm: 180, md: 190 },
                              objectFit: "cover",
                              borderRadius: 2,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                          <Stack spacing={1.3}>
                            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Chip
                                label={`Category: ${getItemCategory(item)}`}
                                size="small"
                                variant="outlined"
                              />
                              {getItemCollection(item) ? (
                                <Chip
                                  label={`Collection: ${getItemCollection(item)}`}
                                  size="small"
                                  variant="outlined"
                                />
                              ) : null}
                            </Stack>
                            <Typography sx={{ opacity: 0.75 }}>
                              {getItemDescription(item)}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Chip label={`Size: ${getItemSize(item)}`} size="small" />
                              <Chip label={`Color: ${getItemColor(item)}`} size="small" />
                            </Stack>

                            <Stack direction="row" spacing={1.2} alignItems="center">
                              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                                {currency(itemPrice)}
                              </Typography>
                              <Typography
                                sx={{
                                  textDecoration: "line-through",
                                  opacity: 0.6,
                                }}
                              >
                                {currency(originalPrice)}
                              </Typography>
                              {lineDiscount > 0 ? (
                                <Chip
                                  size="small"
                                  color="success"
                                  label={`Save ${currency(lineDiscount)}`}
                                />
                              ) : null}
                            </Stack>

                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              justifyContent="space-between"
                              alignItems={{ xs: "start", sm: "center" }}
                              spacing={1.5}
                            >
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  border: (theme) => `1px solid ${theme.palette.brand.border}`,
                                  borderRadius: 999,
                                }}
                              >
                                <IconButton onClick={() => changeQuantity(item, -1)}>
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography sx={{ width: 32, textAlign: "center" }}>
                                  {item.quantity}
                                </Typography>
                                <IconButton onClick={() => changeQuantity(item, 1)}>
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>

                              <Stack direction="row" spacing={1}>
                                <AppButton
                                  variant="outlined"
                                  size="small"
                                  startIcon={<FavoriteBorderOutlinedIcon />}
                                  onClick={() => handleMoveToWishlist(item)}
                                >
                                  Move to Wishlist
                                </AppButton>
                                <AppButton
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  startIcon={<DeleteOutlineIcon />}
                                  onClick={() => handleRemove(getProductId(item))}
                                >
                                  Remove
                                </AppButton>
                              </Stack>
                            </Stack>

                            <Typography sx={{ opacity: 0.75 }}>
                              Line Total: {currency(lineTotal)}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                position: { lg: "sticky" },
                top: 96,
                border: (theme) => `1px solid ${theme.palette.brand.border}`,
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 700, letterSpacing: 1.3, mb: 2.5 }}>
                  ORDER SUMMARY
                </Typography>

                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.2 }}>
                  <Typography sx={{ opacity: 0.8 }}>Subtotal</Typography>
                  <Typography>{currency(subtotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.2 }}>
                  <Typography sx={{ opacity: 0.8 }}>Discount</Typography>
                  <Typography color="success.main">
                    -{currency(productDiscount + couponValue)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.2 }}>
                  <Typography sx={{ opacity: 0.8 }}>Shipping</Typography>
                  <Typography>{shipping === 0 ? "Free" : currency(shipping)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.2 }}>
                  <Typography sx={{ opacity: 0.8 }}>Tax (GST 12%)</Typography>
                  <Typography>{currency(gst)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography sx={{ opacity: 0.8 }}>Estimated Delivery</Typography>
                  <Typography>{estimatedDeliveryDate()}</Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Total</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 20, color: "primary.main" }}>
                    {currency(total)}
                  </Typography>
                </Stack>

                <Typography sx={{ mb: 0.8, opacity: 0.78 }}>Have a code?</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <AppInput
                    size="small"
                    placeholder="Enter Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <AppButton onClick={handleApplyCoupon}>Apply</AppButton>
                </Stack>
                {couponLabel ? (
                  <Typography sx={{ color: "success.main", mb: 2, fontSize: 14 }}>
                    Applied: {couponLabel}
                  </Typography>
                ) : null}

                <Box
                  sx={{
                    p: 1.5,
                    border: (theme) => `1px dashed ${theme.palette.brand.border}`,
                    borderRadius: 2,
                    mb: 2.2,
                  }}
                >
                  <Typography sx={{ fontSize: 14, opacity: 0.82 }}>
                    Free shipping on orders over {currency(FREE_SHIPPING_THRESHOLD)}.
                  </Typography>
                  <Typography sx={{ fontSize: 14, opacity: 0.82 }}>
                    Shipping Method: Express Surface.
                  </Typography>
                </Box>

                <AppButton fullWidth sx={{ mb: 2 }} component={Link} href="/checkout">
                  Proceed to Checkout
                </AppButton>

                <Stack spacing={1.1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SecurityOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontSize: 14 }}>Secure Payment</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AutorenewOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontSize: 14 }}>7 Day Easy Returns</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PaymentsOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontSize: 14 }}>COD Available</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalShippingOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontSize: 14 }}>Free Shipping</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
