"use client";

import ThemeContextProvider from "../context/ThemeContext";
import CartProvider from "../context/CartContext";
import WishlistProvider from "../context/WishlistContext";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

export default function Providers({ children }) {
  return (
    <ThemeContextProvider>
      <CartProvider>
        <WishlistProvider>
          <Navbar />
          {children}
          <Footer />
        </WishlistProvider>
      </CartProvider>
    </ThemeContextProvider>
  );
}