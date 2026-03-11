import { Box, Container, Stack, Typography } from "@mui/material";

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.default", minHeight: "70vh" }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 1 }}>
          Privacy Policy
        </Typography>
        <Typography sx={{ opacity: 0.75, mb: 4 }}>
          Last updated: March 9, 2026
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Information We Collect</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              We collect account details, shipping information, and order data required to process your purchases.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>How We Use Data</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Your data is used for order fulfillment, customer support, fraud prevention, and service improvement.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Data Sharing</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              We only share required information with payment gateways, logistics providers, and service partners.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Your Rights</Typography>
            <Typography sx={{ opacity: 0.8 }}>
              You may request access, correction, or deletion of your personal information by contacting support.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
