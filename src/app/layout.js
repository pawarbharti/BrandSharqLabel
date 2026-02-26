import ThemeContextProvider from "../context/ThemeContext";
import CartProvider from "../context/CartContext"; // 👈 ADD THIS
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WishlistProvider from "@/context/WishlistContext";
import AuthProvider from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>
          <AuthProvider>
            <CartProvider> {/* 👈 WRAP HERE */}
              <WishlistProvider>
                <Navbar />
                {children}
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}