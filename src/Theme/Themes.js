import { createTheme } from "@mui/material/styles";

const commonTypography = {
  typography: {
    fontFamily: `"JetBrains Mono", "monospace"`,
  },
};

export const AppLightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FFF",
      paper: "#F5F5F5",
    },
    primary: {
      main: "#088A6A",
    },
    secondary: {
      main: "#3AAA49",
    },
  },
  // ...commonTypography,
});

export const AppSilverTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000ff", // deep dark gray (overall app background)
      paper: "#2C2C2C", // slightly lighter for surfaces
    },
    primary: {
      main: "#9E9E9E", // silver/gray tone for primary elements
    },
    secondary: {
      main: "#B0BEC5", // lighter silver-blue for accents
    },
    text: {
      primary: "#E0E0E0", // light text for readability
      secondary: "#B0B0B0",
    },
    divider: "#424242",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // remove default MUI overlay
        },
      },
    },
  },
  ...commonTypography,
});
// This is essentially what createTheme() returns by default
export const defaultTheme = createTheme({
  palette: {
    mode: "light", // ← default is light (not dark)

    primary: {
      main: "#1976d2", // Blue 700 – the famous MUI blue
      light: "#42a5f5", // Blue 400
      dark: "#1565c0", // Blue 800
      contrastText: "#fff",
    },

    secondary: {
      main: "#9c27b0", // Purple 500 (A200 was used in very old versions)
      light: "#ba68c8", // Purple 300
      dark: "#7b1fa2", // Purple 700
      contrastText: "#fff",
    },

    error: {
      main: "#d32f2f", // Red 700
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#fff",
    },

    warning: {
      main: "#ed6c02", // Orange 800-ish
      light: "#ff9800",
      dark: "#e65100",
      contrastText: "#fff",
    },

    info: {
      main: "#0288d1", // Light blue
      light: "#03a9f4",
      dark: "#01579b",
      contrastText: "#fff",
    },

    success: {
      main: "#2e7d32", // Green 800
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#fff",
    },

    // Background & surface colors (light mode defaults)
    background: {
      default: "#fff", // page / app background
      paper: "#fff", // cards, dialogs, menus, etc.
    },

    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },

    divider: "rgba(0, 0, 0, 0.12)",

    // ... many more (action, common, grey shades, etc.)
  },

  // Other top-level defaults (not palette)
  spacing: 8, // 1 unit = 8px
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // ... variants: h1–h6, subtitle1/2, body1/2, button, caption, overline
  },
  // shadows, transitions, zIndex, direction: 'ltr', breakpoints, etc.
});

export const AppDarkDefaultTheme = createTheme({
  palette: {
    mode: "dark",

    // ─── Core background colors (MUI dark defaults) ───
    background: {
      default: "#121212",   // Standard dark page/app background
      paper: "#121212",     // Cards, dialogs, menus, drawers, etc.
      // You can make paper slightly lighter if you prefer elevation contrast:
      // paper: "#1e1e1e",
    },

    // ─── Primary (keeps the classic MUI blue – works well on dark) ───
    primary: {
      main: "#90caf9",      // Lighter blue variant – better visibility on dark bg
      light: "#e3f2fd",
      dark: "#42a5f5",
      contrastText: "#000000", // black text on light blue is more readable
    },

    // ─── Secondary (default purple works nicely in dark mode too) ───
    secondary: {
      main: "#ce93d8",      // Lighter purple for accents
      light: "#f3e5f5",
      dark: "#ab47bc",
      contrastText: "#000000",
    },

    // ─── Text (MUI dark mode defaults) ───
    text: {
      primary: "#ffffff",             // #fff
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },

    // ─── Divider ───
    divider: "rgba(255, 255, 255, 0.12)",

    // Optional: common status colors (also lightened for dark mode contrast)
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ffa726",
    },
    info: {
      main: "#29b6f6",
    },
    success: {
      main: "#66bb6a",
    },

    // Optional: if you want stronger contrast on surfaces
    // action: {
    //   hover: "rgba(255, 255, 255, 0.08)",
    //   selected: "rgba(255, 255, 255, 0.16)",
    //   disabled: "rgba(255, 255, 255, 0.3)",
    // },
  },

  components: {
    // Same override as your silver theme – removes default paper gradient/overlay
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    // Optional: better dark-mode button contrast
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // if you dislike uppercase
        },
      },
    },
  },

  // Reuse your common typography settings
  ...commonTypography,
});

export const AppDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // true dark gray background
      paper: "#1E1E1E", // slightly lighter for cards/panels
    },
    primary: {
      main: "#08A68F", // teal-ish, stands out on dark
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#4CAF50", // green accent
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#E0E0E0", // light gray for main text
      secondary: "#B0B0B0", // slightly dimmer for secondary text
    },
    divider: "#333", // subtle dividers
  },
  shape: {
    borderRadius: 8, // slightly rounded corners
  },
});

export const AppPalenightTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#292D3E",
      paper: "#32374D",
    },
    primary: {
      main: "#82AAFF", // bright blue
    },
    secondary: {
      main: "#C792EA", // purple
    },
    text: {
      primary: "#EEFFFF", // near-white
      secondary: "#676E95", // muted gray
    },
  },
  typography: {
    fontFamily: `"Operator Mono", "monospace"`,
  },
});

export const AppNightOwlTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#011627", // deep navy
      paper: "#1D3B53",
    },
    primary: {
      main: "#82AAFF", // soft blue
    },
    secondary: {
      main: "#7FDBCA", // teal
    },
    text: {
      primary: "#D6DEEB",
      secondary: "#5F7E97",
    },
  },
  typography: {
    fontFamily: `"Dank Mono", "monospace"`,
  },
});

export const AppCobalt2Theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#193549", // cobalt blue
      paper: "#1F4662",
    },
    primary: {
      main: "#FF9D00", // orange
    },
    secondary: {
      main: "#FF628C", // pink
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9EFFFF", // cyan hints
    },
  },
  typography: {
    fontFamily: `"Source Code Pro", "monospace"`,
  },
});

export const AppMaterialDarkerTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#212121", // deep dark gray
      paper: "#2C2C2C",
    },
    primary: {
      main: "#82AAFF", // light blue
    },
    secondary: {
      main: "#C792EA", // soft purple
    },
    text: {
      primary: "#EEFFFF",
      secondary: "#B0BEC5",
    },
  },
  typography: {
    fontFamily: `"JetBrains Mono", "monospace"`,
  },
});

export const AppGruvboxDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#282828", // dark background
      paper: "#3C3836", // softer background
    },
    primary: {
      main: "#FB4934", // bright red
    },
    secondary: {
      main: "#B8BB26", // olive green
    },
    text: {
      primary: "#EBDBB2", // warm beige
      secondary: "#A89984", // muted brown-gray
    },
  },
  typography: {
    fontFamily: `"Fira Code", "monospace"`,
  },
});

export const AppSolarizedTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FDF6E3",
      paper: "#EEE8D5",
    },
    primary: {
      main: "#268BD2",
    },
    secondary: {
      main: "#2AA198",
    },
  },
  typography: {
    fontFamily: `"Fira Code", "Courier New", monospace`,
  },
});

export const AppDraculaTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#282A36",
      paper: "#44475A",
    },
    primary: {
      main: "#BD93F9",
    },
    secondary: {
      main: "#FF79C6",
    },
  },
  typography: {
    fontFamily: `"JetBrains Mono", "monospace"`,
  },
});

// Monokai-inspired theme
export const AppMonokaiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#272822",
      paper: "#3E3D32",
    },
    primary: {
      main: "#F92672", // pinkish red
    },
    secondary: {
      main: "#A6E22E", // bright green
    },
    text: {
      primary: "#F8F8F2", // off-white text
      secondary: "#75715E",
    },
  },
  typography: {
    fontFamily: `"Fira Code", "monospace"`,
  },
});

// Nord-inspired theme
export const AppNordTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#2E3440",
      paper: "#3B4252",
    },
    primary: {
      main: "#81A1C1", // icy blue
    },
    secondary: {
      main: "#88C0D0", // lighter blue
    },
    text: {
      primary: "#D8DEE9",
      secondary: "#4C566A",
    },
  },
  typography: {
    // fontFamily: `"Roboto Mono", "monospace"`,
  },
});

// Solarized Dark theme
export const AppSolarizedDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#002B36",
      paper: "#073642",
    },
    primary: {
      main: "#268BD2", // blue
    },
    secondary: {
      main: "#2AA198", // cyan/teal
    },
    text: {
      primary: "#839496",
      secondary: "#586E75",
    },
  },
  typography: {
    fontFamily: `"Source Code Pro", "monospace"`,
  },
});

// One Dark Pro inspired theme
export const AppOneDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#282C34",
      paper: "#21252B",
    },
    primary: {
      main: "#61AFEF", // bright blue
    },
    secondary: {
      main: "#E06C75", // soft red
    },
    text: {
      primary: "#ABB2BF",
      secondary: "#5C6370",
    },
  },
  typography: {
    fontFamily: `"Operator Mono", "monospace"`,
  },
});

// One Dark Pro inspired theme with farming-friendly green background
export const AppTwoDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#2D3C28", // muted green background
      paper: "#242E20", // darker for cards/dialogs
    },
    primary: {
      main: "#7EC86B", // fresh green for primary actions
    },
    secondary: {
      main: "#E5C07B", // golden-wheat tone for farming feel
    },
    text: {
      primary: "#E6F0E6", // soft off-white for contrast on green
      secondary: "#A6B2A6", // muted green-gray for secondary text
    },
    divider: "#3C4B38", // subtle greenish divider
  },
  typography: {
    fontFamily: `"Operator Mono", "monospace"`,
  },
});
