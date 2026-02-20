// Context.js  (recommended version)
import { createContext, useContext } from "react";
import { ThemeMode } from "./Constants"; // assuming this exists

// Better default shape — prevents "undefined" errors in dev
const defaultContextValue = {
  themeMode: ThemeMode.SYSTEM,
  setThemeMode: () => {
    console.warn("setThemeMode called outside ThemeProvider");
  },
  ThemeMode,
};

export const ThemeContext = createContext(defaultContextValue);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === defaultContextValue) {
    console.warn("useAppTheme must be used inside ThemeProviderWrapper");
  }
  
  return context;
};