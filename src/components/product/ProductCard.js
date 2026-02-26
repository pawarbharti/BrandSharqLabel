"use client";

import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
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
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const isWishlisted = wishlist.find((item) => item.id === product.id);

  return (
    <Card
      sx={{
        position: "relative", // important for heart positioning
        border: "1px solid rgba(207,162,146,0.3)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      {/* ❤️ Heart Button */}
      <IconButton
        onClick={() =>
          isWishlisted
            ? removeFromWishlist(product.id)
            : addToWishlist(product)
        }
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

        <Button fullWidth variant="contained" sx={{ mt: 2 }}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}