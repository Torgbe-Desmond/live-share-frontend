import { useEffect } from "react";
import { useTheme } from "@mui/material";

export default function ThemeColorUpdater() {
  const theme = useTheme();

  useEffect(() => {
    const bgColor = theme.palette.background.default;

    let metaTheme = document.querySelector('meta[name="theme-color"]');

    if (!metaTheme) {
      metaTheme = document.createElement("meta");
      metaTheme.setAttribute("name", "theme-color");
      document.head.appendChild(metaTheme);
    }

    metaTheme.setAttribute("content", bgColor);
  }, [theme]);

  return null;
}