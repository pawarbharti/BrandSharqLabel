import { Box, Container, Stack, Typography } from "@mui/material";

export default function ContactPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.default", minHeight: "70vh" }}>
      <Container maxWidth="sm">
        <Typography variant="h3" sx={{ mb: 1 }}>
          Contact Us
        </Typography>
        <Typography sx={{ opacity: 0.8, mb: 4 }}>
          Reach out for order help, product queries, or collaborations.
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Email</Typography>
            <Typography sx={{ opacity: 0.8 }}>info@sharqlabel.com</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Phone</Typography>
            <Typography sx={{ opacity: 0.8 }}>7678294158</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Address</Typography>
            <Typography sx={{ opacity: 0.8 }}>D-102, Ace Platinum, ZETA-1, Greater Noida</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Support Hours</Typography>
            <Typography sx={{ opacity: 0.8 }}>Monday to Saturday, 10:00 AM - 6:00 PM IST</Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
