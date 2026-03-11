"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import { useRouter } from "next/navigation";
import { AppButton, AppInput, useToast } from "@/components/common";
import { useAuth } from "@/context/AuthContext";
import { addressesApi, createReturnApi, getAccountApi, getReturnsApi } from "@/lib/api";
import { WishlistContext } from "@/context/WishlistContext";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: <DashboardOutlinedIcon /> },
  { key: "orders", label: "Orders", icon: <ReceiptLongOutlinedIcon /> },
  { key: "wishlist", label: "Wishlist", icon: <FavoriteBorderOutlinedIcon /> },
  { key: "addresses", label: "Addresses", icon: <PlaceOutlinedIcon /> },
  { key: "payments", label: "Payment Methods", icon: <CreditCardOutlinedIcon /> },
  { key: "profile", label: "Profile Details", icon: <PersonOutlineOutlinedIcon /> },
  { key: "returns", label: "Returns", icon: <AutorenewOutlinedIcon /> },
  { key: "logout", label: "Logout", icon: <LogoutOutlinedIcon /> },
];

const getOrderId = (order) => order?.id || order?._id || `ORD-${Math.random().toString(36).slice(2, 8)}`;
const getOrderRouteId = (order) => order?.id || order?._id || order?.orderId || "";
const getOrderDate = (order) => order?.date || order?.createdAt || new Date().toISOString();
const getOrderStatus = (order) => order?.status || "Processing";
const getOrderTotal = (order) => Number(order?.total || order?.totalAmount || 0);
const getOrderItems = (order) => (Array.isArray(order?.items) ? order.items : []);
const formatOrderAddress = (value) => {
  if (!value) return "Address not available";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (typeof value === "object") {
    const parts = [
      value?.name,
      value?.line1,
      value?.line2,
      value?.city,
      value?.state,
      value?.pincode,
      value?.landmark,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "Address not available";
  }
  return "Address not available";
};
const getAddressId = (address) => address?.id || address?._id || address?.addressId;
const currency = (value) => `Rs ${Math.round(Number(value || 0)).toLocaleString("en-IN")}`;

const normalizeAddresses = (data) => {
  const root = data?.addresses || data?.data || data;
  const list = Array.isArray(root) ? root : [];
  return list.map((address, index) => ({
    id: getAddressId(address) || `addr-${index + 1}`,
    name: address?.name || address?.fullName || "Address",
    line1: address?.line1 || address?.addressLine1 || address?.street || "",
    line2: address?.line2 || address?.addressLine2 || address?.landmark || "",
    city: address?.city || "",
    state: address?.state || "",
    pincode: address?.pincode || address?.postalCode || "",
    phone: address?.phone || "",
    landmark: address?.landmark || "",
    instructions: address?.instructions || address?.deliveryInstructions || "",
    isDefault: Boolean(address?.isDefault || address?.default),
  }));
};

const normalizePaymentMethods = (data) => {
  const root = data?.paymentMethods || data?.data || data;
  const list = Array.isArray(root) ? root : [];
  return list.map((method, index) => ({
    id: method?.id || method?._id || `pm-${index + 1}`,
    label: method?.label || method?.provider || method?.type || "Payment Method",
    type: method?.type || method?.method || "Card",
    masked: method?.maskedNumber || method?.masked || method?.value || "",
  }));
};

const normalizeRewards = (data) => {
  const root = data?.rewards || data?.data || data || {};
  return {
    points: Number(root?.points || 0),
    tier: root?.tier || "Member",
  };
};

const normalizeReturns = (data) => {
  const root = data?.returns || data?.data || data;
  const list = Array.isArray(root) ? root : [];
  return list.map((entry, index) => ({
    id: entry?.id || entry?._id || `ret-${index + 1}`,
    orderId: entry?.orderId || entry?.order?.id || "-",
    productId: entry?.productId || entry?.product?.id || "",
    name: entry?.name || entry?.productName || entry?.product?.name || "Item",
    size: entry?.size || entry?.variant?.size || "N/A",
    color: entry?.color || entry?.variant?.color || "N/A",
    status: entry?.status || "Requested",
    reason: entry?.reason || "",
    comment: entry?.comment || "",
    image: entry?.image || "",
  }));
};

export default function AccountPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { wishlist } = useContext(WishlistContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState("");

  const [addressForm, setAddressForm] = useState({
    id: "",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    landmark: "",
    instructions: "",
  });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [couponData, setCouponData] = useState({ points: 0, tier: "Member" });
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadAccountData() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const [account, returnsData] = await Promise.all([
          getAccountApi(),
          getReturnsApi().catch(() => []),
        ]);

        if (!active) return;
        const profile = account?.profile?.user || account?.profile?.data || account?.profile || account?.user || null;
        const orderList = account?.orders?.orders || account?.orders?.data || account?.orders || [];
        const addressList = normalizeAddresses(account?.addresses || []);
        const fallbackAddresses = addressList.length
          ? addressList
          : normalizeAddresses(await addressesApi.list().catch(() => []));
        const returnList = normalizeReturns(account?.returns || returnsData);

        setUser(profile);
        setOrders(Array.isArray(orderList) ? orderList : []);
        setAddresses(fallbackAddresses);
        setPaymentMethods(normalizePaymentMethods(account?.paymentMethods || []));
        setCouponData(normalizeRewards(account?.rewards || {}));
        setReturns(returnList);
      } catch (err) {
        if (!active) return;
        toast.error(err.message || "Failed to load account details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAccountData();
    return () => {
      active = false;
    };
  }, [isAuthenticated, toast]);

  useEffect(() => {
    if (returns.length) return;
    const returnCandidates = orders
      .filter((order) => ["Delivered", "Shipped", "Processing", "On the Way"].includes(getOrderStatus(order)))
      .flatMap((order) =>
        getOrderItems(order).map((item, index) => ({
          id: `${getOrderId(order)}-${index + 1}`,
          orderId: getOrderId(order),
          productId: item?.productId || item?.id || "",
          name: item?.name || item?.productName || item?.product?.name || "Item",
          size: item?.size || item?.variant?.size || "N/A",
          color: item?.color || item?.variant?.color || "N/A",
          status: "Eligible",
          reason: "",
          image: "",
        }))
      );
    setReturns(returnCandidates);
  }, [orders, returns.length]);

  const ordersPlaced = orders.length;
  const wishlistItems = wishlist.length;
  const savedAddresses = addresses.length;
  const lastOrder = orders[0] || null;
  const recentOrders = orders.slice(0, 3);
  const recentAddresses = addresses.slice(0, 2);
  const recentReturns = returns.slice(0, 3);

  const panelCardSx = {
    border: (theme) => `1px solid ${theme.palette.brand.borderSoft}`,
    borderRadius: 2.5,
    backgroundColor: "background.paper",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    },
  };

  const statCardSx = {
    border: "none",
    borderRadius: 2.5,
    backgroundColor: "background.paper",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    },
  };

  const handleLogoutTab = async () => {
    await logout();
    router.push("/");
  };

  const onTabClick = async (tab) => {
    if (tab === "logout") {
      await handleLogoutTab();
      return;
    }
    setActiveTab(tab);
  };

  const saveAddress = async () => {
    const payload = { ...addressForm };
    if (!payload.name || !payload.line1 || !payload.city || !payload.pincode || !payload.phone) {
      toast.info("Fill required address fields.");
      return;
    }

    try {
      if (payload.id) {
        await addressesApi.update(payload.id, payload);
        setAddresses((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
        toast.success("Address updated.");
      } else {
        const created = await addressesApi.create(payload);
        const normalized = normalizeAddresses(created);
        if (normalized.length) {
          setAddresses((prev) => [...prev, normalized[0]]);
        } else {
          setAddresses((prev) => [...prev, { ...payload, id: `addr-${Date.now()}` }]);
        }
        toast.success("Address added.");
      }
    } catch (err) {
      if (payload.id) {
        setAddresses((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
      } else {
        setAddresses((prev) => [...prev, { ...payload, id: `addr-${Date.now()}` }]);
      }
      toast.info("Saved locally. Address API not available.");
    } finally {
      setAddressForm({
        id: "",
        name: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        landmark: "",
        instructions: "",
      });
    }
  };

  const deleteAddress = async (id) => {
    try {
      await addressesApi.remove(id);
    } catch (err) {
      // Fallback to local delete.
    }
    setAddresses((prev) => prev.filter((address) => address.id !== id));
    toast.info("Address removed.");
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((address) => ({ ...address, isDefault: address.id === id }))
    );
    toast.success("Default address set.");
  };

  const requestReturn = (returnId, reason) => {
    if (!reason) {
      toast.info("Select a reason for return.");
      return;
    }
    const target = returns.find((entry) => entry.id === returnId);
    if (!target) return;

    createReturnApi({
      orderId: target.orderId || undefined,
      productId: target.productId || undefined,
      reason,
      comment: target.comment || "",
    })
      .then(() => {
        setReturns((prev) =>
          prev.map((entry) =>
            entry.id === returnId ? { ...entry, status: "Requested", reason } : entry
          )
        );
        toast.success("Return request submitted.");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to submit return request.");
      });
  };

  const updateReturnImage = (returnId, file) => {
    setReturns((prev) =>
      prev.map((entry) =>
        entry.id === returnId ? { ...entry, image: file?.name || "" } : entry
      )
    );
  };

  if (isLoading || loading) {
    return (
      <Container sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          My Account
        </Typography>
        <Typography sx={{ mb: 2 }}>Please sign in to view your account.</Typography>
        <AppButton component={Link} href="/login">
          Go to Login
        </AppButton>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 1.5, md: 3 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card sx={{ ...panelCardSx, position: "sticky", top: 20 }}>
            <CardContent sx={{ p: 0 }}>
              <List sx={{ py: 1 }}>
                {TABS.map((tab) => (
                  <ListItemButton
                    key={tab.key}
                    selected={activeTab === tab.key}
                    onClick={() => onTabClick(tab.key)}
                    sx={{
                      borderRadius: 1.5,
                      mx: 1,
                      mb: 0.5,
                      py: 1,
                      backgroundColor: activeTab === tab.key ? "rgba(0,0,0,0.04)" : "transparent",
                      borderLeft: activeTab === tab.key ? (theme) => `3px solid ${theme.palette.primary.main}` : "none",
                      transition: "all 0.2s ease",
                      ">svg": { mr: 1.5 },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>{tab.icon}</ListItemIcon>
                    <ListItemText primary={tab.label} sx={{ "& .MuiTypography-root": { fontSize: 14 } }} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {activeTab === "dashboard" ? (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>Welcome back, {user?.name || "Member"}!</Typography>
                <Typography sx={{ opacity: 0.65, fontSize: 15 }}>
                  Last order: {lastOrder ? new Date(getOrderDate(lastOrder)).toLocaleDateString("en-IN") : "No orders yet"}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ ...statCardSx }}>
                    <CardContent sx={{ py: 2.5 }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                          <Typography sx={{ opacity: 0.65, fontSize: 13, mb: 1 }}>Orders Placed</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>{ordersPlaced}</Typography>
                        </Box>
                        <ShoppingBagOutlinedIcon sx={{ opacity: 0.3, fontSize: 32 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ ...statCardSx }}>
                    <CardContent sx={{ py: 2.5 }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                          <Typography sx={{ opacity: 0.65, fontSize: 13, mb: 1 }}>Wishlist Items</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>{wishlistItems}</Typography>
                        </Box>
                        <FavoriteBorderOutlinedIcon sx={{ opacity: 0.3, fontSize: 32 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ ...statCardSx }}>
                    <CardContent sx={{ py: 2.5 }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                          <Typography sx={{ opacity: 0.65, fontSize: 13, mb: 1 }}>Saved Addresses</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>{savedAddresses}</Typography>
                        </Box>
                        <PlaceOutlinedIcon sx={{ opacity: 0.3, fontSize: 32 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ ...statCardSx }}>
                    <CardContent sx={{ py: 2.5 }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                          <Typography sx={{ opacity: 0.65, fontSize: 13, mb: 1 }}>Reward Points</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>{couponData.points}</Typography>
                        </Box>
                        <CardGiftcardOutlinedIcon sx={{ opacity: 0.3, fontSize: 32 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={{ ...panelCardSx, background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}08 100%)` }}>
                <CardContent sx={{ py: 2.5 }}>
                  <Typography variant="h6" sx={{ mb: 1.2, fontWeight: 600 }}>⭐ Loyalty & Rewards</Typography>
                  <Stack spacing={1}>
                    <Box>
                      <Typography sx={{ opacity: 0.7, fontSize: 13 }}>Tier Status</Typography>
                      <Typography sx={{ fontWeight: 600 }}>{couponData.tier}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ opacity: 0.7, fontSize: 13 }}>Points Earned</Typography>
                      <Typography sx={{ fontWeight: 600 }}>{couponData.points}</Typography>
                    </Box>
                    <Chip size="small" color="primary" label="Priority Access + Exclusive Offers" sx={{ alignSelf: "flex-start", mt: 0.5 }} />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          ) : null}

          {activeTab === "orders" ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Your Orders</Typography>
                <Typography sx={{ opacity: 0.65, fontSize: 14 }}>Showing latest {recentOrders.length} order(s)</Typography>
              </Box>
              {recentOrders.map((order) => {
                const oid = getOrderId(order);
                const routeOrderId = getOrderRouteId(order);
                const isOpen = expandedOrder === oid;
                return (
                  <Card key={oid} sx={{ ...panelCardSx }}>
                    <CardContent>
                      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1}>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>Order ID: {oid}</Typography>
                          <Typography sx={{ opacity: 0.75 }}>
                            Date: {new Date(getOrderDate(order)).toLocaleDateString("en-IN")}
                          </Typography>
                          <Typography sx={{ opacity: 0.75 }}>Total: {currency(getOrderTotal(order))}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={getOrderStatus(order)} color={getOrderStatus(order) === "Delivered" ? "success" : "warning"} />
                          <AppButton variant="outlined" size="small" onClick={() => setExpandedOrder(isOpen ? "" : oid)}>
                            {isOpen ? "Hide Details" : "View Details"}
                          </AppButton>
                          <AppButton
                            size="small"
                            onClick={() => {
                              if (!routeOrderId) {
                                toast.info("Tracking is not available for this order.");
                                return;
                              }
                              router.push(`/track-order/${routeOrderId}`);
                            }}
                          >
                            Track Order
                          </AppButton>
                        </Stack>
                      </Stack>
                      {isOpen ? (
                        <Box sx={{ mt: 2 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Typography sx={{ mb: 1, fontWeight: 600 }}>Products Purchased</Typography>
                          {getOrderItems(order).map((item, idx) => (
                            <Typography key={`${oid}-${idx}`} sx={{ opacity: 0.8, mb: 0.5 }}>
                              {item?.name || item?.productName || item?.product?.name || "Item"} | Size: {item?.size || item?.variant?.size || "N/A"} | Color: {item?.color || item?.variant?.color || "N/A"} | Qty: {item?.qty || item?.quantity || 1}
                            </Typography>
                          ))}
                          <Typography sx={{ mt: 1.5, opacity: 0.8 }}>
                            Delivery Address: {formatOrderAddress(order?.shippingAddress || order?.address)}
                          </Typography>
                          <Typography sx={{ opacity: 0.8 }}>
                            Payment Method: {order?.paymentMethod || "Online Payment"}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                            <AppButton variant="outlined" size="small" onClick={() => toast.info("Invoice download will be available soon.")}>
                              Download Invoice
                            </AppButton>
                            <AppButton variant="outlined" size="small" onClick={() => setActiveTab("returns")}>
                              Request Return
                            </AppButton>
                          </Stack>
                        </Box>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          ) : null}

          {activeTab === "wishlist" ? (
            <Card sx={{ ...panelCardSx }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>❤️ Your Wishlist</Typography>
                <Typography sx={{ opacity: 0.65, mb: 2, fontSize: 15 }}>
                  You have <strong>{wishlistItems}</strong> saved item(s). Continue where you left off.
                </Typography>
                <AppButton component={Link} href="/wishlist" size="large">
                  View Wishlist
                </AppButton>
              </CardContent>
            </Card>
          ) : null}

          {activeTab === "addresses" ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Address Management</Typography>
                <Typography sx={{ opacity: 0.65, fontSize: 14 }}>Manage your shipping and delivery addresses</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={7}>
                  <Card sx={{ ...panelCardSx }}>
                    <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <AppInput label="Name" value={addressForm.name} onChange={(e) => setAddressForm((p) => ({ ...p, name: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <AppInput label="Phone" value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12}>
                      <AppInput label="Address Line 1" value={addressForm.line1} onChange={(e) => setAddressForm((p) => ({ ...p, line1: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12}>
                      <AppInput label="Address Line 2" value={addressForm.line2} onChange={(e) => setAddressForm((p) => ({ ...p, line2: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <AppInput label="City" value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <AppInput label="State" value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <AppInput label="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm((p) => ({ ...p, pincode: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <AppInput label="Landmark" value={addressForm.landmark} onChange={(e) => setAddressForm((p) => ({ ...p, landmark: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <AppInput label="Delivery Instructions" value={addressForm.instructions} onChange={(e) => setAddressForm((p) => ({ ...p, instructions: e.target.value }))} />
                    </Grid>
                  </Grid>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <AppButton onClick={saveAddress}>{addressForm.id ? "Update Address" : "Add Address"}</AppButton>
                    {addressForm.id ? (
                      <AppButton
                        variant="outlined"
                        onClick={() =>
                          setAddressForm({
                            id: "",
                            name: "",
                            line1: "",
                            line2: "",
                            city: "",
                            state: "",
                            pincode: "",
                            phone: "",
                            landmark: "",
                            instructions: "",
                          })
                        }
                      >
                        Cancel Edit
                      </AppButton>
                    ) : null}
                  </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <Stack spacing={1.2}>
                    <Typography sx={{ opacity: 0.75, fontSize: 14 }}>Saved Addresses ({addresses.length})</Typography>
                    {recentAddresses.map((address) => (
                <Card key={address.id} sx={{ ...panelCardSx }}>
                  <CardContent sx={{ py: 1.6 }}>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1}>
                      <Box>
                        <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 600 }}>{address.name}</Typography>
                          {address.isDefault ? <Chip size="small" color="secondary" label="Default" /> : null}
                        </Stack>
                        <Typography sx={{ opacity: 0.8 }}>
                          {address.line1} {address.line2}
                        </Typography>
                        <Typography sx={{ opacity: 0.8 }}>
                          {address.city}, {address.state} - {address.pincode}
                        </Typography>
                        <Typography sx={{ opacity: 0.8 }}>Phone: {address.phone}</Typography>
                        {address.landmark ? <Typography sx={{ opacity: 0.75 }}>Landmark: {address.landmark}</Typography> : null}
                        {address.instructions ? <Typography sx={{ opacity: 0.75 }}>Instructions: {address.instructions}</Typography> : null}
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton onClick={() => setAddressForm(address)}><EditOutlinedIcon /></IconButton>
                        <IconButton onClick={() => deleteAddress(address.id)}><DeleteOutlineOutlinedIcon /></IconButton>
                        {!address.isDefault ? (
                          <AppButton size="small" variant="outlined" onClick={() => setDefaultAddress(address.id)}>
                            Set Default
                          </AppButton>
                        ) : null}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          ) : null}

          {activeTab === "payments" ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Payment Methods</Typography>
                <Typography sx={{ opacity: 0.65, fontSize: 14 }}>Manage your saved payment options</Typography>
              </Box>
              {paymentMethods.length ? (
                <Grid container spacing={1.5}>
                  {paymentMethods.map((method) => (
                    <Grid item xs={12} md={4} key={method.id}>
                      <Card sx={{ ...panelCardSx }}>
                        <CardContent sx={{ py: 2 }}>
                          <Typography>{method.label}</Typography>
                          <Typography sx={{ opacity: 0.75 }}>
                            {method.type}{method.masked ? ` | ${method.masked}` : ""}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ opacity: 0.75 }}>No saved payment methods.</Typography>
              )}
            </Stack>
          ) : null}

          {activeTab === "profile" ? (
            <Card sx={{ ...panelCardSx }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Profile Details</Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ opacity: 0.7, fontSize: 13 }}>Name</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{user?.name || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ opacity: 0.7, fontSize: 13 }}>Email</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{user?.email || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ opacity: 0.7, fontSize: 13 }}>Phone</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{user?.phone || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ opacity: 0.7, fontSize: 13 }}>Gender</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {user?.gender
                        ? String(user.gender).charAt(0).toUpperCase() + String(user.gender).slice(1)
                        : "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : null}

          {activeTab === "returns" ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Returns & Exchanges</Typography>
                <Typography sx={{ opacity: 0.65, fontSize: 14 }}>Showing latest {recentReturns.length} item(s)</Typography>
              </Box>
              {recentReturns.map((entry) => (
                <Card key={entry.id} sx={{ ...panelCardSx }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 600 }}>
                      {entry.name} | Order: {entry.orderId}
                    </Typography>
                    <Typography sx={{ opacity: 0.75 }}>
                      Size: {entry.size} | Color: {entry.color}
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.2 }}>
                      <AppInput
                        select
                        size="small"
                        label="Reason"
                        value={entry.reason || ""}
                        onChange={(e) =>
                          setReturns((prev) =>
                            prev.map((item) =>
                              item.id === entry.id ? { ...item, reason: e.target.value } : item
                            )
                          )
                        }
                        sx={{ minWidth: 180 }}
                      >
                        <MenuItem value="">Select reason</MenuItem>
                        <MenuItem value="size-issue">Size issue</MenuItem>
                        <MenuItem value="quality-issue">Quality issue</MenuItem>
                        <MenuItem value="wrong-item">Wrong item received</MenuItem>
                      </AppInput>
                      <AppButton component="label" variant="outlined" size="small">
                        Upload Image
                        <input
                          hidden
                          type="file"
                          onChange={(e) => updateReturnImage(entry.id, e.target.files?.[0])}
                        />
                      </AppButton>
                      <AppButton size="small" onClick={() => requestReturn(entry.id, entry.reason)}>
                        Request Return
                      </AppButton>
                      <Chip size="small" color={entry.status === "Requested" ? "warning" : "success"} label={entry.status} />
                    </Stack>
                    {entry.image ? (
                      <Typography sx={{ fontSize: 13, opacity: 0.72, mt: 0.7 }}>
                        Uploaded: {entry.image}
                      </Typography>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : null}

        </Grid>
      </Grid>
    </Container>
  );
}
