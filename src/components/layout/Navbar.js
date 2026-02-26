"use client";
import { AppBar, Toolbar, Button, IconButton, Box } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "transparent",
        borderBottom: "1px solid rgba(207,162,146,0.3)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link href="/">
            <Image
              src={mode === "dark" ? "/logo-dark.png" : "/logo-light.png"}
              alt="Sharq Label"
              width={100}
              height={50}
              style={{ cursor: "pointer" }}
            />
          </Link>
        </Box>

        {/* Navigation */}
        <div>
          <Button
            component={Link}
            href="/shop"
            sx={{
              fontSize: "1.5rem",
              letterSpacing: 2,
              fontWeight: 500,
            }}
          >
            Shop
          </Button>

          <Button
            component={Link}
            href="/collection"
            sx={{
              fontSize: "1.5rem",
              letterSpacing: 2,
              fontWeight: 500,
            }}
          >
            Collection
          </Button>

          <Button
            component={Link}
            href="/new-arrivals"
            sx={{
              fontSize: "1.5rem",
              letterSpacing: 2,
              fontWeight: 500,
            }}
          >
            New
          </Button>

          <Button
            component={Link}
            href="/cart"
            sx={{
              fontSize: "1.5rem",
              letterSpacing: 2,
              fontWeight: 500,
            }}
          >
            Cart
          </Button>
          <Button
            component={Link}
            href="/wishlist"
            sx={{
              fontSize: "1.5rem",
              letterSpacing: 2,
              fontWeight: 500,
            }}
          >
            Wishlist
          </Button>

          <Button
            component={Link}
            href="/account"
            sx={{
              fontSize: "1.5rem",
              letterSpacing: 2,
              fontWeight: 500,
            }}
          >
            Account
          </Button>
        </div>

        {/* Dark Mode Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                href="/account"
                sx={{ textTransform: "none" }}
              >
                {user?.name || "Account"}
              </Button>
              <Button onClick={handleLogout} sx={{ textTransform: "none" }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                href="/login"
                sx={{
                  textTransform: "none",
                  fontSize: "1.5rem",
                  letterSpacing: 2,
                  fontWeight: 500,
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                href="/signup"
                sx={{
                  textTransform: "none",
                  fontSize: "1.5rem",
                  letterSpacing: 2,
                  fontWeight: 500,
                }}
              >
                Sign up
              </Button>
            </>
          )}

          <IconButton onClick={toggleColorMode}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
