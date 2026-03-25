"use client";

import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { contactPageContent } from "@/workflow/pages/contact";

export default function ContactPage() {
  const theme = useTheme();
  const brand = theme.palette.brand;
  const iconMap = {
    email: <EmailOutlinedIcon sx={{ fontSize: 24 }} />,
    phone: <PhoneOutlinedIcon sx={{ fontSize: 24 }} />,
    address: <LocationOnOutlinedIcon sx={{ fontSize: 24 }} />,
    hours: <AccessTimeOutlinedIcon sx={{ fontSize: 24 }} />,
  };

  return (
    <Box sx={{ bgcolor: brand.bg }}>
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          background: `linear-gradient(135deg, ${brand.primary}14, ${brand.hover}10)`,
          borderBottom: `1px solid ${brand.borderSoft}`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              color: brand.text,
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: { xs: 1.5, md: 3 },
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
              mb: 2,
            }}
          >
            {contactPageContent.hero.title}
          </Typography>
          <Divider
            sx={{
              width: 80,
              mx: "auto",
              mb: 3,
              height: 3,
              borderColor: "transparent",
              background: `linear-gradient(90deg, ${brand.gradientStart}, ${brand.gradientEnd})`,
            }}
          />
          <Typography
            sx={{
              color: brand.textMuted,
              textAlign: "center",
              maxWidth: 720,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            {contactPageContent.hero.description}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {contactPageContent.items.map((item) => (
            <Grid item xs={12} sm={6} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  bgcolor: brand.surface,
                  border: `1px solid ${brand.borderSoft}`,
                  boxShadow: brand.shadowCard,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "16px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: brand.primary,
                      bgcolor: `${brand.primary}10`,
                      flexShrink: 0,
                    }}
                  >
                    {iconMap[item.iconKey]}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: brand.text, fontWeight: 600, mb: 0.75 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: brand.textMuted, lineHeight: 1.8 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
