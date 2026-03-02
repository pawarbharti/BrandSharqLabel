"use client";

import { createTheme } from "@mui/material/styles";

const lightBrand = {
  bg: "#F7F1ED",
  surface: "#FFFFFF",
  primary: "#CFA292",
  hover: "#B98573",
  text: "#2A1E1A",
  textMuted: "rgba(42,30,26,0.65)",
  border: "rgba(207,162,146,0.35)",
  borderSoft: "rgba(207,162,146,0.2)",
  gradientStart: "#CFA292",
  gradientEnd: "#B98573",
  overlayStrong: "rgba(42,30,26,0.65)",
  overlaySoft: "rgba(42,30,26,0.35)",
  navGlass: "rgba(247,241,237,0.8)",
  shadowCard: "0 6px 18px rgba(42,30,26,0.06)",
  shadowCardStrong: "0 12px 28px rgba(42,30,26,0.12)",
  heroTextShadow: "0 6px 25px rgba(42,30,26,0.6)",
};

const darkBrand = {
  bg: "#0B1220",               // deeper navy for better contrast
  surface: "#1E293B",          // lighter than bg for separation
  primary: "#CFA292",          // brand peach accent
  hover: "#E8C1B2",            // slightly brighter hover
  text: "#F8FAFC",             // brighter white for headings
  textMuted: "rgba(248,250,252,0.82)", // FIXED (was too dim before)
  border: "rgba(207,162,146,0.28)",
  borderSoft: "rgba(207,162,146,0.18)",
  gradientStart: "#CFA292",
  gradientEnd: "#E8C1B2",
  overlayStrong: "rgba(11,18,32,0.72)",   // reduced darkness
  overlaySoft: "rgba(11,18,32,0.42)",     // softer overlay
  navGlass: "rgba(11,18,32,0.78)",
  shadowCard: "0 8px 24px rgba(0,0,0,0.45)",
  shadowCardStrong: "0 14px 38px rgba(0,0,0,0.6)",
  heroTextShadow: "0 8px 30px rgba(0,0,0,0.85)",
};

export const getTheme = (mode) => {
  const brand = mode === "dark" ? darkBrand : lightBrand;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brand.primary,
        dark: brand.hover,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: brand.hover,
        contrastText: "#FFFFFF",
      },
      background: {
        default: brand.bg,
        paper: brand.surface,
      },
      text: {
        primary: brand.text,
        secondary: brand.textMuted,
      },
      divider: brand.border,
      brand,
    },

    typography: {
      fontFamily: `"Playfair Display", serif`,
      h3: {
        fontWeight: 600,
        letterSpacing: 2,
      },
      h4: {
        fontWeight: 500,
      },
      button: {
        textTransform: "none",
        letterSpacing: 0.8,
        fontWeight: 500,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: brand.bg,
            color: brand.text,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: brand.navGlass,
            borderBottom: `1px solid ${brand.borderSoft}`,
            backdropFilter: "blur(14px)",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30, // 🔥 More luxury
            padding: "8px 20px",
          },

          containedPrimary: {
            background: `linear-gradient(45deg, ${brand.gradientStart}, ${brand.gradientEnd})`,
            color: "#FFFFFF",
            boxShadow: brand.shadowCard,
            "&:hover": {
              background: `linear-gradient(45deg, ${brand.gradientEnd}, ${brand.gradientStart})`,
              boxShadow: brand.shadowCardStrong,
            },
          },

          outlined: {
            borderColor: brand.border,
            "&:hover": {
              borderColor: brand.hover,
              backgroundColor: brand.borderSoft,
            },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            color: brand.text,
            "&:hover": {
              backgroundColor: brand.borderSoft,
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${brand.borderSoft}`,
            boxShadow: brand.shadowCard,
            backgroundColor: brand.surface,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: brand.shadowCardStrong,
              transform: "translateY(-4px)",
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 500,
          },
        },
      },
    },
  });
};