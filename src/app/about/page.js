import { Box, Container, Grid, Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.default", minHeight: "70vh" }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 1 }}>
          About Sharq Label
        </Typography>
        <Typography sx={{ opacity: 0.8, mb: 4 }}>
          Sharq Label creates premium menswear focused on structure, quality, and modern identity.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 1 }}>Our Vision</Typography>
            <Typography sx={{ opacity: 0.78 }}>
              Build timeless essentials that feel contemporary and intentional every season.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 1 }}>Our Craft</Typography>
            <Typography sx={{ opacity: 0.78 }}>
              We focus on refined cuts, durable materials, and fit-led design across every product.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 1 }}>Our Promise</Typography>
            <Typography sx={{ opacity: 0.78 }}>
              Consistent quality, clear service, and a shopping experience built on trust.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
