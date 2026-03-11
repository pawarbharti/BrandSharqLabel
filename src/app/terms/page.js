import { Box, Container, Stack, Typography } from "@mui/material";

export default function TermsPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.default", minHeight: "70vh" }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 1 }}>
          Terms and Conditions
        </Typography>
        <Typography sx={{ opacity: 0.75, mb: 4 }}>
          Last updated: March 9, 2026
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Orders and Payments</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Orders are confirmed only after successful payment authorization and stock availability.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Pricing and Availability</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Prices and stock may change without prior notice. Product images are representative.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Intellectual Property</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              All content and branding on this website are the property of Sharq Label and may not be reused without permission.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Liability</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Sharq Label is not liable for delays or losses caused by events outside reasonable control.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
