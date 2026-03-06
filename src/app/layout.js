import "./globals.css";
import ThemeContextProvider from "../context/ThemeContext";
import CartProvider from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WishlistProvider from "@/context/WishlistContext";
import AuthProvider from "@/context/AuthContext";
import { PageLoaderProvider, ToastProvider } from "@/components/common";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>
          <AuthProvider>
            <PageLoaderProvider>
              <ToastProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Navbar />
                    {children}
                    <Footer />
                  </WishlistProvider>
                </CartProvider>
              </ToastProvider>
            </PageLoaderProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
