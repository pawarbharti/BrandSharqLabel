"use client";

import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: "#df8b6f", // blush
            },
            secondary: {
              main: "#1F2A38", // navy
            },
            background: {
              default: "#131A23", // dark navy
              paper: "#1F2A38",
            },
            text: {
              primary: "#F4ECE8",
              secondary: "#df8b6f",
            },
          }
        : {
            primary: {
              main: "#1F2A38", // navy for buttons
            },
            secondary: {
              main: "#df8b6f", // blush accent
            },
            background: {
              default: "#F4ECE8", // light blush neutral
              paper: "#FFFFFF",
            },
            text: {
              primary: "#1F2A38",
              secondary: "#df8b6f",
            },
          }),
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
        letterSpacing: 1,
      },
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            padding: "10px 22px",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          },
        },
      },
    },
  });