"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { WishlistContext } from "@/context/WishlistContext";
import { CartContext } from "@/context/CartContext";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const isWishlisted = wishlist.find((item) => item.id === product.id);

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
    } catch (err) {
      if (err.message === "Unauthorized") router.push("/login");
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (err) {
      if (err.message === "Unauthorized") router.push("/login");
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        border: "1px solid rgba(207,162,146,0.3)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <IconButton
        onClick={handleWishlistToggle}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          bgcolor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      >
        {isWishlisted ? (
          <FavoriteIcon sx={{ color: "#df8b6f" }} />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

      <CardMedia component="img" height="300" image={product.image} />

      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body1">₹{product.price}</Typography>

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
