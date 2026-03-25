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
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { aboutPageContent } from "@/workflow/pages/about";

export default function AboutPage() {
  const theme = useTheme();
  const brand = theme.palette.brand;
  const iconMap = {
    vision: <AutoAwesomeOutlinedIcon sx={{ fontSize: 28 }} />,
    craft: <CheckroomOutlinedIcon sx={{ fontSize: 28 }} />,
    promise: <VerifiedOutlinedIcon sx={{ fontSize: 28 }} />,
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
              letterSpacing: { xs: 1.5, md: 3 },
              textAlign: "center",
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
              mb: 2,
            }}
          >
            {aboutPageContent.hero.title}
          </Typography>
          <Divider
            sx={{
              width: 80,
              mx: "auto",
              mb: 3,
              borderColor: "transparent",
              height: 3,
              background: `linear-gradient(90deg, ${brand.gradientStart}, ${brand.gradientEnd})`,
            }}
          />
          <Typography
            sx={{
              color: brand.textMuted,
              textAlign: "center",
              maxWidth: 760,
              mx: "auto",
              lineHeight: 1.8,
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            {aboutPageContent.hero.description}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {aboutPageContent.values.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: { xs: 3, md: 3.5 },
                  borderRadius: 3,
                  bgcolor: brand.surface,
                  border: `1px solid ${brand.borderSoft}`,
                  boxShadow: brand.shadowCard,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: brand.shadowCardStrong,
                  },
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "18px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: brand.primary,
                      bgcolor: `${brand.primary}10`,
                    }}
                  >
                    {iconMap[item.iconKey]}
                  </Box>
                  <Typography variant="h5" sx={{ color: brand.text, fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: brand.textMuted, lineHeight: 1.8 }}>
                    {item.body}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
