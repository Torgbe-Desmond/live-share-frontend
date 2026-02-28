import { useMemo, useState, useEffect } from "react";
import { useMediaQuery, ThemeProvider, CssBaseline } from "@mui/material";

import { ThemeMode } from "./Constants";
import {  AppDarkTheme, AppLightTheme,darkTheme,defaultTheme } from "./Themes";
import { ThemeContext } from "./Context";
import ThemeColorUpdater from "./ThemeColorUpdater";

export const ThemeProviderWrapper = ({ children }) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeMode, setThemeMode] = useState(ThemeMode.SYSTEM);

  const selectedTheme = useMemo(() => {
    if (themeMode === ThemeMode.LIGHT) return AppLightTheme;
    if (themeMode === ThemeMode.DARK) return AppDarkTheme;

    // SYSTEM mode
    return prefersDark ? darkTheme : defaultTheme;
  }, [themeMode, prefersDark]);

  useEffect(() => {
    document.body.setAttribute("data-theme", selectedTheme.palette.mode);
  }, [selectedTheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, ThemeMode }}>
      <ThemeProvider theme={selectedTheme}>
        <CssBaseline />
        <ThemeColorUpdater />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};