"use client";

import { Box, Container, Divider, Grid, Paper, Typography, useTheme } from "@mui/material";
import { termsPageContent } from "@/workflow/pages/terms";

export default function TermsPage() {
  const theme = useTheme();
  const brand = theme.palette.brand;

  return (
    <Box sx={{ bgcolor: brand.bg }}>
      <Box sx={{ py: { xs: 7, md: 10 }, background: `linear-gradient(135deg, ${brand.primary}14, ${brand.hover}10)`, borderBottom: `1px solid ${brand.borderSoft}` }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ color: brand.text, fontWeight: 700, textAlign: "center", fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" }, mb: 2 }}>
            {termsPageContent.hero.title}
          </Typography>
          <Divider sx={{ width: 80, mx: "auto", mb: 2.5, height: 3, borderColor: "transparent", background: `linear-gradient(90deg, ${brand.gradientStart}, ${brand.gradientEnd})` }} />
          <Typography sx={{ color: brand.textMuted, textAlign: "center" }}>
            Last updated: {termsPageContent.hero.updatedAt}
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={2.5}>
          {termsPageContent.sections.map((section) => (
            <Grid item xs={12} key={section.title}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: brand.surface, border: `1px solid ${brand.borderSoft}`, boxShadow: brand.shadowCard }}>
                <Typography variant="h6" sx={{ mb: 1, color: brand.text, fontWeight: 600 }}>{section.title}</Typography>
                <Typography sx={{ color: brand.textMuted, lineHeight: 1.8 }}>{section.body}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
