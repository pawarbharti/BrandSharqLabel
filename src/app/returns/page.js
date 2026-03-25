"use client";

import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { returnsPageContent } from "@/workflow/pages/returns";

export default function ReturnsPage() {
  const theme = useTheme();
  const brand = theme.palette.brand;
  const iconMap = {
    returnWindow: <AssignmentReturnOutlinedIcon sx={{ fontSize: 28 }} />,
    exchangeEligibility: <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />,
    qualityCheck: <TaskAltOutlinedIcon sx={{ fontSize: 28 }} />,
    refundTimeline: <PaymentsOutlinedIcon sx={{ fontSize: 28 }} />,
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
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
              letterSpacing: { xs: 1.5, md: 3 },
              mb: 2,
            }}
          >
            {returnsPageContent.hero.title}
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
              maxWidth: 760,
              mx: "auto",
              lineHeight: 1.8,
              fontSize: { xs: "1rem", md: "1.05rem" },
            }}
          >
            {returnsPageContent.hero.description}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {returnsPageContent.policyBlocks.map((item) => (
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
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: brand.shadowCardStrong,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: "18px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: brand.primary,
                    bgcolor: `${brand.primary}10`,
                    mb: 2,
                  }}
                >
                  {iconMap[item.iconKey]}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: brand.text, fontWeight: 600, mb: 1 }}
                >
                  {item.title}
                </Typography>
                <Typography sx={{ color: brand.textMuted, lineHeight: 1.8 }}>
                  {item.body}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            bgcolor: brand.surface,
            border: `1px solid ${brand.borderSoft}`,
            boxShadow: brand.shadowCard,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: brand.text, fontWeight: 600, mb: 2 }}
          >
            {returnsPageContent.stepsTitle}
          </Typography>
          <Grid container spacing={2}>
            {returnsPageContent.steps.map((step, index) => (
              <Grid item xs={12} md={6} key={step}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    bgcolor: `${brand.primary}08`,
                    border: `1px solid ${brand.borderSoft}`,
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{ color: brand.primary, fontWeight: 700, mb: 1 }}
                  >
                    Step {index + 1}
                  </Typography>
                  <Typography sx={{ color: brand.textMuted, lineHeight: 1.8 }}>
                    {step}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            bgcolor: brand.surface,
            border: `1px solid ${brand.borderSoft}`,
            boxShadow: brand.shadowCard,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: brand.text, fontWeight: 600, mb: 2 }}
          >
            {returnsPageContent.notesTitle}
          </Typography>
          {returnsPageContent.notes.map((note, index) => (
            <Typography
              key={note}
              sx={{ color: brand.textMuted, lineHeight: 1.9, mb: index < returnsPageContent.notes.length - 1 ? 1.5 : 0 }}
            >
              {note}
            </Typography>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}
