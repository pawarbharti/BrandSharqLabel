import Link from "next/link";
import { Box, Typography, Button, Container } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/homevideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌑 Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      {/* ✨ Content */}
      <Container sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            letterSpacing: 3,
            mb: 0.2,
            lineHeight: 1.1,
          }}
        >
          SHARQ LABEL
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            letterSpacing: 5,
            color: "#df8b6f",
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          BORN TO BE DIFFERENT
        </Typography>

        <Typography variant="h5" sx={{ mt: 3, mb: 4 }}>
          Luxury Menswear Redefined
        </Typography>

        <Link href="/shop" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#df8b6f",
              color: "#131A23",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              letterSpacing: 1,
              "&:hover": {
                backgroundColor: "#d8b2a4",
              },
            }}
          >
            Explore Collection
          </Button>
        </Link>
      </Container>
    </Box>
  );
}