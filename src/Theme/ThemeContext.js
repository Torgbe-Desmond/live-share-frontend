import React, { useMemo, useState, useEffect } from "react";
import { useMediaQuery, ThemeProvider, CssBaseline } from "@mui/material";

import { ThemeMode } from "./Constants";
import {
  AppDarkTheme,
  AppLightTheme,
  AppSolarizedTheme,
  AppDraculaTheme,
  AppOneDarkTheme,
  AppPalenightTheme,
  AppMonokaiTheme,
  AppNordTheme,
  AppGruvboxDarkTheme,
  AppSilverTheme,
  defaultTheme,
  AppDarkDefaultTheme
} from "./Themes";
import { ThemeContext } from "./Context";
import { updateBodyClassesAndMeta } from "./Utils";
import ThemeColorUpdater from "./ThemeColorUpdater";

export const ThemeProviderWrapper = ({ children }) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const systemTheme = prefersDark ? ThemeMode.DARK : ThemeMode.LIGHT;
  const [themeMode, setThemeMode] = useState(ThemeMode.SYSTEM);

  const selectedTheme = useMemo(() => {
    if (themeMode === ThemeMode.LIGHT) return AppLightTheme;
    if (themeMode === ThemeMode.DARK) return AppDarkTheme;
    return systemTheme === ThemeMode.DARK ? defaultTheme : defaultTheme;
  }, [themeMode, prefersDark]);

  useEffect(() => {
    updateBodyClassesAndMeta(selectedTheme.palette.mode);
  }, [selectedTheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, ThemeMode }}>
      <ThemeProvider theme={selectedTheme}>
        <CssBaseline />
        <ThemeColorUpdater/>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};