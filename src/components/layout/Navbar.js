"use client";

import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Badge,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";

import { useContext, useState } from "react";
import { ColorModeContext } from "../../context/ThemeContext";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { isAdminUser } from "@/lib/authRole";

export default function Navbar() {
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const canSeeAdmin = Boolean(isAuthenticated && isAdminUser(user));

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const navLinkStyle = {
    position: "relative",
    fontSize: "1.5rem",
    fontWeight: 500,
    textTransform: "none",
    letterSpacing: 1,
    px: 2,
    "&::after": {
      content: '""',
      position: "absolute",
      width: 0,
      height: "2px",
      bottom: 0,
      left: 0,
      backgroundColor: "primary.main",
      transition: "0.3s ease",
    },
    "&:hover::after": {
      width: "100%",
    },
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={(theme) => ({
        backdropFilter: "blur(12px)",
        background: theme.palette.brand.navGlass,
        borderBottom: `1px solid ${theme.palette.brand.borderSoft}`,
      })}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/">
            <Image
              src={mode === "dark" ? "/logo-dark.png" : "/logo-light.png"}
              alt="Sharq Label"
              width={110}
              height={50}
              style={{ cursor: "pointer" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button component={Link} href="/shop" sx={navLinkStyle}>
              Shop
            </Button>
            <Button component={Link} href="/collection" sx={navLinkStyle}>
              Collection
            </Button>
            <Button component={Link} href="/new-arrivals" sx={navLinkStyle}>
              New Arrivals
            </Button>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Wishlist */}
            <IconButton component={Link} href="/wishlist">
              <Badge badgeContent={0} color="error">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>

            {/* Cart */}
            <IconButton component={Link} href="/cart">
              <Badge badgeContent={0} color="error">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <Button component={Link} href="/account" sx={navLinkStyle}>
                  {user?.name?.split(" ")[0].toUpperCase()}
                </Button>

                {canSeeAdmin && (
                  <Button component={Link} href="/admin" sx={navLinkStyle}>
                    Admin
                  </Button>
                )}

                <Button
                  onClick={() => setOpenLogoutDialog(true)}
                  sx={navLinkStyle}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} href="/login" sx={navLinkStyle}>
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  sx={{
                    borderRadius: "30px",
                    px: 3,
                    textTransform: "none",
                    background: (theme) =>
                      `linear-gradient(45deg, ${theme.palette.brand.gradientStart}, ${theme.palette.brand.gradientEnd})`,
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Theme Toggle */}
            <IconButton onClick={toggleColorMode}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Mobile Menu */}
            <IconButton sx={{ display: { xs: "flex", md: "none" } }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            px: 2,
            py: 1.5,
          },
        }}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              setOpenLogoutDialog(false);
              await handleLogout();
            }}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
