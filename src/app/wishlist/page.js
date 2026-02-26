"use client";

import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  return (
    <Box sx={{ p: 6, bgcolor: "background.default", color: "text.primary" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        My Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Typography>Your wishlist is empty.</Typography>
      ) : (
        <Grid container spacing={4}>
          {wishlist.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ bgcolor: "background.paper" }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography sx={{ mb: 2 }}>
                    ${product.price}
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}