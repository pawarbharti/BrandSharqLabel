"use client";

import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist_items");
      if (raw) {
        setWishlist(JSON.parse(raw));
      }
    } catch (e) {
      setWishlist([]);
    }
  }, []);

  const addToWishlist = async (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      const next = exists ? prev : [...prev, product];
      localStorage.setItem("wishlist_items", JSON.stringify(next));
      return next;
    });
  };

  const removeFromWishlist = async (id) => {
    setWishlist((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem("wishlist_items", JSON.stringify(next));
      return next;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
