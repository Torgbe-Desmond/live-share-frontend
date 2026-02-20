import { useEffect } from "react";
import { useAppTheme } from "./Context"; // your context hook
import { useMediaQuery } from "@mui/material";

export default function ThemeColorUpdater() {
  const { themeMode } = useAppTheme();

  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    // Get current MUI theme background (or hardcode your values)
    const bgColor = prefersDark
      ? "#121212" // your dark background
      : "#ffffff"; // your light background

    // Update meta theme-color (affects Android + some browser bars)
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement("meta");
      metaTheme.setAttribute("name", "theme-color");
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute("content", bgColor);

    // Optional: also update manifest theme_color if you have a dynamic manifest (rare)
  }, [themeMode]);

  return null; // this is a side-effect component
}
