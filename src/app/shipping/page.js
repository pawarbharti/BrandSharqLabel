import { Box, Container, Stack, Typography } from "@mui/material";

export default function ShippingPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.default", minHeight: "70vh" }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 1 }}>
          Shipping and Returns
        </Typography>
        <Typography sx={{ opacity: 0.75, mb: 4 }}>
          Last updated: March 9, 2026
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Shipping Timeline</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Orders are usually processed within 1-2 business days and delivered within 3-7 business days.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Shipping Charges</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Shipping charges are calculated at checkout based on your location and selected service level.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Returns and Exchanges</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Eligible items can be returned or exchanged within 7 days of delivery if unworn and in original condition.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Refund Process</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Refunds are issued after quality checks and may take 5-7 business days to reflect in your original payment method.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
