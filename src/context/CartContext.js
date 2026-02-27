"use client";

import { createContext, useEffect, useState } from "react";
import {
  addToCartApi,
  cartApi,
  getCartApi,
  removeFromCartApi,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { isAuthenticated, user } = useAuth();

  const normalizeCart = (response) => {
    const root = response?.cart || response?.data || response;
    const items = Array.isArray(root)
      ? root
      : Array.isArray(root?.items)
      ? root.items
      : [];

    return items.map((item) => ({
      id: item.productId || item.id || item.product?._id || item.product?.id,
      name: item.name || item.product?.name || "Product",
      price: item.price || item.product?.price || 0,
      image: item.image || item.product?.images?.[0] || "/homepic.jpeg",
      quantity: item.quantity || 1,
    }));
  };

  useEffect(() => {
    let active = true;

    async function loadCart() {
      if (!isAuthenticated) {
        setCart([]);
        return;
      }

      try {
        const data = await getCartApi();
        if (active) setCart(normalizeCart(data));
      } catch (err) {
        if (active) setCart([]);
      }
    }

    loadCart();
    return () => {
      active = false;
    };
  }, [isAuthenticated, user?.id]);

  const addToCart = async (product) => {
    const productId = product.productId || product.id || product._id;
    const quantity = product.quantity || 1;
    const data = await addToCartApi({ productId, quantity });
    setCart(normalizeCart(data));
  };

  const removeFromCart = async (id) => {
    const data = await removeFromCartApi(id);
    setCart(normalizeCart(data));
  };

  const clearCart = async () => {
    const data = await cartApi.clear();
    setCart(normalizeCart(data));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
