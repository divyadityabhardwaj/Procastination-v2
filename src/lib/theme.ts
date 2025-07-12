import { createTheme } from "@mui/material/styles";

export const lightPalette = {
  mode: "light" as const,
  background: {
    default: "#f5f6fa",
    paper: "#fff",
  },
  primary: {
    main: "#1976d2",
    contrastText: "#fff",
  },
  secondary: {
    main: "#ffd54f",
    contrastText: "#121212",
  },
  text: {
    primary: "#222",
    secondary: "#555",
  },
};

export const darkPalette = {
  mode: "dark" as const,
  background: {
    default: "#121212",
    paper: "rgba(66, 66, 66, 0.95)",
  },
  primary: {
    main: "#fff",
    contrastText: "#121212",
  },
  secondary: {
    main: "#ffd54f",
    contrastText: "#121212",
  },
  text: {
    primary: "#fff",
    secondary: "rgba(255,255,255,0.7)",
  },
};

export function getTheme(mode: "light" | "dark") {
  const palette = mode === "light" ? lightPalette : darkPalette;
  return createTheme({
    palette,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
}
