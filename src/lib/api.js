"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function throwApiError(error, fallbackMessage) {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallbackMessage;
  throw new Error(message);
}

async function request(method, url, data, params, fallbackMessage) {
  try {
    const response = await api({ method, url, data, params });
    return response.data;
  } catch (error) {
    throwApiError(error, fallbackMessage);
  }
}

export const authApi = {
  register: (payload) =>
    request("post", "/api/auth/register", payload, null, "Register failed"),
  verifyEmail: (payload) =>
    request(
      "post",
      "/api/auth/verify-email",
      payload,
      null,
      "Email verification failed"
    ),
  login: (payload) =>
    request("post", "/api/auth/login", payload, null, "Login failed"),
  logout: () => request("post", "/api/auth/logout", null, null, "Logout failed"),
  me: () => request("get", "/api/auth/me", null, null, "Failed to load user"),
  forgotPassword: (payload) =>
    request(
      "post",
      "/api/auth/forgot-password",
      payload,
      null,
      "Failed to send reset instructions"
    ),
  resetPassword: (payload) =>
    request(
      "post",
      "/api/auth/reset-password",
      payload,
      null,
      "Failed to reset password"
    ),
};

export const productsApi = {
  list: (params) =>
    request("get", "/api/products", null, params, "Failed to load products"),
  create: (payload) =>
    request("post", "/api/products", payload, null, "Failed to create product"),
  getById: (id) =>
    request("get", `/api/products/${id}`, null, null, "Failed to load product"),
  update: (id, payload) =>
    request("put", `/api/products/${id}`, payload, null, "Failed to update product"),
  remove: (id) =>
    request("delete", `/api/products/${id}`, null, null, "Failed to delete product"),
};

export const cartApi = {
  get: () => request("get", "/api/cart", null, null, "Failed to load cart"),
  add: (payload) =>
    request("post", "/api/cart/add", payload, null, "Failed to add cart item"),
  update: (payload) =>
    request("put", "/api/cart/update", payload, null, "Failed to update cart"),
  remove: (productId) =>
    request(
      "delete",
      `/api/cart/remove/${productId}`,
      null,
      null,
      "Failed to remove cart item"
    ),
  clear: () => request("delete", "/api/cart/clear", null, null, "Failed to clear cart"),
};

export const usersApi = {
  getProfile: () =>
    request("get", "/api/users/profile", null, null, "Failed to load profile"),
  updateProfile: (payload) =>
    request("put", "/api/users/profile", payload, null, "Failed to update profile"),
  deleteProfile: () =>
    request("delete", "/api/users/profile", null, null, "Failed to delete profile"),
};

export const addressesApi = {
  create: (payload) =>
    request("post", "/api/addresses", payload, null, "Failed to create address"),
  list: () => request("get", "/api/addresses", null, null, "Failed to load addresses"),
  update: (id, payload) =>
    request("put", `/api/addresses/${id}`, payload, null, "Failed to update address"),
  remove: (id) =>
    request("delete", `/api/addresses/${id}`, null, null, "Failed to delete address"),
};

export const categoriesApi = {
  list: () => request("get", "/api/categories", null, null, "Failed to load categories"),
  create: (payload) =>
    request("post", "/api/categories", payload, null, "Failed to create category"),
  update: (id, payload) =>
    request("put", `/api/categories/${id}`, payload, null, "Failed to update category"),
  remove: (id) =>
    request("delete", `/api/categories/${id}`, null, null, "Failed to delete category"),
};

export const reviewsApi = {
  create: (payload) =>
    request("post", "/api/reviews", payload, null, "Failed to create review"),
  listByProduct: (id) =>
    request("get", `/api/reviews/${id}`, null, null, "Failed to load reviews"),
  remove: (id) =>
    request("delete", `/api/reviews/${id}`, null, null, "Failed to delete review"),
};

export const ordersApi = {
  create: (payload) =>
    request("post", "/api/orders", payload, null, "Failed to create order"),
  myOrders: () =>
    request("get", "/api/orders/my-orders", null, null, "Failed to load orders"),
  getById: (id) =>
    request("get", `/api/orders/${id}`, null, null, "Failed to load order"),
  updateStatus: (id, payload) =>
    request(
      "put",
      `/api/orders/${id}/status`,
      payload,
      null,
      "Failed to update order status"
    ),
};

export const paymentsApi = {
  create: (payload) =>
    request("post", "/api/payments/create", payload, null, "Failed to create payment"),
  verify: (payload) =>
    request("post", "/api/payments/verify", payload, null, "Failed to verify payment"),
  getByOrderId: (orderId) =>
    request(
      "get",
      `/api/payments/${orderId}`,
      null,
      null,
      "Failed to load payment status"
    ),
};

export const adminApi = {
  users: () => request("get", "/api/admin/users", null, null, "Failed to load users"),
  orders: () => request("get", "/api/admin/orders", null, null, "Failed to load orders"),
  dashboardStats: () =>
    request(
      "get",
      "/api/admin/dashboard-stats",
      null,
      null,
      "Failed to load dashboard stats"
    ),
  promote: (payload) =>
    request("post", "/api/admin/promote", payload, null, "Failed to promote user"),
};

export async function loginApi(payload) {
  return authApi.login(payload);
}

export async function signupApi(payload) {
  return authApi.register(payload);
}

export async function getProductsApi() {
  return productsApi.list();
}

export async function getCartApi() {
  return cartApi.get();
}

export async function addToCartApi(payload) {
  return cartApi.add(payload);
}

export async function removeFromCartApi(productId) {
  return cartApi.remove(productId);
}

export async function getAccountApi() {
  const [profile, orders] = await Promise.all([
    usersApi.getProfile(),
    ordersApi.myOrders(),
  ]);
  return { profile, orders };
}

export default api;
