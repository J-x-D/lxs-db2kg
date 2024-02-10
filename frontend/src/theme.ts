import { createTheme } from "@mui/material/styles";

const borderRadius = 12;
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f44336",
    },
    divider: "#E0E0E0",
    background: {
      default: "#F7F7F7",
      paper: "#fff",
    },
  },
  shape: {
    borderRadius: borderRadius,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius,
          boxShadow: "none",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius,
          gap: 2,

          height: "56px",
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius,

          height: "56px",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
});

export default theme;
